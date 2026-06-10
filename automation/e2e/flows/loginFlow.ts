// [DRAFT] Needs QA + Engineer review before use in CI.

import { loginPage } from '../pages/LoginPage';

export function loginAs(role: 'admin' | 'regular_user') {
  cy.fixture('users').then((users) => {
    const user = users[role];
    if (!user) throw new Error(`users.json 缺少 "${role}" 帳號設定`);
    loginPage.visit();
    loginPage.login(user.email, user.password);
    cy.url().should('not.include', '/login');
  });
}
