# AI-assisted Spec-Driven QA Automation

這是一套讓 **PM、QA、AI、工程師** 協作產生測試設計與自動化測試的框架。

核心原則：

```txt
PM 只提供需求
QA/AI 整理規格與測試設計
Cypress / pytest 執行測試
Allure 產生報告
AI 摘要 PM / QA 報告
```

## 專案框架圖

```txt
┌─────────────────────────────────────────────┐
│ PM Input                                     │
│ pm-inbox/{feature}.md                        │
│ PM 只寫客戶需求，不碰測試設定                 │
└──────────────────────┬──────────────────────┘
                       │ QA 確認後轉入
                       ▼
┌─────────────────────────────────────────────┐
│ QA / AI Workspace                            │
│ qa-workspace/specs/{feature}/                │
│ spec.md / questions.md / scenarios.md / plan │
└──────────────────────┬──────────────────────┘
                       │ QA 審核測試設計
                       ▼
┌─────────────────────────────────────────────┐
│ Automation                                   │
│ Cypress: automation/e2e/                     │
│ pytest:  automation/api/                     │
└──────────────────────┬──────────────────────┘
                       │ GitHub Actions 執行
                       ▼
┌─────────────────────────────────────────────┐
│ Report                                       │
│ Allure raw:  artifacts/raw/allure-results/   │
│ Allure html: artifacts/generated/allure-report/ │
│ PM report:   artifacts/generated/pm/         │
│ QA report:   artifacts/generated/qa/         │
└─────────────────────────────────────────────┘
```

## 角色分工

```txt
PM
  └─ 寫 pm-inbox/{feature}.md 或一份批次需求文件

QA
  └─ 檢查 PM 需求、轉入 qa-workspace、審核測試設計

AI
  └─ 產生 questions、scenarios、test cases、report draft

Engineer
  └─ 提供 selector、API contract、測試環境與 code review
```

## 主要資料夾

```txt
pm-inbox/       PM 需求輸入區
qa-workspace/   QA/AI 規格與測試設計工作區
qa-knowledge/   QA 規則與風險規則
prompts/        AI prompt 範本
.claude/commands/ AI slash commands
automation/     Cypress / pytest 測試碼
artifacts/      測試產物與報告
scripts/        QA/AI 執行腳本
docs/           詳細說明文件
```

## 基本流程

```txt
1. PM 寫 pm-inbox/{feature}.md 或 pm-inbox/{release}.md
2. QA 執行轉入腳本
3. QA/AI 拆分功能，QA 輸入 YES 後建立 qa-workspace/specs/{feature}/
4. QA/AI 整理 spec.md
5. QA/AI 產生 questions.md
6. PM 回答 PM Answer
7. QA/AI 產生 scenarios / test cases / test plan
8. QA 審核後才進入 Cypress / pytest 自動化
9. GitHub Actions 執行測試
10. Allure + AI 產生 QA / PM 報告
```

## 日常操作

| 目的 | 指令 |
|---|---|
| PM 需求轉成 QA 文件 | `.\scripts\new-feature-from-inbox.ps1` |
| 產生全部功能 QA/PM 報告 | `.\scripts\generate-qa-report.ps1` |
| 產生單一功能報告 | `.\scripts\generate-qa-report.ps1 -Feature register` |
| 產生測試情境矩陣 Excel | `.\scripts\generate-scenario-matrix.ps1` |
| 只重新匯出 PM Word | `.\scripts\export-pm-report-docx.ps1` |
| 開啟 Cypress UI | `npm run test:e2e:open` |
| 執行 Cypress E2E | `npm run test:e2e` |
| 執行 pytest API 測試 | `pytest` |
| 產生 Allure 報告 | `npm run allure:generate` |
| 開啟 Allure 報告 | `npm run allure:open` |

若要指定其他 PM 文件：

```powershell
.\scripts\new-feature-from-inbox.ps1 -InboxFile .\pm-inbox\{release}.md -FeatureName {release} -SplitRequirements -Yes
```

## 常看位置

```txt
PM 需求：pm-inbox/{release}.md
QA 文件：qa-workspace/specs/{feature}/
QA 報告：artifacts/generated/qa/test-report.md
PM 報告：artifacts/generated/pm/release-summary.docx
矩陣表：artifacts/generated/qa/scenario-matrix.xlsx
Allure：artifacts/generated/allure-report/
```

## 測試結果標記

報告統計只會讀取 `scenarios.md` 的標準狀態欄位：

```md
- Status: Passed
- Status: Failed
- Status: Blocked
- Status: Skipped
```

也可以使用中文：

```md
- 狀態: 通過
- 狀態: 失敗
- 狀態: 阻塞
- 狀態: 略過
```

## 環境設定

第一次執行前先建立 `.env`：

```powershell
Copy-Item .env.example .env
```

常用設定：

```txt
CYPRESS_BASE_URL
API_BASE_URL
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

## 核心規則

- PM inbox 只放需求，不放測試設定。
- AI 產物一律先視為 draft，QA 要檢查後再使用。
- 測試 pass/fail 以 Cypress、pytest 或 CI 結果為準。
- PM 對外報告使用 Word `.docx`，Markdown 保留作為版本控管來源。

## 參考文件

```txt
docs/environment-setup.md        環境設定
docs/collaboration-guide.md      PM / QA / AI 分工
docs/reporting-standard.md       報告格式
docs/slash-commands.md           AI slash command
```
