// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 題目內容
// Automation candidates: TC-QCONTENT-001 ~ TC-QCONTENT-005
// SKIP REASON: 測驗頁真實 URL 為 /question?step=overview（點「發展檢測」進入）；後續題目頁 URL 與 selector 待確認

// [ENG TASK] Confirm URL for actual question step after clicking 「開始檢測」 on /question?step=overview
// [ENG TASK] Add data-testid="question-text" — question body element
// [ENG TASK] Add data-testid="question-id" — hidden or visible unique question identifier
// [ENG TASK] Add data-testid="answer-option" — each answer option button
// [ENG TASK] Add data-testid="exam-container" — outermost exam wrapper

import { loginAs } from '../flows/loginFlow';

describe('題目內容', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  const ageLevels = [
    { fixture: 'case_2m', label: '2M' },
    { fixture: 'case_36m', label: '36M' },
    { fixture: 'case_48m', label: '48M' },
  ];

  it.skip('TC-QCONTENT-001 所有年齡層題目不出現測試用標記文字', () => {
    // [ENG TASK] Provide a way to scan all questions for a given case
    cy.fixture('cases').then((cases) => {
      cy.visit('/frontdesk'); // [ENG TASK] Replace with actual exam URL for 48M case after clicking 「發展檢測」

      // Walk through questions and check for test labels
      // [ENG TASK] Add data-testid="question-text" to question body element
      cy.get('[data-testid="question-text"]').each(($q) => {
        expect($q.text()).not.to.contain('[測試用]');
        expect($q.text()).not.to.contain('[測試警示題]');
      });
    });
  });

  it.skip('TC-QCONTENT-002 作答後系統切換至下一題，不重複顯示同一題目', () => {
    cy.visit('/frontdesk'); // [ENG TASK] Replace with actual exam URL for 36M case after clicking 「發展檢測」

    // [ENG TASK] Add data-testid="question-id" (hidden or visible) to identify current question
    cy.get('[data-testid="question-id"]').invoke('text').then((firstId) => {
      cy.get('[data-testid="answer-option"]').first().click();
      cy.get('[data-testid="question-id"]').invoke('text').then((secondId) => {
        expect(secondId).not.to.eq(firstId);
      });
    });
  });

  it.skip('TC-QCONTENT-003 48M 個案可正常開始測驗，不顯示題目不足錯誤', () => {
    cy.visit('/frontdesk'); // [ENG TASK] Replace with actual exam URL for 48M case after clicking 「發展檢測」
    cy.get('[data-testid="exam-container"]').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });

  it.skip('TC-QCONTENT-004 60M 個案可正常開始測驗，不顯示題目不足錯誤', () => {
    cy.visit('/frontdesk'); // [ENG TASK] Replace with actual exam URL for 60M case after clicking 「發展檢測」
    cy.get('[data-testid="exam-container"]').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });

  it.skip('TC-QCONTENT-005 72M 個案可正常開始測驗，不顯示題目不足錯誤', () => {
    cy.visit('/frontdesk'); // [ENG TASK] Replace with actual exam URL for 72M case after clicking 「發展檢測」
    cy.get('[data-testid="exam-container"]').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });
});
