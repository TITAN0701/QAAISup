// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 手繪圖形辨識
// Automation candidates: TC-HWRITE-003 (trapezoid guide frame visibility)
// TC-HWRITE-001~002 marked automation_candidate=false (visual inspection required)

// SKIP REASON: 前台測驗頁 URL 待確認；需取得真實 selector（id/class/text）後才能執行
// [ENG TASK] Confirm URL for handwriting recognition page
// [ENG TASK] Confirm real selectors for trapezoid guide frame and start recording button

import { loginAs } from '../flows/loginFlow';

describe('手繪圖形辨識', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-HWRITE-003 開始錄製後梯形輔助框從畫面消失', () => {
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
