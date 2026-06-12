// DRAFT: 需 QA / 工程師 review 後才可正式使用
// 來源：qa-workspace/specs/forgot-password/test-cases.json
// Selector 驗證：Playwright snapshot-13-forgot-password.yml（2026-06-12）

describe("忘記密碼流程", () => {
  const loginUrl = "/login";
  const forgotPasswordUrl = "/forgot-password";

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit(loginUrl);
    cy.contains('h2', '歡迎回來').should('be.visible');
  });

  it("[TC-FORGOT-PASSWORD-001] 忘記密碼入口導向正確", () => {
    cy.contains('button', '忘記密碼？').should('be.visible').click();
    cy.url().should('include', forgotPasswordUrl);
    cy.contains('h2', '忘記密碼？').should('be.visible');
    cy.screenshot("TC-FORGOT-PASSWORD-001-result");
  });

  it("[TC-FORGOT-PASSWORD-002] 忘記密碼未輸入 Email 時提示必填", () => {
    cy.visit(forgotPasswordUrl);
    cy.contains('h2', '忘記密碼？').should('be.visible');
    cy.contains('button', '傳送重設連結').should('be.visible').click();
    cy.contains('div,span,p', /必填|請輸入|email/i).should('be.visible');
    cy.screenshot("TC-FORGOT-PASSWORD-002-result");
  });

  it("[TC-FORGOT-PASSWORD-003] 忘記密碼輸入錯誤 Email 格式時提示錯誤", () => {
    cy.visit(forgotPasswordUrl);
    cy.contains('h2', '忘記密碼？').should('be.visible');
    cy.get('input[placeholder="example@email.com"]').should('be.visible').clear().type('ZZZ@QQW');
    cy.contains('button', '傳送重設連結').should('be.visible').click();
    cy.contains('p,span,div', /email|格式|錯誤|正確/i).should('be.visible');
    cy.screenshot("TC-FORGOT-PASSWORD-003-result");
  });

  it("[TC-FORGOT-PASSWORD-004] 忘記密碼輸入有效 Email 後送出通知", () => {
    cy.intercept('POST', /forgot-password/).as('forgetPasswordApi');
    cy.visit(forgotPasswordUrl);
    cy.contains('h2', '忘記密碼？').should('be.visible');
    cy.get('input[placeholder="example@email.com"]').should('be.visible').clear().type('qatest@example.com');
    cy.contains('button', '傳送重設連結').should('be.visible').click();
    cy.wait('@forgetPasswordApi', { timeout: 10000 }).then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });
    cy.screenshot("TC-FORGOT-PASSWORD-004-result");
  });
});
