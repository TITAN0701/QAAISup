// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 圖卡配對
// Automation candidates: TC-CARDMATCH-001 ~ TC-CARDMATCH-005

// [ENG TASK] Add data-testid="question-type" to identify question type (e.g. "card-matching")
// [ENG TASK] Add data-testid="card-option" to each colored card option
// [ENG TASK] Add data-testid="feedback-message" for post-answer feedback

import { loginAs } from '../flows/loginFlow';

describe('圖卡配對', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it('TC-CARDMATCH-001 4M 個案測驗中不顯示圖卡配對題目', () => {
    cy.visit('/exam/start?age=4');

    // Walk through all questions and verify none are card-matching type
    // [ENG TASK] Add data-testid="question-type" with value like "card-matching" or "standard"
    cy.get('[data-testid="question-type"]').each(($el) => {
      expect($el.text()).not.to.contain('card-matching');
    });
  });

  it('TC-CARDMATCH-002 6M 個案測驗中不顯示圖卡配對題目', () => {
    cy.visit('/exam/start?age=6');

    cy.get('[data-testid="question-type"]').each(($el) => {
      expect($el.text()).not.to.contain('card-matching');
    });
  });

  it('TC-CARDMATCH-003 8M 個案測驗中可正常顯示圖卡配對題目', () => {
    cy.visit('/exam/start?age=8');

    // At least one card-matching question should appear
    cy.get('[data-testid="question-type"][value="card-matching"]').should('exist');
    // Cards should be visible
    cy.get('[data-testid="card-option"]').should('be.visible');
  });

  it('TC-CARDMATCH-004 圖卡配對題中點擊彩色圖案即算配對成功（無需拖拉）', () => {
    cy.visit('/exam/start?age=8');

    // Navigate to a card-matching question
    // [ENG TASK] Provide direct URL or test data to land on a card-matching question
    cy.get('[data-testid="question-type"][value="card-matching"]').should('exist');

    // Click (not drag) the correct colored card
    cy.get('[data-testid="card-option-correct"]').click();

    // Should register as correct without drag
    cy.get('[data-testid="answer-result"]').should('contain', '正確');
  });

  it('TC-CARDMATCH-005 圖卡配對點擊正確圖案後顯示正向回饋並進入下一題', () => {
    cy.visit('/exam/start?age=8');

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
