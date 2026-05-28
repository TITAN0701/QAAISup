// DRAFT: 需 QA / 工程師 review 後才可正式使用
// 來源：qa-workspace/specs/forgot-password/test-cases.json

// TODO (Engineering): 請在登入頁的「忘記密碼」連結加上 data-testid="login-forgot-password-link"
// TODO (Engineering): 請在忘記密碼頁的 Email 輸入欄加上 data-testid="forgot-password-email-input"
// TODO (Engineering): 請在忘記密碼頁的送出按鈕加上 data-testid="forgot-password-submit-button"
// TODO (Engineering): 請在 Email 必填錯誤提示加上 data-testid="forgot-password-email-required-error"
// TODO (Engineering): 請在 Email 格式錯誤提示加上 data-testid="forgot-password-email-format-error"
// TODO (Engineering): 請在送出成功後的通知訊息加上 data-testid="forgot-password-success-message"

describe("忘記密碼流程", () => {
  const loginUrl = "/login";
  const forgotPasswordUrl = "/forgot-password";

  beforeEach(() => {
    cy.visit(loginUrl);
  });

  it("[TC-FORGOT-PASSWORD-001] 忘記密碼入口導向正確", () => {
    // TODO: 確認忘記密碼流程的目標 URL 或頁面狀態（依 PM Answer）
    cy.get('[data-testid="login-forgot-password-link"]').click();

    // 驗證已進入忘記密碼流程（URL 或標題，待 PM 確認後補斷言）
    cy.url().should("include", forgotPasswordUrl);

    cy.screenshot("TC-FORGOT-PASSWORD-001-result");
  });

  it("[TC-FORGOT-PASSWORD-002] 忘記密碼未輸入 Email 時提示必填", () => {
    cy.visit(forgotPasswordUrl);

    // Email 欄位保持空白，直接送出
    cy.get('[data-testid="forgot-password-submit-button"]').click();

    // TODO: 確認必填錯誤文案（依 PM Answer）
    cy.get('[data-testid="forgot-password-email-required-error"]').should("be.visible");

    cy.screenshot("TC-FORGOT-PASSWORD-002-result");
  });

  it("[TC-FORGOT-PASSWORD-003] 忘記密碼輸入錯誤 Email 格式時提示錯誤", () => {
    cy.visit(forgotPasswordUrl);

    // TODO: 確認錯誤格式樣本（依 PM Answer）
    cy.get('[data-testid="forgot-password-email-input"]').type("invalid-email-format");
    cy.get('[data-testid="forgot-password-submit-button"]').click();

    // TODO: 確認格式錯誤文案（依 PM Answer）
    cy.get('[data-testid="forgot-password-email-format-error"]').should("be.visible");

    cy.screenshot("TC-FORGOT-PASSWORD-003-result");
  });

  it("[TC-FORGOT-PASSWORD-004] 忘記密碼輸入有效 Email 後送出通知", () => {
    cy.visit(forgotPasswordUrl);

    // 使用環境變數取得測試 Email，不硬寫帳號資料
    const testEmail = Cypress.env("TEST_USER_EMAIL") || "test@example.com";

    cy.get('[data-testid="forgot-password-email-input"]').type(testEmail);
    cy.get('[data-testid="forgot-password-submit-button"]').click();

    // TODO: 確認送出後通知文案或畫面狀態（依 PM Answer）
    cy.get('[data-testid="forgot-password-success-message"]').should("be.visible");

    cy.screenshot("TC-FORGOT-PASSWORD-004-result");
  });
});
