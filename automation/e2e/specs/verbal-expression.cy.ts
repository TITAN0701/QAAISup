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
// [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — picture-naming URL 及 UI 元素已於前次 session 確認
//   存在：口語表達標題、開始錄製按鈕、圖片編號（01/01）、倒數計時器
// TC-VERBAL-001,002 it.skip 保留原因：
//   1. cy.visit('/question?step=picture-naming') 直連被 SIT 重導，Cypress 無法到達
//   2. 60 秒計時器驗證需 cy.clock() + cy.tick()，Playwright MCP 無法替代
//   3. 開始錄製需 mediaDevices（automation_candidate: false 部分）
//
// 2026-06-17 解鎖路徑（JS bundle 確認）：
//   直連問題可用 navigateToStep(childName, 'picture-naming', 'ai', 'SE03_LE04') 解決。
//   resolveNextStep 邏輯：category='ai' + currentQuestion.type='SE03_LE04' → hv('SE03_LE04') → 'picture-naming'。
//   呼叫：navigateToStep(freshChild, 'picture-naming', 'ai', 'SE03_LE04')
//   計時器格式（00:60 vs 01:00）仍需確認。

import { loginAs } from '../flows/loginFlow';
import { navigateToStep } from '../flows/examFlow';
import { createChild } from '../flows/childFlow';

describe('口語表達', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  // [VERIFIED BY PLAYWRIGHT MCP] 2026-06-15 — picture-naming 功能入口存在，UI 元素已確認
  // 計時器正數計時（showCountdown:false，bundle 確認），初始 00:00，60秒後 01:00
  // 2026-06-17 解鎖：navigateToStep category='ai' + type='SE03_LE04' → picture-naming
  // [BLOCKED 2026-06-17] SIT 環境「開始錄製」觸發 API 回 500，頁面無法進入錄製狀態
  // 新建孩童在 picture-naming 步驟點「開始錄製」→ quizattempts API 500 → 頁面不跳轉
  // 同樣問題見 TC-QCONTENT-002（observation/submit 500）
  // 需 SIT API 正常或使用已有固定個案才能驗證 60 秒計時行為
  it.skip('TC-VERBAL-001 口語表達每張圖片各自獨立計時 60 秒，切換圖片後重置', () => {
    createChild(48).then((child) => {
      navigateToStep(child, 'picture-naming', 'ai', 'SE03_LE04');
      cy.contains('口語表達').should('be.visible');
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("了解！繼續")').length) {
          cy.contains('button', '了解！繼續').click();
        }
      });
      cy.contains('button', '開始錄製').should('be.visible');
      cy.clock();
      cy.contains('button', '開始錄製').click();
      cy.get('body').should('contain', '01/');
      cy.contains('00:00').should('be.visible');
      cy.tick(60000);
      cy.contains('01:00').should('be.visible');
      cy.get('body').should('contain', '02/');
      cy.screenshot('TC-VERBAL-001-result');
    });
  });

  // [BLOCKED 2026-06-17] 同 TC-VERBAL-001，SIT API 500 阻塞錄製啟動
  it.skip('TC-VERBAL-002 第一張圖 60 秒計時結束後自動進入第二張圖並重新計時', () => {
    createChild(48).then((child) => {
      navigateToStep(child, 'picture-naming', 'ai', 'SE03_LE04');
      cy.contains('口語表達').should('be.visible');
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("了解！繼續")').length) {
          cy.contains('button', '了解！繼續').click();
        }
      });
      cy.contains('button', '開始錄製').should('be.visible');
      cy.clock();
      cy.contains('button', '開始錄製').click();
      cy.get('body').should('contain', '01/');
      cy.tick(60000);
      cy.get('body').should('contain', '02/');
      cy.contains('00:00').should('be.visible');
      cy.screenshot('TC-VERBAL-002-result');
    });
  });
});
