// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 口語表達
// Automation candidates: TC-VERBAL-001, TC-VERBAL-002 (timer verification)
// TC-VERBAL-003~005 marked automation_candidate=false
//
// Selector 來源：Playwright smoke-test 2026-06-13（snapshot-step-1-picture-naming.yml）
// 確認 URL: /question?step=picture-naming
// 確認 selector:
//   - 模組標題: cy.contains('口語表達')
//   - 圖片編號: cy.contains('01/01')
//   - 計時器: 格式為 "00:XX"（倒數）
//   - 開始錄製: cy.contains('button', '開始錄製')
//   - 播放語音: cy.contains('button', '播放語音')
//   - 完成作答: cy.contains('button', '完成作答')
//   - 評分選項: cy.contains('button', '正確') / '不正確' / '沒反應'
//   - 上傳影片: cy.contains('button', '上傳影片')
//
// [SDET TODO] 進入 /question?step=picture-naming 需先選擇 48M+ 個案並開始檢測
// [SDET TODO] 計時器以 cy.clock() + cy.tick() 控制，需確認 app 使用 Date/setTimeout

import { loginAs } from '../flows/loginFlow';

describe('口語表達', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  it.skip('TC-VERBAL-001 口語表達每張圖片各自獨立倒數 60 秒，切換圖片後重置', () => {
    // 前置：需選擇 48M+ 個案並進入測驗後到達 picture-naming step
    cy.visit('/question?step=picture-naming');
    cy.contains('口語表達').should('be.visible');
    cy.contains('button', '開始錄製').click();

    // 確認第一張圖（格式 01/01 或 01/N）
    cy.contains(/^01\//).should('be.visible');

    // 計時器以倒數格式顯示（00:60 或 01:00）
    // [SDET TODO] 確認計時器初始值與格式（00:60 / 01:00）
    cy.clock();
    cy.tick(60000);

    // 切換後應顯示第二張圖
    cy.contains(/^02\//).should('be.visible');
    cy.screenshot('TC-VERBAL-001-result');
  });

  it.skip('TC-VERBAL-002 第一張圖 60 秒倒數結束後自動進入第二張圖並重新計時', () => {
    cy.visit('/question?step=picture-naming');
    cy.contains('口語表達').should('be.visible');
    cy.contains('button', '開始錄製').click();

    cy.contains(/^01\//).should('be.visible');
    cy.clock();
    cy.tick(60000);

    cy.contains(/^02\//).should('be.visible');
    cy.screenshot('TC-VERBAL-002-result');
  });
});
