// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 影片錄製
// Automation candidates: TC-VIDEO-005, TC-VIDEO-006 (text comparison only)
// TC-VIDEO-001~004 marked automation_candidate=false (require media device simulation)

// SKIP REASON: 前台測驗頁 URL 待確認；需取得真實 selector（id/class/text）後才能執行
// [SDET TODO] Confirm URL for 大肢體 and 走路側面 module recording pages
// [SDET TODO] Confirm real selector for recording duration instruction text

import { loginAs } from '../flows/loginFlow';

describe('影片錄製', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-VIDEO-005 大肢體模組錄製頁面顯示「超過 30 秒，最多 60 秒」說明文字', () => {
    // [SDET TODO] Confirm URL for 大肢體 module recording page
    cy.visit('/exam/module/gross-motor/record');

    // [SDET TODO] Confirm selector for recording duration instruction text area
    cy.contains('超過 30 秒').should('be.visible');
    cy.contains('最多 60 秒').should('be.visible');
  });

  it.skip('TC-VIDEO-006 走路側面模組錄製頁面顯示「超過 15 秒」說明文字', () => {
    // [SDET TODO] Confirm URL for 走路側面 module recording page
    cy.visit('/exam/module/gait-side/record');

    // [SDET TODO] Confirm selector for recording duration instruction text area
    cy.contains('超過 15 秒').should('be.visible');
    cy.contains('超過 5 秒').should('not.exist');
    cy.contains('超過 30 秒').should('not.exist');
  });
});
