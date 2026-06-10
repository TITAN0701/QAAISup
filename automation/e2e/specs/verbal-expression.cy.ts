// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 口語表達
// Automation candidates: TC-VERBAL-001, TC-VERBAL-002 (timer verification)
// TC-VERBAL-003~005 marked automation_candidate=false

// SKIP REASON: 前台測驗頁 URL 待確認；需取得真實 selector（id/class/text）後才能執行
// [ENG TASK] Confirm URL for verbal expression question page
// [ENG TASK] Confirm real selectors for timer display and image index indicator

import { loginAs } from '../flows/loginFlow';

describe('口語表達', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-VERBAL-001 口語表達每張圖片各自獨立倒數 60 秒，切換圖片後重置', () => {
    // [ENG TASK] Confirm URL for verbal expression question page
    cy.visit('/exam/verbal-expression');

    // Verify timer starts at 60 for first image
    cy.get('[data-testid="image-index"]').should('contain', '1');
    cy.get('[data-testid="timer-display"]').should('contain', '60');

    // Fast-forward time to trigger image switch
    cy.clock();
    cy.tick(60000); // advance 60 seconds

    // Timer should reset to 60 for the second image
    cy.get('[data-testid="image-index"]').should('contain', '2');
    cy.get('[data-testid="timer-display"]').should('contain', '60');
  });

  it.skip('TC-VERBAL-002 第一張圖 60 秒倒數結束後自動進入第二張圖並重新計時', () => {
    cy.visit('/exam/verbal-expression');

    cy.clock();

    cy.get('[data-testid="image-index"]').should('contain', '1');

    // Wait for 60s timer to complete
    cy.tick(60000);

    // System should auto-advance to second image
    cy.get('[data-testid="image-index"]').should('contain', '2');

    // Timer restarts from 60
    cy.get('[data-testid="timer-display"]').should('contain', '60');
  });
});
