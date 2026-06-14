# Test Cases 彙整

> 自動產出，請勿手動編輯。來源：`qa-workspace/specs/*/test-cases.json`
> 最後更新：2026-06-14T16:00:00+08:00

## 統計

| Feature | 總數 | High | Medium | Low | 可自動化 | 自動化率 |
|---------|------|------|--------|-----|---------|---------|
| login | 6 | 6 | 0 | 0 | 6 | 100% |
| forgot-password | 4 | 4 | 0 | 0 | 4 | 100% |
| admin-backend | 4 | 3 | 1 | 0 | 4 | 100% |
| register | 4 | 4 | 0 | 0 | 4 | 100% |
| account-register | 3 | 3 | 0 | 0 | 1 | 33% |
| card-matching | 5 | 4 | 1 | 0 | 5 | 100% |
| question-content | 7 | 5 | 2 | 0 | 5 | 71% |
| question-logic | 6 | 5 | 1 | 0 | 6 | 100% |
| gait-analysis | 10 | 0 | 9 | 1 | 7 | 70% |
| verbal-expression | 5 | 4 | 1 | 0 | 2 | 40% |
| data-validation | 3 | 0 | 3 | 0 | 3 | 100% |
| handwriting-recognition | 3 | 0 | 3 | 0 | 1 | 33% |
| observation-group | 4 | 4 | 0 | 0 | 0 | 0% |
| re-recording | 4 | 2 | 2 | 0 | 2 | 50% |
| video-recording | 6 | 4 | 2 | 0 | 2 | 33% |
| **合計** | **74** | **48** | **25** | **1** | **52** | **70%** |

---

## login

> 來源：`qa-workspace/specs/login/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-LOGIN-001 | 有效帳密登入成功 | high | e2e | ✅ |
| TC-LOGIN-002 | 未輸入帳號時提示必填 | high | e2e | ✅ |
| TC-LOGIN-003 | 未輸入密碼時提示必填 | high | e2e | ✅ |
| TC-LOGIN-004 | 錯誤帳密登入失敗 | high | e2e | ✅ |
| TC-LOGIN-005 | 忘記密碼入口導向正確 | high | e2e | ✅ |
| TC-LOGIN-006 | 創建帳號入口導向正確 | high | e2e | ✅ |

---

## forgot-password

> 來源：`qa-workspace/specs/forgot-password/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-FORGOT-PASSWORD-001 | 忘記密碼入口導向正確 | high | e2e | ✅ |
| TC-FORGOT-PASSWORD-002 | 忘記密碼未輸入 Email 時提示必填 | high | e2e | ✅ |
| TC-FORGOT-PASSWORD-003 | 忘記密碼輸入錯誤 Email 格式時提示錯誤 | high | e2e | ✅ |
| TC-FORGOT-PASSWORD-004 | 忘記密碼輸入有效 Email 後送出通知 | high | e2e | ✅ |

---

## admin-backend

> 來源：`qa-workspace/specs/admin-backend/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-ADMIN-001 | 管理員可停用帳號並更新帳號狀態為停用 | high | e2e | ✅ |
| TC-ADMIN-002 | 停用帳號後該使用者嘗試登入時系統拒絕並顯示停用訊息 | high | e2e | ✅ |
| TC-ADMIN-003 | 管理員進入使用者資料頁面後可執行修改，一般使用者的編輯按鈕已隱藏 | high | e2e | ✅ |
| TC-ADMIN-004 | 一般使用者頁面不顯示編輯他人資料的按鈕 | medium | e2e | ✅ |

---

## register

> 來源：`qa-workspace/specs/register/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-REGISTER-001 | 創建帳號入口導向正確 | high | e2e | ✅ |
| TC-REGISTER-002 | 註冊必填欄位未填時提示必填 | high | e2e | ✅ |
| TC-REGISTER-003 | 密碼與確認密碼不一致時提示錯誤 | high | e2e | ✅ |
| TC-REGISTER-004 | 輸入有效資料後建立帳號或進入驗證流程 | high | e2e | ✅ |

---

## account-register

