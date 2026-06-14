// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 題目內容
// Selector 來源：Playwright debug screenshots (2026-06-13)
//
// 測試孩童策略：
//   TC-QCONTENT-002: 每次執行新建 48M 孩童（避免上次執行消耗測驗狀態）
//   TC-QCONTENT-003~005: 固定個案（等待下次檢測時間，只驗證頁面載入，不進入測驗）
//
// [SDET TODO] TC-QCONTENT-002: 確認 48M 新孩童的第一題為選擇題（是/否按鈕可點）；
//   若系統從影片題開始出題，需調整 ageMonths 或等到出現選擇題再作答。

import { loginAs } from '../flows/loginFlow';
import { navigateToExamOverview, startExamFor } from '../flows/examFlow';
import { createChild } from '../flows/childFlow';

describe('題目內容', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-QCONTENT-001 所有年齡層題目不出現測試用標記文字', () => {
    // [SDET TODO] 需確認如何在單一 test 中遍歷所有題目（題數不定，頁面動態切換）
    navigateToExamOverview('fewqwfa');
    cy.contains('button', '開始檢測').click();
    cy.url().should('include', 'step=');
    cy.get('h2').each(($q) => {
      expect($q.text()).not.to.contain('[測試用]');
      expect($q.text()).not.to.contain('[測試警示題]');
    });
  });

  it.skip('TC-QCONTENT-002 作答後系統切換至下一題，不重複顯示同一題目', () => {
    // [SDET TODO] 48M 新孩童第一題為精細動作拍照題（step=graphic-copying-photo），
    // 不含是/否按鈕，無法用 cy.contains('button', '否') 作答。
    // 需確認哪個月齡層第一題為是/否觀察題，再調整 createChild(ageMonths)。
    // createChild() 本身已正常運作（POST /cskapi/api/child 成功）。
    const freshChild = createChild(48);
    startExamFor(freshChild);
    cy.url().should('include', 'step=');

    cy.get('h2').invoke('text').then((firstQuestion) => {
      cy.contains('button', '否').click();
      cy.contains('button', '下一題').should('not.be.disabled').click();
      cy.get('h2').invoke('text').should('not.equal', firstQuestion);
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
