// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 走路步態
// Automation candidates: TC-GAIT-001 ~ TC-GAIT-005, TC-GAIT-007, TC-GAIT-009
// TC-GAIT-006 (visual), TC-GAIT-008 (recording timer), TC-GAIT-010 (visual) = manual only

// ✅ URLs confirmed 2026-06-15 via JS bundle analysis:
//    walk-fb (正/背面)：/question?step=walk-fb
//    walk-side (側面)：/question?step=walk-side
//    No separate /exam/module/gait/reminder page exists — 404 confirmed.
// ✅ Text content confirmed via bundle fetch (walk-fb-DtMb6cvB.js / walk-side-6HEwPPc7.js)
// [SDET TODO] All tests below need exam-state setup before cy.visit():
//    System enforces sequential exam flow — direct navigation to /question?step=xxx
//    redirects to current step if that step hasn't been reached yet.
//    Implement via API fixture (start exam + progress) or localStorage seeding.
// [SDET TODO] TC-GAIT-001: 衣著限制說明文字未出現在 walk-fb bundle；需人工確認是否有獨立頁面或不同 step

import { loginAs } from '../flows/loginFlow';

describe('走路步態', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-GAIT-001 走路步態拍攝提醒頁面包含衣著限制說明文字', () => {
    // [SDET TODO] 衣著限制文字（請勿讓孩子穿著遮擋四肢）未在 walk-fb bundle 中確認
    // 可能不存在此提示，或位於不同 step；需人工瀏覽 walk-fb 頁面確認
    cy.visit('/question?step=walk-fb');
    cy.contains('請勿讓孩子穿著遮擋四肢').should('be.visible');
  });

  it.skip('TC-GAIT-002 正/背面模組拍攝前提示詞包含全身入鏡說明', () => {
    // [SDET TODO] 需 exam-state fixture（進行中的測驗且已到達 walk-fb step）
    cy.visit('/question?step=walk-fb');
    cy.contains('全身（從頭到腳）都在綠色輔助框內').should('be.visible');
  });

  it.skip('TC-GAIT-003 正/背面模組提示詞一包含「錄影前避免孩童超出輔助框」文字', () => {
    // [SDET TODO] 需 exam-state fixture（進行中的測驗且已到達 walk-fb step）
    cy.visit('/question?step=walk-fb');
    cy.contains('錄影前避免孩童超出輔助框').should('be.visible');
  });

  it.skip('TC-GAIT-004 正/背面模組提示詞三包含「不干涉」與「多人入鏡」說明', () => {
    // [SDET TODO] 需 exam-state fixture（進行中的測驗且已到達 walk-fb step）
    cy.visit('/question?step=walk-fb');
    cy.contains('拍攝過程中避免干涉孩童動作與多人入鏡').should('be.visible');
  });

  it.skip('TC-GAIT-005 側面模組提示詞包含側面行走說明（非正對鏡頭）', () => {
    // [SDET TODO] 需 exam-state fixture（進行中的測驗且已到達 walk-side step）
    // 注意：bundle 確認側面為「橫式拍攝」+「側面行走」；無「由左向右/由右向左」文字
    cy.visit('/question?step=walk-side');
    cy.contains('側面行走').should('be.visible');
    cy.contains('橫式擺放（橫式拍攝）').should('be.visible');
  });

  it.skip('TC-GAIT-007 正/背面模組錄製頁面顯示「超過 15 秒」錄製時長要求', () => {
    // [SDET TODO] 需 exam-state fixture（進行中的測驗且已到達 walk-fb step）
    cy.visit('/question?step=walk-fb');
    cy.contains('超過 15 秒，最多 60 秒').should('be.visible');
  });

  it.skip('TC-GAIT-009 側面模組拍攝注意事項包含「不干涉」與「多人入鏡」說明', () => {
    // [SDET TODO] 需 exam-state fixture（進行中的測驗且已到達 walk-side step）
    cy.visit('/question?step=walk-side');
    cy.contains('拍攝過程中避免干涉孩童動作與多人入鏡').should('be.visible');
  });
});
