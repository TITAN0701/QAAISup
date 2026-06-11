// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 重新錄製
// Automation candidates: TC-REREC-002, TC-REREC-004
// TC-REREC-001, TC-REREC-003 = async upload dependency, manual review recommended

// SKIP REASON: 前台檢測紀錄頁 URL 待確認；需取得真實 selector（id/class/text）後才能執行
// [ENG TASK] Confirm URL for 檢測紀錄 page
// [ENG TASK] Confirm real selectors for re-recording entry button, complete button, module list
// [ENG TASK] Seed test data: cases with pending re-record modules

import { loginAs } from '../flows/loginFlow';

describe('重新錄製', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-REREC-002 重新錄製完成後不觸發圖卡配對或評測結果頁面', () => {
    // Precondition: case with pending re-record modules
    // [ENG TASK] Seed test data: a case with 2+ pending re-record modules
    cy.visit('/records');

    // Enter re-recording flow
    cy.get('[data-testid="re-recording-entry-button"]').first().click();

    // Complete one module recording
    // [ENG TASK] Add data-testid="complete-module-button" in re-recording flow
    cy.get('[data-testid="complete-module-button"]').click();

    // Verify we did NOT land on card-matching or result page
    cy.url().should('not.contain', '/card-matching');
    cy.url().should('not.contain', '/result');

    // [ENG TASK] Add data-testid="re-recording-module-list" for module queue
    cy.get('[data-testid="re-recording-module-list"]').should('exist');
  });

  it.skip('TC-REREC-004 重新錄製中途中斷後再次進入可繼續剩餘模組', () => {
    // [ENG TASK] Seed test data: case with 3 pending modules, 1 already completed
    cy.visit('/records');

    cy.get('[data-testid="re-recording-entry-button"]').first().click();

    // Complete 1 module then leave
    cy.get('[data-testid="complete-module-button"]').click();
    cy.visit('/records'); // simulate leaving mid-flow

    // Re-enter re-recording
    cy.get('[data-testid="re-recording-entry-button"]').first().click();

    // Should show only remaining (2) modules, not all 3
    cy.get('[data-testid="re-recording-module-list"] li')
      .should('have.length', 2);
  });
});
