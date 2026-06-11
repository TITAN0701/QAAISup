export class LoginPage {
  visit() {
    cy.visit('/login');
    cy.contains('h2', '歡迎回來').should('be.visible');
  }

  fillEmail(email: string) {
    cy.get('input[placeholder="請輸入手機號碼或電子郵件"]').clear().type(email);
  }

  fillPassword(password: string) {
    cy.get('input[placeholder="請輸入密碼"]').clear().type(password, { log: false });
  }

  submit() {
    cy.contains('button', '登入').click();
  }

  login(email: string, password: string) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }

  getErrorMessage() {
    return cy.contains('div,span,p', /帳號或密碼錯誤|登入失敗/i);
  }
}

export const loginPage = new LoginPage();
