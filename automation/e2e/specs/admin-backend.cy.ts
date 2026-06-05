// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 後台管理
// Automation candidates: TC-ADMIN-001 ~ TC-ADMIN-004

// [ENG TASK] Add data-testid="account-list-item" for each account row in admin list
// [ENG TASK] Add data-testid="disable-account-button", "account-status-badge"
// [ENG TASK] Add data-testid="edit-profile-button" (visible to admin only)
// [ENG TASK] Confirm admin backend URL (e.g. /admin or /backend)

import { loginAs } from '../flows/loginFlow';

describe('後台管理', () => {
  it('TC-ADMIN-001 管理員可停用帳號並更新帳號狀態為停用', () => {
    // [ENG TASK] Confirm admin login flow — may need separate admin URL
    loginAs('admin');
    cy.visit('/admin/accounts');

    // Find an active test account
    cy.get('[data-testid="account-list-item"]').first().within(() => {
      cy.get('[data-testid="disable-account-button"]').click();
    });

    // Status should update to disabled
    cy.get('[data-testid="account-list-item"]').first()
      .get('[data-testid="account-status-badge"]')
      .should('contain', '停用');
  });

  it('TC-ADMIN-002 停用帳號後該使用者嘗試登入時系統拒絕並顯示停用訊息', () => {
    // Precondition: disabled_user fixture account is disabled
    cy.fixture('users').then((users) => {
      cy.visit('/login');
      cy.get('[data-testid="login-email-input"]').type(users.disabled_user.email);
      cy.get('[data-testid="login-password-input"]').type(users.disabled_user.password);
      cy.get('[data-testid="login-submit-button"]').click();

      // Should be rejected
      cy.get('[data-testid="login-error-message"]')
        .should('be.visible')
        .and('contain', '停用');
      cy.url().should('contain', '/login');
    });
  });

  it('TC-ADMIN-003 管理員進入使用者資料頁面後可見編輯按鈕', () => {
    loginAs('admin');
    cy.visit('/admin/users');

    // Admin should see the edit button for another user's profile
    cy.get('[data-testid="account-list-item"]').first().click();
    cy.get('[data-testid="edit-profile-button"]').should('be.visible');
  });

  it('TC-ADMIN-004 一般使用者頁面不顯示編輯他人資料的按鈕', () => {
    loginAs('regular_user');
    cy.visit('/profile');

    // Regular user should NOT see the edit-others button
    cy.get('[data-testid="edit-profile-button"]').should('not.exist');
  });
});