> 來源：`qa-workspace/specs/account-register/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-ACCREG-001 | 填寫完整必填資料並輸入正確驗證碼後完成帳號註冊 | high | e2e | ❌ |
| TC-ACCREG-002 | 輸入正確驗證碼後驗證通過並繼續後續步驟 | high | e2e | ❌ |
| TC-ACCREG-003 | 輸入錯誤驗證碼後系統顯示錯誤提示並拒絕完成註冊 | high | e2e | ✅ |

---

## card-matching

> 來源：`qa-workspace/specs/card-matching/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-CARDMATCH-001 | 4M 個案測驗中不顯示圖卡配對題目 | high | e2e | ✅ |
| TC-CARDMATCH-002 | 6M 個案測驗中不顯示圖卡配對題目 | high | e2e | ✅ |
| TC-CARDMATCH-003 | 8M 個案測驗中可正常顯示圖卡配對題目 | high | e2e | ✅ |
| TC-CARDMATCH-004 | 圖卡配對題中點擊彩色圖案即算配對成功 | high | e2e | ✅ |
| TC-CARDMATCH-005 | 圖卡配對點擊正確圖案後顯示正向回饋並進入下一題 | medium | e2e | ✅ |

---

## question-content

> 來源：`qa-workspace/specs/question-content/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-QCONTENT-001 | 所有年齡層題目不出現帶有「[測試用]」或「[測試警示題]」標記的題目 | high | e2e | ✅ |
| TC-QCONTENT-002 | 作答後系統切換至下一題，不重複顯示同一題目 | high | e2e | ✅ |
| TC-QCONTENT-003 | 48M 個案可正常開始測驗，不顯示題目不足錯誤 | high | e2e | ✅ |
| TC-QCONTENT-004 | 60M 個案可正常開始測驗，不顯示題目不足錯誤 | high | e2e | ✅ |
| TC-QCONTENT-005 | 72M 個案可正常開始測驗，不顯示題目不足錯誤 | high | e2e | ✅ |
| TC-QCONTENT-006 | 答對後顯示正向鼓勵文字，不出現「答對了」字樣 | medium | e2e | ❌ |
| TC-QCONTENT-007 | 答錯後顯示正向鼓勵文字，不出現「答錯了」字樣 | medium | e2e | ❌ |

---

## question-logic

> 來源：`qa-workspace/specs/question-logic/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-QLOGIC-001 | 從實質年齡層開始出題，答錯後系統降低一個年齡層難度 | high | e2e | ✅ |
| TC-QLOGIC-002 | 答對後系統只上升一個年齡層，不可跨越兩階或更多 | high | e2e | ✅ |
| TC-QLOGIC-003 | 42M 個案答對後系統最高升至 48M，不跳至 60M 或更高 | high | e2e | ✅ |
| TC-QLOGIC-004 | 跨模組後系統跳回實質年齡層（4M）對應的下一模組 | high | e2e | ✅ |
| TC-QLOGIC-005 | 觀察題組全錯時結果顯示最低月齡「2 個月」，不顯示「0 個月」 | high | e2e | ✅ |
| TC-QLOGIC-006 | 個案在最低年齡層（2M）持續答錯時，系統維持最低階不崩潰 | medium | e2e | ✅ |

---

## gait-analysis

> 來源：`qa-workspace/specs/gait-analysis/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-GAIT-001 | 走路步態拍攝提醒頁面包含衣著限制說明文字 | medium | e2e | ✅ |
| TC-GAIT-002 | 正/背面模組拍攝前提示詞包含全身入鏡說明 | medium | e2e | ✅ |
| TC-GAIT-003 | 正/背面模組提示詞一包含「錄影前避免孩童超出輔助框」文字 | low | e2e | ✅ |
| TC-GAIT-004 | 正/背面模組提示詞三包含「不干涉」與「多人入鏡」說明 | medium | e2e | ✅ |
| TC-GAIT-005 | 側面模組提示詞包含橫向行走情境說明（非走向鏡頭） | medium | e2e | ✅ |
| TC-GAIT-006 | 側面模組拍攝畫面輔助框設置於畫面邊緣 | medium | e2e | ❌ |
| TC-GAIT-007 | 側面模組錄製頁面顯示「超過 15 秒」錄製時長要求 | medium | e2e | ✅ |
| TC-GAIT-008 | 側面模組錄製未滿 15 秒時系統阻止提早結束 | medium | e2e | ❌ |
| TC-GAIT-009 | 側面模組拍攝注意事項包含「不干涉」與「多人入鏡」說明 | medium | e2e | ✅ |
| TC-GAIT-010 | 口語表達錄製畫面中題目圖片不被錄製視窗遮擋 | medium | e2e | ❌ |

---

## verbal-expression

> 來源：`qa-workspace/specs/verbal-expression/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-VERBAL-001 | 口語表達每張圖片各自獨立倒數 60 秒計時，切換圖片後重置 | high | e2e | ✅ |
| TC-VERBAL-002 | 第一張圖 60 秒倒數結束後自動進入第二張圖並重新計時 | high | e2e | ✅ |
| TC-VERBAL-003 | 影片上傳成功後「下一題」按鈕自動變為可點擊 | high | e2e | ❌ |
| TC-VERBAL-004 | 影片上傳成功後可直接點擊「下一題」，無需先點「取消」 | high | e2e | ❌ |
| TC-VERBAL-005 | 口語表達題目圖卡與鏡頭視窗不互相遮擋 | medium | e2e | ❌ |

