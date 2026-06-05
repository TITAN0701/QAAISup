# Playwright Smoke Test

使用 Playwright MCP 自動登入系統，巡覽所有主要頁面並截圖，存到 `artifacts/raw/cypress/screenshots/`。

## Arguments

```txt
$ARGUMENTS
```

參數格式（可任意組合）：
- 不帶參數：讀 `.env` 的 `CYPRESS_BASE_URL` 作為目標系統
- 帶網址：`https://uat.example.com` — 使用指定網址作為目標系統
- 帶網址 + 帳密：`https://uat.example.com user@example.com password123`
- 帶路徑：`/admin/some-page` — 在標準頁面之外額外截這個路徑

## Steps

### Step 1 — 確認 Playwright MCP 可用

使用 `mcp__playwright__browser_navigate` 工具。如果工具不存在，停止並告知使用者需要重啟 VSCode 讓 Playwright MCP 載入。

### Step 2 — 解析目標系統

從 `$ARGUMENTS` 判斷：

1. **有傳入 https:// 開頭的網址** → 使用該網址作為 `BASE_URL`
   - 若同時有帳密參數（第二、三個參數）→ 使用傳入的帳密
   - 若沒有帳密 → 提示使用者輸入，或讀 `.env` 的 `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`

2. **沒有傳入網址** → 讀 `.env` 取得 `CYPRESS_BASE_URL` 作為 `BASE_URL`，帳密讀 `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`

3. **有傳入 / 開頭的路徑** → 視為額外截圖頁面（Step 5 處理）

執行前告知使用者：「目標系統：{BASE_URL}，帳號：{email}」

### Step 3 — 建立截圖資料夾

```bash
mkdir -p artifacts/raw/cypress/screenshots
```

### Step 4 — 登入系統

1. 導覽到 `{BASE_URL}/login`
2. 填入帳號密碼並點登入
3. 確認成功進入後台（URL 包含 dashboard 或首頁路徑）
4. 若登入失敗，停止並回報錯誤

### Step 5 — 依序截圖所有主要頁面

以下每個頁面都要：
1. 導覽到 `{BASE_URL}{路徑}`
2. 截全頁截圖（`fullPage: true`）
3. 存到 `artifacts/raw/cypress/screenshots/smoke-{編號}-{名稱}.png`

| 編號 | 名稱 | 路徑 | 需登出 |
|------|------|------|--------|
| 01 | login | `/login` | ✅ 先登出 |
| 02 | register | `/register` | ✅ 登出狀態 |
| 03 | forgot-password | `/forgot-password` | ✅ 登出狀態 |
| 04 | dashboard | `/admin/dashboard` | 重新登入後 |
| 05 | child-list | `/admin/child-list` | |
| 06 | question | `/admin/question` | |
| 07 | invite | `/admin/invite` | |
| 08 | about | `/admin/about` | |
| 09 | profile | `/admin/profile/info?mode=read` | |

**注意**：
- 截 01~03 前先登出（點頭像 → 登出）
- 截 04 前重新登入
- 若頁面路徑不存在（404）或被重導，記錄失敗並繼續

### Step 6 — 如果 $ARGUMENTS 有額外路徑，補充截圖

將 `/` 開頭的路徑參數各截一張，命名為 `smoke-extra-{slug}.png`。

### Step 6 — 回報結果

列出所有截圖檔案清單，格式如下：

```
✅ 截圖完成：N 張
📁 存放路徑：artifacts/raw/cypress/screenshots/

| 檔案 | 頁面 | 狀態 |
|------|------|------|
| smoke-01-login.png | 登入頁 | ✅ |
...

⚠️  失敗項目（如有）：
- smoke-XX-xxx.png：失敗原因
```

## Rules

- 不要點「開始測驗」或任何會新增/修改資料的按鈕
- 不要填寫任何表單並送出（只截圖，不操作）
- 截圖統一使用 `fullPage: true`
- 如果某頁面載入失敗（404 或跳轉），記錄為失敗但繼續執行其他頁面
- 截圖完成後**不要**關閉瀏覽器（保留給後續使用）
