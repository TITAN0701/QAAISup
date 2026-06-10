// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 資料驗證
// Source: qa-workspace/specs/data-validation/scenarios.md
// Note: SC-DATA-VALIDATION-001~003 are API type → see automation/api/tests/data-validation.test.py
//       SC-DATA-VALIDATION-004 is BLOCKED (CASEID 流水號規則待群健所確認)

// [ENG TASK] Confirm form URL where 身分證字號 is entered (child registration form)
// [ENG TASK] Confirm field name / placeholder for 身分證字號 input
// [ENG TASK] Add data-testid="id-number-input" — 身分證字號 input field
// [ENG TASK] Add data-testid="id-number-error" — validation error message element

import { loginAs } from '../flows/loginFlow';

describe('資料驗證 (UI)', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it('SC-DATA-VALIDATION-003 身分證字號第二碼非 1 或 2 時顯示驗證錯誤', () => {
    // [ENG TASK] Replace with actual child registration form URL
    cy.visit('/admin/child-list');

    // [ENG TASK] Replace with actual trigger to open child add/edit form
    cy.contains('button', /新增|建立|Add/i).click();

    // Enter ID number with invalid 2nd digit (e.g. "3")
    // [ENG TASK] Add data-testid="id-number-input"
    cy.get('[data-testid="id-number-input"]').type('A312345678');

    // Trigger validation
    cy.get('[data-testid="id-number-input"]').blur();

    // Error message should appear
    // [ENG TASK] Add data-testid="id-number-error"
    cy.get('[data-testid="id-number-error"]')
      .should('be.visible')
      .and('contain.text', /格式|錯誤|無效/i);
  });
});
