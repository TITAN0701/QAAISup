# PM-4 Import XLSX

You are helping a PM import an Excel (.xlsx) file from the pm-inbox folder into a readable Markdown document.

## Goal

Read a specified xlsx file from `pm-inbox/`, list all sheet names for the user to choose from, then convert the selected sheet(s) into a well-structured `.md` file saved under `pm-inbox/`.

Arguments:

```txt
$ARGUMENTS
```

## Steps

### Step 1 — Locate the file

If `$ARGUMENTS` contains a filename, use it. Otherwise, list all `.xlsx` files currently in `pm-inbox/` and ask the user which one to process.

File must exist under `pm-inbox/`. Do not accept paths outside this folder.

### Step 2 — List all sheets

Use Python with `openpyxl` to read the xlsx file and print all sheet names:

```python
import openpyxl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
wb = openpyxl.load_workbook('pm-inbox/<filename>', data_only=True)
for name in wb.sheetnames:
    print(name)
```

Present the sheet list to the user and ask which sheet(s) to import.
If the user already specified a sheet name in `$ARGUMENTS`, skip this step and proceed.

### Step 3 — Read the selected sheet

Use Python to read all non-empty rows from the selected sheet. Detect the header row (first non-empty row) and use it as column names.

Preserve all cell values including newlines within cells.

### Step 4 — Analyse and structure the content

Before writing the md file:
- Identify what kind of data this sheet contains (issue tracker, task list, requirement table, schedule, etc.)
- Choose a suitable Markdown structure:
  - **Issue / bug tracker** → group by category column, use tables per group, add summary section at the end
  - **Flat table** → single markdown table
  - **Requirement list** → use headings per requirement item
  - **Schedule / milestone** → use table with date columns

If the sheet has a clear grouping column (e.g. 問題分類, 模組, 功能), group rows under headings by that column.

### Step 5 — Write the md file

Output filename: derive from the sheet name, lowercased with hyphens, e.g.:
- `0507_Issue與處理狀況追蹤` → `issue-tracking-0507.md`
- `需求說明` → `requirements.md`
- `專案時程` → `schedule.md`

If a file with the same name already exists, ask the user before overwriting.

Save to `pm-inbox/<output-filename>.md`.

Include at the top:
```md
## 來源
- 原始檔案：<xlsx filename>
- 分頁：<sheet name>
- 匯入日期：<today's date>
```

### Step 6 — Confirm

Report to the user:
- Output file path
- Number of rows imported
- Any rows skipped (fully empty)
- Any data quality issues noticed (missing values in key columns, inconsistent status labels, etc.)

## Rules

- Use `openpyxl` for reading. If not installed, run `pip install openpyxl -q` first.
- Always use `encoding='utf-8'` when writing stdout in Python to avoid cp950 encoding errors on Windows.
- Do not modify the original xlsx file.
- Do not create files outside `pm-inbox/`.
- If multiple sheets are selected, produce one md file per sheet.
- Preserve the original cell content as faithfully as possible — do not summarise or omit data.
