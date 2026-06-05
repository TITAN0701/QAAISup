// [DRAFT] Needs QA + Engineer review before use in CI.
// [ENG TASK] Add data-testid to login form elements if not present.

export class LoginPage {
  visit() {
    cy.visit('/login');
  }

  fillEmail(email: string) {
    // [ENG TASK] Add data-testid="login-email-input"
    cy.get('[data-testid="login-email-input"]').clear().type(email);
  }

  fillPassword(password: string) {
    // [ENG TASK] Add data-testid="login-password-input"
    cy.get('[data-testid="login-password-input"]').clear().type(password);
  }

  submit() {
    // [ENG TASK] Add data-testid="login-submit-button"
    cy.get('[data-testid="login-submit-button"]').click();
  }

  login(email: string, password: string) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }

  getErrorMessage() {
    // [ENG TASK] Add data-testid="login-error-message"
    return cy.get('[data-testid="login-error-message"]');
  }
}

export const loginPage = new LoginPage();
