# Test Scenarios: 題目內容

## Source
- Feature: question-content
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-QUESTION-CONTENT-001: 測試標記題目已從系統移除
- **Status**: Ready
- **Given**: 系統中各年齡層（2M、36M、48M 等）的題庫已更新
- **When**: 施測者針對任意年齡層個案開始測驗，瀏覽所有顯示的題目
- **Then**: 不應出現任何帶有「[測試用]」或「[測試警示題]」標記的題目
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #5

### SC-QUESTION-CONTENT-002: 答題後正確切換到下一題（不重複）
- **Status**: Ready
- **Given**: 個案正在進行測驗，目前顯示第 N 題
- **When**: 個案作答（答對或答錯）
- **Then**: 系統應顯示第 N+1 題（不同題目），不應重複顯示同一道題目
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #6

### SC-QUESTION-CONTENT-003: 48M 個案可正常開始測驗
- **Status**: Ready
- **Given**: 系統中 48M 年齡層已補足題庫
- **When**: 施測者選擇 48M 年齡層個案並開始測驗
- **Then**: 測驗正常啟動，不顯示「無法開始測驗：題目不足」錯誤訊息
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #7

### SC-QUESTION-CONTENT-004: 60M 個案可正常開始測驗
- **Status**: Ready
- **Given**: 系統中 60M 年齡層已補足題庫
- **When**: 施測者選擇 60M 年齡層個案並開始測驗
- **Then**: 測驗正常啟動，不顯示「無法開始測驗：題目不足」錯誤訊息
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #7

### SC-QUESTION-CONTENT-005: 72M 個案可正常開始測驗
- **Status**: Ready
- **Given**: 系統中 72M 年齡層已補足題庫
- **When**: 施測者選擇 72M 年齡層個案並開始測驗
- **Then**: 測驗正常啟動，不顯示「無法開始測驗：題目不足」錯誤訊息
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #7

### SC-QUESTION-CONTENT-006: 答對顯示正向鼓勵文字（非「答對了」）
- **Status**: Ready
- **Given**: 個案正在進行測驗
- **When**: 個案答對一道題目
- **Then**: 系統顯示正向鼓勵文字（如「太棒了」「很棒」或按讚圖示），不應出現「答對了」字樣
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #8

### SC-QUESTION-CONTENT-007: 答錯顯示正向鼓勵文字（非「答錯了」）
- **Status**: Ready
- **Given**: 個案正在進行測驗
- **When**: 個案答錯一道題目
- **Then**: 系統顯示正向鼓勵文字（如「太棒了」「很棒」或按讚圖示），不應出現「答錯了」字樣
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #8
