// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 觀察題組
// Automation candidates: SC-OBSERVATION-GROUP-001 ~ SC-OBSERVATION-GROUP-004
// SKIP REASON: cases.json id 待填入（需真實 SIT 個案 ID）；AI 模組完成狀態無法自動觸發，需工程確認
// Source: qa-workspace/specs/observation-group/scenarios.md
//
// 已確認（2026-06-10 Playwright 探索）：
//   - 觀察題組 URL: /question?step=choice
//   - 答案選項: button "是" / button "否" / button "未觀察"
//   - 下一題按鈕: button "下一題"（答題後才啟用）
//   - 題目類型標籤: cy.contains('觀察題組')

// [ENG TASK] Seed test data: 15M+/24M/39M 個案且 AI 模組已完成，提供 cases.json 真實 id
// [ENG TASK] Confirm how to verify AI module completion state (URL change or DOM element)

import { loginAs } from '../flows/loginFlow';

describe('觀察題組', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('SC-OBSERVATION-GROUP-001 超過 15M 個案完成 AI 模組後點下一題可進入觀察題組', () => {
    // Precondition: 15M+ case with AI module completed (cases.json id 待填入)
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      // [ENG TASK] Confirm how AI module completion is indicated before observation group
      cy.url().should('include', 'step=choice');
      cy.contains('觀察題組').should('be.visible');
    });
  });

  it.skip('SC-OBSERVATION-GROUP-002 24M 個案完成 AI 模組後進入 24M 對應觀察題組', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      cy.url().should('include', 'step=choice');
      cy.contains('觀察題組').should('be.visible');
      // [ENG TASK] Confirm how to verify 24M-specific observation group vs 15M
    });
  });

  it.skip('SC-OBSERVATION-GROUP-003 39M 個案完成 AI 模組後無需取消重來即可進入觀察題組', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      cy.url().should('include', 'step=choice');
      cy.contains('觀察題組').should('be.visible');
      cy.url().should('not.include', 'cancel');
    });
  });

  it.skip('SC-OBSERVATION-GROUP-004 重新進入觀察題組時 AI 模組結果保留，不需重做', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      cy.url().should('include', 'step=choice');
      cy.contains('觀察題組').should('be.visible');

      // Cancel and re-enter
      cy.contains('button', '取消').click();
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      // Should return to choice step, not restart from beginning
      cy.url().should('include', 'step=choice');
    });
  });
});
