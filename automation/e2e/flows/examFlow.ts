// Exam session navigation helpers
// Selector 來源：Playwright debug screenshots (2026-06-13)
//
// 正確導航路徑（2026-06-17 修正版）：
//   createChild(36) → { name, id }
//   → cy.visit(`/{id}/developmental`) → 直接到目標孩童頁，跳過 frontdesk 重導問題
//   → 新孩童：click "開始檢測"；進行中孩童：click "繼續檢測" → /question?step=overview
//   → cy.contains('button', '開始檢測').click() → 開始答題
//
// 限制：「等待下次檢測時間」狀態（已完成測驗且尚未到下次日期）無法進入測驗。
//
// quizattempts API（2026-06-17 Playwright MCP 確認）：
//   新孩童（尚未檢測）：POST /cskapi/api/child/{id}/quizattempts/start
//   進行中孩童：       POST /cskapi/api/child/{id}/quizattempts/resume/{quizId}
//   兩者 response 結構相同：
//   Response: {
//     data: {
//       quizId: string,
//       category: "ai" | "observation",
//       currentQuestion: { attemptId, id, type, question, ttsText, answerContents, images },
//       statistics: string[]
//     }
//   }
//   ⚠️ navigateToStep 必須同時攔截 start 和 resume，否則新孩童測試失敗
//
// resolveNextStep 邏輯（從 JS bundle 確認，2026-06-17）：
//   if (category === 'observation') → step = 'choice'
//   if (category === 'ai') → step = hv(currentQuestion.type)
//
// 完整 type 對照（2026-06-17 JS bundle + SIT 實測確認）：
//   category='observation', type=任意       → choice
//   category='ai',          type='GM01_01'  → walk-fb
//   category='ai',          type='GM01_02'  → walk-side
//   category='ai',          type='GM01_03'  → supine
//   category='ai',          type='FM02_01'  → graphic-copying-video
//   category='ai',          type='FM02_02'  → graphic-copying-photo
//   category='ai',          type='SE03_LE04' → picture-naming

import type { Child } from './childFlow';

/** 導航至目標孩童的 developmental 頁面（直接用 childId，跳過 frontdesk 重導）。
 *  新孩童顯示「開始檢測」，進行中孩童顯示「繼續檢測」，兩者都導向 /question?step=overview。 */
export function navigateToExamOverview(child: Child) {
  cy.visit(`/${child.id}/developmental`);
  cy.url().should('include', `/developmental`);
  cy.get('body').then(($body) => {
    if ($body.find('button:contains("繼續檢測")').length) {
      cy.contains('button', '繼續檢測').click();
    } else {
      cy.contains('button', '開始檢測').last().click();
    }
  });
  cy.url().should('include', '/question');
}

/** 導航至測驗總覽並點「開始檢測」進入答題流程（會異動個案測驗狀態）。
 *  適用於新孩童（開始檢測）與進行中孩童（繼續檢測）。 */
export function startExamFor(childName: string) {
  cy.visit('/frontdesk');
  cy.contains(childName).click();
  cy.url().should('match', /\/\d+(\/developmental)?$/);
  cy.get('body').then(($body) => {
    if ($body.find('button:contains("繼續檢測")').length) {
      cy.contains('button', '繼續檢測').click();
    } else {
      cy.contains('button', '開始檢測').last().click();
    }
  });
  cy.url().should('include', '/question');
  cy.contains('button', '開始檢測').click();
  cy.url().should('not.include', 'overview');
}

/**
 * 透過 cy.intercept stub start/resume API，強制 Vue Router 導向指定 step。
 *
 * 用途：解決 SIT 環境 cy.visit('/question?step=XXX') 直連被重導問題。
 * 原理：Vue Router 在 overview 點擊「開始檢測」後呼叫
 *   POST /cskapi/api/child/{id}/quizattempts/start（新孩童）或
 *   POST /cskapi/api/child/{id}/quizattempts/resume/{quizId}（進行中孩童），
 *   根據 response 的 currentQuestion.type 決定 step URL。
 *   stub 此 API 讓 type = targetType，Router 就會導向 targetStep。
 *
 * 參數：
 *   child      — createChild() 回傳的 Child 物件 { name, id }
 *   targetStep — 目標 step URL 片段，如 'choice'、'picture-naming'
 *   targetCategory — 'ai' 或 'observation'
 *   targetType — 對應 currentQuestion.type（observation 可省略）
 */
export function navigateToStep(child: Child, targetStep: string, targetCategory: string, targetType: string = '') {
  // 新孩童呼叫 /start；進行中孩童呼叫 /resume。兩者 response 結構相同，需同時攔截。
  const stubFn = (req: any) => {
    req.continue((res: any) => {
      if (res.body?.data) {
        res.body.data.category = targetCategory;
        if (targetType && res.body.data.currentQuestion) {
          res.body.data.currentQuestion.type = targetType;
        }
      }
    });
  };
  cy.intercept('POST', '**/quizattempts/start', stubFn).as('startStub');
  cy.intercept('POST', '**/quizattempts/resume/**', stubFn).as('resumeStub');

  navigateToExamOverview(child);
  cy.contains('button', '開始檢測').click();
  cy.url({ timeout: 10000 }).should('include', `step=${targetStep}`);
}
