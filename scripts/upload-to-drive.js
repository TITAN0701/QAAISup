/**
 * upload-to-drive.js
 * 產出帶日期的 QA Report .xlsx，上傳至 Google Drive
 * 資料夾：我的雲端硬碟 > WETPAINT > AI Suport文件
 * 執行：node scripts/upload-to-drive.js
 */

const { google } = require('googleapis');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT     = path.resolve(__dirname, '..');
const CREDENTIALS_PATH = path.join(PROJECT_ROOT, '.claude', 'google-credentials.json');
const TOKEN_PATH       = path.join(PROJECT_ROOT, '.claude', 'sheets-token.json');
const TC_DIR           = path.join(PROJECT_ROOT, 'qa-workspace', 'specs');
const ARTIFACTS_QA     = path.join(PROJECT_ROOT, 'artifacts', 'generated', 'qa');
const ARTIFACTS_PM     = path.join(PROJECT_ROOT, 'artifacts', 'generated', 'pm');
const OUTPUT_DIR       = path.join(PROJECT_ROOT, 'artifacts', 'generated', 'qa');

// Google Drive 資料夾名稱路徑（從 My Drive 開始）
const DRIVE_FOLDER_PATH = ['WETPAINT', 'AI Suport文件'];

function getAuth() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret } = credentials.web || credentials.installed;
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
  oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
  return oauth2Client;
}

// 依資料夾名稱路徑找到 Drive 資料夾 ID
async function findFolderId(drive, folderNames) {
  let parentId = 'root';
  for (const name of folderNames) {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
    });
    if (!res.data.files || res.data.files.length === 0) {
      throw new Error(`找不到 Drive 資料夾：${name}（父層 ID：${parentId}）`);
    }
    parentId = res.data.files[0].id;
  }
  return parentId;
}

// ── 載入 Test Cases ──
function loadTestCases() {
  const rows = [];
  if (!fs.existsSync(TC_DIR)) return rows;
  for (const feature of fs.readdirSync(TC_DIR)) {
    const tcFile = path.join(TC_DIR, feature, 'test-cases.json');
    if (!fs.existsSync(tcFile)) continue;
    let data;
    try { data = JSON.parse(fs.readFileSync(tcFile, 'utf8')); } catch { continue; }
    for (const tc of (data.test_cases || [])) {
      const auto = tc.automation_candidate === true ? '✅'
        : tc.automation_candidate === false ? '❌' : '⚠️';
      const note = tc.automation_candidate === false ? (tc.notes || '無法自動化') : (tc.notes || '');
      rows.push([data.feature || feature, tc.id || '', tc.title || '',
        tc.priority || '', tc.type || '', auto, note]);
    }
  }
  return rows;
}

// ── 載入 Scenarios ──
function loadScenarios() {
  const rows = [];
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
      const givenMatch = block.match(/[-*]\s*\*\*Given\*\*:\s*([^\n]+)/);
      const whenMatch  = block.match(/[-*]\s*\*\*When\*\*:\s*([^\n]+)/);
      const thenMatch  = block.match(/[-*]\s*\*\*Then\*\*:\s*([^\n]+)/);
      const oldDescMatch = block.match(/[-*]\s*Source acceptance:\s*([^\n]+)/);
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
      const typeMatch   = block.match(/[-*]\s*\*{0,2}Type\*{0,2}:\s*([^\n]+)/);
      const prioMatch   = block.match(/[-*]\s*\*{0,2}Priority\*{0,2}:\s*([^\n]+)/);
      const autoMatch   = block.match(/[-*]\s*Automation candidate:\s*([^\n]+)/);
      const statusMatch = block.match(/[-*]\s*\*{0,2}Status\*{0,2}:\s*([^\n]+)/);
      const auto = autoMatch ? (autoMatch[1].trim() === 'true' ? '✅' : '❌') : '⚠️';
      rows.push([
        feature, id, desc,
        typeMatch   ? typeMatch[1].trim()   : '',
        prioMatch   ? prioMatch[1].trim()   : '',
        auto,
        statusMatch ? statusMatch[1].trim() : '',
      ]);
    }
  }
  return rows;
}

