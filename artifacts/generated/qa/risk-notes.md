# Risk Notes

> 依據 `qa-knowledge/risk-rules.md` 風險分級規則產生。
> 產生日期：2026-06-03

---

## question-logic（跳題邏輯）

**風險等級：HIGH**

**影響範圍：**
全體受測個案的測驗結果。跳題邏輯直接決定測驗的升降階行為，錯誤將導致個案被分配至不正確年齡層的題目，影響最終評估結果的準確性。

**判斷依據：**
- 此為核心商業規則，錯誤會影響所有個案的測驗流程（多個主要流程同時受影響）
- SC-QUESTION-LOGIC-005 涉及結果資料寫入，若月齡顯示「0 個月」可能造成資料一致性錯誤
- SC-QUESTION-LOGIC-004 跨模組邏輯若錯誤，每次跨模組均會觸發問題

**建議 Owner：** 開發工程師（後端跳題邏輯）+ QA 負責驗收

**是否建議 Release：** 所有 high priority 案例（TC-QLOGIC-001 ~ TC-QLOGIC-005）通過前不建議 Release。

---

## question-content（題目內容）

**風險等級：HIGH**

**影響範圍：**
所有年齡層的受測個案。測試標記題目若未清除，將污染正式測驗資料；題庫不足將直接阻擋特定年齡層個案無法開始測驗。

**判斷依據：**
- 測試標記題目殘留（SC-QUESTION-CONTENT-001）屬於資料一致性問題，影響所有年齡層
- 題庫不足（SC-QUESTION-CONTENT-003/004/005）直接導致核心流程失敗（無法開始測驗）
- 題目重複顯示（SC-QUESTION-CONTENT-002）影響測驗公正性，屬核心使用者流程缺陷

**建議 Owner：** 開發工程師（題庫管理）+ 內容管理人員

**是否建議 Release：** TC-QCONTENT-001 ~ TC-QCONTENT-005 通過前不建議 Release；TC-QCONTENT-006/007（答題回饋文字）為 medium，可評估是否作為 hotfix。

---

## card-matching（圖卡配對）

**風險等級：HIGH（Ready 案例）/ BLOCKED 部分待確認**

**影響範圍：**
4M 和 6M 個案（應受保護不見圖卡配對題）與 8M 以上個案（應正常顯示）。

**判斷依據：**
- SC-CARD-MATCHING-001/002（4M、6M 不顯示圖卡配對）屬核心出題邏輯，若錯誤影響特定年齡層所有個案
- SC-CARD-MATCHING-004 為 BLOCKED，跳題範圍限制規則不明，存在潛在未知風險

**BLOCKED 額外風險說明：**
SC-CARD-MATCHING-004（Issue #10）跳題上限規則尚未確認，測試覆蓋有缺口，建議在確認前不對圖卡配對升降階邏輯進行 release。

**建議 Owner：** PM（確認跳題規則）+ 開發工程師

**是否建議 Release：** TC-CARDMATCH-001 ~ TC-CARDMATCH-005 通過後可 Release；SC-CARD-MATCHING-004 解除 BLOCKED 前，圖卡配對升降階功能建議標注為 known gap。

---

## video-recording（影片錄製）

**風險等級：HIGH**

**影響範圍：**
所有需要錄製影片的模組（AI 模組、大肢體模組、走路側面模組等）。若最低錄製時長未被強制執行，AI 辨識將收到品質不足的影片，影響後續分析結果。

**判斷依據：**
- 最低錄製時長強制執行（SC-VIDEO-RECORDING-003/004）屬於核心資料寫入保護，影響 AI 辨識品質
- 說明文字錯誤（SC-VIDEO-RECORDING-005/006）屬非阻斷性 UI 問題，但可能導致使用者行為錯誤

**建議 Owner：** 開發工程師（錄製時長控制）+ UX 設計師（說明文字確認）

**是否建議 Release：** TC-VIDEO-001 ~ TC-VIDEO-004（時長控制）通過前不建議 Release；TC-VIDEO-005/006（說明文字）可評估作為低優先級修正。

---

## verbal-expression（口語表達）

**風險等級：HIGH（Ready 案例）**

**影響範圍：**
進行口語表達測驗的所有個案。計時器若未正確重置，導致評測時間不一致；「下一題」按鈕若無法啟用，將阻塞測驗流程。

**判斷依據：**
- SC-VERBAL-EXPRESSION-001/002（計時器）影響每位進行口語表達測驗的個案，屬核心流程
- SC-VERBAL-EXPRESSION-003/004（下一題按鈕）若失效，直接阻塞測驗流程進行

**BLOCKED 額外風險說明：**
SC-VERBAL-EXPRESSION-005（最短完成時間）與 SC-VERBAL-EXPRESSION-007（AI 模組）均為 BLOCKED，看圖說故事最短時間規則不明確，存在測試覆蓋缺口。

**建議 Owner：** 開發工程師 + PM（確認最短完成時間規則）

