const { google } = require('googleapis');
const fs = require('fs');
const http = require('http');
const url = require('url');

const CREDENTIALS_PATH = 'C:\\Users\\suppo\\Desktop\\QAAI專案\\.claude\\google-credentials.json';
const TOKEN_PATH = 'C:\\Users\\suppo\\Desktop\\QAAI專案\\.claude\\sheets-token.json';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.readonly',
];

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_id, client_secret, redirect_uris } = credentials.installed;

const oauth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3000');

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('請在瀏覽器開啟以下網址授權：\n');
console.log(authUrl);
console.log('\n等待授權回調...');

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname === '/') {
    const code = parsed.query.code;
    if (code) {
      try {
        const { tokens } = await oauth2Client.getToken(code);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
        res.end('<h2>授權成功！可以關閉此視窗。</h2>');
        console.log('\n✅ Token 已儲存至:', TOKEN_PATH);
        server.close();
      } catch (err) {
        res.end('<h2>授權失敗：' + err.message + '</h2>');
        console.error('授權失敗:', err);
        server.close();
      }
    }
  }
});

server.listen(3000, () => {
  console.log('本機伺服器已啟動於 http://localhost:3000');
});
