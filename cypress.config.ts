import { defineConfig } from "cypress";
import allureWriter from "@shelex/cypress-allure-plugin/writer";

export default defineConfig({
  e2e: {
    specPattern: "automation/e2e/specs/**/*.cy.ts",
    supportFile: "automation/e2e/support/e2e.ts",
    fixturesFolder: "automation/e2e/fixtures",
    screenshotsFolder: "artifacts/raw/cypress/screenshots",
    videosFolder: "artifacts/raw/cypress/videos",
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    },
  },
  env: {
    allure: true,
    allureResultsPath: "artifacts/raw/allure-results",
  },
});
