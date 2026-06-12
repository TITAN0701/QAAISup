/**
 * auth-sheets.js
 * 授權 Google Sheets + Drive 寫入權限
 */

const { google } = require('googleapis');
const fs = require('fs');
const http = require('http');
const url = require('url');

const CREDENTIALS_PATH = 'C:\\Users\\suppo\\Desktop\\QAAI專案\\.claude\\google-credentials.json';
const TOKEN_PATH = 'C:\\Users\\suppo\\Desktop\\QAAI專案\\.claude\\sheets-token.json';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
];

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_id, client_secret } = credentials.web || credentials.installed;

const REDIRECT_URI = 'http://localhost:3000';
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n請在瀏覽器開啟以下網址授權：\n');
console.log(authUrl);
console.log('\n等待授權回調（localhost:3000）...\n');

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const code = parsed.query.code;
  if (code) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h2>✅ 授權成功！可以關閉此視窗。</h2>');
      console.log('✅ Token 已儲存至:', TOKEN_PATH);
      console.log('✅ Scopes:', tokens.scope);
      server.close();
      process.exit(0);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h2>❌ 授權失敗：' + err.message + '</h2>');
      console.error('❌ 授權失敗:', err.message);
      server.close();
      process.exit(1);
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('等待授權...');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('本機伺服器已啟動於 http://localhost:3000');
});
