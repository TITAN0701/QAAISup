// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 帳號註冊
// Automation candidates: TC-ACCREG-003
// TC-ACCREG-001~002 = require real OTP email, manual or mock needed
// Selector 來源：Playwright snapshot-12-register.yml (2026-06-13)

// [SDET TODO] TC-ACCREG-003: 確認 OTP verify API endpoint（目前寫 **/verify-otp，需工程師確認真實路徑）

describe('帳號註冊', () => {
  beforeEach(() => {
    cy.visit('/register');
    cy.contains('創立帳號').should('be.visible');
  });

  it.skip('TC-ACCREG-003 輸入錯誤驗證碼後系統顯示錯誤提示並拒絕完成註冊', () => {
    cy.get('input[placeholder="請輸入全名"]').type('測試使用者');
    cy.get('input[placeholder="example@email.com"]').type('test-otp@test.example');
    cy.get('input[placeholder="請輸入 8 碼以上含大小寫英文"]').type('TestPass@123');

    // Mock OTP verification API to return invalid code error
    // [SDET TODO] 確認真實 API endpoint 路徑（目前用 **/verify-otp 估計）
    cy.intercept('POST', '**/verify-otp', {
      statusCode: 400,
      body: { error: 'invalid_otp', message: '驗證碼錯誤' },
    }).as('verifyOtp');

    cy.contains('button', '確認送出').click();
    cy.wait('@verifyOtp');

    cy.contains('div,p,span', /驗證碼|錯誤/i).should('be.visible');
    cy.url().should('contain', '/register');
  });
});
