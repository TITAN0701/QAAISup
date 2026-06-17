// DRAFT: 需 QA / 工程師 review 後才可正式使用
// 來源：qa-workspace/specs/login/test-cases.json
// Selector 驗證：Playwright snapshot 2026-06-09（登入頁無 data-testid，使用 placeholder）

// [SDET TODO] Add data-testid="login-account-input", "login-password-input", "login-submit-button"
// [SDET TODO] Add data-testid="login-error-message" for error toast/alert

describe("一般登入", () => {
  const loginUrl = "/login";
  const forgotPasswordUrl = "/forgot-password";

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit(loginUrl);
    cy.contains('h2', '歡迎回來').should('be.visible');
  });

  it("[TC-LOGIN-001] 有效帳密登入成功", () => {
    const account = Cypress.env("TEST_USER_EMAIL");
    const password = Cypress.env("TEST_USER_PASSWORD");

    cy.intercept('POST', '*/*/auth/login**').as('loginApi');
    cy.get('input[placeholder="請輸入手機號碼或電子郵件"]').should('be.visible').clear().type(account);
    cy.get('input[placeholder="請輸入密碼"]').should('be.visible').clear().type(password, { log: false });
    cy.contains('button', '登入').should('be.visible').click();

    cy.wait('@loginApi').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.url().should('not.include', loginUrl);
    cy.screenshot("TC-LOGIN-001-result");
  });

  it("[TC-LOGIN-002] 未輸入帳號時提示必填", () => {
    cy.get('input[placeholder="請輸入密碼"]').should('be.visible').clear().type('anypassword', { log: false });
    cy.contains('button', '登入').should('be.visible').click();
    cy.contains('div,span,p', /帳號|必填|請輸入/i).should('be.visible');
    cy.screenshot("TC-LOGIN-002-result");
  });

  it("[TC-LOGIN-003] 未輸入密碼時提示必填", () => {
    const account = Cypress.env("TEST_USER_EMAIL");
    cy.get('input[placeholder="請輸入手機號碼或電子郵件"]').should('be.visible').clear().type(account);
    cy.contains('button', '登入').should('be.visible').click();
    cy.contains('div,span,p', /密碼|必填|請輸入/i).should('be.visible');
    cy.screenshot("TC-LOGIN-003-result");
  });

  it("[TC-LOGIN-004] 錯誤帳密登入失敗", () => {
    cy.get('input[placeholder="請輸入手機號碼或電子郵件"]').should('be.visible').clear().type('invalid-user@example.com');
    cy.get('input[placeholder="請輸入密碼"]').should('be.visible').clear().type('wrongpassword', { log: false });
    cy.contains('button', '登入').should('be.visible').click();
    cy.contains('div,span,p', /帳號或密碼錯誤|登入失敗/i).should('be.visible');
    cy.url().should('include', loginUrl);
    cy.screenshot("TC-LOGIN-004-result");
  });

  it("[TC-LOGIN-005] 忘記密碼入口導向正確", () => {
    cy.contains('button', '忘記密碼？').should('be.visible').click();
    cy.url().should('include', forgotPasswordUrl);
    cy.screenshot("TC-LOGIN-005-result");
  });

  // [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — 登入頁 snapshot 確認：頁面無「創立帳號」文字或連結，功能入口不存在
  it.skip("[TC-LOGIN-006] 創建帳號入口導向正確 (登入頁無此入口，待確認)", () => {
    cy.contains('創立帳號').should('be.visible').click();
    cy.url().should('include', '/register');
    cy.screenshot("TC-LOGIN-006-result");
  });
});
