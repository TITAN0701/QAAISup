// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 走路步態
// Automation candidates: TC-GAIT-001 ~ TC-GAIT-005, TC-GAIT-007, TC-GAIT-009
// TC-GAIT-006 (visual), TC-GAIT-008 (recording timer), TC-GAIT-010 (visual) = manual only

// SKIP REASON: 前台測驗頁 URL 待確認；需取得真實 selector（id/class/text）後才能執行
// [SDET TODO] Confirm URLs for gait reminder, front/back record, and side record pages
// [SDET TODO] Confirm real selectors for clothing reminder text, pre-shoot prompts, duration hint, shooting notes

import { loginAs } from '../flows/loginFlow';

describe('走路步態', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-GAIT-001 走路步態拍攝提醒頁面包含衣著限制說明文字', () => {
    cy.visit('/exam/module/gait/reminder');

    // [SDET TODO] Confirm selector for clothing reminder text area
    cy.contains('請勿讓孩子穿著遮擋四肢').should('be.visible');
  });

  it.skip('TC-GAIT-002 正/背面模組拍攝前提示詞包含全身入鏡說明', () => {
    cy.visit('/exam/module/gait-front/record');

    // [SDET TODO] Confirm selector for pre-shoot prompt container
    cy.contains('全身').should('be.visible');
    cy.contains('綠色輔助框').should('be.visible');
  });

  it.skip('TC-GAIT-003 正/背面模組提示詞一包含「錄影前避免孩童超出輔助框」文字', () => {
    cy.visit('/exam/module/gait-front/record');

    // [SDET TODO] Confirm selector for first prompt item
    cy.contains('錄影前避免孩童超出輔助框').should('be.visible');
  });

  it.skip('TC-GAIT-004 正/背面模組提示詞三包含「不干涉」與「多人入鏡」說明', () => {
    cy.visit('/exam/module/gait-front/record');

    // [SDET TODO] Confirm selector for third prompt item
    cy.contains('避免干涉孩童動作').should('be.visible');
    cy.contains('多人入鏡').should('be.visible');
  });

  it.skip('TC-GAIT-005 側面模組提示詞包含橫向行走說明（非走向鏡頭）', () => {
    cy.visit('/exam/module/gait-side/record');

    // [SDET TODO] Confirm selector for side-module pre-shoot prompt
    cy.contains(/由左向右|由右向左/).should('be.visible');
    cy.contains('走向鏡頭').should('not.exist');
  });

  it.skip('TC-GAIT-007 側面模組錄製頁面顯示「超過 15 秒」錄製時長要求', () => {
    cy.visit('/exam/module/gait-side/record');

    // [SDET TODO] Confirm selector for recording duration hint text
    cy.contains('超過 15 秒').should('be.visible');
  });

  it.skip('TC-GAIT-009 側面模組拍攝注意事項包含「不干涉」與「多人入鏡」說明', () => {
    cy.visit('/exam/module/gait-side/record');

    // [SDET TODO] Confirm selector for shooting notes section
    cy.contains('避免干涉孩童動作').should('be.visible');
    cy.contains('多人入鏡').should('be.visible');
  });
});
