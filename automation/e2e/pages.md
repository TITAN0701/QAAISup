# Playwright Smoke Test — 頁面清單

此檔案定義 `/playwright-smoke-test` 要巡覽的頁面。
換系統時只需更新此檔案，不需修改指令本身。

## 系統資訊

- **系統名稱**：國衛院學齡前兒童發展數位評估系統（wetpaint）
- **SIT URL**：https://sit-wetpaint.nhri.org.tw/
- **最後更新**：2026-06-10（補充 step=choice 跳題行為）

---

## 前台頁面（frontdesk）⬅️ 目前優先執行

| 編號 | 名稱 | 路徑 | 備註 |
|------|------|------|------|
| 01 | frontdesk-home | `/frontdesk` | 自動跳轉至 `/{userId}/developmental`（孩童檔案列表） |
| 02 | question-overview | `/question?step=overview` | 測驗總覽頁（點「發展檢測」或「繼續檢測」後跳轉）|
| 03 | question-choice | `/question?step=choice` | 觀察題組選擇題（15M+ 個案可進入）|
| 04 | question-supine | `/question?step=supine` | 仰躺動作拍攝（影片錄製，低月齡個案）|

> **實際 URL 模式**：
> - 孩童檔案列表：`/{userId}/developmental`（userId 依登入帳號而異，例：`/522/developmental`）
> - 測驗總覽：`/question?step=overview`（兩種進入方式：「開始檢測」全新 / 「繼續檢測」中途繼續）
> - 題目頁：`/question?step={題目代碼}`（step 值為動態代碼，例：`supine` = 仰躺動作拍攝）
>
> **已確認的 step 代碼**：
> - `overview` — 測驗總覽說明
> - `choice` — 觀察題組選擇題（selector：`button "是"` / `button "否"` / `button "未觀察"` / `button "下一題"`）
> - `supine` — 仰躺動作拍攝（影片錄製，不可自動化）
> - 其他 step 代碼待探索（圖卡配對、語言理解等 step code 未知）
>
> **`step=choice` 跳題行為（2026-06-10 確認）**：
> - URL 永遠是 `/question?step=choice`，題目靠內容換頁，不換 step
> - 答題後 `button "下一題"` 才啟用（disabled → enabled）
> - 點「下一題」後換下一題，「下一題」再次變 disabled
> - 進度條在同一 step 內遞增（例：50% → 下一題後增加）
> - 題目標題為 `heading level=2`；題目類型標籤含文字 `"觀察題組"`
> - 已測試個案：39test1042（3歲3個月）
>
> **兩種進入狀況**：
> - 全新個案：`/{userId}/developmental` → 點「發展檢測」→ 右側顯示「開始檢測」→ 點擊 → `/question?step=overview`
> - 中途繼續：`/{userId}/developmental` → 點「發展檢測」→ 右側顯示「繼續檢測」→ 點擊 → `/question?step=overview`

---

## 登出狀態頁面（暫緩）

| 編號 | 名稱 | 路徑 |
|------|------|------|
| 11 | login | `/login` |
| 12 | register | `/register` |
| 13 | forgot-password | `/forgot-password` |

---

## 登入後頁面（後台）（暫緩）

| 編號 | 名稱 | 路徑 |
|------|------|------|
| 21 | dashboard | `/admin/dashboard` |
| 22 | child-list | `/admin/child-list` |
| 23 | question | `/admin/question` |
| 24 | invite | `/admin/invite` |
| 25 | about | `/admin/about` |
| 26 | profile | `/admin/profile/info?mode=read` |

---

## 新增頁面說明

新增頁面時，在對應區塊加一行即可：

```
| 11 | new-page | `/admin/new-page` | 說明（選填）|
```

編號請連續，不要跳號。
