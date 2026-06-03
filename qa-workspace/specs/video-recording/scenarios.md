# Test Scenarios: 影片錄製

## Source
- Feature: video-recording
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-VIDEO-RECORDING-001: 錄製時長不足時顯示提醒
- **Status**: Ready
- **Given**: 使用者進入影片錄製頁面並開始錄製
- **When**: 使用者停止錄製，但錄製時長少於最低要求（如少於 15 秒）
- **Then**: 系統應彈出提醒訊息，告知錄製時長不足
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #12

### SC-VIDEO-RECORDING-002: 錄製時長不足時提供重新錄製選項
- **Status**: Ready
- **Given**: 使用者完成錄製但時長不足
- **When**: 系統顯示時長不足的提醒訊息
- **Then**: 系統應同時提供「重新錄製」按鈕，讓使用者可重錄
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #12

### SC-VIDEO-RECORDING-003: 未達最低秒數前無法結束錄製
- **Status**: Ready
- **Given**: 使用者進入影片錄製頁面，頁面提示最低錄製時長
- **When**: 使用者在未達最低錄製時長（如 15 秒）前嘗試結束錄製
- **Then**: 「結束錄製」按鈕應為不可點擊狀態，或系統阻止提早結束
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #13

### SC-VIDEO-RECORDING-004: AI 模組影片需強制錄製達最低秒數
- **Status**: Ready
- **Given**: 使用者進入 AI 模組的影片錄製頁面
- **When**: 使用者在 1~2 秒內嘗試結束錄製
- **Then**: 系統阻止提早結束，不允許如此短暫的錄製完成上傳
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #13

### SC-VIDEO-RECORDING-005: 大肢體模組錄製時長說明文字正確
- **Status**: Ready
- **Given**: 使用者進入大肢體模組的影片錄製頁面
- **When**: 使用者查看錄製說明文字
- **Then**: 頁面應顯示「超過 30 秒，最多 60 秒」，不應有其他錯誤版本文字
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #14

### SC-VIDEO-RECORDING-006: 走路側面模組錄製時長說明文字正確
- **Status**: Ready
- **Given**: 使用者進入走路側面模組的影片錄製頁面
- **When**: 使用者查看錄製說明文字
- **Then**: 頁面應顯示「超過 15 秒」，不應有其他版本的錯誤文字（如「超過 5 秒」或「超過 30 秒」）
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #14
