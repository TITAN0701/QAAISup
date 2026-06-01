// DRAFT: 需 QA / 工程師 review 後才可正式使用
// 來源：qa-workspace/specs/login/test-cases.json
// Selector 參考：WETPAINT/cypress/e2e/page-objects/Login_flow/LoginWetpaint.js

describe("一般登入", () => {
  const loginUrl = "/login";
  const forgotPasswordUrl = "/forgot-password";
  const registerUrl = "/register";

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit(loginUrl);
    cy.get('div.box_shadow.bg-white').should('exist');
  });

  it("[TC-LOGIN-001] 有效帳密登入成功", () => {
    const account = Cypress.env("TEST_USER_EMAIL");
    const password = Cypress.env("TEST_USER_PASSWORD");

    cy.intercept('POST', '*/*/auth/login**').as('loginApi');
    cy.get('#username').should('be.visible').clear().type(account);
    cy.get('#password').should('be.visible').clear().type(password, { log: false });
    cy.contains('button', '登入').should('be.visible').click();

    cy.wait('@loginApi').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.url().should('not.include', loginUrl);
    cy.screenshot("TC-LOGIN-001-result");
  });

  it("[TC-LOGIN-002] 未輸入帳號時提示必填", () => {
    cy.get('#password').should('be.visible').clear().type('anypassword', { log: false });
    cy.contains('button', '登入').should('be.visible').click();
    cy.contains('div,span,p', /帳號|必填|請輸入/i).should('be.visible');
    cy.screenshot("TC-LOGIN-002-result");
  });

  it("[TC-LOGIN-003] 未輸入密碼時提示必填", () => {
    cy.get('#username').should('be.visible').clear().type('0999999993');
    cy.contains('button', '登入').should('be.visible').click();
    cy.contains('div,span,p', /密碼|必填|請輸入/i).should('be.visible');
    cy.screenshot("TC-LOGIN-003-result");
  });

  it("[TC-LOGIN-004] 錯誤帳密登入失敗", () => {
    cy.get('#username').should('be.visible').clear().type('0999999994');
    cy.get('#password').should('be.visible').clear().type('wrongpassword', { log: false });
    cy.contains('button', '登入').should('be.visible').click();
    cy.contains('div', '帳號或密碼錯誤').should('be.visible');
    cy.url().should('include', loginUrl);
    cy.screenshot("TC-LOGIN-004-result");
  });

  it("[TC-LOGIN-005] 忘記密碼入口導向正確", () => {
    cy.contains('button', ' 忘記密碼？ ').should('be.visible').click();
    cy.url().should('include', forgotPasswordUrl);
    cy.screenshot("TC-LOGIN-005-result");
  });

  it("[TC-LOGIN-006] 創建帳號入口導向正確", () => {
    cy.contains('span', '還沒有帳號？').should('be.visible');
    cy.contains('button', '創立帳號').should('be.visible').click();
    cy.url().should('include', registerUrl);
    cy.screenshot("TC-LOGIN-006-result");
  });
});
