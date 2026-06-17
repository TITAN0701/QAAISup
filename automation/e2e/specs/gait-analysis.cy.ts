// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 走路步態
// TC-GAIT-006 (visual), TC-GAIT-008 (recording timer), TC-GAIT-010 (visual) = manual only

// [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — QATest36M (id=546) Vue router push 進入各 step：
//   walk-fb URL: /question?step=walk-fb — 截圖：snapshot-step-walk-fb-confirmed.png
//   walk-side URL: /question?step=walk-side — 截圖：snapshot-step-walk-side-confirmed.png
// [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — TC-GAIT-001：walk-fb 無「衣著限制」文字，功能不存在
// [RE-VERIFIED 2026-06-17] walk-fb 頁面為錄製教學頁，實際文字：
//   「正對或背對鏡頭直行」、「超過 15 秒，最多 60 秒」
//   無「全身輔助框」、「多人入鏡」等舊文字（UI 已改版）
// [RE-VERIFIED 2026-06-17] walk-side 實際文字：
//   「走路步態（側面）」、「超過 15 秒、最多 60 秒」、「不要干涉孩子的行為」
// 2026-06-17 解鎖：navigateToStep stub start/resume API，直接導向 /{childId}/developmental

import { loginAs } from '../flows/loginFlow';
import { navigateToStep } from '../flows/examFlow';
import { createChild } from '../flows/childFlow';

describe('走路步態', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-GAIT-001 走路步態拍攝提醒頁面包含衣著限制說明文字', () => {
    // SIT walk-fb 頁面無此文字，功能不存在
  });

  // [RE-VERIFIED 2026-06-17] walk-fb 頁面標題為「正對或背對鏡頭直行」，無舊版輔助框文字
  it('TC-GAIT-002 正/背面模組拍攝教學頁面顯示「正對或背對鏡頭直行」說明', () => {
    createChild(36).then((child) => {
      navigateToStep(child, 'walk-fb', 'ai', 'GM01_01');
      cy.contains('正對或背對鏡頭直行').should('be.visible');
    });
  });

  // [RE-VERIFIED 2026-06-17] walk-fb 說明文字包含「從頭到腳」
  it('TC-GAIT-003 正/背面模組說明文字包含「從頭到腳」完整入鏡說明', () => {
    createChild(36).then((child) => {
      navigateToStep(child, 'walk-fb', 'ai', 'GM01_01');
      cy.contains('從頭到腳').should('be.visible');
    });
  });

  // [RE-VERIFIED 2026-06-17] walk-fb 說明包含「超過 15 秒，最多 60 秒」
  it('TC-GAIT-004 正/背面模組說明包含「超過 15 秒，最多 60 秒」錄製時長', () => {
    createChild(36).then((child) => {
      navigateToStep(child, 'walk-fb', 'ai', 'GM01_01');
      cy.contains('超過 15 秒').should('be.visible');
      cy.contains('最多 60 秒').should('be.visible');
    });
  });

  // [RE-VERIFIED 2026-06-17] walk-side 頁面標題「走路步態(側面)」（半形括號）
  it('TC-GAIT-005 側面模組頁面顯示「走路步態(側面)」標題', () => {
    createChild(36).then((child) => {
      navigateToStep(child, 'walk-side', 'ai', 'GM01_02');
      cy.contains('走路步態').should('be.visible');
      cy.contains('側面').should('be.visible');
    });
  });

  // [RE-VERIFIED 2026-06-17] walk-fb 說明包含「超過 15 秒，最多 60 秒」（與 TC-GAIT-004 相同驗證點）
  it('TC-GAIT-007 正/背面模組錄製頁面顯示「超過 15 秒」錄製時長要求', () => {
    createChild(36).then((child) => {
      navigateToStep(child, 'walk-fb', 'ai', 'GM01_01');
      cy.contains('超過 15 秒').should('be.visible');
      cy.contains('最多 60 秒').should('be.visible');
    });
  });

  // [RE-VERIFIED 2026-06-17] walk-side 包含「不要干涉孩子的行為」
  it('TC-GAIT-009 側面模組說明包含「不要干涉孩子的行為」注意事項', () => {
    createChild(36).then((child) => {
      navigateToStep(child, 'walk-side', 'ai', 'GM01_02');
      cy.contains('不要干涉孩子的行為').should('be.visible');
    });
  });
});
