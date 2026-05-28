from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

from jsonschema import Draft202012Validator

EXECUTED_STATUSES = {"Pass", "Fail", "Blocked", "N/A"}
RESULT_DEFAULTS = {
    "executed_at": "",
    "test_url": "",
    "screenshot": "",
    "evidence": "",
    "notes": "",
}


def load_json(path: Path) -> object:
    with path.open("r", encoding="utf-8-sig") as file:
        return json.load(file)


def dump_json(path: Path, data: object) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def now_text() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def normalize_execution_result_file(path: Path, data: dict) -> bool:
    changed = False
    for item in data.get("test_results", []):
        if not isinstance(item, dict):
            continue

        for key, default in RESULT_DEFAULTS.items():
            if key not in item:
                item[key] = default
                changed = True

        if item.get("status") in EXECUTED_STATUSES and not item.get("executed_at"):
            item["executed_at"] = now_text()
            changed = True

    if changed:
        dump_json(path, data)
    return changed


def get_scenario_ids(path: Path) -> set[str]:
    if not path.exists():
        return set()
    content = path.read_text(encoding="utf-8-sig")
    return set(re.findall(r"(?m)^###\s+(SC-[A-Z0-9_-]+)\s*$", content))


def get_test_case_ids(path: Path) -> set[str]:
    if not path.exists():
        return set()
    data = load_json(path)
    if not isinstance(data, dict):
        return set()
    return {
        item.get("id")
        for item in data.get("test_cases", [])
        if isinstance(item, dict) and isinstance(item.get("id"), str)
    }


def format_json_path(path_parts: list[object]) -> str:
    formatted = "$"
    for part in path_parts:
        formatted += f"[{part}]" if isinstance(part, int) else f".{part}"
    return formatted


def validate_execution_results(specs_root: Path, schema_path: Path, fix: bool = False) -> int:
    schema = load_json(schema_path)
    validator = Draft202012Validator(schema)
    errors: list[str] = []
    fixed_files: list[str] = []

    feature_dirs = sorted(
        path for path in specs_root.iterdir() if path.is_dir() and not path.name.startswith((".", "_"))
    )

    for feature_dir in feature_dirs:
        results_path = feature_dir / "execution-results.json"
        if not results_path.exists():
            errors.append(f"{feature_dir.name}: missing execution-results.json")
            continue

        try:
            data = load_json(results_path)
        except json.JSONDecodeError as exc:
            errors.append(f"{feature_dir.name}: invalid JSON: {exc}")
            continue

        for error in sorted(validator.iter_errors(data), key=lambda item: list(item.path)):
            errors.append(
                f"{feature_dir.name}: schema error at {format_json_path(list(error.path))}: {error.message}"
            )

        if not isinstance(data, dict):
            continue

        if fix and normalize_execution_result_file(results_path, data):
            fixed_files.append(str(results_path).replace("\\", "/"))

        if data.get("feature") != feature_dir.name:
            errors.append(f"{feature_dir.name}: feature field must match folder name")

        scenario_ids = get_scenario_ids(feature_dir / "scenarios.md")
        test_case_ids = get_test_case_ids(feature_dir / "test-cases.json")

        for index, item in enumerate(data.get("scenario_reviews", [])):
            scenario_id = item.get("scenario_id") if isinstance(item, dict) else None
            if scenario_id not in scenario_ids:
                errors.append(
                    f"{feature_dir.name}: scenario_reviews[{index}].scenario_id {scenario_id!r} "
                    "does not exist in scenarios.md"
                )

        seen_results: set[tuple[str, str]] = set()
        for index, item in enumerate(data.get("test_results", [])):
            if not isinstance(item, dict):
                continue
            test_case_id = item.get("test_case_id")
            platform = item.get("platform")
            if test_case_id not in test_case_ids:
                errors.append(
                    f"{feature_dir.name}: test_results[{index}].test_case_id {test_case_id!r} "
                    "does not exist in test-cases.json"
                )
            key = (test_case_id, platform)
            if key in seen_results:
                errors.append(f"{feature_dir.name}: duplicate test result for {test_case_id} / {platform}")
            seen_results.add(key)

    if errors:
        print("Execution result validation failed:")
        for error in errors:
            print(f"  - {error}")
        return 1

    if fixed_files:
        print("Execution result auto-filled:")
        for path in fixed_files:
            print(f"  - {path}")

    print(f"Execution result validation passed. Checked {len(feature_dirs)} feature workspace(s).")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate QA execution-results.json files.")
    parser.add_argument("--specs-root", default="qa-workspace/specs")
    parser.add_argument("--schema", default="qa-workspace/schemas/execution-results.schema.json")
    parser.add_argument("--fix", action="store_true", help="Auto-fill missing executed_at and optional result fields.")
    args = parser.parse_args()
    return validate_execution_results(Path(args.specs_root), Path(args.schema), fix=args.fix)


if __name__ == "__main__":
    sys.exit(main())
