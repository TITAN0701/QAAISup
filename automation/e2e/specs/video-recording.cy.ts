// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 影片錄製
// Automation candidates: TC-VIDEO-005, TC-VIDEO-006 (text comparison only)
// TC-VIDEO-001~004 marked automation_candidate=false (require media device simulation)

// URL source: /question?step=walk-side confirmed from snapshot-step-walk-side.yml (2026-06-15)
// URL source: /question?step=graphic-copying-video — [SDET TODO] confirm from smoke test snapshot

import { loginAs } from '../flows/loginFlow';

describe('影片錄製', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-VIDEO-005 大肢體模組錄製頁面顯示正確時長說明文字', () => {
    // [SDET TODO] URL: /question?step=graphic-copying-video — 需補 snapshot 確認說明文字內容
    cy.visit('/question?step=graphic-copying-video');
    cy.contains('秒').should('be.visible');
  });

  it('TC-VIDEO-006 走路側面模組錄製頁面顯示「超過 15 秒，最多 60 秒」說明文字', () => {
    // URL confirmed: /question?step=walk-side (snapshot-step-walk-side.yml, 2026-06-15)
    // Text confirmed: duration_hint = "超過 15 秒，最多 60 秒"
    cy.visit('/question?step=walk-side');
    cy.contains('超過 15 秒').should('be.visible');
    cy.contains('最多 60 秒').should('be.visible');
    cy.contains('超過 30 秒').should('not.exist');
  });
});
