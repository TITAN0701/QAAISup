// [DRAFT] Needs QA + Engineer review before use in CI.
// Feature: 圖卡配對
// TC-CARDMATCH-001 ~ TC-CARDMATCH-003: cy.intercept() 攔截 quiz attempt API 驗證 step 出現與否
// TC-CARDMATCH-004 ~ TC-CARDMATCH-005: it.skip() — 需 picture-pairing 頁面 DOM snapshot
//
// 已確認（2026-06-15 bundle 分析）：
//   - 圖卡配對 step code：picture-pairing（/question?step=picture-pairing）
//   - quiz API pattern：/cskapi/api/child/*/quizattempts/**
//
// [SDET TODO] TC-001~003：確認 quiz API response 中 steps 陣列的實際欄位名稱
//   可用 cy.log() 印出 res.body 查看格式，或問後端確認
// [SDET TODO] TC-004~005：對 /question?step=picture-pairing 頁面執行 Playwright snapshot，
//   取得圖卡選項、回饋元素的真實 selector 後補齊
// [SDET TODO] cases.json 的 case_4m / case_6m / case_8m id 需填入真實 childId，
//   或由 beforeEach 呼叫 API 建立測試用孩童

import { loginAs } from '../flows/loginFlow';

// 攔截 quiz attempt 相關 API 並存入 alias
const interceptQuiz = (alias: string) => {
  cy.intercept('GET', '**/cskapi/api/child/*/quizattempts/**').as(alias);
  cy.intercept('POST', '**/cskapi/api/child/*/quizattempts/**').as(`${alias}Post`);
};

describe('圖卡配對', () => {
  beforeEach(() => {
    loginAs('regular_user');
  });

  // ── 年齡層分流驗證（TC-001 ~ TC-003） ──────────────────────────────────

  it.skip('TC-CARDMATCH-001 4M 個案測驗中不顯示圖卡配對題目', () => {
    // [SDET TODO] 填入 4M 個案的 childId（cases.json case_4m.id）
    // [SDET TODO] 確認 quiz API response 中 steps 欄位格式（陣列?字串?）
    const childId = Cypress.env('CASE_4M_CHILD_ID'); // 從 env 或 fixture 讀取

    interceptQuiz('quizConfig');
    cy.visit(`/${Cypress.env('USER_ID')}/developmental`);

    // 開始測驗
    cy.contains('button', '發展檢測').click();
    cy.contains('button', '開始檢測').click();

    cy.wait('@quizConfigPost').then(({ response }) => {
      const body = JSON.stringify(response?.body ?? '');
      // picture-pairing 不應出現在 4M 個案的 quiz 設定中
      expect(body).not.to.include('picture-pairing');
    });

    // 額外驗證：直接 navigate 到 picture-pairing 應被導走
    cy.visit('/question?step=picture-pairing');
    cy.url().should('not.include', 'step=picture-pairing');
  });

  it.skip('TC-CARDMATCH-002 6M 個案測驗中不顯示圖卡配對題目', () => {
    // [SDET TODO] 填入 6M 個案的 childId（cases.json case_6m.id）
    interceptQuiz('quizConfig6m');

    cy.visit(`/${Cypress.env('USER_ID')}/developmental`);
    cy.contains('button', '發展檢測').click();
    cy.contains('button', '開始檢測').click();

    cy.wait('@quizConfig6mPost').then(({ response }) => {
      const body = JSON.stringify(response?.body ?? '');
      expect(body).not.to.include('picture-pairing');
    });

    cy.visit('/question?step=picture-pairing');
    cy.url().should('not.include', 'step=picture-pairing');
  });

  it.skip('TC-CARDMATCH-003 8M 個案測驗中可正常顯示圖卡配對題目', () => {
    // [SDET TODO] 填入 8M 個案的 childId（cases.json case_8m.id）
    interceptQuiz('quizConfig8m');

    cy.visit(`/${Cypress.env('USER_ID')}/developmental`);
    cy.contains('button', '發展檢測').click();
    cy.contains('button', '開始檢測').click();

    cy.wait('@quizConfig8mPost').then(({ response }) => {
      const body = JSON.stringify(response?.body ?? '');
      // picture-pairing 應出現在 8M 個案的 quiz 設定中
      expect(body).to.include('picture-pairing');
    });

    // 額外驗證：navigate 到 picture-pairing 應停在該頁面
    cy.visit('/question?step=picture-pairing');
    cy.url().should('include', 'step=picture-pairing');
    // 頁面應有圖卡選項（不需啟動相機）
    cy.contains('圖卡').should('exist');
  });

  // ── 圖卡互動驗證（TC-004 ~ TC-005）需 DOM snapshot ─────────────────────

  it.skip('TC-CARDMATCH-004 圖卡配對題中點擊彩色圖案即算配對成功（無需拖拉）', () => {
    // [SDET TODO] 需對 /question?step=picture-pairing 執行 Playwright snapshot
    // 確認：圖卡選項的 selector（按鈕文字? class? img alt?）
    // 確認：作答結果的 selector 或 API response
    cy.visit('/question?step=picture-pairing');
    cy.url().should('include', 'step=picture-pairing');

    // [SDET TODO] 替換為從 snapshot 確認的真實 selector
    // 暫時以 cy.contains 定位第一個可點擊的圖卡選項
    cy.contains('button', '下一題').should('be.disabled');
    // [SDET TODO] cy.get('正確圖卡 selector').click();
    // [SDET TODO] cy.contains('button', '下一題').should('not.be.disabled');
  });

  it.skip('TC-CARDMATCH-005 圖卡配對點擊正確圖案後顯示正向回饋並進入下一題', () => {
    // [SDET TODO] 需對 /question?step=picture-pairing 執行 Playwright snapshot
    // 確認：正向回饋元素的文字或 class
    // 確認：題目切換的偵測方式（URL 不變，靠標題或題號文字判斷）
    cy.visit('/question?step=picture-pairing');
    cy.url().should('include', 'step=picture-pairing');

    // [SDET TODO] 取得目前題號或圖卡標題作為基準
    // [SDET TODO] cy.get('正確圖卡 selector').click();
    // [SDET TODO] cy.contains('正向回饋文字').should('be.visible');
    // [SDET TODO] 驗證已進入下一題（標題或題號改變）
  });
});
