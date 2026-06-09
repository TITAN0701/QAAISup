export class LoginPage {
  visit() {
    cy.visit('/login');
  }

  fillEmail(email: string) {
    cy.get('#username').clear().type(email);
  }

  fillPassword(password: string) {
    cy.get('#password').clear().type(password, { log: false });
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
    // 尚未確認錯誤訊息的實際 selector，暫用文字比對
    return cy.contains('登入失敗');
  }
}

export const loginPage = new LoginPage();
