// DRAFT: 需 QA / 工程師 review 後才可正式使用
// 來源：qa-workspace/specs/register/test-cases.json
// Selector 參考：WETPAINT/cypress/e2e/page-objects/Register_Account/RegisterAccount.js

describe("創建帳號入口", () => {
  const loginUrl = "/login";
  const registerUrl = "/register";

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit(loginUrl);
    cy.get('div.box_shadow.bg-white').should('exist');
  });

  it("[TC-REGISTER-001] 創建帳號入口導向正確", () => {
    cy.contains('span', '還沒有帳號？').should('be.visible');
    cy.contains('button', '創立帳號').should('be.visible').click();
    cy.url().should('include', registerUrl);
    cy.screenshot("TC-REGISTER-001-result");
  });

  it("[TC-REGISTER-002] 註冊必填欄位未填時提示必填", () => {
    cy.visit(registerUrl);
    cy.contains('button', '確認送出').click();
    cy.contains('div,span,p', /必填|請輸入/i).should('be.visible');
    cy.screenshot("TC-REGISTER-002-result");
  });

  it("[TC-REGISTER-003] 密碼與確認密碼不一致時提示錯誤", () => {
    cy.visit(registerUrl);
    cy.get('#password').should('be.visible').clear().type('Password123', { log: false });
    cy.get('#confirmPassword').should('be.visible').clear().type('DifferentPassword456', { log: false });
    cy.contains('button', '確認送出').click();
    cy.contains('div,span,p', /不一致|不相符|密碼/i).should('be.visible');
    cy.screenshot("TC-REGISTER-003-result");
  });

  it("[TC-REGISTER-004] 輸入有效資料後建立帳號或進入驗證流程", () => {
    cy.visit(registerUrl);

    const uniquePhone = `09${Date.now().toString().slice(-8)}`;
    const uniqueEmail = `test+${Date.now()}@example.com`;

    cy.get('input[placeholder="請輸入全名"]').should('be.visible').clear().type('測試用戶');
    cy.get('#password').should('be.visible').clear().type('TestPassword123', { log: false });
    cy.get('#confirmPassword').should('be.visible').clear().type('TestPassword123', { log: false });
    cy.get('input[type="radio"][value="female"]').should('be.visible').check();
    cy.get('input[placeholder="example@email.com"]').should('be.visible').clear().type(uniqueEmail);
    cy.get('input[placeholder="0900-000-000"]').should('be.visible').clear().type(uniquePhone);

    cy.url().should('include', registerUrl);
    cy.screenshot("TC-REGISTER-004-result");
  });
});