**是否建議 Release：** TC-VERBAL-001 ~ TC-VERBAL-004 通過後可 Release；AI 口語表達模組（#19）未解除 BLOCKED 前，相關功能不建議對外開放。

---

## observation-group（觀察題組）

**風險等級：HIGH**

**影響範圍：**
所有超過 15M 且有觀察題組的個案。若 AI 模組完成後無法進入觀察題組，測驗流程將中斷，且若需重做 AI 模組，對施測者與個案造成重大不便。

**判斷依據：**
- SC-OBSERVATION-GROUP-001 ~ SC-OBSERVATION-GROUP-004 均屬核心使用者流程
- AI 模組結果保留問題（SC-OBSERVATION-GROUP-004）涉及資料一致性
- 問題重現於特定個案（霏霏 39M），但邏輯缺陷可能影響所有超過 15M 個案

**建議 Owner：** 開發工程師（測驗流程控制器）

**是否建議 Release：** TC-OBSERVE-001 ~ TC-OBSERVE-004 通過前不建議 Release。

---

## handwriting-recognition（手繪圖形辨識）

**風險等級：MEDIUM（Ready 案例）/ HIGH（BLOCKED 缺口）**

**影響範圍（Ready 案例）：**
使用手繪圖形辨識功能的個案（主要為 3-6 歲兒童）。教學示意圖與注意事項錯誤為 UI 問題，梯形輔助框殘留可能影響辨識結果。

**判斷依據（Ready 案例）：**
- SC-HANDWRITING-002/003（示意圖與圖文一致性）為非阻斷性 UI 問題
- SC-HANDWRITING-004（梯形輔助框）若未消失可能影響 AI 辨識品質，屬 medium-high 邊界

**BLOCKED 額外風險說明（HIGH）：**
SC-HANDWRITING-001（AI 模組部署）、SC-HANDWRITING-005（3-6 歲流程順序）、SC-HANDWRITING-006（月齡題目不足）、SC-HANDWRITING-007（影片+照片流程）均為 BLOCKED，累積 4 個高風險缺口。3-6 歲手繪功能測試覆蓋嚴重不足，建議優先解除 BLOCKED。

**建議 Owner：** 開發工程師 + PM（確認 3-6 歲流程設計）+ 主任（流程決策）

**是否建議 Release：** 3-6 歲手繪圖形辨識功能不建議在 BLOCKED 項目全部解除前 Release。

---

## gait-analysis（走路步態）

**風險等級：MEDIUM**

**影響範圍：**
使用走路步態模組（正面、背面、側面）的所有個案。主要為 UI 文字說明與輔助框視覺問題，以及側面模組的錄製時長控制。

**判斷依據：**
- SC-GAIT-ANALYSIS-001 ~ SC-GAIT-ANALYSIS-006、SC-GAIT-ANALYSIS-009/010 多為 UI/說明文字問題，屬非阻斷性問題但可能導致使用者操作錯誤（medium risk）
- SC-GAIT-ANALYSIS-008（側面模組錄製時長控制）若失效影響 AI 辨識品質，為 medium-high
- 問題集中於特定模組（側面模組），不影響所有模組

**建議 Owner：** 開發工程師（錄製時長控制）+ UX 設計師（說明文字與輔助框）

**是否建議 Release：** TC-GAIT-008（側面模組時長控制）通過前建議不 Release 側面模組；UI 說明文字問題（TC-GAIT-001 ~ TC-GAIT-007、TC-GAIT-009）可評估作為修正項目但非 release blocker。

---

## re-recording（重新錄製）

**風險等級：HIGH**

**影響範圍：**
有多個待補錄模組的個案（如 Lala 41M）。重新錄製流程若中斷或觸發錯誤頁面，施測者需重複操作，影響使用效率與資料完整性。

**判斷依據：**
- SC-RE-RECORDING-001/002（流程連貫性與錯誤觸發）屬核心使用者流程缺陷
- 若觸發圖卡配對或評測結果頁面（SC-RE-RECORDING-002），可能造成資料混亂
- SC-RE-RECORDING-004（中斷後繼續）涉及狀態保留，屬資料一致性問題

**建議 Owner：** 開發工程師（重新錄製流程控制器）

**是否建議 Release：** TC-REREC-001/002 通過前不建議 Release 重新錄製功能；TC-REREC-003/004 為 medium，建議同批次修正。

---

## progress-bar（進度條）

**風險等級：MEDIUM（待解除 BLOCKED）**

**影響範圍：**
所有進行測驗的個案（AI 模組與觀察題組的進度顯示）。

**判斷依據：**
- 所有情境均為 BLOCKED，進度條更新規則完全未確認
- 進度條為非核心功能（不影響測驗結果），但影響使用者體驗
- 規則來源（群健所）尚未提供，屬外部依賴風險

**BLOCKED 額外風險說明：**
進度條規則完全未確認，無任何測試覆蓋，建議以「已知缺口」追蹤。

