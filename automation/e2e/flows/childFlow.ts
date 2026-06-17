// childFlow.ts
// 每次測試前建立全新孩童資料，確保測驗狀態乾淨可用。
//
// 使用方式：
//   const child = createChild(36);
//   navigateToStep(child, 'walk-fb', 'ai', 'GM01_01');
//
// 實作：使用 cy.request() 直接呼叫 API（/cskapi/api/child），
//   不透過 UI，繞過 Reka UI 下拉選單互動問題。
//   cy.request() 自動帶入瀏覽器 session cookie（需先呼叫 loginAs）。
//
// 回傳：Cypress.Chainable<{ name: string; id: number }>
//   呼叫端用 .then(child => navigateToStep(child, ...)) 才能拿到 id。
//   直接傳 child 物件給 navigateToStep 即可（TypeScript 允許 Chainable 型別）。
//
// API 限制：
//   - fullName 只允許中文、英文字母與數字（不可有連字號）
//   - birthDate 需為 2 個月以上、6 歲以下
//   - 城市/區域：臺北市南港區 (homeCity.code="63", homeDist.code="6309")

export interface Child {
  name: string;
  id: number;
}

function birthdayForAge(ageMonths: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - ageMonths);
  d.setDate(d.getDate() - 3); // 往前 3 天確保月齡計算不在邊界
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function fakeNationalId(): string {
  // 台灣身分證驗證算法：letter → 2碼 + 1碼性別 + 7碼隨機 + 1碼 checksum
  const letterMap: Record<string, number> = {
    A:10,B:11,C:12,D:13,E:14,F:15,G:16,H:17,I:34,
    J:18,K:19,L:20,M:21,N:22,O:35,P:23,Q:24,R:25,
    S:26,T:27,U:28,V:29,W:32,X:30,Y:31,Z:33
  };
  const letters = Object.keys(letterMap);
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const code = letterMap[letter];
  const d: number[] = [Math.floor(code / 10), code % 10, 1]; // d[2]=1 男性
  for (let i = 0; i < 7; i++) d.push(Math.floor(Math.random() * 10));
  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const sum = d.slice(0, 10).reduce((s, v, i) => s + v * weights[i], 0);
  const check = (10 - (sum % 10)) % 10;
  return `${letter}${d.slice(2).join('')}${check}`;
}

/**
 * 建立全新孩童資料（直接呼叫 POST /cskapi/api/child）。
 * 回傳 Cypress.Chainable<Child>，需用 .then(child => ...) 或直接傳給支援 Chainable 的函式。
 * 呼叫前需已登入（loginAs 在 beforeEach 中執行）。
 */
export function createChild(ageMonths: number): Cypress.Chainable<Child> {
  const childName = `qa${ageMonths}m${Date.now()}`;
  const nationalId = fakeNationalId();
  const birthday = birthdayForAge(ageMonths);

  return cy.window().then((win) => {
    const token = win.sessionStorage.getItem('token');
    return cy.request({
      method: 'POST',
      url: '/cskapi/api/child',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        nationalId,
        fullName: childName,
        gender: 'Male',
        birthDate: birthday,
        homeCity: { code: '63', name: '' },
        homeDist: { code: '6309', name: '' },
        liveCity: { code: '63', name: '' },
        liveDist: { code: '6309', name: '' },
        isFullTerm: true,
        weightCategory: 1,
        isIndigenous: false,
      },
      failOnStatusCode: true,
    }).then((resp) => {
      const id = resp.body?.data?.id as number;
      return { name: childName, id };
    });
  });
}
