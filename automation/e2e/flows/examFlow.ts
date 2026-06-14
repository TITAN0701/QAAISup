// Exam session navigation helpers
// Selector 來源：Playwright debug screenshots (2026-06-13)
//
// 正確導航路徑：
//   cy.visit('/frontdesk') → 自動重定向 /{childId}/developmental（最後一個孩童）
//   → cy.contains(childName).click() → /{childId}/developmental（目標孩童）
//   → 新孩童：click "開始檢測"；進行中孩童：click "繼續檢測" → /question?step=overview
//   → cy.contains('button', '開始檢測').click() → 開始答題
//
// 限制：「等待下次檢測時間」狀態（已完成測驗且尚未到下次日期）無法進入測驗。

/** 導航至測驗總覽頁，但不開始測驗。
 *  新孩童顯示「開始檢測」，進行中孩童顯示「繼續檢測」，兩者都導向 /question?step=overview。 */
export function navigateToExamOverview(childName: string) {
  cy.visit('/frontdesk');
  cy.contains(childName).click();
  cy.url().should('include', '/developmental');
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
  navigateToExamOverview(childName);
  cy.contains('button', '開始檢測').click();
  cy.url().should('not.include', 'overview');
}
