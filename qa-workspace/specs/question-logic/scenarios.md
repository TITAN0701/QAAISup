# Test Scenarios: 跳題邏輯

## Source
- Feature: question-logic
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-QUESTION-LOGIC-001: 從實質年齡層開始出題，答錯後下降一階
- **Status**: Ready
- **Given**: 一名 4M 個案進入測驗系統，系統已正確判斷其實質年齡層
- **When**: 測驗開始後，個案連續答錯當前年齡層題目
- **Then**: 系統應從實質年齡層（4M）開始出題，答錯後降低一個年齡層難度，不限制下降次數（可持續往下降）
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #1

### SC-QUESTION-LOGIC-002: 答對後只能上升一個年齡層
- **Status**: Ready
- **Given**: 個案正在較低年齡層答題，已答對
- **When**: 系統決定下一題的難度
- **Then**: 系統應只上升一個年齡層，不可跨越兩階或更多
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #1, #2

### SC-QUESTION-LOGIC-003: 42 個月個案不可測出超過 48 個月結果
- **Status**: Ready
- **Given**: 一名 42M（3歲10個月）個案進入測驗，答對後系統持續升階
- **When**: 系統嘗試再次升一階
- **Then**: 系統最高只能升至 48M（上一階），不可直接跳至 60M 或更高年齡層
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #2

### SC-QUESTION-LOGIC-004: 跨模組後回到實質年齡層的對應模組
- **Status**: Ready
- **Given**: 一名 4M 個案完成「6M 語言理解」模組
- **When**: 系統判斷要進入下一個模組
- **Then**: 系統應跳到 4M（實質年齡層）的「語言表達」模組，而非 6M 的語言表達模組
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #3

### SC-QUESTION-LOGIC-005: 觀察題組全錯時月齡顯示最低值 2 個月
- **Status**: Ready
- **Given**: 一名 6M 受試者進行測驗，觀察題組全部答錯
- **When**: 系統計算最終結果
- **Then**: 結果應顯示「2 個月」（最低月齡下限），不應顯示「0 個月」
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #4

### SC-QUESTION-LOGIC-006: 答錯後無限制下降（邊界：已在最低階）
- **Status**: Ready
- **Given**: 個案已在最低年齡層（2M）持續答錯
- **When**: 系統嘗試再次降階
- **Then**: 系統維持在最低可測年齡層，不出現錯誤或系統崩潰
- **Type**: e2e
- **Priority**: medium
- **Issue Ref**: #1, #4
