# QA-4b Export Scenario Matrix XLSX

You are helping QA export test cases and scenarios into an Excel report.

## Goal

1. Read `artifacts/generated/qa/test-cases.json`
2. Split into individual `qa-workspace/specs/{feature}/test-cases.json` files
3. Run `scripts/generate-scenario-matrix-xlsx.py`
4. Report the output path and statistics

Arguments:

```txt
$ARGUMENTS
```

## Steps

### Step 1 — Check test-cases.json exists

If `artifacts/generated/qa/test-cases.json` does not exist, stop and tell the user to run `/QA-4-generate-testcases` first.

### Step 2 — Split test-cases.json into per-feature files

Run the following Python to split the large JSON into individual feature files:

```python
import json, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('artifacts/generated/qa/test-cases.json', encoding='utf-8') as f:
    data = json.load(f)

base = 'qa-workspace/specs'

items = data if isinstance(data, list) else [data]
for item in items:
    feature = item.get('feature')
    if not feature:
        continue
    target = os.path.join(base, feature, 'test-cases.json')
    with open(target, 'w', encoding='utf-8') as f:
        json.dump(item, f, ensure_ascii=False, indent=2)
    print(f'WRITTEN: {feature}/test-cases.json ({len(item.get("test_cases", []))} cases)')
```

### Step 3 — Generate Excel

Run:

```powershell
python scripts/generate-scenario-matrix-xlsx.py
```

### Step 4 — Report result

Tell the user:
- Output file path
- Total scenarios
- Total test cases
- Where to find the file (artifacts/generated/qa/scenario-matrix.xlsx)

## Rules

- Always run from the project root directory.
- If the xlsx file is currently open in Excel, the script will create a timestamped backup file automatically — inform the user if this happens.
- Do not modify the original test-cases.json.
