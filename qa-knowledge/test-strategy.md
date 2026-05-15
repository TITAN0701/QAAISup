# Test Strategy

此文件定義 QA 設計測試案例時的優先順序與自動化判斷規則。

## Priority

測試優先順序：

1. 核心使用者流程
2. 高風險商業規則
3. 權限與安全相關流程
4. 常見錯誤情境
5. 邊界條件

## Automation Rule

適合優先自動化：

- 穩定且會重複執行的 regression case
- 核心流程 smoke test
- API contract test
- 明確輸入與輸出的 business rule

不適合優先自動化：

- 需求尚未穩定的功能
- 頻繁變動的 UI 細節
- 需要人工主觀判斷的視覺體驗
- 缺少穩定測試資料的情境

## Review Rule

QA 審核 AI 產出的測試案例時，應確認：

- 是否覆蓋主要 acceptance criteria
- 是否包含成功與失敗情境
- 是否有測試資料需求
- 是否有不合理的 AI 假設
- 是否適合自動化
