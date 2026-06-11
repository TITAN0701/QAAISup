# Playwright Smoke Test — 頁面清單

此檔案定義 `/playwright-smoke-test` 要巡覽的頁面。
換系統時只需更新此檔案，不需修改指令本身。

## 系統資訊

- **系統名稱**：國衛院學齡前兒童發展數位評估系統（wetpaint）
- **SIT URL**：https://sit-wetpaint.nhri.org.tw/
- **最後更新**：2026-06-10（補充 supine 完整錄影流程與 choice radio selector）

---

## 前台頁面（frontdesk）⬅️ 目前優先執行

| 編號 | 名稱 | 路徑 | 備註 |
|------|------|------|------|
| 01 | frontdesk-home | `/frontdesk` | 自動跳轉至 `/{userId}/developmental`（孩童檔案列表） |
| 02 | question-overview | `/question?step=overview` | 測驗總覽頁（點「發展檢測」或「繼續檢測」後跳轉）|
| 03 | question-choice | `/question?step=choice` | 觀察題組選擇題（15M+ 個案可進入）|
| 04 | question-supine | `/question?step=supine` | 仰躺動作拍攝（影片錄製，低月齡個案）|

### URL 模式與進入方式

- 孩童檔案列表：`/{userId}/developmental`（userId 依登入帳號而異，例：`/522/developmental`）
- 測驗總覽：`/question?step=overview`
- 題目頁：`/question?step={題目代碼}`（step 值為動態代碼）

**兩種進入狀況**：

| 狀況 | 路徑 |
|------|------|
| 全新個案 | `/{userId}/developmental` → 點「發展檢測」→「開始檢測」→ `/question?step=overview` |
| 中途繼續 | `/{userId}/developmental` → 點「發展檢測」→「繼續檢測」→ `/question?step=overview` |

**已確認的 step 代碼**：

| step | 說明 | 可自動化 |
|------|------|:--------:|
| `overview` | 測驗總覽說明 | ✅ |
| `choice` | 觀察題組選擇題 | ✅（部分） |
| `supine` | 仰躺動作拍攝（影片錄製） | ❌ |
| 其他 | 圖卡配對、語言理解等 step code 未知 | ❓ |

**已確認的 step 順序（2M 個案，2026-06-10）**：

`overview` → 點「開始檢測」→ `supine`（仰躺錄影）→ 上傳成功 → 點「下一題」→ `choice`（觀察題組）

### step=supine 錄影流程（2026-06-10 確認，個案：qatest01 0歲2個月）

1. 教學頁（多頁輪播，底部有 4 個點）→ 按「開始錄製」
2. 系統要求**直式視窗**（橫式會顯示「請將裝置轉成直式」）
3. 錄影介面：攝影機畫面 + 綠色輔助框 + 右上倒數計時
4. 未滿 30 秒停止 → 警告「錄製時間未滿 30 秒」→ 按「我知道了」繼續
5. 達 60 秒自動停止 → 提示「影片錄製已達 1 分鐘」→ 進入確認頁
6. 確認頁：影片預覽 + **取消 / 重新錄製 / 上傳影片**
7. 上傳成功後顯示「上傳成功！」→ 按「下一題」→ 跳至 `step=choice`

**supine selector**：

| 元素 | Selector |
|------|----------|
| 開始錄製（教學頁） | `cy.contains('button', '開始錄製')` |
| 開始錄製（錄影介面） | `cy.contains('button', '開始錄製')` |
| 我知道了（未滿30秒警告） | `cy.contains('button', '我知道了')` |
| 重新錄製 | `cy.contains('button', '重新錄製')` |
| 上傳影片 | `cy.contains('button', '上傳影片')` |
| 返回 | `cy.contains('button', '返回')` |

> ⚠️ supine 需要攝影機權限與真實錄影，**無法自動化**；需手動測試或 mock API。

### step=choice 跳題行為（2026-06-10 確認）

- URL 永遠是 `/question?step=choice`，題目靠內容換頁，**不換 step**
- 答題後「下一題」才啟用（disabled → enabled）；點後換下一題，再次 disabled
- 進度條在同一 step 內遞增

**⚠️ 答案選項樣式因月齡不同而異**：

| 月齡 | 樣式 | Selector |
|------|------|----------|
| 高月齡（39M，39test1042） | button | `cy.contains('button', '是')` / `cy.contains('button', '否')` / `cy.contains('button', '未觀察')` |
| 低月齡（2M，qatest01） | radio button | `cy.contains('是')` / `cy.contains('否')` / `cy.contains('未觀察')` |

**共用 selector**：

| 元素 | Selector |
|------|----------|
| 下一題 | `cy.contains('button', '下一題')` |
| 題目類型標籤 | `cy.contains('觀察題組')` |
| 取消 | `cy.contains('button', '取消')` |

> 已測試個案：39test1042（3歲3個月）、qatest01（0歲2個月）

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
