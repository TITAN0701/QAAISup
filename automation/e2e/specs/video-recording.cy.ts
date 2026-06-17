// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 影片錄製
// TC-VIDEO-001~004: automation_candidate=false (require media device simulation)
// 2026-06-17 解鎖：TC-VIDEO-005,006 改用 navigateToStep 直達目標 step

import { loginAs } from '../flows/loginFlow';
import { navigateToStep } from '../flows/examFlow';
import { createChild } from '../flows/childFlow';

describe('影片錄製', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  // [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — 頁面含「超過 30 秒、最多 60 秒」文字
  // 2026-06-17 解鎖：navigateToStep category='ai' + type='FM02_01' → graphic-copying-video
  it('TC-VIDEO-005 手繪圖形模組錄製頁面顯示「超過 30 秒，最多 60 秒」說明文字', () => {
    createChild(36).then((child) => {
      navigateToStep(child, 'graphic-copying-video', 'ai', 'FM02_01');
      cy.contains('超過 30 秒').should('be.visible');
      cy.contains('最多 60 秒').should('be.visible');
    });
  });

  it('TC-VIDEO-006 走路側面模組錄製頁面顯示「超過 15 秒，最多 60 秒」說明文字', () => {
    createChild(36).then((child) => {
      navigateToStep(child, 'walk-side', 'ai', 'GM01_02');
      cy.contains('超過 15 秒').should('be.visible');
      cy.contains('最多 60 秒').should('be.visible');
    });
  });
});
