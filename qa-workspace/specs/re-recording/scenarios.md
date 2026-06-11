# Test Scenarios: 重新錄製

## Source
- Feature: re-recording
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-RE-RECORDING-001: 重新錄製後可連貫完成所有待補錄模組
- **Status**: Ready
- **Given**: 一名個案（如 Lala 41M）有多個待補錄影片模組，使用者從「檢測紀錄」進入「重新錄製」
- **When**: 使用者完成第一個模組的錄製
- **Then**: 系統應繼續引導使用者進行下一個待補錄模組，不中斷流程
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #38

### SC-RE-RECORDING-002: 重新錄製不觸發圖卡配對
- **Status**: Ready
- **Given**: 使用者從「檢測紀錄」進入「重新錄製」流程
- **When**: 完成一個影片模組的重新錄製
- **Then**: 系統不應彈出圖卡配對或評測結果頁面，流程應直接繼續錄製下一個待補錄模組
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #38

### SC-RE-RECORDING-003: 所有待補錄模組完成後顯示完成畫面
- **Status**: Ready
- **Given**: 使用者進入重新錄製流程，有 3 個待補錄模組
- **When**: 使用者依序完成所有 3 個模組的錄製
- **Then**: 系統顯示「已完成所有補錄」或類似完成提示，結束重新錄製流程
- **Type**: e2e
- **Priority**: medium
- **Issue Ref**: #38

### SC-RE-RECORDING-004: 重新錄製流程中途中斷後可再次進入繼續
- **Status**: Ready
- **Given**: 使用者在重新錄製流程中完成部分模組後離開
- **When**: 使用者再次從「檢測紀錄」進入「重新錄製」
- **Then**: 系統應顯示剩餘未完成的待補錄模組，不需要重頭開始
- **Type**: e2e
- **Priority**: medium
- **Issue Ref**: #38
