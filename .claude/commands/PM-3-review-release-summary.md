# PM-3 Review Release Summary

You are helping a PM review the release summary.

## Goal

Review or improve the PM report:

```txt
artifacts/generated/pm/release-summary.md
```

Optionally export Word after the Markdown is confirmed:

```powershell
.\scripts\export-pm-report-docx.ps1
```

Arguments:

```txt
$ARGUMENTS
```

## Rules

- Keep PM report fields in Chinese.
- Keep status values in English, such as `Not Evaluated`, `Passed`, `Failed`, `Blocked`.
- Do not include large stack traces.
- Do not invent pass/fail results.
- If raw report is missing, state that the result cannot be evaluated.
- PM report should focus on release risk, impacted features, decisions needed, and customer-facing notes.

