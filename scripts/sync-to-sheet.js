try { require('dotenv').config(); } catch {}

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TOKEN_PATH = path.join(PROJECT_ROOT, '.claude', 'sheets-token.json');
const CREDENTIALS_PATH = path.join(PROJECT_ROOT, '.claude', 'google-credentials.json');
const SPREADSHEET_ID = '1-EO-84MVnU7zyBoCJUcJvNJpPYYYCzmRldCwDvEcO1Q';
const TC_DIR = path.join(PROJECT_ROOT, 'qa-workspace', 'specs');
const ARTIFACTS_QA = path.join(PROJECT_ROOT, 'artifacts', 'generated', 'qa');

function loadCredentials() {
  if (process.env.GOOGLE_CREDENTIALS_JSON) return JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
  if (fs.existsSync(CREDENTIALS_PATH)) return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  throw new Error('缺少 credentials。請設定 GOOGLE_CREDENTIALS_JSON 或將憑證存至 .claude/google-credentials.json');
}

function loadToken() {
  if (process.env.GOOGLE_SHEETS_TOKEN) return JSON.parse(process.env.GOOGLE_SHEETS_TOKEN);
  if (fs.existsSync(TOKEN_PATH)) return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  throw new Error('缺少 token。請執行 node scripts/auth-sheets.js 完成授權，或設定 GOOGLE_SHEETS_TOKEN 環境變數');
}

function getAuth() {
  const credentials = loadCredentials();
  const { client_id, client_secret } = credentials.web || credentials.installed;
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3000');
  oauth2Client.setCredentials(loadToken());
  return oauth2Client;
}

// ── 確保分頁存在，回傳 sheetId ──
async function ensureSheet(sheets, title) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existing = meta.data.sheets.find(s => s.properties.title === title);
  if (existing) return existing.properties.sheetId;
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests: [{ addSheet: { properties: { title } } }] },
  });
  return res.data.replies[0].addSheet.properties.sheetId;
}

