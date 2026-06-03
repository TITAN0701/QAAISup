# Test Scenarios: 手繪圖形辨識

## Source
- Feature: handwriting-recognition
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-HANDWRITING-001: AI 手繪圖形辨識模組存在（調整中）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #22 狀態為「調整中」，AI 手繪圖形辨識拍攝模組尚未確認部署完成，無法建立測試情境。
- **Issue Ref**: #22

### SC-HANDWRITING-002: 拍攝教學示意圖顯示正確情境
- **Status**: Ready
- **Given**: 使用者進入手繪圖形辨識拍攝頁面，查看拍攝教學示意圖
- **When**: 系統顯示教學示意圖
- **Then**: 示意圖應呈現「放好畫好的圖形紙」的拍攝場景，不應出現手或筆，且與錄影教學示意圖不同
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #23

### SC-HANDWRITING-003: 拍攝注意事項圖片角度與文字說明一致
- **Status**: Ready
- **Given**: 使用者進入手繪圖形辨識拍攝頁面，查看拍攝注意事項
- **When**: 系統顯示注意事項圖片
- **Then**: 最右側圖片的角度與旁邊的文字說明一致，圖文內容相符
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #24

### SC-HANDWRITING-004: 梯形輔助框在開始錄製後消失
- **Status**: Ready
- **Given**: 使用者進入手繪圖形辨識頁面，錄製前畫面顯示梯形輔助框
- **When**: 使用者點擊開始錄製
- **Then**: 梯形輔助框應從畫面中消失，不在正式錄製過程中顯示
- **Type**: e2e
- **Priority**: medium
- **Issue Ref**: #25

### SC-HANDWRITING-005: 3-6 歲檢測流程先進入手繪圖形辨識（調整中）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #26 狀態為「調整中」，3-6 歲檢測流程順序（應優先手繪圖形辨識而非走路步態）尚未確認修正，且需與主任確認流程設計，無法建立測試情境。
- **Issue Ref**: #26

### SC-HANDWRITING-006: 3-6 歲各月齡皆可正常開始測驗（調整中）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #27 狀態為「調整中」，3-6 歲部分月齡（如 4y1m、5y2m）仍無法測試，顯示「題目不足」，尚未確認修正完成，無法建立測試情境。
- **Issue Ref**: #27

### SC-HANDWRITING-007: 手繪圖形模組包含影片錄製與照片拍攝（調整中）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #28 狀態為「調整中」，部分個案手繪圖形模組缺少影片錄製，完整流程（影片+照片）尚未確認修正，無法建立測試情境。
- **Issue Ref**: #28
