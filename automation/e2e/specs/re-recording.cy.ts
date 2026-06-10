// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 重新錄製
// Automation candidates: TC-REREC-002, TC-REREC-004
// TC-REREC-001, TC-REREC-003 = async upload dependency, manual review recommended

// [ENG TASK] Confirm URL for 檢測紀錄 page (e.g. /records or /frontdesk/records)
// [ENG TASK] Add data-testid="re-recording-entry-button" — entry button per record row
// [ENG TASK] Add data-testid="complete-module-button" — finish/next button in re-recording flow
// [ENG TASK] Add data-testid="re-recording-module-list" — pending module queue list
// [ENG TASK] Seed test data: cases with pending re-record modules (2+ and 3 with 1 done)

import { loginAs } from '../flows/loginFlow';

describe('重新錄製', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it('TC-REREC-002 重新錄製完成後不觸發圖卡配對或評測結果頁面', () => {
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

  it('TC-REREC-004 重新錄製中途中斷後再次進入可繼續剩餘模組', () => {
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
