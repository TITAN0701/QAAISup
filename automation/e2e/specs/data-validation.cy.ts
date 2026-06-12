// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 資料驗證
// Source: qa-workspace/specs/data-validation/scenarios.md
// Note: SC-DATA-VALIDATION-001~003 are API type → see automation/api/tests/data-validation.test.py
//       SC-DATA-VALIDATION-004 is BLOCKED (CASEID 流水號規則待群健所確認)

// SKIP REASON: 身分證字號欄位真實 selector 與表單 URL 待確認
// [SDET TODO] Confirm form URL where 身分證字號 is entered (child registration form)
// [SDET TODO] Confirm real selector for 身分證字號 input and validation error message

import { loginAs } from '../flows/loginFlow';

describe('資料驗證 (UI)', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('SC-DATA-VALIDATION-003 身分證字號第二碼非 1 或 2 時顯示驗證錯誤', () => {
    // [SDET TODO] Replace with actual child registration form URL
    cy.visit('/admin/child-list');

    // [SDET TODO] Replace with actual trigger to open child add/edit form
    cy.contains('button', /新增|建立|Add/i).click();

    // [SDET TODO] Confirm placeholder or label text for 身分證字號 input
    cy.contains('div,label', /身分證|身份證/).parent().find('input').first()
      .type('A312345678');

    // Trigger validation
    cy.contains('div,label', /身分證|身份證/).parent().find('input').first()
      .blur();

    // [SDET TODO] Confirm error message container selector
    cy.contains('div,span,p', /格式|錯誤|無效/i).should('be.visible');
  });
});
