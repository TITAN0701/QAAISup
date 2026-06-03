# QA/AI Questions for PM: 題目內容

## Need Clarification

1. Issue #7：48M、60M、72M 目前使用暫時性題目，正式題目由馬偕提供後才導入。正式題目的導入時程為何？導入後 QA 需要重新驗證嗎？
   - Impact: 若暫時性題目與正式題目不同，現在的測試結果可能不適用，需規劃二次驗證。
   - PM Answer:

2. Issue #8：統一回饋文字為「正向鼓勵」，各模組正確的回饋文案為何？（是「很棒！」還是「太棒了！」還是按讚圖示？）
   - Impact: 影響 E2E 測試中回饋文字的斷言內容，若無確定文案則無法自動化驗證。
   - PM Answer:

3. Issue #5：測試用標記題目移除後，如何確認所有環境（SIT/正式）的題庫都已清除？是否有題庫清單可供 QA 比對驗證？
   - Impact: 若無清單，QA 只能抽測部分年齡層，無法保證全面覆蓋。
   - PM Answer:

4. Issue #6：重複題目排除後，是否有特定年齡層或模組曾出現重複率較高？需要重點驗證哪些年齡層？
   - Impact: 影響測試資料準備與驗證重點。
   - PM Answer:

## Confirmed Decisions

- Source: pm-inbox/issue-tracking-0507.md
- Issue #5、#6、#7、#8 狀態均為「已完成」，待 QA 驗證。
- 回饋文字應統一為正向鼓勵，不應出現「答對了」或「答錯了」字樣。
