// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 後台管理
// Automation candidates: TC-ADMIN-001 ~ TC-ADMIN-004
// Selectors verified from Playwright snapshot 2026-06-09

// [ENG TASK] Add data-testid to action buttons in account/child table rows
//   e.g. data-testid="account-disable-button", "account-edit-button"
//   e.g. data-testid="child-row-action-button"
// [ENG TASK] Add data-testid="login-error-message" for disabled account error

import { loginAs } from '../flows/loginFlow';

// Nav links (verified from snapshot)
const NAV = {
  dashboard: 'a[href="/admin/dashboard"]',
  childList: 'a[href="/admin/child-list"]',
  question: 'a[href="/admin/question"]',
  invite: 'a[href="/admin/invite"]',
  about: 'a[href="/admin/about"]',
};

describe('後台管理', () => {
  beforeEach(() => {
    loginAs('admin');
  });

  it('TC-ADMIN-001 後台導覽列正確顯示所有選單項目', () => {
    cy.visit('/admin/dashboard');
    cy.contains('nav a', '儀錶板').should('be.visible');
    cy.contains('nav a', '孩童列表').should('be.visible');
    cy.contains('nav a', '題目管理').should('be.visible');
    cy.contains('nav a', '邀請管理').should('be.visible');
    cy.contains('nav a', '關於我們').should('be.visible');
  });

  it('TC-ADMIN-002 儀表板顯示孩童統計資料', () => {
    cy.visit('/admin/dashboard');
    cy.contains('孩童總人數').should('be.visible');
    cy.contains('新增孩童數').should('be.visible');
    cy.contains('檢測完成數').should('be.visible');
    cy.contains('檢測完成率').should('be.visible');
  });

  it('TC-ADMIN-003 孩童列表可搜尋姓名或案例編號', () => {
    cy.visit('/admin/child-list');
    cy.get('table').should('be.visible');
    cy.get('input[placeholder="搜尋姓名或案例編號"]').should('be.visible').type('test');
    cy.contains('button', '搜尋').click();
  });

  it('TC-ADMIN-004 孩童列表顯示欄位正確', () => {
    cy.visit('/admin/child-list');
    cy.get('table thead').within(() => {
      cy.contains('孩童姓名').should('be.visible');
      cy.contains('性別').should('be.visible');
      cy.contains('年齡').should('be.visible');
      cy.contains('地區').should('be.visible');
      cy.contains('最後檢測').should('be.visible');
      cy.contains('狀態').should('be.visible');
      cy.contains('動作').should('be.visible');
    });
  });

  it('TC-ADMIN-005 帳號管理列表顯示帳號編號、帳號名稱、角色、來源', () => {
    cy.visit('/admin/invite');
    cy.contains('帳號管理').should('be.visible');
    cy.get('table thead').within(() => {
      cy.contains('帳號編號').should('be.visible');
      cy.contains('帳號名稱').should('be.visible');
      cy.contains('角色').should('be.visible');
      cy.contains('來源').should('be.visible');
    });
  });

  it('TC-ADMIN-006 帳號管理可產生邀請連結', () => {
    cy.visit('/admin/invite');
    cy.contains('button', '產生邀請連結').should('be.visible');
  });

  it('TC-ADMIN-007 帳號管理可查看連結紀錄', () => {
    cy.visit('/admin/invite');
    cy.contains('button', '連結紀錄').should('be.visible').click();
  });

  it('TC-ADMIN-008 停用帳號後登入被拒並顯示錯誤訊息', () => {
    // Precondition: disabled_user fixture account is disabled
    cy.fixture('users').then((users) => {
      cy.visit('/login');
      cy.get('[data-testid="login-email-input"]').type(users.disabled_user.email);
      cy.get('[data-testid="login-password-input"]').type(users.disabled_user.password);
      cy.get('[data-testid="login-submit-button"]').click();
      // [ENG TASK] Add data-testid="login-error-message" to error alert
      cy.get('[data-testid="login-error-message"]')
        .should('be.visible')
        .and('contain', '停用');
      cy.url().should('contain', '/login');
    });
  });
});
