const { spawnSync } = require("node:child_process");
const path = require("node:path");

const cypressPackageJson = require.resolve("cypress/package.json");
const cypressBin = path.join(path.dirname(cypressPackageJson), "bin", "cypress");
const args = process.argv.slice(2);
const env = { ...process.env };

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
