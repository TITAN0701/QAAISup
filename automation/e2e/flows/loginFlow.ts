// [DRAFT] Needs QA + Engineer review before use in CI.

import { loginPage } from '../pages/LoginPage';

export function loginAs(role: 'admin' | 'regular_user') {
  cy.fixture('users').then((users) => {
    const user = users[role];
    loginPage.visit();
    loginPage.login(user.email, user.password);
    // [ENG TASK] Confirm the landing page selector after successful login
    cy.get('[data-testid="main-content"]').should('exist');
  });
}
