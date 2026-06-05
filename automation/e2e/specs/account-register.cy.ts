// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 帳號註冊
// Automation candidates: TC-ACCREG-003 (mock wrong verification code)
// TC-ACCREG-001~002 = require real OTP email, manual or mock needed

// [ENG TASK] Confirm verification code API endpoint to intercept/mock
// [ENG TASK] Add data-testid="register-otp-input" and "register-submit-button"
// [ENG TASK] Add data-testid="register-error-message"

describe('帳號註冊', () => {
  it('TC-ACCREG-003 輸入錯誤驗證碼後系統顯示錯誤提示並拒絕完成註冊', () => {
    cy.visit('/register');

    // Fill in registration form
    // [ENG TASK] Add data-testid="register-name-input", "register-email-input", "register-password-input"
    cy.get('[data-testid="register-name-input"]').type('測試使用者');
    cy.get('[data-testid="register-email-input"]').type('test-otp@test.example');
    cy.get('[data-testid="register-password-input"]').type('TestPass@123');
    cy.get('[data-testid="register-submit-button"]').click();

    // Mock OTP verification API to return invalid code error
    cy.intercept('POST', '**/verify-otp', {
      statusCode: 400,
      body: { error: 'invalid_otp', message: '驗證碼錯誤' },
    }).as('verifyOtp');

    // Enter wrong OTP
    cy.get('[data-testid="register-otp-input"]').type('000000');
    cy.get('[data-testid="register-otp-submit-button"]').click();

    cy.wait('@verifyOtp');

    // Error message should appear; registration should not complete
    cy.get('[data-testid="register-error-message"]')
      .should('be.visible')
      .and('contain', '驗證碼');

    cy.url().should('contain', '/register');
    cy.url().should('not.contain', '/login');
  });
});
