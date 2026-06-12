# AI Slash Commands

本專案提供 Claude Code 風格的 slash command prompt。

位置：

```txt
.claude/commands/
```

## PM Commands

| Command | Purpose |
|---|---|
| `/PM-import` | 匯入 PM 需求（直接寫 or 從 .xlsx 匯入） |
| `/PM-report` | 審查並匯出 PM 發布摘要報告（.md + .docx） |

## QA Commands

| Command | Purpose |
|---|---|
| `/QA-1-import-pm-request` | 檢查 PM inbox 並準備轉入 QA workspace |
| `/QA-clarify` | QA 整理不確定假設（QA Assumption，內部備忘） |
| `/QA-design` | 產 scenarios + test-cases（一次完成） |
| `/QA-5-generate-automation` | 讀 Playwright snapshot 產 Cypress/pytest 草稿 |
| `/QA-6-generate-report` | 根據執行結果產 QA/PM 報告 |

## Notes

- Slash commands are shortcut prompts.
- They do not replace QA review.
- PM commands should not create automation code.
- QA commands should not invent unconfirmed business rules.
- PM Word report is exported with `scripts/export-pm-report-docx.ps1`.
