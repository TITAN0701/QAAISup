# QA/AI Questions for PM: 影片錄製

## Need Clarification

1. Issue #14：各模組最低錄製秒數不同（大肢體 30 秒、走路側面 15 秒），請問其他模組（仰躺、口語表達等）的最低錄製秒數各為多少？
   - Impact: 影響各模組錄製時長測試案例設計，需要完整的各模組時間規格才能驗證。
   - PM Answer:

2. Issue #12：錄製時長不足時應「彈出提醒並提供重新錄製選項」，提醒文案為何？提示出現時機是在結束錄製時還是上傳時？
   - Impact: 影響 E2E 測試中提示訊息的斷言內容與觸發時機。
   - PM Answer:

3. Issue #13：未達最低秒數前不可結束錄製，結束錄製按鈕的行為是「disabled」還是「點了會顯示提示」？
   - Impact: 影響自動化測試的操作方式與斷言。
   - PM Answer:

4. 影片上傳失敗（如網路中斷）時，系統處理行為是什麼？是否有重試機制？
   - Impact: 影響錄製流程例外情境的測試設計。
   - PM Answer:

## Confirmed Decisions

- Source: pm-inbox/issue-tracking-0507.md
- Issue #12、#13、#14 狀態均為「已完成」，待 QA 驗證。
- 大肢體模組最低錄製時長：超過 30 秒，最多 60 秒。
- 走路側面模組最低錄製時長：超過 15 秒。
