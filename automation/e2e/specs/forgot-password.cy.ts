// DRAFT: 需 QA / 工程師 review 後才可正式使用
// 來源：qa-workspace/specs/forgot-password/test-cases.json
// Selector 參考：WETPAINT/cypress/e2e/page-objects/Login_flow/LoginWetpaint.js

describe("忘記密碼流程", () => {
  const loginUrl = "/login";
  const forgotPasswordUrl = "/forgot-password";

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit(loginUrl);
    cy.get('div.box_shadow.bg-white').should('exist');
  });

  it("[TC-FORGOT-PASSWORD-001] 忘記密碼入口導向正確", () => {
    cy.contains('button', ' 忘記密碼？ ').should('be.visible').click();
    cy.url().should('include', forgotPasswordUrl);
    cy.contains('p', /請輸入您的電子郵件地址/i).should('be.visible');
    cy.screenshot("TC-FORGOT-PASSWORD-001-result");
  });

  it("[TC-FORGOT-PASSWORD-002] 忘記密碼未輸入 Email 時提示必填", () => {
    cy.contains('button', ' 忘記密碼？ ').should('be.visible').click();
    cy.url().should('include', forgotPasswordUrl);
    cy.contains('button', /傳送重設連結|下一步|送出/i).should('be.visible').click();
    cy.contains('div,span,p', /必填|請輸入|email/i).should('be.visible');
    cy.screenshot("TC-FORGOT-PASSWORD-002-result");
  });

  it("[TC-FORGOT-PASSWORD-003] 忘記密碼輸入錯誤 Email 格式時提示錯誤", () => {
    cy.contains('button', ' 忘記密碼？ ').should('be.visible').click();
    cy.url().should('include', forgotPasswordUrl);

    cy.intercept('POST', '**/api/auth/forgot-password**', {
      statusCode: 400,
      body: { msg: 'invalid email' },
    }).as('forgetPasswordApiFail');

    cy.get('input#email, input[name="email"], input[placeholder="example@email.com"]')
      .first().should('be.visible').clear().type('ZZZ@QQW');
    cy.contains('button', /傳送重設連結|下一步|送出/i).should('be.visible').click();

    cy.contains('p,span,div', /email|格式|錯誤|正確/i).should('be.visible');
    cy.screenshot("TC-FORGOT-PASSWORD-003-result");
  });

  it("[TC-FORGOT-PASSWORD-004] 忘記密碼輸入有效 Email 後送出通知", () => {
    cy.contains('button', ' 忘記密碼？ ').should('be.visible').click();
    cy.url().should('include', forgotPasswordUrl);

    cy.intercept('POST', '**/api/auth/forgot-password**').as('forgetPasswordApi');

    const testEmail = Cypress.env("TEST_USER_EMAIL") || "test@example.com";
    cy.get('input#email, input[name="email"], input[placeholder="example@email.com"]')
      .first().should('be.visible').clear().type(testEmail);
    cy.contains('button', /傳送重設連結|下一步|送出/i).should('be.visible').click();

    cy.wait('@forgetPasswordApi').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.screenshot("TC-FORGOT-PASSWORD-004-result");
  });
});
