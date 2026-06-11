# QA/AI Questions for PM: 口語表達

## Need Clarification

1. Issue #17（待確認）：看圖說故事最少需要幾分鐘才能按完成？目前「5 分鐘」的設定是否已確認要縮短？縮短後的時間為何？
   - Impact: 高嚴重度且待確認，確認前無法設計此情境的測試案例。
   - PM Answer:

2. Issue #17：圖片「變白」問題的觸發條件是什麼？在計時結束前、結束時還是特定操作後？
   - Impact: 影響此 bug 的重現步驟設計與回歸測試。
   - PM Answer:

3. Issue #19（調整中）：口語表達 AI 模組缺失，預計何時修復？適用哪些年齡層？
   - Impact: 高嚴重度，影響多個年齡層的完整測驗流程，需確認修復範圍才能設計測試。
   - PM Answer:

4. Issue #15：60 秒倒數結束後若尚未作答，系統行為是什麼？自動跳下一題還是顯示提示？
   - Impact: 影響計時邊界條件的測試設計。
   - PM Answer:

5. 口語表達模組一次測驗共幾張圖？張數依年齡層不同嗎？
   - Impact: 影響測試流程的步驟設計與預期執行時間。
   - PM Answer:

## Confirmed Decisions

- Source: pm-inbox/issue-tracking-0507.md
- Issue #15、#16、#18 狀態為「已完成」，待 QA 驗證。
- Issue #17 為「待確認」，Issue #19 為「調整中」，暫不自動化。
- 計時方式：每張圖獨立計時 60 秒反向倒數。
- 上傳完成後「下一題」按鈕應自動啟用。