---

## data-validation

> 來源：`qa-workspace/specs/data-validation/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-DATAVAL-001 | 身分證字號第二碼為「1」（男性）時驗證通過 | medium | api | ✅ |
| TC-DATAVAL-002 | 身分證字號第二碼為「2」（女性）時驗證通過 | medium | api | ✅ |
| TC-DATAVAL-003 | 身分證字號第二碼非「1」或「2」時驗證失敗 | medium | api | ✅ |

---

## handwriting-recognition

> 來源：`qa-workspace/specs/handwriting-recognition/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-HWRITE-001 | 手繪圖形辨識拍攝教學示意圖呈現正確場景（無手或筆） | medium | e2e | ❌ |
| TC-HWRITE-002 | 手繪圖形辨識注意事項最右側圖片角度與文字說明一致 | medium | e2e | ❌ |
| TC-HWRITE-003 | 開始錄製後梯形輔助框從畫面消失 | medium | e2e | ✅ |

---

## observation-group

> 來源：`qa-workspace/specs/observation-group/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-OBSERVE-001 | 超過 15M 個案完成 AI 模組後可正常跳轉至觀察題組 | high | e2e | ❌ |
| TC-OBSERVE-002 | 24M 個案完成 AI 模組後進入 24M 對應的觀察題組 | high | e2e | ❌ |
| TC-OBSERVE-003 | AI 模組完成後點擊「下一題」直接進入觀察題組，無需點「取消」 | high | e2e | ❌ |
| TC-OBSERVE-004 | 重新進入觀察題組時系統保留已完成的 AI 模組結果，無需重錄 | high | e2e | ❌ |

---

## re-recording

> 來源：`qa-workspace/specs/re-recording/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-REREC-001 | 重新錄製完成第一個模組後系統繼續引導進行下一個待補錄模組 | high | e2e | ❌ |
| TC-REREC-002 | 重新錄製完成後不觸發圖卡配對或評測結果頁面 | high | e2e | ✅ |
| TC-REREC-003 | 所有待補錄模組完成後系統顯示完成提示 | medium | e2e | ❌ |
| TC-REREC-004 | 重新錄製中途中斷後再次進入可繼續剩餘模組，無需重頭開始 | medium | e2e | ✅ |

---

## video-recording

> 來源：`qa-workspace/specs/video-recording/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 可自動化 |
|----|------|--------|------|--------|
| TC-VIDEO-001 | 錄製時長不足時系統彈出提醒訊息 | high | e2e | ❌ |
| TC-VIDEO-002 | 錄製時長不足時提醒訊息中提供「重新錄製」按鈕 | high | e2e | ❌ |
| TC-VIDEO-003 | 未達最低錄製時長前「結束錄製」按鈕不可點擊 | high | e2e | ❌ |
| TC-VIDEO-004 | AI 模組影片錄製 1~2 秒時系統阻止提早結束 | high | e2e | ❌ |
| TC-VIDEO-005 | 大肢體模組錄製頁面顯示「超過 30 秒，最多 60 秒」說明文字 | medium | e2e | ✅ |
| TC-VIDEO-006 | 走路側面模組錄製頁面顯示「超過 15 秒」說明文字 | medium | e2e | ✅ |
