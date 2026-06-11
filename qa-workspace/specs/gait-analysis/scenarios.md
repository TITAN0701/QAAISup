# Test Scenarios: 走路步態

## Source
- Feature: gait-analysis
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-GAIT-ANALYSIS-001: 拍攝提醒包含衣著限制說明
- **Status**: Ready
- **Given**: 使用者進入走路步態（大肢體模組）的拍攝提醒頁面
- **When**: 系統顯示拍攝提醒
- **Then**: 提醒文字中應包含「請勿讓孩子穿著遮擋四肢或過於寬鬆的衣物」或類似說明
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #29

### SC-GAIT-ANALYSIS-002: 正/背面模組拍攝前提示詞說明全身入鏡
- **Status**: Ready
- **Given**: 使用者進入正面或背面模組的拍攝頁面
- **When**: 系統顯示拍攝前提示詞
- **Then**: 提示詞應包含「請確認拍攝前孩子的全身（從頭到腳）都在綠色輔助框內，並且清楚入鏡」或相近文字
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #30

### SC-GAIT-ANALYSIS-003: 正/背面模組提示詞一包含輔助框超出提醒
- **Status**: Ready
- **Given**: 使用者進入正面或背面模組的拍攝頁面
- **When**: 系統顯示提示詞一
- **Then**: 提示詞一應包含「錄影前避免孩童超出輔助框」文字
- **Type**: ui
- **Priority**: low
- **Issue Ref**: #31

### SC-GAIT-ANALYSIS-004: 正/背面模組提示詞三包含不干涉與多人說明
- **Status**: Ready
- **Given**: 使用者進入正面或背面模組的拍攝頁面
- **When**: 系統顯示提示詞三
- **Then**: 提示詞三應包含「拍攝過程中避免干涉孩童動作與多人入鏡」文字
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #32

### SC-GAIT-ANALYSIS-005: 側面模組提示詞描述橫向行走情境
- **Status**: Ready
- **Given**: 使用者進入側面模組的拍攝頁面
- **When**: 系統顯示拍攝提示詞
- **Then**: 提示詞應包含引導孩子由左向右（或由右向左）在鏡頭前橫向走過的說明，不應是「走向鏡頭」
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #33

### SC-GAIT-ANALYSIS-006: 側面模組輔助框設置於畫面邊緣
- **Status**: Ready
- **Given**: 使用者進入側面模組的拍攝頁面
- **When**: 系統顯示拍攝畫面
- **Then**: 輔助框應設置於畫面邊緣（參考仰躺模組設計），確保孩童全身皆在畫面中
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #34

### SC-GAIT-ANALYSIS-007: 側面模組錄製時長超過 15 秒
- **Status**: Ready
- **Given**: 使用者進入側面模組的影片錄製頁面
- **When**: 系統顯示錄製時長說明
- **Then**: 頁面顯示「超過 15 秒」的錄製時長要求
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #35

### SC-GAIT-ANALYSIS-008: 側面模組未達 15 秒無法結束錄製
- **Status**: Ready
- **Given**: 使用者進入側面模組開始錄製
- **When**: 使用者在錄製未滿 15 秒時嘗試結束
- **Then**: 系統阻止提早結束錄製
- **Type**: e2e
- **Priority**: medium
- **Issue Ref**: #35

### SC-GAIT-ANALYSIS-009: 側面模組拍攝事項包含不干涉與多人說明
- **Status**: Ready
- **Given**: 使用者進入側面模組的拍攝頁面
- **When**: 系統顯示拍攝注意事項
- **Then**: 注意事項應包含「拍攝過程中避免干涉孩童動作與多人入鏡」文字
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #36

### SC-GAIT-ANALYSIS-010: 口語表達錄製時圖片不被視窗遮擋
- **Status**: Ready
- **Given**: 使用者進行口語表達題目的錄製，畫面同時顯示題目圖片與錄製視窗
- **When**: 系統顯示錄製畫面
- **Then**: 題目圖片不被錄製視窗遮擋，可完整檢視
- **Type**: ui
- **Priority**: medium
- **Issue Ref**: #37
