// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 手繪圖形辨識
// TC-HWRITE-001~002: automation_candidate=false (visual inspection required)
// TC-HWRITE-003: automation_candidate=false — 驗證「梯形輔助框錄製後消失」需啟動相機 (mediaDevices)
//                Cypress 無法模擬相機錄製，不產出 .cy.ts，不寫 it.skip
// [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — graphic-copying-photo 頁面存在（step=graphic-copying-photo）
//   截圖：snapshot-step-graphic-copying-photo.png；heading: 手繪圖形辨識圖片拍照

import { loginAs } from '../flows/loginFlow';

describe('手繪圖形辨識', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  // TC-HWRITE-003: automation_candidate=false
  // 驗證「開始錄製後梯形輔助框消失」需啟動相機 (mediaDevices)，無法自動化
  // [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — graphic-copying-photo 功能入口存在，前置步驟可到達
  // 錄製後行為（梯形框消失）需人工確認
});
