// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 觀察題組
// Automation candidates: SC-OBSERVATION-GROUP-001 ~ SC-OBSERVATION-GROUP-004
// SKIP REASON: cases.json id 欄位待填入真實個案 ID；需取得真實 selector（id/class/text）後才能執行
// Source: qa-workspace/specs/observation-group/scenarios.md

// [ENG TASK] Confirm URL for exam page after AI module completion
// [ENG TASK] Confirm URL / trigger for entering observation group
// [ENG TASK] Add data-testid="next-question-button" — 下一題 button after AI module
// [ENG TASK] Add data-testid="observation-group-title" or check URL to verify entry
// [ENG TASK] Add data-testid="ai-module-status" — shows AI module completion state
// [ENG TASK] Seed test data: cases at 15M, 24M, 39M with AI module marked completed

import { loginAs } from '../flows/loginFlow';

describe('觀察題組', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('SC-OBSERVATION-GROUP-001 超過 15M 個案完成 AI 模組後點下一題可進入觀察題組', () => {
    // Precondition: 15M+ case with AI module completed
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?caseId=${cases.case_15m_plus.id}`);

      // Wait for AI module to be marked complete
      // [ENG TASK] Add data-testid="ai-module-status" showing completion
      cy.get('[data-testid="ai-module-status"]').should('contain', '完成');

      // Click 下一題
      cy.get('[data-testid="next-question-button"]').click();

      // Verify entered observation group (not stuck or no response)
      // [ENG TASK] Add data-testid="observation-group-title" or verify URL
      cy.get('[data-testid="observation-group-title"]').should('be.visible');
    });
  });

  it.skip('SC-OBSERVATION-GROUP-002 24M 個案完成 AI 模組後進入 24M 對應觀察題組', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?caseId=${cases.case_24m.id}`);

      cy.get('[data-testid="next-question-button"]').click();

      // Should enter 24M observation group, not 15M
      cy.get('[data-testid="observation-group-title"]').should('be.visible');
      cy.url().should('not.contain', '15m');
    });
  });

  it.skip('SC-OBSERVATION-GROUP-003 39M 個案完成 AI 模組後無需取消重來即可進入觀察題組', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?caseId=${cases.case_39m.id}`);

      cy.get('[data-testid="next-question-button"]').click();

      // Should navigate directly to observation group — no cancel/restart required
      cy.get('[data-testid="observation-group-title"]').should('be.visible');
      cy.url().should('not.contain', '/cancel');
      cy.url().should('not.contain', '/restart');
    });
  });

  it.skip('SC-OBSERVATION-GROUP-004 重新進入觀察題組時 AI 模組結果保留，不需重做', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?caseId=${cases.case_15m_plus.id}`);

      // Simulate: enter observation group, cancel, re-enter
      cy.get('[data-testid="next-question-button"]').click();
      cy.get('[data-testid="observation-group-title"]').should('be.visible');

      // Go back and re-enter
      cy.go('back');
      cy.get('[data-testid="next-question-button"]').click();

      // AI module should still show as completed — not reset
      cy.get('[data-testid="ai-module-status"]').should('contain', '完成');
      cy.get('[data-testid="observation-group-title"]').should('be.visible');
    });
  });
});