**建議 Owner：** PM（催請群健所提供規則）

**是否建議 Release：** 進度條功能應在規則確認且測試通過後再 Release；若進度條為視覺輔助功能且不影響測驗邏輯，可評估以「顯示佔位符」方式暫時 Release。

---

## account-register（帳號/註冊）

**風險等級：HIGH**

**影響範圍：**
所有新使用者。帳號註冊為系統入口，若驗證碼流程失效或無法完成註冊，影響全部新使用者上線。

**判斷依據：**
- SC-ACCOUNT-REGISTER-001 ~ SC-ACCOUNT-REGISTER-003 均屬核心登入/帳號流程
- 驗證碼錯誤應正確拒絕屬安全相關規則（security）
- SC-ACCOUNT-REGISTER-004（邀請制度）為 BLOCKED，邀請規則不明確是額外風險

**BLOCKED 額外風險說明：**
邀請制度（Issue #46）未完成內部測試，若此為必要的帳號開通機制，BLOCKED 期間可能影響正常註冊流程。

**建議 Owner：** 開發工程師 + 資安（驗證碼機制審核）

**是否建議 Release：** TC-ACCREG-001 ~ TC-ACCREG-003 通過前不建議 Release。

---

## data-validation（資料驗證）

**風險等級：MEDIUM**

**影響範圍：**
輸入身分證字號的所有使用者。身分證驗證規則若錯誤，可能導致合法資料被拒絕或非法資料被接受。

**判斷依據：**
- SC-DATA-VALIDATION-001 ~ SC-DATA-VALIDATION-003 屬資料格式驗證，為單一功能問題，影響範圍有限
- 驗證錯誤不直接影響核心測驗流程，但影響資料準確性
- SC-DATA-VALIDATION-004（流水號規則）為 BLOCKED，群健所規則未確認屬外部依賴風險

**建議 Owner：** 開發工程師（後端驗證邏輯）

**是否建議 Release：** TC-DATAVAL-001 ~ TC-DATAVAL-003 通過後可 Release；SC-DATA-VALIDATION-004 解除 BLOCKED 前，流水號功能建議標注為 known gap。

---

## admin-backend（後台管理）

**風險等級：HIGH**

**影響範圍：**
管理員與所有受管理的使用者帳號。帳號停用與資料編輯屬於權限與資料寫入流程，若失效將影響系統安全性與資料管理能力。

**判斷依據：**
- SC-ADMIN-BACKEND-001/002（停用帳號）屬核心權限管理，直接影響登入安全
- SC-ADMIN-BACKEND-003/004（編輯按鈕權限控制）屬安全相關規則，若一般使用者可見編輯他人按鈕為安全漏洞
- SC-ADMIN-BACKEND-005 ~ SC-ADMIN-BACKEND-008 均為 BLOCKED，管理功能有多個未確認缺口

**BLOCKED 額外風險說明（HIGH）：**
後台管理共 5 個 BLOCKED 情境（邀請規則、帳號管理列表、局處機構建立與維護），後台功能測試覆蓋嚴重不足，建議在 Release 後台管理功能前逐一解除。

**建議 Owner：** 開發工程師 + 資安 + PM（確認局處機構需求）

**是否建議 Release：** TC-ADMIN-001 ~ TC-ADMIN-004 通過前不建議 Release 後台管理功能；BLOCKED 項目（特別是帳號管理列表與局處機構）在規則確認前不建議對外開放。

---

## 整體風險摘要

| 功能 | 風險等級 | 是否有 BLOCKED 缺口 | Release 建議 |
|------|---------|-------------------|-------------|
| question-logic | HIGH | 無 | high 案例通過後可 Release |
| question-content | HIGH | 無 | high 案例通過後可 Release |
| card-matching | HIGH | 有（跳題規則未確認） | Ready 案例通過；BLOCKED 標注 known gap |
| video-recording | HIGH | 無 | 時長控制案例通過後可 Release |
| verbal-expression | HIGH | 有（最短時間、AI 模組） | Ready 案例通過；AI 模組不建議開放 |
| observation-group | HIGH | 無 | 全部案例通過後可 Release |
| handwriting-recognition | MEDIUM/HIGH | 有（4 個 BLOCKED） | 3-6 歲功能不建議在 BLOCKED 未解前 Release |
| gait-analysis | MEDIUM | 無 | 時長控制通過；文字問題非 blocker |
| re-recording | HIGH | 無 | high 案例通過後可 Release |
| progress-bar | MEDIUM | 全部 BLOCKED | 規則確認前不建議 Release |
| account-register | HIGH | 有（邀請制度） | Ready 案例通過後可 Release |
| data-validation | MEDIUM | 有（流水號規則） | Ready 案例通過後可 Release |
| admin-backend | HIGH | 有（5 個 BLOCKED） | Ready 案例通過；BLOCKED 未解前不建議完整開放後台 |
