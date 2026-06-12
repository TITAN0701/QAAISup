// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 手繪圖形辨識
// Automation candidates: TC-HWRITE-003 (trapezoid guide frame visibility)
// TC-HWRITE-001~002 marked automation_candidate=false (visual inspection required)

// SKIP REASON: 前台測驗頁 URL 待確認；需取得真實 selector（id/class/text）後才能執行
// [SDET TODO] Confirm URL for handwriting recognition page
// [SDET TODO] Confirm real selectors for trapezoid guide frame and start recording button

import { loginAs } from '../flows/loginFlow';

describe('手繪圖形辨識', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-HWRITE-003 開始錄製後梯形輔助框從畫面消失', () => {
    // [SDET TODO] Confirm URL for handwriting recognition page
    cy.visit('/exam/handwriting-recognition');

    // [SDET TODO] Confirm selector for trapezoid guide frame element (currently unknown)
    // Guide frame should be visible before recording starts
    cy.contains('button', '開始錄製').should('be.visible');

    cy.contains('button', '開始錄製').click();

    // [SDET TODO] Confirm how trapezoid guide frame disappears (hidden class / removed from DOM)
    // cy.get('[selector-for-guide-frame]').should('not.be.visible');
  });
});
