# AI-assisted Spec-Driven QA Automation

QA 支援 PM 的 SDD 流程工具。

```txt
[PM 寫需求]
      ↓
[QA/AI 拆規格與問題]
      ↓
[PM 回答 questions.md]
      ↓
[QA 產 scenarios.md]
      ↓
[產生測試情境 Excel]
      ↓
[QA/Engineer 補自動化]
      ↓
[CI 跑 Cypress / pytest]
      ↓
[產生 QA / PM 報告]
```

## 角色

| 角色 | 負責 |
|---|---|
| PM | 寫需求、回答問題、確認規則 |
| QA | 拆規格、設計情境、判斷風險 |
| AI | 產生草稿、整理問題、摘要報告 |
| Engineer | selector、API、自動化與 review |

## 主要目錄

| 路徑 | 用途 |
|---|---|
| `pm-inbox/` | PM 原始需求 |
| `qa-workspace/specs/{feature}/` | 規格、問題、情境、測試計畫 |
| `automation/e2e/` | Cypress E2E 測試 |
| `automation/api/` | pytest API 測試 |
| `artifacts/generated/` | QA / PM / Allure 報告 |
| `scripts/` | 建立、檢查、報告工具 |

## 操作流程

```txt
1. PM 放需求
   pm-inbox/{release-or-feature}.md

2. 建立 SDD 工作區
   qa-workspace/specs/{feature}/

3. 檢查文件
   validate-sdd.ps1

4. PM 回答問題
   questions.md -> PM Answer / Status

5. QA 產測試情境
   scenarios.md -> scenario-matrix.xlsx

6. 補測試
   automation/e2e/ 或 automation/api/

7. 產生報告
   artifacts/generated/
```

## 常用指令

| 目的 | 指令 |
|---|---|
| 建立 SDD | `.\scripts\new-feature-from-inbox.ps1 -InboxFile .\pm-inbox\xxx.md -SplitRequirements -Yes` |
| 檢查 SDD | `.\scripts\validate-sdd.ps1` |
| PM 問題完成後檢查 | `.\scripts\validate-sdd.ps1 -FailOnOpenQuestions` |
| 產生測試情境 Excel | `.\scripts\generate-scenario-matrix.ps1` |
| 檢查 Cypress | `npm run test:e2e:verify` |
| 跑 E2E | `npm run test:e2e` |
| 跑 API | `pytest` |
| 產生報告 | `.\scripts\generate-qa-report.ps1` |

## PM 回答格式

```md
- PM Answer: 實際回答內容
- Status: Answered
```

未確認時：

```md
- PM Answer:
- Status: Open
```

## 測試與報告

| 類型 | 位置 |
|---|---|
| Cypress 測試 | `automation/e2e/specs/{feature}.cy.ts` |
| pytest 測試 | `automation/api/tests/test_{feature}.py` |
| 測試情境來源 | `qa-workspace/specs/{feature}/scenarios.md` |
| 測試情境矩陣 | `artifacts/generated/qa/scenario-matrix.xlsx` |
| QA 報告 | `artifacts/generated/qa/test-report.md` |
| PM 摘要 | `artifacts/generated/pm/release-summary.md` |
| PM Word | `artifacts/generated/pm/release-summary.docx` |

## CI

```txt
push main / Pull Request / 手動 Run workflow
      ↓
GitHub Actions
      ↓
檢查 SDD -> 檢查 secrets -> 跑測試 -> 產生情境矩陣 -> 產生報告
```

需要的 GitHub Secrets：

```txt
CYPRESS_BASE_URL
API_BASE_URL
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

## 詳細文件

| 文件 | 內容 |
|---|---|
| `pm-inbox/README.md` | PM 需求格式 |
| `docs/feature-document-format.md` | SDD 文件格式 |
| `docs/collaboration-guide.md` | 分工規則 |
| `docs/environment-setup.md` | 環境設定 |
| `docs/reporting-standard.md` | 報告規則 |
| `docs/toolchain.md` | 工具鏈 |
