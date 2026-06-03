# QA/AI Questions for PM: 後台管理

## Need Clarification

1. Issue #46（待內部測試）、#49（待內部測試）：邀請規則與帳號管理列表檢視權限尚在內部測試，預計何時對 QA 開放測試？
   - Impact: 影響後台測試執行時程規劃。
   - PM Answer:

2. Issue #50、#51（未填狀態）：局處／機構建立與維護頁面的規格為何？完整說明文件在哪裡？
   - Impact: 缺少規格說明無法設計測試案例。
   - PM Answer:

3. Issue #48：「修改他人資料」隱藏編輯按鈕，哪些角色可以修改他人資料？按鈕隱藏後後端是否也有權限驗證，還是只是前端隱藏？
   - Impact: 若後端未驗證則存在安全風險，影響安全性測試範圍。
   - PM Answer:

4. Issue #49：帳號管理列表的「檢視權限」，不同角色能看到的帳號清單範圍是否不同？（如局處管理員只能看到本局處帳號）
   - Impact: 影響權限控制測試的多角色測試資料準備。
   - PM Answer:

5. 後台 SIT 測試環境是否已對 QA 開放？登入後台的測試帳號如何取得？
   - Impact: 影響所有後台測試案例的執行前提。
   - PM Answer:

## Confirmed Decisions

- Source: pm-inbox/issue-tracking-0507.md
- Issue #47、#48 狀態為「已完成」，待 QA 驗證。
- Issue #46、#49 為「待內部測試」，Issue #50、#51 尚無狀態，需進一步確認。