// ── 載入 Test Report（從 md 解析表格列） ──
function loadTestReport() {
  const rows = [];
  const reportFile = path.join(ARTIFACTS_QA, 'test-report.md');
  if (!fs.existsSync(reportFile)) return rows;
  const content = fs.readFileSync(reportFile, 'utf8');
  const tableRows = content.match(/\| .+ \| .+ \|/g) || [];
  for (const row of tableRows) {
    const cols = row.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length >= 2 && !cols[0].startsWith('-')) rows.push(cols);
  }
  return rows;
}

// ── 載入 Release Summary（從 md 解析表格列） ──
function loadReleaseSummary() {
  const rows = [];
  const file = path.join(ARTIFACTS_PM, 'release-summary.md');
  if (!fs.existsSync(file)) return rows;
  const content = fs.readFileSync(file, 'utf8');
  const tableRows = content.match(/\| .+ \| .+ \|/g) || [];
  for (const row of tableRows) {
    const cols = row.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length >= 2 && !cols[0].startsWith('-')) rows.push(cols);
  }
  return rows;
}

// ── 建立 xlsx ──
async function buildXlsx(outputPath) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'QAAI';
  wb.created = new Date();

  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } },
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: { bottom: { style: 'thin' } },
  };

  function addSheet(name, headers, rows) {
    const ws = wb.addWorksheet(name);
    const headerRow = ws.addRow(headers);
    headerRow.eachCell(cell => Object.assign(cell, headerStyle));
    ws.getRow(1).height = 22;
    for (const row of rows) ws.addRow(row);
    // 自動欄寬
    ws.columns.forEach((col, i) => {
      const maxLen = Math.max(
        (headers[i] || '').length,
        ...rows.map(r => String(r[i] || '').length)
      );
      col.width = Math.min(Math.max(maxLen + 2, 10), 60);
    });
    return ws;
  }

  // Sheet 1：Test Cases
  const tcRows = loadTestCases();
  addSheet('Test Cases', ['Feature', 'TC ID', '標題', '優先度', '類型', '自動化', '備註'], tcRows);

  // Sheet 2：Scenarios
  const scRows = loadScenarios();
  addSheet('Scenarios', ['Feature', 'SC ID', '情境描述', '類型', '優先度', '自動化', '狀態'], scRows);

  // Sheet 3：Test Report
  const reportRows = loadTestReport();
  if (reportRows.length > 0) {
    const reportHeaders = reportRows[0];
    addSheet('Test Report', reportHeaders, reportRows.slice(1));
  }

  // Sheet 3：Release Summary
  const summaryRows = loadReleaseSummary();
  if (summaryRows.length > 0) {
    const summaryHeaders = summaryRows[0];
    addSheet('Release Summary', summaryHeaders, summaryRows.slice(1));
  }

  await wb.xlsx.writeFile(outputPath);
}

// ── 上傳至 Drive ──
async function uploadToDrive(drive, folderId, filePath, fileName) {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    media: {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: fs.createReadStream(filePath),
    },
    fields: 'id, name, webViewLink',
  });
  return res.data;
}

// ── 主流程 ──
async function main() {
  if (!fs.existsSync(CREDENTIALS_PATH) || !fs.existsSync(TOKEN_PATH)) {
    console.log('⏭️  Google Drive 上傳跳過（憑證未設定，僅公司環境可用）');
    console.log('   缺少檔案：', !fs.existsSync(CREDENTIALS_PATH) ? CREDENTIALS_PATH : TOKEN_PATH);
    return;
  }
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `${dateStr}-qa-report.xlsx`;
  const outputPath = path.join(OUTPUT_DIR, fileName);

  console.log('📊 產出 xlsx...');
  await buildXlsx(outputPath);
  console.log(`✅ 已產出：${outputPath}`);

  console.log('☁️  連線 Google Drive...');
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const folderId = await findFolderId(drive, DRIVE_FOLDER_PATH);
  console.log(`✅ 找到資料夾：${DRIVE_FOLDER_PATH.join(' > ')} (${folderId})`);

  console.log(`📤 上傳 ${fileName}...`);
  const file = await uploadToDrive(drive, folderId, outputPath, fileName);
  console.log(`✅ 上傳完成：${file.name}`);
  console.log(`🔗 ${file.webViewLink}`);
}

main().catch(err => {
  if (err.message && err.message.includes('drive.file')) {
    console.error('❌ 權限不足：需要 drive.file scope，請重新執行授權：');
    console.error('   node scripts/auth-sheets.js');
  } else {
    console.error('❌ 失敗：', err.message);
  }
  process.exit(1);
});
