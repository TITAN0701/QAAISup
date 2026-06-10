// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 手繪圖形辨識
// Automation candidates: TC-HWRITE-003 (trapezoid guide frame visibility)
// TC-HWRITE-001~002 marked automation_candidate=false (visual inspection required)

// [ENG TASK] Confirm URL for handwriting recognition page (e.g. /exam/handwriting-recognition)
// [ENG TASK] Add data-testid="trapezoid-guide-frame" — trapezoid guide overlay element
// [ENG TASK] Add data-testid="start-recording-button" — start recording button

import { loginAs } from '../flows/loginFlow';

describe('手繪圖形辨識', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it('TC-HWRITE-003 開始錄製後梯形輔助框從畫面消失', () => {
    // [ENG TASK] Confirm URL for handwriting recognition page
    cy.visit('/exam/handwriting-recognition');

    // Guide frame should be visible before recording
    cy.get('[data-testid="trapezoid-guide-frame"]').should('be.visible');

    // Click start recording
    cy.get('[data-testid="start-recording-button"]').click();

    // Guide frame should disappear after recording starts
    cy.get('[data-testid="trapezoid-guide-frame"]').should('not.be.visible');
  });
});
