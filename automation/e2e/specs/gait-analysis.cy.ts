// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 走路步態
// Automation candidates: TC-GAIT-001 ~ TC-GAIT-005, TC-GAIT-007, TC-GAIT-009
// TC-GAIT-006 (visual), TC-GAIT-008 (recording timer), TC-GAIT-010 (visual) = manual only

// [ENG TASK] Add data-testid="shooting-reminder-text" to shooting reminder page content
// [ENG TASK] Add data-testid="prompt-1", "prompt-3" to individual prompt items
// [ENG TASK] Add data-testid="recording-duration-hint" on recording page
// [ENG TASK] Confirm URL for each gait sub-module page

import { loginAs } from '../flows/loginFlow';

describe('走路步態', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it('TC-GAIT-001 走路步態拍攝提醒頁面包含衣著限制說明文字', () => {
    cy.visit('/exam/module/gait/reminder');

    cy.get('[data-testid="shooting-reminder-text"]')
      .should('contain', '請勿讓孩子穿著遮擋四肢');
  });

  it('TC-GAIT-002 正/背面模組拍攝前提示詞包含全身入鏡說明', () => {
    cy.visit('/exam/module/gait-front/record');

    // [ENG TASK] Add data-testid="pre-shoot-prompt" for the pre-shoot tips area
    cy.get('[data-testid="pre-shoot-prompt"]')
      .should('contain', '全身')
      .and('contain', '綠色輔助框');
  });

  it('TC-GAIT-003 正/背面模組提示詞一包含「錄影前避免孩童超出輔助框」文字', () => {
    cy.visit('/exam/module/gait-front/record');

    cy.get('[data-testid="prompt-1"]')
      .should('contain', '錄影前避免孩童超出輔助框');
  });

  it('TC-GAIT-004 正/背面模組提示詞三包含「不干涉」與「多人入鏡」說明', () => {
    cy.visit('/exam/module/gait-front/record');

    cy.get('[data-testid="prompt-3"]')
      .should('contain', '避免干涉孩童動作')
      .and('contain', '多人入鏡');
  });

  it('TC-GAIT-005 側面模組提示詞包含橫向行走說明（非走向鏡頭）', () => {
    cy.visit('/exam/module/gait-side/record');

    cy.get('[data-testid="pre-shoot-prompt"]')
      .should('satisfy', ($el: JQuery<HTMLElement>) => {
        const text = $el.text();
        return text.includes('由左向右') || text.includes('由右向左');
      });

    cy.get('[data-testid="pre-shoot-prompt"]')
      .should('not.contain', '走向鏡頭');
  });

  it('TC-GAIT-007 側面模組錄製頁面顯示「超過 15 秒」錄製時長要求', () => {
    cy.visit('/exam/module/gait-side/record');

    cy.get('[data-testid="recording-duration-hint"]')
      .should('contain', '超過 15 秒');
  });

  it('TC-GAIT-009 側面模組拍攝注意事項包含「不干涉」與「多人入鏡」說明', () => {
    cy.visit('/exam/module/gait-side/record');

    // [ENG TASK] Add data-testid="shooting-notes" to the notes section
    cy.get('[data-testid="shooting-notes"]')
      .should('contain', '避免干涉孩童動作')
      .and('contain', '多人入鏡');
  });
});
