// [DRAFT] Needs SDET review before use in CI.
// Feature: 跳題邏輯
// Automation candidates: TC-QLOGIC-001 ~ TC-QLOGIC-006
// SKIP REASON: 年齡層跳題邏輯無對應 DOM 元素可驗證；cases.json id 待填入；需 [SDET TODO] 完成後才可解除 skip
//
// 已確認（2026-06-10 Playwright 探索）：
//   - 觀察題組 URL: /question?step=choice（同一 URL 內依序換題，不換 step）
//   - 進度條: 同一 step 內百分比遞增（例：50%）
//   - 答題後「下一題」按鈕啟用；點後換下一題，「下一題」再次 disabled 等新答題
//   - 答案選項樣式依月齡不同：
//     * 高月齡（15M+）: button "是" / button "否" / button "未觀察"
//     * 低月齡（2M~9M）: radio button（cy.contains('是') 不含 button role）
//   - 下一題: button "下一題"（共用）
//   - 題目類型標籤: 含文字 "觀察題組"
//   - 題目標題: heading level=2（題目內容）

// [SDET TODO] Add data-testid="question-age-level" — shows current age level label (needed for TC-QLOGIC-001~004)
// [SDET TODO] Add data-testid="answer-option-correct" / "answer-option-wrong" — or expose via fixture
// [SDET TODO] Add data-testid="result-age-display" on result page
// [SDET TODO] Add data-testid="complete-module-button" — next/finish button in module
// [SDET TODO] Add data-testid="current-module-label" — shows module name + age level
// [SDET TODO] Add data-testid="exam-container" — outermost exam wrapper
// [SDET TODO] Provide fixture cases.json with case_2m, case_4m, case_6m, case_42m fields (real SIT case IDs)

import { loginAs } from '../flows/loginFlow';

describe('跳題邏輯', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-QLOGIC-001 從實質年齡層開始出題，答錯後系統降低一個年齡層難度', () => {
    // Preconditions: 4M 個案存在且年齡層已判斷
    // [SDET TODO] Provide cases.json case_4m id; navigate directly to that child's exam
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview'); // [SDET TODO] Need to be in the 4M child's session context
      cy.contains('button', '開始檢測').click();

      // Verify first question is at 4M level
      // [SDET TODO] Add data-testid="question-age-level" to show current age level label
      cy.get('[data-testid="question-age-level"]').should('contain', '4');

      // Answer wrong
      // [SDET TODO] Add data-testid="answer-option-wrong" or confirm which button = wrong answer
      cy.contains('button', '否').click();
      cy.contains('button', '下一題').click();

      // Verify level dropped by one
      cy.get('[data-testid="question-age-level"]').should('contain', '2');
    });
  });

  it.skip('TC-QLOGIC-002 答對後系統只上升一個年齡層，不可跨越兩階', () => {
    // [SDET TODO] Provide cases.json case_4m id
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      // Answer correct at 2M level
      // [SDET TODO] Add data-testid="answer-option-correct" or confirm which button = correct answer
      cy.contains('button', '是').click();
      cy.contains('button', '下一題').click();

      // Should go to 4M (one level up), not 6M or higher
      cy.get('[data-testid="question-age-level"]').should('contain', '4');
      cy.get('[data-testid="question-age-level"]').should('not.contain', '6');
    });
  });

  it.skip('TC-QLOGIC-003 42M 個案答對後最高升至 48M，不跳至 60M 或更高', () => {
    // [SDET TODO] Provide cases.json case_42m id
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      // Keep answering correct to push level up
      // [SDET TODO] Provide a test helper or API to fast-forward to 48M level
      cy.contains('button', '是').click();
      cy.contains('button', '下一題').click();
      cy.get('[data-testid="question-age-level"]').should('contain', '48');

      // One more correct — should stay at 48, not jump to 60
      cy.contains('button', '是').click();
      cy.contains('button', '下一題').click();
      cy.get('[data-testid="question-age-level"]').should('contain', '48');
      cy.get('[data-testid="question-age-level"]').should('not.contain', '60');
    });
  });

  it.skip('TC-QLOGIC-004 跨模組後系統跳回實質年齡層（4M）對應的下一模組', () => {
    // Preconditions: 4M 個案剛完成「6M 語言理解」模組
    // [SDET TODO] Provide cases.json case_4m id
    // [SDET TODO] Add data-testid="current-module-label" to show module name + age level
    // [SDET TODO] Add data-testid="complete-module-button" — next/finish button at end of module
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      // Complete the 6M language comprehension module
      cy.get('[data-testid="complete-module-button"]').click();

      // Verify jump target is 4M language expression (not 6M)
      cy.get('[data-testid="current-module-label"]').should('contain', '4');
      cy.get('[data-testid="current-module-label"]').should('contain', '語言表達');
    });
  });

  it.skip('TC-QLOGIC-005 觀察題組全錯時結果顯示最低月齡「2 個月」', () => {
    // [SDET TODO] Provide cases.json with 6M case id (need AI module completed)
    // [SDET TODO] Add data-testid="result-age-display" on result page to verify final age
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();
      cy.url().should('include', 'step=choice');
      cy.contains('觀察題組').should('be.visible');

      // Answer all observation group questions "否" (wrong/negative)
      // 6M 個案為 radio button 樣式（不是 button role）
      cy.contains('否').click();
      cy.contains('button', '下一題').click();
      // [SDET TODO] Need to iterate all observation questions — count unknown without real data

      cy.get('[data-testid="result-age-display"]').should('contain', '2');
      cy.get('[data-testid="result-age-display"]').should('not.contain', '0');
    });
  });

  it.skip('TC-QLOGIC-006 個案在最低年齡層（2M）持續答錯時系統不崩潰', () => {
    // [SDET TODO] Provide cases.json case_4m id
    // [SDET TODO] Add data-testid="exam-container" outermost exam wrapper
    cy.fixture('cases').then((cases) => {
      cy.visit('/question?step=overview');
      cy.contains('button', '開始檢測').click();

      // Keep answering wrong at 2M — system should stay stable
      // 4M 個案為低月齡，答案為 radio button 樣式
      for (let i = 0; i < 5; i++) {
        cy.contains('否').click(); // radio button 樣式（低月齡）
        cy.contains('button', '下一題').click();
        // [SDET TODO] Add data-testid="question-age-level" to verify stays at 2M
      }

      // No error message, no blank page
      cy.get('body').should('not.contain', '發生錯誤');
      cy.url().should('include', '/question');
    });
  });
});
