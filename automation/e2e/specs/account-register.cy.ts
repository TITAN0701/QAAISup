// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 帳號註冊
// Automation candidates: TC-ACCREG-003 (mock wrong verification code)
// TC-ACCREG-001~002 = require real OTP email, manual or mock needed
// Selector 驗證：Playwright snapshot 2026-06-09

// [ENG TASK] Confirm verification code API endpoint to intercept/mock
// [ENG TASK] Add data-testid="register-otp-input", "register-otp-submit-button", "register-error-message"

describe('帳號註冊', () => {
  beforeEach(() => {
    cy.visit('/register');
    cy.contains('創立帳號').should('be.visible');
  });

  it('TC-ACCREG-003 輸入錯誤驗證碼後系統顯示錯誤提示並拒絕完成註冊', () => {
    // Fill in registration form (selectors verified from snapshot)
    cy.get('input[placeholder="請輸入全名"]').type('測試使用者');
    cy.get('input[placeholder="example@email.com"]').type('test-otp@test.example');
    // Password field has no placeholder — use role
    cy.get('input[placeholder="請輸入 8 碼以上含大小寫英文"]').type('TestPass@123');

    // Mock OTP verification API to return invalid code error
    cy.intercept('POST', '**/verify-otp', {
      statusCode: 400,
      body: { error: 'invalid_otp', message: '驗證碼錯誤' },
    }).as('verifyOtp');

    cy.contains('button', '確認送出').click();
    cy.wait('@verifyOtp');

    // [ENG TASK] Add data-testid="register-error-message" to error alert
    cy.get('[data-testid="register-error-message"]')
      .should('be.visible')
      .and('contain', '驗證碼');

    cy.url().should('contain', '/register');
  });
});
