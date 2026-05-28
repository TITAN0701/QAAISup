// DRAFT: 需 QA / 工程師 review 後才可正式使用
// 來源：qa-workspace/specs/login/test-cases.json

// TODO (Engineering): 請在帳號輸入欄加上 data-testid="login-email-input"
// TODO (Engineering): 請在密碼輸入欄加上 data-testid="login-password-input"
// TODO (Engineering): 請在登入送出按鈕加上 data-testid="login-submit-button"
// TODO (Engineering): 請在帳號必填錯誤提示加上 data-testid="login-email-required-error"
// TODO (Engineering): 請在密碼必填錯誤提示加上 data-testid="login-password-required-error"
// TODO (Engineering): 請在登入失敗錯誤提示加上 data-testid="login-error-message"
// TODO (Engineering): 請在「忘記密碼」連結加上 data-testid="login-forgot-password-link"
// TODO (Engineering): 請在「創建帳號」連結加上 data-testid="login-create-account-link"

describe("一般登入", () => {
  const loginUrl = "/login";
  const forgotPasswordUrl = "/forgot-password";
  const registerUrl = "/register";

  beforeEach(() => {
    cy.visit(loginUrl);
  });

  it("[TC-LOGIN-001] 有效帳密登入成功", () => {
    // 使用環境變數取得測試帳密，不硬寫帳號資料
    const email = Cypress.env("TEST_USER_EMAIL");
    const password = Cypress.env("TEST_USER_PASSWORD");

    cy.get('[data-testid="login-email-input"]').type(email);
    cy.get('[data-testid="login-password-input"]').type(password);
    cy.get('[data-testid="login-submit-button"]').click();

    // TODO: 確認登入成功後 URL 或畫面狀態（依 PM Answer）
    cy.url().should("not.include", loginUrl);

    cy.screenshot("TC-LOGIN-001-result");
  });

  it("[TC-LOGIN-002] 未輸入帳號時提示必填", () => {
    cy.get('[data-testid="login-password-input"]').type("anypassword");
    cy.get('[data-testid="login-submit-button"]').click();

    // TODO: 確認帳號必填錯誤文案（依 PM Answer）
    cy.get('[data-testid="login-email-required-error"]').should("be.visible");

    cy.screenshot("TC-LOGIN-002-result");
  });

  it("[TC-LOGIN-003] 未輸入密碼時提示必填", () => {
    cy.get('[data-testid="login-email-input"]').type("test@example.com");
    cy.get('[data-testid="login-submit-button"]').click();

    // TODO: 確認密碼必填錯誤文案（依 PM Answer）
    cy.get('[data-testid="login-password-required-error"]').should("be.visible");

    cy.screenshot("TC-LOGIN-003-result");
  });

  it("[TC-LOGIN-004] 錯誤帳密登入失敗", () => {
    cy.get('[data-testid="login-email-input"]').type("wrong@example.com");
    cy.get('[data-testid="login-password-input"]').type("wrongpassword");
    cy.get('[data-testid="login-submit-button"]').click();

    // TODO: 確認登入失敗錯誤文案（依 PM Answer）
    cy.get('[data-testid="login-error-message"]').should("be.visible");
    cy.url().should("include", loginUrl);

    cy.screenshot("TC-LOGIN-004-result");
  });

  it("[TC-LOGIN-005] 忘記密碼入口導向正確", () => {
    cy.get('[data-testid="login-forgot-password-link"]').click();

    // TODO: 確認忘記密碼導向 URL 或頁面標題（依 PM Answer）
    cy.url().should("include", forgotPasswordUrl);

    cy.screenshot("TC-LOGIN-005-result");
  });

  it("[TC-LOGIN-006] 創建帳號入口導向正確", () => {
    cy.get('[data-testid="login-create-account-link"]').click();

    // TODO: 確認創建帳號導向 URL 或頁面標題（依 PM Answer）
    cy.url().should("include", registerUrl);

    cy.screenshot("TC-LOGIN-006-result");
  });
});