// ── 清除並寫入 ──
async function writeSheet(sheets, sheetName, rows) {
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1:Z10000`,
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });
}

// ── 1. Test Cases ──
function loadTestCases() {
  const rows = [['Feature', 'TC ID', '標題', '優先度', '類型', '自動化', '最後更新']];
  if (!fs.existsSync(TC_DIR)) return rows;
  for (const feature of fs.readdirSync(TC_DIR)) {
    const tcFile = path.join(TC_DIR, feature, 'test-cases.json');
    if (!fs.existsSync(tcFile)) continue;
    let data;
    try { data = JSON.parse(fs.readFileSync(tcFile, 'utf8')); } catch { continue; }
    for (const tc of (data.test_cases || [])) {
      const auto = tc.automation_candidate === true ? '✅'
        : tc.automation_candidate === false ? '❌' : '⚠️';
      rows.push([data.feature || feature, tc.id || '', tc.title || '',
        tc.priority || '', tc.type || '', auto,
        new Date().toISOString().slice(0, 10)]);
    }
  }
  return rows;
}

// ── 2. Scenarios ──
function loadScenarios() {
  const rows = [['Feature', 'SC ID', '情境描述', '類型', '優先度', '自動化', '狀態']];
  if (!fs.existsSync(TC_DIR)) return rows;
  for (const feature of fs.readdirSync(TC_DIR)) {
    const scFile = path.join(TC_DIR, feature, 'scenarios.md');
    if (!fs.existsSync(scFile)) continue;
    const content = fs.readFileSync(scFile, 'utf8');
    const blocks = content.split(/(?=### SC-)/);
    for (const block of blocks) {
      const idMatch = block.match(/### (SC-[A-Z0-9-]+)(?::\s*([^\n]+))?/);
      if (!idMatch) continue;
      const id = idMatch[1].trim();
      const titleFromId = idMatch[2] ? idMatch[2].trim() : '';

      // 舊格式：Source acceptance
      const oldDescMatch = block.match(/[-*]\s*Source acceptance:\s*([^\n]+)/);
      // 新格式：Given/When/Then 拼成一句
      const givenMatch = block.match(/[-*]\s*\*\*Given\*\*:\s*([^\n]+)/);
      const whenMatch  = block.match(/[-*]\s*\*\*When\*\*:\s*([^\n]+)/);
      const thenMatch  = block.match(/[-*]\s*\*\*Then\*\*:\s*([^\n]+)/);

      let desc = '';
      if (oldDescMatch) {
        desc = oldDescMatch[1].trim();
      } else if (givenMatch || whenMatch || thenMatch) {
        const parts = [];
        if (givenMatch) parts.push('Given: ' + givenMatch[1].trim());
        if (whenMatch)  parts.push('When: '  + whenMatch[1].trim());
        if (thenMatch)  parts.push('Then: '  + thenMatch[1].trim());
        desc = parts.join(' / ');
      } else {
        desc = titleFromId;
      }

      // Type：支援 `- Type:` 和 `- **Type**:`
      const typeMatch = block.match(/[-*]\s*\*{0,2}Type\*{0,2}:\s*([^\n]+)/);
      const prioMatch = block.match(/[-*]\s*\*{0,2}Priority\*{0,2}:\s*([^\n]+)/);
      const autoMatch = block.match(/[-*]\s*Automation candidate:\s*([^\n]+)/);
      const statusMatch = block.match(/[-*]\s*\*{0,2}Status\*{0,2}:\s*([^\n]+)/);

      const auto = autoMatch
        ? (autoMatch[1].trim() === 'true' ? '✅' : '❌')
        : '⚠️';

      rows.push([
        feature,
        id,
        desc,
        typeMatch ? typeMatch[1].trim() : '',
        prioMatch ? prioMatch[1].trim() : '',
        auto,
        statusMatch ? statusMatch[1].trim() : '',
      ]);
    }
  }
  return rows;
}

// ── 3. Test Report（摘要表格） ──
function loadTestReport() {
  const rows = [['項目', '數值']];
  const reportFile = path.join(ARTIFACTS_QA, 'test-report.md');
  if (!fs.existsSync(reportFile)) return rows;
  const content = fs.readFileSync(reportFile, 'utf8');
  // 抓所有 markdown 表格列
  const tableRows = content.match(/\| .+ \| .+ \|/g) || [];
  for (const row of tableRows) {
    const cols = row.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length >= 2 && !cols[0].startsWith('-')) {
      rows.push(cols);
    }
  }
  return rows;
}

// ── 4. Risk Notes ──
function loadRiskNotes() {
  const rows = [['Feature', '風險等級', '影響範圍', '建議 Owner', '建議 Release']];
  const riskFile = path.join(ARTIFACTS_QA, 'risk-notes.md');
  if (!fs.existsSync(riskFile)) return rows;
  const content = fs.readFileSync(riskFile, 'utf8');
  const blocks = content.split(/(?=^## )/m).filter(b => b.startsWith('## ') && !b.startsWith('## 整體'));
  for (const block of blocks) {
    const featureMatch = block.match(/^## (.+)/);
    // 支援 **風險等級：HIGH** 和 風險等級：**HIGH** 兩種格式
    const levelMatch = block.match(/\*\*風險等級[：:]([^*\n]+)\*\*/) ||
                       block.match(/風險等級[：:]\s*\*\*([^*]+)\*\*/);
    const impactMatch = block.match(/影響範圍[^：:]*[：:]\**\s*\n([\s\S]*?)(?=\n\*\*|\n---)/);

    // owner/release 去除行首殘留的 ** 前綴
    const ownerMatch = block.match(/建議 Owner[：:]\s*([^\n]+)/);
    const releaseMatch = block.match(/是否建議 Release[：:]\s*([^\n]+)/);
    const cleanStars = s => s ? s.replace(/^\*\*\s*/, '').trim() : '';
    rows.push([
      featureMatch ? featureMatch[1].trim() : '',
      levelMatch ? levelMatch[1].trim() : '',
      impactMatch ? impactMatch[1].trim().replace(/\n/g, ' ') : '',
      ownerMatch ? cleanStars(ownerMatch[1]) : '',
      releaseMatch ? cleanStars(releaseMatch[1]) : '',
    ]);
  }
  return rows;
}

// ── 5. Bug Reports ──
function loadBugReports() {
  const rows = [['Bug ID', '標題', '嚴重程度', '狀態', '影響功能', '日期']];
  const bugsDir = path.join(ARTIFACTS_QA, 'bugs');
  if (!fs.existsSync(bugsDir)) return rows;
  const files = fs.readdirSync(bugsDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const content = fs.readFileSync(path.join(bugsDir, file), 'utf8');
    const idMatch = content.match(/\*\*ID\*\*[：:]\s*(BUG-[^\n]+)/);
    const titleMatch = content.match(/# Bug Report[：:]\s*([^\n]+)/);
    const severityMatch = content.match(/\*\*嚴重程度\*\*[：:]\s*([^\n]+)/);
    const statusMatch = content.match(/\*\*狀態\*\*[：:]\s*([^\n]+)/);
    const impactMatch = content.match(/受影響功能[：:]\s*([^\n]+)/);
    const dateMatch = content.match(/\*\*日期\*\*[：:]\s*([^\n]+)/);
    rows.push([
      idMatch ? idMatch[1].trim() : '',
      titleMatch ? titleMatch[1].trim() : '',
      severityMatch ? severityMatch[1].trim() : '',
      statusMatch ? statusMatch[1].trim() : '',
      impactMatch ? impactMatch[1].trim() : '',
      dateMatch ? dateMatch[1].trim() : '',
    ]);
  }
  return rows;
}

// ── 主流程 ──
async function main() {
  const hasCredentials = process.env.GOOGLE_CREDENTIALS_JSON || fs.existsSync(CREDENTIALS_PATH);
  const hasToken = process.env.GOOGLE_SHEETS_TOKEN || fs.existsSync(TOKEN_PATH);
  if (!hasCredentials) {
    console.log('⏭️  Google Sheets 同步跳過：未設定 GOOGLE_CREDENTIALS_JSON 且找不到 .claude/google-credentials.json');
    return;
  }
  if (!hasToken) {
    console.log('⏭️  Google Sheets 同步跳過：未設定 GOOGLE_SHEETS_TOKEN 且找不到 .claude/sheets-token.json');
    console.log('   請執行：node scripts/auth-sheets.js');
    return;
  }
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const tasks = [
    { name: 'Test Cases',  loader: loadTestCases },
    { name: 'Scenarios',   loader: loadScenarios },
    { name: 'Test Report', loader: loadTestReport },
    { name: 'Risk Notes',  loader: loadRiskNotes },
    { name: 'Bug Reports', loader: loadBugReports },
  ];

  for (const task of tasks) {
    await ensureSheet(sheets, task.name);
    const rows = task.loader();
    await writeSheet(sheets, task.name, rows);
    console.log(`✅ ${task.name}：${rows.length - 1} 筆`);
  }

  console.log(`\n🔗 https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
}

main().catch(err => {
  console.error('❌ 同步失敗：', err.message);
  process.exit(1);
});
