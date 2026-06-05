# Engineering Tasks for Test Automation

> These tasks are required before automation tests can run in CI.
> Generated from QA-5 automation draft — 2026-06-03.

## Global

| # | Task | Files affected |
|---|------|---------------|
| 1 | Confirm base URL for test environment (currently hardcoded as `localhost:3000`) | `cypress.config.ts`, `automation/api/tests/data-validation.test.py` |
| 2 | Add `data-testid="main-content"` to main content area after login | `flows/loginFlow.ts` |
| 3 | Add `data-testid="login-email-input"`, `login-password-input`, `login-submit-button`, `login-error-message` to login form | `pages/LoginPage.ts` |

## 跳題邏輯 (question-logic.cy.ts)

| # | Task |
|---|------|
| 4 | Confirm URL pattern for starting exam by age (e.g. `/exam/start?age=4`) |
| 5 | Add `data-testid="question-age-level"` to display current age level label |
| 6 | Add `data-testid="answer-option"`, `answer-option-correct"`, `answer-option-wrong"` to answer choices |
| 7 | Add `data-testid="current-module-label"` to display current module name + age level |
| 8 | Add `data-testid="observation-group-section"` wrapping observation group questions |
| 9 | Add `data-testid="result-age-display"` on the result page |
| 10 | Add `data-testid="exam-container"` wrapping the exam area |
| 11 | Provide API or URL parameter to start exam at a specific level (for edge case tests) |

## 題目內容 (question-content.cy.ts)

| # | Task |
|---|------|
| 12 | Add `data-testid="question-text"` to each rendered question body |
| 13 | Add `data-testid="question-id"` (hidden attribute) to identify current question uniquely |

## 圖卡配對 (card-matching.cy.ts)

| # | Task |
|---|------|
| 14 | Add `data-testid="question-type"` with `value` attribute indicating question type (e.g. `card-matching`) |
| 15 | Add `data-testid="card-option"` and `data-testid="card-option-correct"` to card choices |
| 16 | Add `data-testid="answer-result"` to show result after answering |
| 17 | Add `data-testid="feedback-message"` for post-answer feedback display |
| 18 | Confirm URL or test setup to navigate directly to a card-matching question |

## 影片錄製 (video-recording.cy.ts)

| # | Task |
|---|------|
| 19 | Confirm URL for 大肢體模組 recording page (currently `/exam/module/gross-motor/record`) |
| 20 | Confirm URL for 走路側面模組 recording page (currently `/exam/module/gait-side/record`) |
| 21 | Add `data-testid="recording-duration-hint"` to duration instruction text on recording pages |

## 口語表達 (verbal-expression.cy.ts)

| # | Task |
|---|------|
| 22 | Confirm URL for verbal expression question page |
| 23 | Add `data-testid="timer-display"` to show countdown value |
| 24 | Add `data-testid="image-index"` to show which image is currently displayed (1st, 2nd, etc.) |
| 25 | Ensure timer is compatible with `cy.clock()` / `cy.tick()` (no native timer wrappers blocking fake timers) |

## 手繪圖形辨識 (handwriting-recognition.cy.ts)

| # | Task |
|---|------|
| 26 | Confirm URL for handwriting recognition page |
| 27 | Add `data-testid="trapezoid-guide-frame"` to the guide frame element |
| 28 | Add `data-testid="start-recording-button"` to the start recording button |

## 走路步態 (gait-analysis.cy.ts)

| # | Task |
|---|------|
| 29 | Confirm URLs for gait sub-modules: `/exam/module/gait/reminder`, `/exam/module/gait-front/record`, `/exam/module/gait-side/record` |
| 30 | Add `data-testid="shooting-reminder-text"` to shooting reminder page content |
| 31 | Add `data-testid="pre-shoot-prompt"` to pre-shoot tip text area |
| 32 | Add `data-testid="prompt-1"`, `data-testid="prompt-3"` to individual prompt list items |
| 33 | Add `data-testid="shooting-notes"` to shooting notes section |

## 重新錄製 (re-recording.cy.ts)

| # | Task |
|---|------|
| 34 | Seed test data: a case with 2+ pending re-record modules for `TC-REREC-002` |
| 35 | Seed test data: a case with 3 pending modules, 1 already completed for `TC-REREC-004` |
| 36 | Confirm URL for 檢測紀錄 page (currently `/records`) |
| 37 | Add `data-testid="re-recording-entry-button"` to enter re-recording from record list |
| 38 | Add `data-testid="complete-module-button"` in re-recording flow |
| 39 | Add `data-testid="re-recording-module-list"` listing remaining modules |

## 帳號註冊 (account-register.cy.ts)

| # | Task |
|---|------|
| 40 | Add `data-testid` to register form fields: `register-name-input`, `register-email-input`, `register-password-input`, `register-submit-button` |
| 41 | Add `data-testid="register-otp-input"`, `register-otp-submit-button` |
| 42 | Add `data-testid="register-error-message"` |
| 43 | Confirm OTP verify API endpoint path (currently `**/verify-otp`) |

## 後台管理 (admin-backend.cy.ts)

| # | Task |
|---|------|
| 44 | Confirm admin backend URL (currently `/admin`) |
| 45 | Prepare `disabled_user` fixture account in test environment (pre-disabled state) |
| 46 | Add `data-testid="account-list-item"` to each row in account list |
| 47 | Add `data-testid="disable-account-button"` and `account-status-badge"` |
| 48 | Add `data-testid="edit-profile-button"` (visible to admin, hidden to regular user) |

## 資料驗證 API (data-validation.test.py)

| # | Task |
|---|------|
| 49 | Confirm API endpoint for ID number validation (`POST /api/validate/id-number`) |
| 50 | Confirm request body key (`id_number`?) and response key (`valid`?) |
| 51 | Update `BASE_URL` in `automation/api/tests/data-validation.test.py` to actual test env |
