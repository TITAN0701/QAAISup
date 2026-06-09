const { spawnSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

// 自動載入 .env
const envFile = path.join(__dirname, "../.env");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8").split("\n").forEach((line) => {
    const [key, ...rest] = line.trim().split("=");
    if (key && !key.startsWith("#") && rest.length) {
      process.env[key] = rest.join("=");
    }
  });
}

const cypressPackageJson = require.resolve("cypress/package.json");
const cypressBin = path.join(path.dirname(cypressPackageJson), "bin", "cypress");
const args = process.argv.slice(2);
const env = { ...process.env };

// 把 TEST_USER_EMAIL / TEST_USER_PASSWORD 對應到 Cypress env 變數
if (env.TEST_USER_EMAIL) env.CYPRESS_TEST_USER_EMAIL = env.TEST_USER_EMAIL;
if (env.TEST_USER_PASSWORD) env.CYPRESS_TEST_USER_PASSWORD = env.TEST_USER_PASSWORD;

delete env.ELECTRON_RUN_AS_NODE;

const result = spawnSync(process.execPath, [cypressBin, ...args], {
  env,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
