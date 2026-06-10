# Playwright Smoke Test — 頁面清單

此檔案定義 `/playwright-smoke-test` 要巡覽的頁面。
換系統時只需更新此檔案，不需修改指令本身。

## 系統資訊

- **系統名稱**：國衛院學齡前兒童發展數位評估系統（wetpaint）
- **SIT URL**：https://sit-wetpaint.nhri.org.tw/
- **最後更新**：2026-06-10

---

## 前台頁面（frontdesk）⬅️ 目前優先執行

| 編號 | 名稱 | 路徑 | 備註 |
|------|------|------|------|
| 01 | frontdesk-home | `/frontdesk` | 自動跳轉至 `/{userId}/developmental`（孩童檔案列表） |
| 02 | question-overview | `/question?step=overview` | 測驗總覽頁（點「發展檢測」或「繼續檢測」後跳轉）|

> **實際 URL 模式**：
> - 孩童檔案列表：`/{userId}/developmental`（userId 依登入帳號而異，例：`/522/developmental`）
> - 測驗入口：`/question?step=overview`（有「開始檢測」與「取消」按鈕）
> - 測驗頁後續路徑（step=xxx）待繼續探索

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
