# Module: Eval Loader

此模組定義 AI 在每個產出步驟後，應對照哪個 rubric 進行自我評估。

## 使用方式

在 command 的產出步驟後加入：「對照 `.claude/evals/{rubric}` 進行自我評估」

## Rubric 對照表

| 產出物 | 對應 Rubric | 評估時機 |
|--------|------------|---------|
| `spec.md` | `.claude/evals/spec.rubric.md` | `/QA-1` 讀取 spec 後 |
| `scenarios.md` | `.claude/evals/scenarios.rubric.md` | `/QA-design` 產出後 |
| `test-cases.json` | `.claude/evals/test-cases.rubric.md` | `/QA-design` 產出後 |
| `.cy.ts` / `.py` | `.claude/evals/automation.rubric.md` | `/QA-5` 產出後 |
| `test-report.md` / `release-summary.md` | `.claude/evals/report.rubric.md` | `/QA-6` 產出後 |

## 評估結果代碼

| 代碼 | 意義 | 行動 |
|------|------|------|
| `SPEC_OK` | spec 品質足夠 | 繼續流程 |
| `SPEC_INCOMPLETE` | spec 缺少高權重項目 | 停止，告知使用者補充 |
| `SCENARIOS_OK` | scenarios 品質足夠 | 繼續產 test-cases |
| `SCENARIOS_INCOMPLETE` | scenarios 缺失太多 | 重新產出 |
| `TC_OK` | test-cases 品質足夠 | 繼續產 automation |
| `TC_INVALID` | test-cases 有高權重錯誤 | 修正後繼續 |
| `AUTOMATION_OK` | automation 可提交 | 列出 SDET 待確認項 |
| `AUTOMATION_BLOCKED` | automation 有安全/規則違反 | 必須修正後才可提交 |
| `REPORT_OK` | 報告品質足夠 | 可交付 |
| `REPORT_INVALID` | 缺少 execution-results | 告知使用者先執行測試 |

## 適用 Commands

- `/QA-design` — 評估 scenarios + test-cases
- `/QA-5-generate-automation` — 評估 .cy.ts / .py
- `/QA-6-generate-report` — 評估 report
