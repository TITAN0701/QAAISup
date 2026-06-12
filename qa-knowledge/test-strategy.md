# Test Strategy

此文件定義 QA 設計測試案例時的優先順序與自動化判斷規則。
適用系統：國衛院學齡前兒童發展數位評估系統（wetpaint）

## Priority

測試優先順序：

1. 核心檢測流程（題目邏輯、AI 模組、影片錄製、結果顯示）
2. 資料正確性（身分證字號格式、年齡分層、CASEID 流水號）
3. 權限與帳號安全（登入、帳號停用、角色限制）
4. 觀察題組與重新錄製等特殊流程
5. 常見錯誤情境與邊界條件
6. 後台管理功能（帳號管理、孩童列表、題目管理）

## Automation Rule

適合優先自動化（automation_candidate: true）：

- 登入 / 帳號管理流程
- 表單驗證（身分證字號格式、必填欄位）
- 管理後台 UI 結構驗證（導覽列、欄位、搜尋）
- 頁面導覽與 URL 驗證
- API contract test（資料格式、HTTP 狀態碼）
- 明確輸入與輸出的 business rule（題目邏輯分層條件）

不適合自動化（automation_candidate: false）：

- 需實際錄製影片（video-recording、gait-analysis、verbal-expression）
- 需 AI 模組實際分析完成才能驗證結果
- 需人眼判斷視覺品質（影片畫質、輔助框比例）
- 涉及「開始測驗 / 開始檢測」操作（SIT 環境限制）
- 非同步上傳等待外部 API 回應
- 需求尚未穩定或 QA Assumption 仍待驗證的功能

## Selector Rule

**目前禁止使用 `data-testid` selector**（SIT DOM 尚未加入，詳見 selector-policy.md）。

現階段使用順序：`input[placeholder]` > `cy.contains('button/a', '文字')` > `a[href]` > 穩定唯一中文文字

無法確認 selector 的 TC 一律寫 `it.skip()`，並在檔案頂部加 `[SDET TODO]`。
禁止使用 CSS nth-child、不穩定 class name、完整 XPath。

## Review Rule

QA 審核 AI 產出的測試案例時，應確認：

- 是否覆蓋主要 acceptance criteria
- 是否包含成功與失敗情境
- 是否有測試資料需求（年齡層 fixture、帳號角色）
- 是否有不合理的 AI 假設
- 是否適合自動化（對照 risk-rules.md 不可自動化情境）
- Selector 是否使用真實存在的 DOM 屬性
