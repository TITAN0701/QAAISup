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
  └─ 寫 pm-inbox/{feature}.md

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
automation/     Cypress / pytest 測試碼
artifacts/      測試產物與報告
scripts/        QA/AI 執行腳本
docs/           詳細說明文件
```

## 基本流程

```txt
1. PM 寫 pm-inbox/{feature}.md
2. QA 執行轉入腳本
3. QA 輸入 YES 後建立 qa-workspace/specs/{feature}/
4. QA/AI 整理 spec.md
5. QA/AI 產生 questions.md
6. PM 回答 PM Answer
7. QA/AI 產生 scenarios / test cases / test plan
8. QA 審核後才進入 Cypress / pytest 自動化
9. GitHub Actions 執行測試
10. Allure + AI 產生 QA / PM 報告
```

## 常用指令

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
```

## 核心規則

- PM inbox 只放需求，不放設定。
- QA/AI 設定不放在 PM 資料夾。
- AI 產物一律視為 draft。
- 測試 pass/fail 必須來自 Cypress、pytest 或 CI。
- Allure 是正式測試報告來源。
- PM 對外報告使用 Word `.docx`，Markdown 保留作為版本控管來源。
