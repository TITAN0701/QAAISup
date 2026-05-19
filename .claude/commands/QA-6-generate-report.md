# QA-6 Generate Report

You are helping QA generate QA and PM reports from test execution results.

## Goal

Read:

```txt
artifacts/raw/allure-results/
artifacts/generated/allure-report/
CI logs if available
```

Generate:

```txt
artifacts/generated/qa/test-report.md
artifacts/generated/qa/failure-analysis.md
artifacts/generated/pm/release-summary.md
```

Then export:

```txt
artifacts/generated/pm/release-summary.docx
```

Arguments:

```txt
$ARGUMENTS
```

## Rules

- Do not invent pass/fail results.
- Pass/fail must come from Cypress, pytest, CI, or Allure.
- PM report fields should be Chinese.
- PM report status values should remain English.
- QA report may include technical details.
- PM report should summarize release risk, impacted features, PM decisions needed, and customer-facing notes.
- Use `.\scripts\export-pm-report-docx.ps1` to export Word after Markdown is ready.

