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

## 常用指令

### AI Slash Commands

如果使用 Claude Code 或支援 slash command 的 AI 工具，可以在聊天輸入框輸入 `/` 後使用：

```txt
/PM-1-create-intake
/PM-2-answer-questions
/PM-3-review-release-summary
/QA-1-import-pm-request
/QA-2-generate-questions
/QA-3-generate-scenarios
/QA-4-generate-testcases
/QA-5-generate-automation
/QA-6-generate-report
```

這些指令檔放在：

```txt
.claude/commands/
```

### PM 需求轉入 QA/AI 工作區

```powershell
.\scripts\new-feature-from-inbox.ps1
```

### 安裝前端測試套件

```powershell
npm install
```

### 開啟 Cypress UI

```powershell
npm run test:e2e:open
```

### 執行 Cypress E2E

```powershell
npm run test:e2e
```

### 安裝 Python API 測試套件

```powershell
pip install -r requirements.txt
```

### 執行 pytest API 測試

```powershell
pytest
```

### 產生 Allure 報告

```powershell
npm run allure:generate
```

### 開啟 Allure 報告

```powershell
npm run allure:open
```

### 匯出 PM Word 報告

```powershell
.\scripts\export-pm-report-docx.ps1
```

用途：

```txt
將 artifacts/generated/pm/release-summary.md
轉成 artifacts/generated/pm/release-summary.docx
```

## 報告位置

```txt
PM report:
  artifacts/generated/pm/release-summary.md
  artifacts/generated/pm/release-summary.docx

QA report:
  artifacts/generated/qa/test-report.md
  artifacts/generated/qa/failure-analysis.md

Allure report:
  artifacts/generated/allure-report/
```

## 工具鏈

```txt
主要 E2E: Cypress
輔助 API: Python + pytest
CI: GitHub Actions
Report: Allure
```

## 詳細文件

```txt
docs/architecture.md             架構說明
docs/collaboration-guide.md      PM / QA / AI 分工
docs/feature-document-format.md  功能文件格式
docs/toolchain.md                Cypress / pytest / Allure 工具鏈
docs/reporting-standard.md       報告格式
docs/slash-commands.md           AI slash command 說明
docs/references.md               參考架構與來源
docs/environment-setup.md        被測產品環境設定
```

## 核心規則

- PM inbox 只放需求，不放設定。
- QA/AI 設定不放在 PM 資料夾。
- AI 產物一律視為 draft。
- 測試 pass/fail 必須來自 Cypress、pytest 或 CI。
- Allure 是正式測試報告來源。
- PM 對外報告使用 Word `.docx`，Markdown 保留作為版本控管來源。

## 被測產品設定

本專案需要設定實際產品環境才會真的執行測試。

本機可先複製：

```powershell
Copy-Item .env.example .env
```

主要設定：

```txt
CYPRESS_BASE_URL
API_BASE_URL
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

詳細說明：

```txt
docs/environment-setup.md
```

## 目前常用操作指令

PM 寫完需求後，拆成多個 QA 功能資料夾並產生初版 QA 文件：

```powershell
.\scripts\new-feature-from-inbox.ps1 -InboxFile .\pm-inbox\release-2026-05-example.md -FeatureName release-2026-05-example -SplitRequirements -Yes
```

QA 測完或更新 `tasks.md`、`scenarios.md` 後，產生 QA 報告、PM 摘要與 Word。

不帶 `-Feature` 時，會彙整 `qa-workspace/specs/` 底下全部功能：

```powershell
.\scripts\generate-qa-report.ps1
```

`-Feature` 要填 `qa-workspace/specs/` 底下的功能資料夾名稱：

```powershell
.\scripts\generate-qa-report.ps1 -Feature {feature}
```

範例：

```powershell
.\scripts\generate-qa-report.ps1 -Feature login
.\scripts\generate-qa-report.ps1 -Feature forgot-password
.\scripts\generate-qa-report.ps1 -Feature register
```

彙整所有測試情境成矩陣對照表，會同時產生 Markdown 與 Excel：

```powershell
.\scripts\generate-scenario-matrix.ps1
```

輸出：

```txt
artifacts/generated/qa/scenario-matrix.md
artifacts/generated/qa/scenario-matrix.xlsx
```

只重新匯出 PM Word 報告：

```powershell
.\scripts\export-pm-report-docx.ps1
```

常用檢查位置：

```txt
qa-workspace/specs/{feature}/
artifacts/generated/qa/test-report.md
artifacts/generated/pm/release-summary.md
artifacts/generated/pm/release-summary.docx
```
