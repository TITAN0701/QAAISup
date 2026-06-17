# Playwright Smoke Test — 頁面清單

此檔案定義 `/playwright-smoke-test` 要巡覽的頁面。
換系統時只需更新此檔案，不需修改指令本身。

## 系統資訊

- **系統名稱**：國衛院學齡前兒童發展數位評估系統（wetpaint）
- **SIT URL**：https://sit-wetpaint.nhri.org.tw/
- **最後更新**：2026-06-16

---

## 已知 SIT 測試個案

> ⚠️ 執行測驗流程前必須新增**全新孩童**（見強制規則）。下表為**唯讀參考**，用於確認哪些個案已測驗、不可重用。

| child_id | 姓名 | 月齡 | 狀態 | 備註 |
|----------|------|------|------|------|
| 546 | QATest36M | 36M | 🔴 測驗進行中 | 停在 `graphic-copying-photo`，不可用 |
| 528 | 3 | 48M | 🟢 尚未測驗 | 完整模組首選，可用 |
| 502 | 39test1042 | 39M | 🟡 已完成 choice | 部分完成，不可重測 |

> 新增的全新孩童測試完成後，請將 child_id 與狀態補充至此表。

---

## 前台頁面（frontdesk）⬅️ 目前優先執行

| 編號 | 名稱 | 路徑 | 備註 |
|------|------|------|------|
| 01 | frontdesk-home | `/frontdesk` | 自動跳轉至 `/{userId}/developmental` |
| 02 | question-overview | `/question?step=overview` | 測驗總覽頁 |
| 03 | question-choice | `/question?step=choice` | 觀察題組選擇題 |
| 04 | question-supine | `/question?step=supine` | 仰躺動作拍攝（低月齡）|

### 強制規則

> ⚠️ **新增孩童規則**：執行測驗流程前必須**新增全新孩童**，不可使用已有個案。
> 步驟：點「新增檔案」→ 填入姓名 + 生日（依目標月齡）→ 用新孩童開始檢測。

> ⚠️ **等待上限規則**：單次 wait 不超過 **20 秒**。影片上傳等長時間操作改用輪詢（wait 10s → 檢查狀態 → 未完成再 wait 10s）。

### 已確認的 step 代碼（2026-06-15）

| step | 說明 | snapshot 狀態 |
|------|------|:------------:|
| `overview` | 測驗總覽說明 | ✅ |
| `choice` | 觀察題組（是/否/未觀察）| ✅ |
| `supine` | 仰躺動作錄影（低月齡）| ✅ |
| `walk-fb` | 走路步態正/背面錄影 | ✅ |
| `walk-side` | 走路步態側面錄影 | ✅ |
| `graphic-copying-photo` | 手握筆拍照（精細動作）| ✅ |
| `graphic-copying-video` | 手繪圖形錄影（超過 30 秒最多 60 秒）| ✅（2026-06-15）|
| `picture-naming` | 口語表達（看圖說故事，錄影+評分）| ✅（2026-06-15）|
| `picture-pairing` | 圖卡配對（8M+ 才出現）| ❌ 待補 |
| `picture-ident` | 圖片辨識（語言理解）| ❌ 待補 |
| `finish` | 測驗完成頁 | ✅ |
| `result` | 評量結果頁 | ✅ |

**檢測紀錄頁**：`/{childId}/record`（例：`/540/record`）

### 年齡層 × 模組對照

| 月齡 | 出現模組 |
|------|---------|
| 2–9m | 走路步態（walk-fb / walk-side / supine） |
| 12–15m | ＋大肢體動作 |
| 18m | ＋社會情緒（F） |
| 24m+ | ＋手握筆（graphic-copying-photo）、語言理解（picture-pairing / picture-ident） |
| 36m+ | ＋精細動作（graphic-copying-video）、語言表達（picture-naming） |
| 42–48m | 幾乎全部（A+B+C+D1+D2+E+F） |

---

## 登出狀態頁面

> snapshot 已於 2026-06-12 補齊

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
