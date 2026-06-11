# QA/AI Questions for PM: 帳號/註冊

## Need Clarification

1. Issue #41：註冊流程使用邀請制度，QA 測試時如何取得有效邀請碼？測試環境（SIT）是否有固定的測試用邀請碼？
   - Impact: 影響測試環境準備，若無法取得邀請碼則無法執行完整的註冊流程測試。
   - PM Answer:

2. Issue #46（待內部測試）：邀請規則尚未制定完成，目前的邀請機制規格為何？預計何時完成？
   - Impact: 邀請規則未定義前，無法設計完整的邀請制度測試案例。
   - PM Answer:

3. 驗證碼的有效期限是多少？驗證碼驗證失敗（如輸入錯誤）的次數限制與提示訊息為何？
   - Impact: 影響驗證碼邊界條件與負向測試設計。
   - PM Answer:

4. 註冊成功後的系統行為是什麼？直接登入、跳轉到特定頁面，還是顯示成功訊息後需要手動登入？
   - Impact: 影響註冊成功後 E2E 測試的斷言設計。
   - PM Answer:

5. 帳號停用（Issue #47）後，使用者嘗試登入的行為是什麼？顯示什麼錯誤訊息？
   - Impact: 影響帳號停用後的負向測試案例設計。
   - PM Answer:

## Confirmed Decisions

- Source: pm-inbox/issue-tracking-0507.md
- Issue #41 狀態為「已完成」，待 QA 驗證。
- Issue #46 狀態為「待內部測試」，邀請規則尚未定案。
