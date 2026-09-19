#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path


FILES = {
    "anatomy_sha256": "source-brand-anatomy.md",
    "grammar_sha256": "grammar-kernel.md",
    "source_json_sha256": "outputs/source-brand-analysis.json",
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Print source-analysis package digests for analysis-handoff.yaml.")
    parser.add_argument("analysis_directory")
    args = parser.parse_args()
    case = Path(args.analysis_directory).expanduser().resolve()
    missing = [relative for relative in FILES.values() if not (case / relative).is_file()]
    if missing:
        raise SystemExit(f"missing required files: {', '.join(missing)}")
    print("package_integrity:")
    for key, relative in FILES.items():
        digest = hashlib.sha256((case / relative).read_bytes()).hexdigest()
        print(f'  {key}: "{digest}"')
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
