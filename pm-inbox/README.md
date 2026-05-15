# PM Inbox

這個資料夾是 PM 唯一需要接觸的需求輸入區。

PM 不需要建立功能資料夾，不需要複製模板，也不需要理解 QA/AI 的工作目錄。

## PM 要做什麼

PM 只需要新增或編輯一份需求檔：

```txt
pm-inbox/{feature-name}.md
```

例如：

```txt
pm-inbox/forgot-password.md
pm-inbox/user-register.md
pm-inbox/order-checkout.md
```

## PM 文件格式

```md
# 客戶需求：功能名稱

## 客戶原始需求

客戶希望...

## 背景

目前...

## 已知範圍

- 客戶有明確提到的內容

## 不確定的地方

- PM 尚未確認的問題

## 補充資料

- 相關 ticket:
- 客戶會議日期:
- 相關截圖或文件:
```

## PM 不需要做什麼

PM 不需要：

- 建立 `qa-workspace/specs/{feature}` 資料夾
- 複製 `_template`
- 撰寫 `questions.md`
- 撰寫 `scenarios.md`
- 撰寫 `plan.md`
- 撰寫 `tasks.md`
- 撰寫自動化測試碼

## 後續誰處理

QA 或 AI 會讀取 `pm-inbox/{feature-name}.md`，確認後才建立：

```txt
qa-workspace/specs/{feature-name}/
```

QA 執行腳本時會先看到 PM 寫了什麼，確認後輸入 `YES` 才會建立 QA/AI 工作資料夾。
