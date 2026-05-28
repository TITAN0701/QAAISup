# AI-assisted Spec-Driven QA Automation

這個專案是用 SDD 架構協助 QA 支援 PM：先把需求整理成規格，再產出測試情境、測試案例、Excel 矩陣與 QA 報告。

目前先從 QA 文件流程開始，PM 發布摘要先視為選用產物。

## 主要流程

```txt
[PM 需求]
    ↓
[QA/AI 拆規格問題]
    ↓
[PM 回答 questions.md]
    ↓
[QA 產 scenarios.md]
    ↓
[QA 產 test-cases.json]
    ↓
[QA 回填 execution-results.csv]
    ↓
[產生 QA Excel / QA report]
    ↓
[後續再接 Cypress / pytest / CI]
```

## 角色分工

| 角色 | 負責內容 |
|---|---|
| PM | 提供需求、回答 QA 問題、確認驗收條件。 |
| QA | 拆規格、設計情境、產測試案例、回填測試結果。 |
| AI | 協助產文件、檢查格式、整理報告。 |
| Engineer | 補 selector、API、自動化測試與 code review。 |

## 重要資料夾

| 路徑 | 用途 |
|---|---|
| `pm-inbox/` | PM 原始需求。 |
| `qa-workspace/specs/{feature}/` | 每個功能的規格、問題、情境、案例、執行結果。 |
| `qa-workspace/execution-results.csv` | QA 主要回填總表。 |
| `qa-workspace/schemas/` | JSON schema 驗證規則。 |
| `automation/e2e/` | Cypress E2E 測試。 |
| `automation/api/` | pytest API 測試。 |
| `artifacts/generated/qa/` | QA 產出報告與 Excel。 |
| `scripts/` | 自動化整理與驗證腳本。 |

## QA 操作方式

平常只需要做兩件事：

```txt
1. 編輯 qa-workspace/execution-results.csv
2. 執行 .\scripts\refresh-qa-artifacts.ps1
```

執行後會產出：

| 產物 | 用途 |
|---|---|
| `artifacts/generated/qa/scenario-matrix.xlsx` | Excel 版測試情境與測試案例矩陣。 |
| `artifacts/generated/qa/scenario-matrix.md` | Markdown 版矩陣。 |
| `artifacts/generated/qa/test-report.md` | QA 測試報告。 |

## QA 回填規則

`qa-workspace/execution-results.csv` 是主要人工回填來源。

```txt
scenario  = 測試情境，用來確認功能是否可測、是否還有需求問題
test_case = 測試案例，用來記錄實際執行結果
```

常用狀態：

| 狀態 | 意義 |
|---|---|
| `Not Run` | 尚未測試。 |
| `Ready` | 已準備好可以測，但還沒執行。 |
| `Pass` | 測試通過。 |
| `Fail` | 測試失敗。 |
| `Blocked` | 因環境、帳號、API、需求不清楚等原因無法測。 |
| `N/A` | 此情境或平台不適用。 |

## 常用指令

| 目的 | 指令 |
|---|---|
| 一次整理 QA 產物 | `.\scripts\refresh-qa-artifacts.ps1` |
| 驗證 SDD | `.\scripts\validate-sdd.ps1` |
| 驗證測試案例 | `python scripts\validate-testcases.py` |
| 驗證執行結果 | `python scripts\validate-execution-results.py --fix` |
| 產出 Excel / Markdown 矩陣 | `.\scripts\generate-scenario-matrix.ps1` |
| 只產 QA 報告 | `.\scripts\generate-qa-report.ps1 -SkipPm -SkipWord` |
| 需要 PM 摘要時 | `.\scripts\refresh-qa-artifacts.ps1 -IncludePm` |
| 需要 PM Word 時 | `.\scripts\refresh-qa-artifacts.ps1 -IncludePm -IncludeWord` |

## CI

GitHub Actions 目前會在 push、pull request 或手動 Run workflow 時執行 QA flow。

```txt
Validate SDD
    ↓
Validate test cases
    ↓
Validate execution results
    ↓
Run Cypress / pytest
    ↓
Generate Allure
    ↓
Refresh QA artifacts
    ↓
Upload QA report and scenario matrix
```

需要設定的 GitHub Secrets：

```txt
CYPRESS_BASE_URL
API_BASE_URL
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

如果 API 測試站還沒有，可以先讓 API 測試維持範例或略過，等環境確定後再補 `API_BASE_URL`。

## 文件索引

| 文件 | 用途 |
|---|---|
| `docs/execution-results-guide.md` | QA 回填方式。 |
| `docs/reporting-standard.md` | QA 報告應該包含與不應該包含的內容。 |
| `docs/feature-document-format.md` | 功能文件格式。 |
| `docs/environment-setup.md` | 環境設定。 |
| `docs/toolchain.md` | 工具鏈說明。 |
