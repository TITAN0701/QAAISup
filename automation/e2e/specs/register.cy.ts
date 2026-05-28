// DRAFT: 需 QA / 工程師 review 後才可正式使用
// 來源：qa-workspace/specs/register/test-cases.json

// TODO (Engineering): 請在「創建帳號」連結加上 data-testid="login-create-account-link"
// TODO (Engineering): 請在必填欄位加上對應 data-testid（需依實作確認欄位清單）
//   建議：data-testid="register-email-input"
//         data-testid="register-password-input"
//         data-testid="register-confirm-password-input"
// TODO (Engineering): 請在註冊送出按鈕加上 data-testid="register-submit-button"
// TODO (Engineering): 請在必填錯誤提示加上 data-testid="register-required-error"
// TODO (Engineering): 請在密碼不一致錯誤提示加上 data-testid="register-password-mismatch-error"
// TODO (Engineering): 請在註冊成功或進入驗證流程後的狀態標示加上 data-testid="register-success-message"

describe("創建帳號入口", () => {
  const loginUrl = "/login";
  const registerUrl = "/register";

  beforeEach(() => {
    cy.visit(loginUrl);
  });

  it("[TC-REGISTER-001] 創建帳號入口導向正確", () => {
    cy.get('[data-testid="login-create-account-link"]').click();

    // TODO: 確認創建帳號導向 URL 或頁面狀態（依 PM Answer）
    cy.url().should("include", registerUrl);

    cy.screenshot("TC-REGISTER-001-result");
  });

  it("[TC-REGISTER-002] 註冊必填欄位未填時提示必填", () => {
    cy.visit(registerUrl);

    // 所有必填欄位保持空白，直接送出
    cy.get('[data-testid="register-submit-button"]').click();

    // TODO: 確認必填欄位清單與錯誤文案（依 PM Answer 或實作確認）
    cy.get('[data-testid="register-required-error"]').should("be.visible");

    cy.screenshot("TC-REGISTER-002-result");
  });

  it("[TC-REGISTER-003] 密碼與確認密碼不一致時提示錯誤", () => {
    cy.visit(registerUrl);

    // TODO: 補充其他必填欄位的填寫（依實作確認欄位清單）
    cy.get('[data-testid="register-password-input"]').type("Password123");
    cy.get('[data-testid="register-confirm-password-input"]').type("DifferentPassword456");
    cy.get('[data-testid="register-submit-button"]').click();

    // TODO: 確認密碼不一致錯誤文案（依 PM Answer）
    cy.get('[data-testid="register-password-mismatch-error"]').should("be.visible");

    cy.screenshot("TC-REGISTER-003-result");
  });

  it("[TC-REGISTER-004] 輸入有效資料後建立帳號或進入驗證流程", () => {
    cy.visit(registerUrl);

    // 使用環境變數或唯一測試資料，避免帳號重複
    // TODO: 確認後續驗證流程與測試資料產生方式（依 PM Answer）
    const uniqueEmail = `test+${Date.now()}@example.com`;

    cy.get('[data-testid="register-email-input"]').type(uniqueEmail);
    cy.get('[data-testid="register-password-input"]').type("TestPassword123");
    cy.get('[data-testid="register-confirm-password-input"]').type("TestPassword123");
    cy.get('[data-testid="register-submit-button"]').click();

    // TODO: 確認成功後畫面狀態（建立帳號完成 or 進入驗證流程，依 PM Answer）
    cy.get('[data-testid="register-success-message"]').should("be.visible");

    cy.screenshot("TC-REGISTER-004-result");
  });
});
