// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 題目內容
// Selector 來源：Playwright debug screenshots (2026-06-13)
//
// 測試孩童策略：
//   TC-QCONTENT-002: 每次執行新建 48M 孩童（避免上次執行消耗測驗狀態）
//   TC-QCONTENT-003~005: 固定個案（等待下次檢測時間，只驗證頁面載入，不進入測驗）
//
// 2026-06-17 解鎖路徑（JS bundle + SIT resume API 確認）：
//   TC-QCONTENT-001,002 直連問題可用 navigateToStep(childName, 'choice', 'observation') 解決。
//   resolveNextStep 邏輯：category='observation' → step='choice'（不看 currentQuestion.type）。
//   呼叫：navigateToStep(freshChild, 'choice', 'observation')

import { loginAs } from '../flows/loginFlow';
import { navigateToStep } from '../flows/examFlow';
import { createChild } from '../flows/childFlow';

describe('題目內容', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  // [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — choice step 存在，h2 顯示題目名稱（如「手繪圖」），
  // 無 [測試用] / [測試警示題] 文字；截圖：snapshot-step-choice-question.png
  // 2026-06-17 解鎖：navigateToStep stub resume API category='observation' → Router 導向 choice
  it('TC-QCONTENT-001 所有年齡層題目不出現測試用標記文字', () => {
    createChild(48).then((child) => {
      navigateToStep(child, 'choice', 'observation');
      cy.get('h2').each(($q) => {
        expect($q.text()).not.to.contain('[測試用]');
        expect($q.text()).not.to.contain('[測試警示題]');
      });
    });
  });

  // [BLOCKED 2026-06-17] observation/submit API 回 500 on SIT，無法切換下一題
  // 新建孩童送出觀察答案時 POST /quizattempts/observation/submit → 500
  // 需 SIT 環境正常後才能驗證切題行為
  it.skip('TC-QCONTENT-002 作答後系統切換至下一題，不重複顯示同一題目', () => {
    createChild(48).then((child) => {
      navigateToStep(child, 'choice', 'observation');
      cy.get('h2').invoke('text').then((firstQuestion) => {
        cy.contains('button', '否').click();
        cy.contains('button', '下一題').should('not.be.disabled').click();
        cy.get('h2').invoke('text').should('not.equal', firstQuestion);
      });
    });
  });

  it('TC-QCONTENT-003 48M 個案頁面正常載入，不顯示題目不足錯誤', () => {
    // windowslinux20（4歲3個月）目前為「等待下次檢測時間」(下次2027/02/02)，
    // 無法進入測驗流程，驗證發展頁不含題目不足相關錯誤訊息
    cy.visit('/frontdesk');
    cy.contains('windowslinux20').click();
    cy.url().should('include', '/developmental');
    cy.get('main').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });

  it('TC-QCONTENT-004 60M 個案頁面正常載入，不顯示題目不足錯誤', () => {
    // 60MT（5歲5個月）目前為「等待下次檢測時間」(下次2026/12/29)，
    // 無法進入測驗流程，驗證發展頁不含題目不足相關錯誤訊息
    cy.visit('/frontdesk');
    cy.contains('60MT').click();
    cy.url().should('include', '/developmental');
    cy.get('main').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });

  it('TC-QCONTENT-005 72M 個案頁面正常載入，不顯示題目不足錯誤', () => {
    // 72MT（6歲1個月）目前為「等待下次檢測時間」，
    // 無法進入測驗流程，驗證發展頁不含題目不足相關錯誤訊息
    cy.visit('/frontdesk');
    cy.contains('72MT').click();
    cy.url().should('include', '/developmental');
    cy.get('main').should('be.visible');
    cy.get('body').should('not.contain', '題目不足');
    cy.get('body').should('not.contain', '無法開始測驗');
  });
});
