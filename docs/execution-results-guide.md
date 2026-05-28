# 測試執行結果填寫說明

QA 主要回填 `qa-workspace/execution-results.csv`。這是一張可用 Excel 開啟的總表，用 `record_type` 區分情境與測試案例。

`execution-results.json` 由 CSV 同步產生，保留給 schema 驗證、CI 與報告流程使用。不要逐個功能手動維護 JSON。

## 欄位說明

| 欄位 | 誰填 | 說明 |
|---|---|---|
| `record_type` | 系統產生 | `scenario` 代表情境可測性，`test_case` 代表測試案例執行結果。 |
| `feature` | 系統產生 | 功能資料夾名稱。 |
| `item_id` | 系統產生 | `SC-...` 或 `TC-...` 編號，不要手動改。 |
| `platform` | QA | 測試平台，例如 `Desktop / Win Chrome`。 |
| `status` | QA | 測試結果，只能填 `Not Run`、`Ready`、`Pass`、`Fail`、`Blocked`、`N/A`。 |
| `executed_at` | 工具產生 | 實際執行或確認時間。QA 不用手動填，產生 Excel 或執行 `--fix` 時會自動補。 |
| `test_url` | QA | 實際測試的頁面位址，例如 `https://qa.example.com/forgot-password`。 |
| `screenshot` | QA | 截圖檔案路徑或連結，例如 `artifacts/screenshots/forgot-password-001.png`。 |
| `evidence` | QA | 影片、Allure、CI artifact、Issue、PR 或其他佐證連結。 |
| `notes` | QA | 補充說明，例如失敗原因、阻擋原因或測試限制。 |

## 狀態用法

| status | 何時使用 |
|---|---|
| `Not Run` | 還沒測。 |
| `Ready` | 已準備好可以測，但尚未執行。 |
| `Pass` | 已測試通過。 |
| `Fail` | 已測試失敗。 |
| `Blocked` | 因環境、帳號、API、需求不清楚等原因無法測。 |
| `N/A` | 這個平台或情境不適用。 |

## 建議更新方式

QA 可以直接編輯 `qa-workspace/execution-results.csv`：

```json
{
record_type,feature,item_id,title,platform,status,test_url,screenshot,evidence,notes
test_case,forgot-password,TC-FORGOT-PASSWORD-001,忘記密碼入口導向正確,Desktop / Win Chrome,Pass,https://qa.example.com/forgot-password,artifacts/screenshots/forgot-password-001.png,artifacts/generated/allure-report/index.html,忘記密碼入口可正常導向。
}
```

存檔後只要執行一次，系統會自動補欄位、補 `executed_at`、驗證、產 Excel、產報告：

```powershell
.\scripts\refresh-qa-artifacts.ps1
```

如果新增功能或測試案例後要重建 CSV：

```powershell
python scripts\sync-execution-results-sheet.py --export --sheet qa-workspace\execution-results.csv
```

若 Cypress 截圖、影片或測試名稱包含 `TC-...`，一鍵更新也會自動把佐證回填到 `screenshot` / `evidence`。

範例命名：

```txt
artifacts/raw/cypress/screenshots/.../TC-FORGOT-PASSWORD-001.png
```

若需要連 PM Word 一起產生：

```powershell
.\scripts\refresh-qa-artifacts.ps1 -IncludeWord
```

`update-execution-result.py` 仍保留給需要用指令更新單筆結果時使用，日常 QA 回填不需要用它：

```powershell
python scripts\update-execution-result.py `
  --feature forgot-password `
  --test-case-id TC-FORGOT-PASSWORD-001 `
  --status Pass `
  --test-url https://qa.example.com/forgot-password `
  --screenshot artifacts/screenshots/forgot-password-001.png `
  --evidence artifacts/generated/allure-report/index.html `
  --notes "忘記密碼入口可正常導向。"
```

被環境卡住時：

```powershell
python scripts\update-execution-result.py `
  --feature forgot-password `
  --test-case-id TC-FORGOT-PASSWORD-004 `
  --status Blocked `
  --notes "目前沒有 Email 測試環境，無法確認重設密碼通知是否送出。"
```

更新後重新產出 Excel：

```powershell
.\scripts\refresh-qa-artifacts.ps1
```
