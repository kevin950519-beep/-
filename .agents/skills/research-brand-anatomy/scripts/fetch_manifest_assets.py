#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import hashlib
import os
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


@dataclass(frozen=True)
class Task:
    row_index: int
    url: str
    target: Path


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def safe_target(root: Path, raw: str) -> Path:
    candidate = Path(raw).expanduser()
    target = candidate.resolve() if candidate.is_absolute() else (root / candidate).resolve()
    try:
        target.relative_to(root)
    except ValueError as exc:
        raise ValueError(f"local_path escapes analysis directory: {raw}") from exc
    return target


def fetch(task: Task, timeout: int, user_agent: str) -> tuple[int, str, str]:
    target = task.target
    if target.is_file() and target.stat().st_size:
        return task.row_index, "existing", sha256(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(task.url, headers={"User-Agent": user_agent})
    partial = target.with_name(target.name + ".part")
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response, partial.open("wb") as output:
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                output.write(chunk)
        if not partial.stat().st_size:
            raise ValueError("downloaded file is empty")
        os.replace(partial, target)
        return task.row_index, "downloaded", sha256(target)
    except Exception:
        if partial.exists():
            partial.unlink()
        raise


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch manifest assets concurrently and fill SHA-256 values when the column exists.")
    parser.add_argument("analysis_directory")
    parser.add_argument("--manifest", default="visual-corpus.csv")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--timeout", type=int, default=30)
    parser.add_argument("--user-agent", default="Mozilla/5.0 BrandAnatomyResearch/1.0")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = Path(args.analysis_directory).expanduser().resolve()
    manifest = Path(args.manifest).expanduser()
    manifest = manifest.resolve() if manifest.is_absolute() else (root / manifest).resolve()
    if not manifest.is_file():
        print(f"ERROR: manifest not found: {manifest}")
        return 1
    if not 1 <= args.workers <= 8:
        print("ERROR: --workers must be between 1 and 8")
        return 1

    with manifest.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        fields = list(reader.fieldnames or [])
    if "source_url" not in fields or "local_path" not in fields:
        print("ERROR: manifest needs source_url and local_path columns")
        return 1

    tasks: list[Task] = []
    path_urls: dict[Path, str] = {}
    primary_rows: dict[Path, int] = {}
    duplicate_rows: dict[int, list[int]] = {}
    errors: list[str] = []
    for index, row in enumerate(rows):
        url = str(row.get("source_url", "")).strip()
        local_path = str(row.get("local_path", "")).strip()
        if not url or not local_path:
            continue
        if urlparse(url).scheme not in {"http", "https"}:
            errors.append(f"row {index + 2}: unsupported URL scheme")
            continue
        try:
            target = safe_target(root, local_path)
        except ValueError as exc:
            errors.append(f"row {index + 2}: {exc}")
            continue
        previous = path_urls.get(target)
        if previous:
            if previous != url:
                errors.append(f"row {index + 2}: conflicting URLs for {local_path}")
                continue
            duplicate_rows.setdefault(primary_rows[target], []).append(index)
            continue
        path_urls[target] = url
        primary_rows[target] = index
        tasks.append(Task(index, url, target))

    if args.dry_run:
        print(f"MANIFEST={manifest}")
        print(f"TASKS={len(tasks)}")
        print(f"WORKERS={min(args.workers, max(1, len(tasks)))}")
        for error in errors:
            print(f"ERROR: {error}")
        return 1 if errors else 0

    results: dict[int, tuple[str, str]] = {}
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        pending = {executor.submit(fetch, task, args.timeout, args.user_agent): task for task in tasks}
        for future in as_completed(pending):
            task = pending[future]
            try:
                row_index, result, digest = future.result()
                results[row_index] = (result, digest)
                print(f"{result.upper()} {task.target.relative_to(root)}")
            except Exception as exc:
                errors.append(f"row {task.row_index + 2}: {task.url}: {exc}")

    if "sha256" in fields:
        for row_index, (_, digest) in results.items():
            rows[row_index]["sha256"] = digest
            for duplicate_index in duplicate_rows.get(row_index, []):
                rows[duplicate_index]["sha256"] = digest
        temporary = manifest.with_name(manifest.name + ".tmp")
        with temporary.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)
        os.replace(temporary, manifest)

    for error in errors:
        print(f"ERROR: {error}")
    downloaded = sum(1 for result, _ in results.values() if result == "downloaded")
    existing = sum(1 for result, _ in results.values() if result == "existing")
    print(f"RESULT downloaded={downloaded} existing={existing} failed={len(errors)}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
