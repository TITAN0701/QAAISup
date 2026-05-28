# 測試執行結果填寫說明

`execution-results.json` 是 QA 回填測試狀態的來源。不要直接把 Excel 當唯一資料來源，因為 Excel 是由腳本重新產生的輸出檔。

## 欄位說明

| 欄位 | 誰填 | 說明 |
|---|---|---|
| `test_case_id` | 系統產生 | 對應 `test-cases.json` 的測試案例 ID，不要手動改。 |
| `platform` | QA | 測試平台，例如 `Desktop / Win Chrome`。 |
| `status` | QA | 測試結果，只能填 `Not Run`、`Ready`、`Pass`、`Fail`、`Blocked`、`N/A`。 |
| `executed_at` | 工具產生 | 實際執行或確認時間，建議用指令自動填，不要手動輸入。 |
| `evidence` | QA | 截圖、影片、Allure、CI artifact、Issue 或 PR 連結。 |
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

用指令更新，時間會自動填入目前系統時間：

```powershell
python scripts\update-execution-result.py `
  --feature forgot-password `
  --test-case-id TC-FORGOT-PASSWORD-001 `
  --status Pass `
  --evidence artifacts/screenshots/forgot-password-001.png `
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
python scripts\validate-execution-results.py
.\scripts\generate-scenario-matrix.ps1
```
