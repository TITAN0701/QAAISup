// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 跳題邏輯
// Automation candidates: TC-QLOGIC-001 ~ TC-QLOGIC-006

// [ENG TASK] Confirm URL patterns for exam pages (e.g. /exam/:caseId)
// [ENG TASK] Add data-testid to: question-age-level, answer-option, result-age-display
// [ENG TASK] Provide a way to select a test case by age_months in the UI or via API seeding

import { loginAs } from '../flows/loginFlow';

describe('跳題邏輯', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it('TC-QLOGIC-001 從實質年齡層開始出題，答錯後系統降低一個年齡層難度', () => {
    // Preconditions: 4M 個案存在且年齡層已判斷
    cy.fixture('cases').then((cases) => {
      const c = cases.case_4m;
      // [ENG TASK] Replace with actual navigation to start exam for a 4M case
      cy.visit(`/exam/start?age=${c.age_months}`);

      // Verify first question is at 4M level
      // [ENG TASK] Add data-testid="question-age-level" to show current age level label
      cy.get('[data-testid="question-age-level"]').should('contain', '4');

      // Answer wrong
      // [ENG TASK] Add data-testid="answer-option-wrong" or provide a way to pick wrong answer
      cy.get('[data-testid="answer-option"]').last().click();

      // Verify level dropped by one
      cy.get('[data-testid="question-age-level"]').should('contain', '2');
    });
  });

  it('TC-QLOGIC-002 答對後系統只上升一個年齡層，不可跨越兩階', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?age=${cases.case_4m.age_months}&start_level=2`);

      // Answer correct at 2M level
      cy.get('[data-testid="answer-option-correct"]').click();

      // Should go to 4M (one level up), not 6M or higher
      cy.get('[data-testid="question-age-level"]').should('contain', '4');
      cy.get('[data-testid="question-age-level"]').should('not.contain', '6');
    });
  });

  it('TC-QLOGIC-003 42M 個案答對後最高升至 48M，不跳至 60M 或更高', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?age=${cases.case_42m.age_months}&start_level=42`);

      // Keep answering correct to push level up
      // [ENG TASK] Provide a test helper or API to fast-forward to 48M level
      cy.get('[data-testid="answer-option-correct"]').click();
      cy.get('[data-testid="question-age-level"]').should('contain', '48');

      // One more correct — should stay at 48, not jump to 60
      cy.get('[data-testid="answer-option-correct"]').click();
      cy.get('[data-testid="question-age-level"]').should('contain', '48');
      cy.get('[data-testid="question-age-level"]').should('not.contain', '60');
    });
  });

  it('TC-QLOGIC-004 跨模組後系統跳回實質年齡層（4M）對應的下一模組', () => {
    // Preconditions: 4M 個案剛完成「6M 語言理解」模組
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?age=${cases.case_4m.age_months}`);

      // [ENG TASK] Add data-testid="current-module-label" to show module name + age level
      // Complete the 6M language comprehension module
      cy.get('[data-testid="complete-module-button"]').click();

      // Verify jump target is 4M language expression (not 6M)
      cy.get('[data-testid="current-module-label"]').should('contain', '4');
      cy.get('[data-testid="current-module-label"]').should('contain', '語言表達');
    });
  });

  it('TC-QLOGIC-005 觀察題組全錯時結果顯示最低月齡「2 個月」', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?age=${cases.case_6m.age_months}`);

      // [ENG TASK] Add data-testid="result-age-display" on result page
      // Answer all observation group questions wrong
      cy.get('[data-testid="observation-group-section"]').within(() => {
        cy.get('[data-testid="answer-option"]').each(($opt, i, $list) => {
          // pick the wrong answer (last option assumed wrong; engineer to confirm)
          cy.wrap($list[$list.length - 1]).click();
        });
      });

      cy.get('[data-testid="result-age-display"]').should('contain', '2');
      cy.get('[data-testid="result-age-display"]').should('not.contain', '0');
    });
  });

  it('TC-QLOGIC-006 個案在最低年齡層（2M）持續答錯時系統不崩潰', () => {
    cy.fixture('cases').then((cases) => {
      cy.visit(`/exam/start?age=${cases.case_4m.age_months}&start_level=2`);

      // Keep answering wrong at 2M — system should stay stable
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="answer-option"]').last().click();
        cy.get('[data-testid="question-age-level"]').should('contain', '2');
      }

      // No error message, no blank page
      cy.get('body').should('not.contain', '發生錯誤');
      cy.get('[data-testid="exam-container"]').should('be.visible');
    });
  });
});
