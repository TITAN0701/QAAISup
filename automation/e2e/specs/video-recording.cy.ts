// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 影片錄製
// Automation candidates: TC-VIDEO-005, TC-VIDEO-006 (text comparison only)
// TC-VIDEO-001~004 marked automation_candidate=false (require media device simulation)

// [ENG TASK] Add data-testid="recording-duration-hint" to display duration instruction text

import { loginAs } from '../flows/loginFlow';

describe('影片錄製', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it('TC-VIDEO-005 大肢體模組錄製頁面顯示「超過 30 秒，最多 60 秒」說明文字', () => {
    // [ENG TASK] Confirm URL for 大肢體 module recording page
    cy.visit('/exam/module/gross-motor/record');

    cy.get('[data-testid="recording-duration-hint"]')
      .should('contain', '超過 30 秒')
      .and('contain', '最多 60 秒');
  });

  it('TC-VIDEO-006 走路側面模組錄製頁面顯示「超過 15 秒」說明文字', () => {
    // [ENG TASK] Confirm URL for 走路側面 module recording page
    cy.visit('/exam/module/gait-side/record');

    cy.get('[data-testid="recording-duration-hint"]')
      .should('contain', '超過 15 秒')
      .and('not.contain', '超過 5 秒')
      .and('not.contain', '超過 30 秒');
  });
});
