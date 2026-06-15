// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 重新錄製
// Automation candidates: TC-REREC-002, TC-REREC-004
// TC-REREC-001, TC-REREC-003 = async upload dependency, manual review recommended

// SKIP REASON: 缺少 /question?step=re-recording（或等效頁面）的 Playwright snapshot
// 補齊 snapshot 後可解鎖，非永久跳過
// [SDET TODO] 執行 /playwright-smoke-test 補 re-recording 頁面截圖與 snapshot
// [SDET TODO] Confirm URL: 推測為 /question?step=re-recording 或從「檢測紀錄」tab 進入
// [SDET TODO] Confirm selectors: 重新錄製入口按鈕、完成按鈕、模組清單

import { loginAs } from '../flows/loginFlow';

describe('重新錄製', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

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
