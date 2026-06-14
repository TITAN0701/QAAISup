// [DRAFT] Needs SDET review before use in CI.
// Feature: 跳題邏輯
// Selector 來源：Playwright snapshot-03-question-choice.yml (2026-06-13)
//
// 測試孩童策略：
//   TC-QLOGIC-006: 每次執行新建 4M 孩童（確保測驗可進入）
//   4M 個案屬步態分析（影片題），不存在是/否按鈕；
//   僅驗證最低年齡層測驗初始化不崩潰，不嘗試作答。
//
// [SDET TODO] TC-QLOGIC-001~005：年齡層資訊未在 DOM 中顯示，
//   需確認 API response 是否帶 age_level 欄位（cy.intercept 擷取），
//   或改用題庫比對進行間接驗證。

import { loginAs } from '../flows/loginFlow';
import { startExamFor } from '../flows/examFlow';
import { createChild } from '../flows/childFlow';

describe('跳題邏輯', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-QLOGIC-001 從實質年齡層開始出題，答錯後系統降低一個年齡層難度', () => {
    // [SDET TODO] 年齡層降級需 API intercept 或題庫比對驗證
    startExamFor('fewqwfa');
    cy.contains('button', '否').click();
    cy.contains('button', '下一題').should('not.be.disabled').click();
    cy.get('h2').should('be.visible');
  });

  it.skip('TC-QLOGIC-002 答對後系統只上升一個年齡層，不可跨越兩階', () => {
    // [SDET TODO] 年齡層升降需 API intercept 驗證
    startExamFor('fewqwfa');
    cy.contains('button', '是').click();
    cy.contains('button', '下一題').should('not.be.disabled').click();
    cy.get('h2').should('be.visible');
  });

  it.skip('TC-QLOGIC-003 42M 個案答對後最高升至 48M，不跳至 60M 或更高', () => {
    // [SDET TODO] 最高年齡層需 API intercept 或題庫比對驗證；需 42M 個案
    startExamFor('windowslinux20');
    cy.contains('button', '是').click();
    cy.contains('button', '下一題').should('not.be.disabled').click();
    cy.get('h2').should('be.visible');
  });

  it.skip('TC-QLOGIC-004 跨模組後系統跳回實質年齡層（4M）對應的下一模組', () => {
    // [SDET TODO] 跨模組跳轉需確認 URL pattern 或 heading 文字變化
    startExamFor('fewqwfa');
    cy.url().should('include', 'step=');
    cy.get('h2').should('be.visible');
  });

  it.skip('TC-QLOGIC-005 觀察題組全錯時結果顯示最低月齡「2 個月」', () => {
    // [SDET TODO] 需有 AI 模組完成的 6M 個案；結果頁月齡顯示方式待確認
    startExamFor('測試孩童1');
    cy.contains('否').click();
    cy.contains('button', '下一題').should('not.be.disabled').click();
    cy.url().should('include', 'result');
    cy.contains('2').should('be.visible');
  });

  it('TC-QLOGIC-006 個案在最低年齡層（4M）測驗初始化時系統不崩潰', () => {
    // 每次新建 4M 孩童確保測驗可進入（不受前次執行狀態影響）
    // 4M 為步態分析（影片題），無是/否按鈕，只驗證頁面正常初始化
    const freshChild = createChild(4);
    startExamFor(freshChild);
    cy.url().should('include', 'step=');
    cy.get('body').should('not.contain', '發生錯誤');
    cy.get('body').should('not.contain', '系統錯誤');
    cy.get('main').should('be.visible');
  });
});
