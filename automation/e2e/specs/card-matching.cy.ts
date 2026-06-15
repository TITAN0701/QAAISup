// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 圖卡配對 (picture-pairing)
//
// 2026-06-15 Playwright MCP 實測結果：
//   - picture-pairing intro 頁確認（教學頁 selector 已知）
//   - picture-pairing 只在 42-48M 個案出現（36M 以下跳過）
//   - Quiz API 不回傳 step codes，resume 回傳 currentQuestion.type
//   - 年齡分流驗證最可靠方式：導航到 /question?step=picture-pairing 後看 URL 是否維持
//
// [SDET TODO] TC-001~003：需為各年齡層建立/找到測試用個案 childId 並填入 cases.json
//   - 確認「不含 picture-pairing 的個案月齡上限」（實測 36M 不含，42M+ 含）
//   - 需開始測驗（呼叫 resume API 載入 quiz store）後再 navigate 才能正確判斷
// [SDET TODO] TC-004~005：需 42-48M 個案走完 overview→...→picture-pairing 到達
//   實際圖卡題目（intro 頁按「開始作答」需 store 有 picture-pairing question type）
//   snapshot 已在 artifacts/raw/screenshots/snapshots/snapshot-step-picture-pairing.yml

import { loginAs } from '../flows/loginFlow';

describe('圖卡配對', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  // ── 年齡層分流驗證（TC-001 ~ TC-003） ──────────────────────────────────
  // 驗證方式：開始測驗後用 Vue Router 跳到 picture-pairing，
  //   URL 維持 = 此年齡層有此模組；URL 被導走 = 沒有此模組

  it.skip('TC-CARDMATCH-001 4M 個案測驗中不含圖卡配對模組', () => {
    // [SDET TODO] 填入 4M 個案 childId + 完成 overview 點「開始檢測」載入 quiz store
    // [SDET TODO] 確認最低不含 picture-pairing 的月齡（實測 36M 不含）
    cy.visit('/555/developmental'); // 替換為正確的 userId
    cy.contains('button', '繼續檢測, 開始檢測').click(); // 觸發 resume API
    cy.url().should('include', 'step=overview');
    cy.contains('button', '開始檢測').click();

    // 在 Vue Router client-side navigate（不觸發 page reload，保留 quiz store）
    cy.window().then(win => {
      const router = (win as any).__vue_app__?.config.globalProperties.$router;
      if (router) router.push('/question?step=picture-pairing');
    });

    // 若 4M 個案不含 picture-pairing，系統應導回當前 step
    cy.url().should('not.include', 'step=picture-pairing');
  });

  it.skip('TC-CARDMATCH-002 6M 個案測驗中不含圖卡配對模組', () => {
    // [SDET TODO] 填入 6M 個案 childId（同 TC-001 邏輯）
    cy.visit('/555/developmental');
    cy.contains('button', /繼續檢測|開始檢測/).click();
    cy.url().should('include', 'step=overview');
    cy.contains('button', '開始檢測').click();

    cy.window().then(win => {
      const router = (win as any).__vue_app__?.config.globalProperties.$router;
      if (router) router.push('/question?step=picture-pairing');
    });
    cy.url().should('not.include', 'step=picture-pairing');
  });

  it.skip('TC-CARDMATCH-003 42M+ 個案測驗中可進入圖卡配對教學頁', () => {
    // [SDET TODO] 填入 42M+ 個案 childId（確認月齡 ≥ 42M，實測 48M 含此模組）
    // [SDET TODO] 注意：36M 個案實測不含（2026-06-15 確認），月齡門檻約 42M
    cy.visit('/555/developmental');
    cy.contains('button', /繼續檢測|開始檢測/).click();
    cy.url().should('include', 'step=overview');
    cy.contains('button', '開始檢測').click();

    cy.window().then(win => {
      const router = (win as any).__vue_app__?.config.globalProperties.$router;
      if (router) router.push('/question?step=picture-pairing');
    });

    // 42M+ 個案應停在 picture-pairing，顯示教學頁
    cy.url().should('include', 'step=picture-pairing');
    cy.contains('h2', '圖卡配對').should('be.visible');
    cy.contains('測驗教學').should('be.visible');
    cy.contains('請幫孩子點選語音按鈕播放題目，讓孩子自己操作即可。').should('be.visible');
    cy.contains('button', '開始作答').should('be.visible');
  });

  // ── 圖卡互動驗證（TC-004 ~ TC-005）需正常流程到達圖卡題目 ──────────────

  it.skip('TC-CARDMATCH-004 圖卡配對題中點擊彩色圖案即算配對成功（無需拖拉）', () => {
    // [SDET TODO] 需 42-48M 個案透過正常流程走到 picture-pairing（不可用 router.push 跳過）
    //   原因：「開始作答」需要 Pinia store 的 currentQuestionData.type = picture-pairing type
    //   只有透過 ai/complete API 回傳 picture-pairing 題目時才會自動更新 store
    //   router.push 只改 URL，不更新 store，所以 intro 頁的「開始作答」按鈕無效
    // [SDET TODO] 找到圖卡選項 selector（需到達圖卡題目後截圖，確認 button 文字或 img alt）
    // [SDET TODO] 確認「點擊」vs「拖拉」的作答方式（TC 描述為點擊）

    cy.url().should('include', 'step=picture-pairing');
    // [SDET TODO] cy.contains('button', '開始作答').click();
    // [SDET TODO] cy.get('圖卡選項 selector').click();
    // [SDET TODO] cy.contains('button', '下一題').should('not.be.disabled');
  });

  it.skip('TC-CARDMATCH-005 圖卡配對點擊正確圖案後顯示正向回饋並進入下一題', () => {
    // [SDET TODO] 同 TC-004 前置條件
    // [SDET TODO] 確認正向回饋文字（可能為 toast 或畫面文字，截圖後確認）
    // [SDET TODO] 確認換題判斷方式（題號文字或圖卡內容改變）

    cy.url().should('include', 'step=picture-pairing');
    // [SDET TODO] cy.contains('button', '開始作答').click();
    // [SDET TODO] cy.get('正確圖卡 selector').click();
    // [SDET TODO] cy.contains('正向回饋文字').should('be.visible');
    // [SDET TODO] 確認進入下一題
  });
});
