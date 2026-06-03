# QA/AI Questions for PM: 資料驗證

## Need Clarification

1. Issue #42：目前只驗證身分證字號第二碼性別，完整的身分證字號驗證規則為何？（格式、長度、第一碼地區碼等）是否有完整驗證規格？
   - Impact: 影響身分證字號驗證測試案例的覆蓋範圍設計。
   - PM Answer:

2. Issue #43（調整中）：流水號規則等同於 CASEID，CASEID 的完整格式規則為何？群健所提供的流水號規則文件是否可共享給 QA？
   - Impact: 調整中的問題，規則確認前無法設計流水號格式的自動化驗證。
   - PM Answer:

3. Issue #45：發展遲緩結果顯示最低「<2個月」，觸發條件是什麼？只要全錯就顯示，還是有其他計算邏輯？
   - Impact: 影響結果頁面月齡顯示的測試案例設計。
   - PM Answer:

4. 身分證字號欄位是否為必填？若使用者為外國人（無身分證），系統如何處理？
   - Impact: 影響資料驗證邊界情境測試。
   - PM Answer:

## Confirmed Decisions

- Source: pm-inbox/issue-tracking-0507.md
- Issue #42 狀態為「已完成」，待 QA 驗證。
- Issue #43 仍為「調整中」，暫不自動化。
- 身分證字號第二碼：男為 1，女為 2。
