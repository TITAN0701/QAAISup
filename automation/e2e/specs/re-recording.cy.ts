// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 重新錄製
// Automation candidates: TC-REREC-002, TC-REREC-004
// TC-REREC-001, TC-REREC-003 = async upload dependency, manual review recommended

// [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — /records URL 不存在（重導到 /555/developmental）
// 重新錄製入口在孩童的 developmental 頁面，需有「待補錄」狀態的孩童個案
// TC-REREC-002,004 it.skip 保留原因：
//   1. 無「待補錄模組」狀態的測試孩童（需工程師建立 seed 資料）
//   2. 重新錄製本身需 mediaDevices（錄製影片），automation_candidate: false

import { loginAs } from '../flows/loginFlow';

describe('重新錄製', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  // [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — /records 不存在，重新錄製入口在 developmental 頁面
  // automation_candidate: false — 需 mediaDevices 且需有「待補錄」狀態測試個案
  it.skip('TC-REREC-002 重新錄製完成後不觸發圖卡配對或評測結果頁面', () => {
    // [SDET TODO] Seed test data: a case with 2+ pending re-record modules
    cy.visit('/records');

    // [SDET TODO] Confirm button text or stable selector for re-recording entry
    cy.contains('button', /重新錄製|補錄/).first().click();

    // [SDET TODO] Confirm button text for completing a module recording
    cy.contains('button', /完成|下一題|上傳/).click();

    // Verify we did NOT land on card-matching or result page
    cy.url().should('not.contain', '/card-matching');
    cy.url().should('not.contain', '/result');

    // [SDET TODO] Confirm selector for module queue list after completing one module
    cy.contains(/待補錄|重新錄製/).should('exist');
  });

  // [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — 同上，/records 不存在，需 seed 資料
  it.skip('TC-REREC-004 重新錄製中途中斷後再次進入可繼續剩餘模組', () => {
    // [SDET TODO] Seed test data: case with 3 pending modules, 1 already completed
    cy.visit('/records');

    // [SDET TODO] Confirm button text or stable selector for re-recording entry
    cy.contains('button', /重新錄製|補錄/).first().click();

    // Complete 1 module then leave
    cy.contains('button', /完成|下一題|上傳/).click();
    cy.visit('/records'); // simulate leaving mid-flow

    // Re-enter re-recording
    cy.contains('button', /重新錄製|補錄/).first().click();

    // [SDET TODO] Confirm selector for module list items to assert count = 2
    // Should show only remaining (2) modules, not all 3
    cy.contains(/待補錄|重新錄製/).should('exist');
  });
});
