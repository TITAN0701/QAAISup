# Test Scenarios: 口語表達

## Source
- Feature: verbal-expression
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-VERBAL-EXPRESSION-001: 每張圖片獨立計時 60 秒倒數
- **Status**: Ready
- **Given**: 個案進入口語表達題目，畫面顯示第一張圖片
- **When**: 題目開始
- **Then**: 每張圖片應各自獨立倒數計時 60 秒，計時器在切換圖片後重置為 60 秒
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #15

### SC-VERBAL-EXPRESSION-002: 第一張圖 60 秒倒數結束後進入下一張圖
- **Status**: Ready
- **Given**: 個案正在進行口語表達，第一張圖的 60 秒倒數即將結束
- **When**: 第一張圖計時結束
- **Then**: 系統自動進入第二張圖，並重新開始 60 秒倒數
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #15

### SC-VERBAL-EXPRESSION-003: 上傳影片成功後「下一題」按鈕可點擊
- **Status**: Ready
- **Given**: 個案完成口語表達題目的影片錄製並上傳
- **When**: 影片上傳成功
- **Then**: 「下一題」按鈕應自動變為可點擊狀態，個案可直接進入下一題
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #16

### SC-VERBAL-EXPRESSION-004: 上傳後不需點「取消」即可繼續測驗
- **Status**: Ready
- **Given**: 個案上傳口語表達影片成功
- **When**: 個案嘗試直接點擊「下一題」
- **Then**: 系統直接跳至下一題，不需要先點擊「取消」
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #16

### SC-VERBAL-EXPRESSION-005: 看圖說故事最短完成時間限制（待確認）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #17 狀態為「待確認」，看圖說故事最少完成時間的合理值尚未由 PM/開發確認，無法建立測試情境。
- **Issue Ref**: #17

### SC-VERBAL-EXPRESSION-006: 圖卡與鏡頭視窗不互相遮擋
- **Status**: Ready
- **Given**: 個案進入口語表達題目，畫面同時顯示圖卡與鏡頭視窗
- **When**: 題目正常顯示
- **Then**: 圖卡內容與鏡頭視窗不互相遮擋，圖卡可完整檢視
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #18

### SC-VERBAL-EXPRESSION-007: AI 口語表達模組存在（調整中）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #19 狀態為「調整中」，AI 口語表達模組部署狀況尚未確認完成，無法建立測試情境。
- **Issue Ref**: #19
