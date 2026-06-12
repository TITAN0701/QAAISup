// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 圖卡配對
// Automation candidates: TC-CARDMATCH-001 ~ TC-CARDMATCH-005
// SKIP REASON: cases.json id 待填入；圖卡配對題 step code 待確認；data-testid 元素尚未加入 DOM
//
// 已確認（2026-06-10 Playwright 探索）：
//   - 測驗進入點: /question?step=overview → 點「開始檢測」
//   - 圖卡配對題目 step code 未知（不是 choice/supine）→ 需工程確認

// [SDET TODO] Confirm step code for card-matching questions (e.g. /question?step=card or similar)
// [SDET TODO] Confirm real selectors for question type indicator, card options, feedback elements

import { loginAs } from '../flows/loginFlow';

describe('圖卡配對', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-CARDMATCH-001 4M 個案測驗中不顯示圖卡配對題目', () => {
    cy.visit('/question?step=overview'); // [SDET TODO] Need to be in the correct child's session context

    // Walk through all questions and verify none are card-matching type
    // [SDET TODO] Add data-testid="question-type" with value like "card-matching" or "standard"
    cy.get('[data-testid="question-type"]').each(($el) => {
      expect($el.text()).not.to.contain('card-matching');
    });
  });

  it.skip('TC-CARDMATCH-002 6M 個案測驗中不顯示圖卡配對題目', () => {
    cy.visit('/frontdesk'); // [SDET TODO] Replace with actual exam page URL for 6M case after clicking 「發展檢測」

    cy.get('[data-testid="question-type"]').each(($el) => {
      expect($el.text()).not.to.contain('card-matching');
    });
  });

  it.skip('TC-CARDMATCH-003 8M 個案測驗中可正常顯示圖卡配對題目', () => {
    cy.visit('/frontdesk'); // [SDET TODO] Replace with actual exam page URL for 8M case after clicking 「發展檢測」

    // At least one card-matching question should appear
    cy.get('[data-testid="question-type"][value="card-matching"]').should('exist');
    // Cards should be visible
    cy.get('[data-testid="card-option"]').should('be.visible');
  });

  it.skip('TC-CARDMATCH-004 圖卡配對題中點擊彩色圖案即算配對成功（無需拖拉）', () => {
    cy.visit('/frontdesk'); // [SDET TODO] Replace with actual exam page URL for 8M case after clicking 「發展檢測」

    // Navigate to a card-matching question
    // [SDET TODO] Provide direct URL or test data to land on a card-matching question
    cy.get('[data-testid="question-type"][value="card-matching"]').should('exist');

    // Click (not drag) the correct colored card
    cy.get('[data-testid="card-option-correct"]').click();

    // Should register as correct without drag
    cy.get('[data-testid="answer-result"]').should('contain', '正確');
  });

  it.skip('TC-CARDMATCH-005 圖卡配對點擊正確圖案後顯示正向回饋並進入下一題', () => {
    cy.visit('/frontdesk'); // [SDET TODO] Replace with actual exam page URL for 8M case after clicking 「發展檢測」

    cy.get('[data-testid="question-type"][value="card-matching"]').should('exist');

    // Record current question identifier
    cy.get('[data-testid="question-id"]').invoke('text').then((firstId) => {
      cy.get('[data-testid="card-option-correct"]').click();

      // Feedback should appear
      cy.get('[data-testid="feedback-message"]').should('be.visible');

      // Then advance to next question
      cy.get('[data-testid="question-id"]').invoke('text').then((nextId) => {
        expect(nextId).not.to.eq(firstId);
      });
    });
  });
});
