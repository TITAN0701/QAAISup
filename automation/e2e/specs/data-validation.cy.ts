// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 資料驗證
// Source: qa-workspace/specs/data-validation/scenarios.md
// Note: SC-DATA-VALIDATION-001~003 are API type → see automation/api/tests/data-validation.test.py
//       SC-DATA-VALIDATION-004 is BLOCKED (CASEID 流水號規則待群健所確認)

// [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — 前台 /frontdesk → 新增檔案 → dialog 含身分證字號欄位
// selector: input[placeholder="F123456789"]

import { loginAs } from '../flows/loginFlow';

describe('資料驗證 (UI)', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it('SC-DATA-VALIDATION-003 身分證字號第二碼非 1 或 2 時顯示驗證錯誤', () => {
    cy.visit('/frontdesk');
    cy.contains('button', '新增檔案').click();
    // 等 dialog 出現後限定範圍，避免命中背景 DOM 的同名 input
    cy.get('div[role="dialog"]').should('be.visible').within(() => {
      cy.get('input[placeholder="F123456789"]').type('A312345678');
      cy.get('input[placeholder="F123456789"]').blur();
    });
    cy.contains(/格式|錯誤|無效/i).should('be.visible');
    cy.screenshot('SC-DATA-VALIDATION-003-result');
  });
});
