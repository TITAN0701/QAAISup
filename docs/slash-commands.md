# AI Slash Commands

本專案提供 Claude Code 風格的 slash command prompt。

位置：

```txt
.claude/commands/
```

## PM Commands

| Command | Purpose |
|---|---|
| `/PM-1-create-intake` | 協助 PM 建立或整理 `pm-inbox/*.md` |
| `/PM-2-answer-questions` | 協助 PM 回答 `questions.md` 的 `PM Answer` |
| `/PM-3-review-release-summary` | 協助 PM 檢查 PM release summary |

## QA Commands

| Command | Purpose |
|---|---|
| `/QA-1-import-pm-request` | 檢查 PM inbox 並準備轉入 QA workspace |
| `/QA-2-generate-questions` | 根據 spec 產生 PM 釐清問題 |
| `/QA-3-generate-scenarios` | 根據已確認需求產生 scenarios、plan、tasks |
| `/QA-4-generate-testcases` | 產生 test-cases.json、test-plan、risk-notes |
| `/QA-5-generate-automation` | 產生 Cypress-first 自動化草稿 |
| `/QA-6-generate-report` | 根據 Allure/CI 結果產生 QA/PM 報告 |

## Notes

- Slash commands are shortcut prompts.
- They do not replace QA review.
- PM commands should not create automation code.
- QA commands should not invent unconfirmed business rules.
- PM Word report is exported with `scripts/export-pm-report-docx.ps1`.
