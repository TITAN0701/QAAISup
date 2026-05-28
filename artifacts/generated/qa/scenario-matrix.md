# 測試情境矩陣

## 摘要

- 產生時間：2026-05-28 13:30:24
- 情境總數：14
- Passed：0
- Failed：0
- Not Marked：14
- Automation Candidate：14

## 矩陣表

| 功能 | Scenario ID | 驗收來源 | 類型 | 優先級 | 適合自動化 | 狀態 |
|---|---|---|---|---|---|---|
| forgot-password | SC-FORGOT-PASSWORD-001 | 給定使用者位於登入頁，當點擊「忘記密碼」，則系統應進入忘記密碼流程。 | e2e | high | true | Not Marked |
| forgot-password | SC-FORGOT-PASSWORD-002 | 給定使用者位於忘記密碼頁，當未輸入 Email 就送出，則系統應提示 Email 為必填。 | e2e | high | true | Not Marked |
| forgot-password | SC-FORGOT-PASSWORD-003 | 給定使用者位於忘記密碼頁，當輸入格式錯誤的 Email 並送出，則系統應提示 Email 格式錯誤。 | e2e | high | true | Not Marked |
| forgot-password | SC-FORGOT-PASSWORD-004 | 給定使用者位於忘記密碼頁，當輸入有效 Email 並送出，則系統應提示已送出密碼重設通知。 | e2e | high | true | Not Marked |
| login | SC-LOGIN-001 | 給定使用者位於登入頁，當使用者輸入有效帳號與正確密碼並送出，則系統應登入成功。 | e2e | high | true | Not Marked |
| login | SC-LOGIN-002 | 給定使用者位於登入頁，當使用者未輸入帳號就送出，則系統應提示帳號為必填。 | e2e | high | true | Not Marked |
| login | SC-LOGIN-003 | 給定使用者位於登入頁，當使用者未輸入密碼就送出，則系統應提示密碼為必填。 | e2e | high | true | Not Marked |
| login | SC-LOGIN-004 | 給定使用者位於登入頁，當使用者輸入錯誤帳號或錯誤密碼並送出，則系統應顯示登入失敗提示。 | e2e | high | true | Not Marked |
| login | SC-LOGIN-005 | 給定使用者位於登入頁，當使用者點擊「忘記密碼」，則系統應導向忘記密碼流程。 | e2e | high | true | Not Marked |
| login | SC-LOGIN-006 | 給定使用者位於登入頁，當使用者點擊「創建帳號」，則系統應導向註冊流程。 | e2e | high | true | Not Marked |
| register | SC-REGISTER-001 | 給定使用者位於登入頁，當點擊「創建帳號」，則系統應進入註冊流程。 | e2e | high | true | Not Marked |
| register | SC-REGISTER-002 | 給定使用者位於註冊頁，當必填欄位未填就送出，則系統應提示必填欄位。 | e2e | high | true | Not Marked |
| register | SC-REGISTER-003 | 給定使用者位於註冊頁，當密碼與確認密碼不一致並送出，則系統應提示密碼不一致。 | e2e | high | true | Not Marked |
| register | SC-REGISTER-004 | 給定使用者位於註冊頁，當輸入有效資料並送出，則系統應建立帳號或進入後續驗證流程。 | e2e | high | true | Not Marked |

## 來源

- qa-workspace/specs/*/scenarios.md
