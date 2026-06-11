// [DRAFT] Needs QA + Engineer review before use in CI.

import { loginPage } from '../pages/LoginPage';

export function loginAs(_role: 'admin' | 'regular_user') {
  const email = Cypress.env('TEST_USER_EMAIL');
  const password = Cypress.env('TEST_USER_PASSWORD');
  if (!email || !password) {
    throw new Error('Missing CYPRESS_TEST_USER_EMAIL or CYPRESS_TEST_USER_PASSWORD — set in .env or GitHub Secrets');
  }
  loginPage.visit();
  loginPage.login(email, password);
  cy.url().should('not.include', '/login');
}
