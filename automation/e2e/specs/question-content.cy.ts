// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 題目內容
// Automation candidates: TC-QCONTENT-001 ~ TC-QCONTENT-005
// SKIP REASON: cases.json id 待填入（需真實 SIT 個案 ID）；data-testid 元素尚未加入 DOM
//
// 已確認（2026-06-10 Playwright 探索）：
//   - 測驗進入點: /question?step=overview → 點「開始檢測」
//   - 觀察題組題目: /question?step=choice（URL 不變，題目內容換頁）
//   - 答案按鈕: button "是" / button "否" / button "未觀察"
//   - 下一題: button "下一題"（答題後才啟用）

// [SDET TODO] Add data-testid="question-text" — question body element
// [SDET TODO] Add data-testid="question-id" — hidden or visible unique question identifier
// [SDET TODO] Add data-testid="answer-option" — each answer option button
// [SDET TODO] Add data-testid="exam-container" — outermost exam wrapper

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
    // [SDET TODO] Provide a way to scan all questions for a given case
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview'); // [SDET TODO] Need to be in the correct child's session context

      // Walk through questions and check for test labels
      // [SDET TODO] Add data-testid="question-text" to question body element
      cy.get('[data-testid="question-text"]').each(($q) => {
        expect($q.text()).not.to.contain('[測試用]');
        expect($q.text()).not.to.contain('[測試警示題]');
      });
    });
  });

  it.skip('TC-QCONTENT-002 作答後系統切換至下一題，不重複顯示同一題目', () => {
    cy.visit('/frontdesk'); // [SDET TODO] Replace with actual exam URL for 36M case after clicking 「發展檢測」

    // [SDET TODO] Add data-testid="question-id" (hidden or visible) to identify current question
    cy.get('[data-testid="question-id"]').invoke('text').then((firstId) => {
      cy.get('[data-testid="answer-option"]').first().click();
      cy.get('[data-testid="question-id"]').invoke('text').then((secondId) => {
        expect(secondId).not.to.eq(firstId);
      });
    });
  });

  it.skip('TC-QCONTENT-003 48M 個案可正常開始測驗，不顯示題目不足錯誤', () => {
    cy.visit('/question?step=overview'); // [SDET TODO] Need to be in the correct child's session context
    cy.get('[data-testid="exam-container"]').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });

  it.skip('TC-QCONTENT-004 60M 個案可正常開始測驗，不顯示題目不足錯誤', () => {
    cy.visit('/frontdesk'); // [SDET TODO] Replace with actual exam URL for 60M case after clicking 「發展檢測」
    cy.get('[data-testid="exam-container"]').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });

  it.skip('TC-QCONTENT-005 72M 個案可正常開始測驗，不顯示題目不足錯誤', () => {
    cy.visit('/frontdesk'); // [SDET TODO] Replace with actual exam URL for 72M case after clicking 「發展檢測」
    cy.get('[data-testid="exam-container"]').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });
});
