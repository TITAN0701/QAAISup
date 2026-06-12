// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 口語表達
// Automation candidates: TC-VERBAL-001, TC-VERBAL-002 (timer verification)
// TC-VERBAL-003~005 marked automation_candidate=false

// SKIP REASON: 前台測驗頁 URL 待確認；需取得真實 selector（id/class/text）後才能執行
// [SDET TODO] Confirm URL for verbal expression question page
// [SDET TODO] Confirm real selectors for timer display and image index indicator

import { loginAs } from '../flows/loginFlow';

describe('口語表達', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-VERBAL-001 口語表達每張圖片各自獨立倒數 60 秒，切換圖片後重置', () => {
    // [SDET TODO] Confirm URL for verbal expression question page
    cy.visit('/exam/verbal-expression');

    // [SDET TODO] Confirm selector for image index indicator (e.g. "1 / 3" or "第 1 張")
    cy.contains(/^1|第\s*1\s*張|1\s*\//).should('be.visible');

    // [SDET TODO] Confirm selector for timer display showing "60"
    cy.contains('60').should('be.visible');

    // Fast-forward time to trigger image switch
    cy.clock();
    cy.tick(60000);

    // Timer should reset to 60 for the second image
    // [SDET TODO] Confirm image index selector shows "2"
    cy.contains(/^2|第\s*2\s*張|2\s*\//).should('be.visible');
    cy.contains('60').should('be.visible');
  });

  it.skip('TC-VERBAL-002 第一張圖 60 秒倒數結束後自動進入第二張圖並重新計時', () => {
    // [SDET TODO] Confirm URL for verbal expression question page
    cy.visit('/exam/verbal-expression');

    cy.clock();

    // [SDET TODO] Confirm image index selector
    cy.contains(/^1|第\s*1\s*張|1\s*\//).should('be.visible');

    // Wait for 60s timer to complete
    cy.tick(60000);

    // System should auto-advance to second image
    cy.contains(/^2|第\s*2\s*張|2\s*\//).should('be.visible');

    // Timer restarts from 60
    cy.contains('60').should('be.visible');
  });
});
