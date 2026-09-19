#!/usr/bin/env python3
"""Create a labeled contact sheet from locally registered evidence images."""

from __future__ import annotations

import argparse
import csv
import math
from pathlib import Path


IMAGE_SUFFIXES = {".avif", ".bmp", ".gif", ".heic", ".jpeg", ".jpg", ".png", ".tif", ".tiff", ".webp"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--thumb-width", type=int, default=320)
    parser.add_argument("--thumb-height", type=int, default=220)
    parser.add_argument(
        "--category",
        help="Include only rows whose pipe-separated visual_category contains this value.",
    )
    return parser.parse_args()


def resolve_local_path(manifest: Path, value: str) -> Path:
    path = Path(value).expanduser()
    return path if path.is_absolute() else manifest.parent / path


def shorten(value: str, length: int = 42) -> str:
    value = " ".join(value.split())
    return value if len(value) <= length else value[: length - 1] + "…"


def main() -> int:
    args = parse_args()
    try:
        from PIL import Image, ImageDraw, ImageFont, ImageOps
    except ImportError:
        print("ERROR: Pillow is required: python3 -m pip install Pillow")
        return 1

    manifest = args.manifest.expanduser().resolve()
    output = args.output.expanduser().resolve()
    if args.columns < 1 or args.thumb_width < 32 or args.thumb_height < 32:
        print("ERROR: columns must be positive and thumbnail dimensions at least 32px")
        return 1
    if not manifest.is_file():
        print(f"ERROR: manifest not found: {manifest}")
        return 1

    with manifest.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))

    items: list[tuple[dict[str, str], Path]] = []
    for row in rows:
        if row.get("status", "").strip() != "included":
            continue
        if args.category:
            categories = {
                value.strip()
                for value in row.get("visual_category", "").split("|")
                if value.strip()
            }
            if args.category not in categories:
                continue
        local_value = row.get("local_path", "").strip()
        if not local_value:
            continue
        path = resolve_local_path(manifest, local_value)
        if path.is_file() and path.suffix.lower() in IMAGE_SUFFIXES:
            items.append((row, path))

    if not items:
        print("ERROR: no included local images found")
        return 1

    caption_height = 82
    padding = 16
    cell_width = args.thumb_width + padding * 2
    cell_height = args.thumb_height + caption_height + padding * 2
    rows_count = math.ceil(len(items) / args.columns)
    sheet = Image.new(
        "RGB",
        (cell_width * args.columns, cell_height * rows_count),
        "#F4F4F1",
    )
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for index, (row, path) in enumerate(items):
        column = index % args.columns
        row_index = index // args.columns
        x = column * cell_width + padding
        y = row_index * cell_height + padding
        try:
            with Image.open(path) as source:
                source = ImageOps.exif_transpose(source).convert("RGB")
                thumb = ImageOps.contain(
                    source,
                    (args.thumb_width, args.thumb_height),
                    method=Image.Resampling.LANCZOS,
                )
        except Exception as exc:
            print(f"WARNING: skipped unreadable image {path}: {exc}")
            continue

        image_x = x + (args.thumb_width - thumb.width) // 2
        image_y = y + (args.thumb_height - thumb.height) // 2
        sheet.paste(thumb, (image_x, image_y))
        draw.rectangle(
            (x, y, x + args.thumb_width, y + args.thumb_height),
            outline="#C8C8C2",
            width=1,
        )
        evidence_id = row.get("evidence_id", "")
        category = row.get("visual_category", "")
        channel = row.get("channel", "") or row.get("content_type", "")
        era = row.get("published_at", "") or row.get("brand_era", "")
        tier = row.get("source_tier", "")
        title = shorten(row.get("title", ""))
        draw.text(
            (x, y + args.thumb_height + 8),
            f"{evidence_id}  {category}\n{channel}  {era}  {tier}\n{title}",
            fill="#1D1D1B",
            font=font,
            spacing=4,
        )

    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output)
    print(f"Created contact sheet with {len(items)} items: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
