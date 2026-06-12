# AI-assisted Spec-Driven QA Automation

基於 SDD 架構，從 PM 需求到 QA 報告的全流程 AI 協作框架。

---

## 流程總覽

```
[PM 填需求]  /PM-import
     ↓
[建立 QA 工作區]  /QA-1-import-pm-request → new-feature-from-inbox.ps1
     ↓
[QA 整理假設]  /QA-clarify → questions.md（QA Assumption，不等 PM）
     ↓
[QA 產情境 & 案例]  /QA-design → scenarios.md  test-cases.json
     ↓
[截圖取 selector]  /playwright-smoke-test → snapshots/*.yml
     ↓
[QA 產自動化草稿]  /QA-5 → *.cy.ts  test_*.py（selector 從 snapshot 抽取）
     ↓
[執行測試]  npm run test:e2e / pytest → allure-results/
     ↓
[產報告]  /QA-6 → test-cases.md  test-report.md  release-summary.md
     ↓
[匯出 PM 報告]  /PM-report → release-summary.docx
```

---

## 角色分工

| 角色 | 負責 |
|---|---|
| PM | 填需求、回答問題 |
| QA | 審核草稿、回填執行結果 |
| AI | 產文件草稿、整理報告 |
| Engineer | 補 `data-testid`、code review |

---

## 常用指令

```powershell
# 建立新功能工作區
.\scripts\new-feature-from-inbox.ps1

# 產出所有 QA 產物（回填後執行）
.\scripts\refresh-qa-artifacts.ps1

# 含 PM 摘要
.\scripts\refresh-qa-artifacts.ps1 -IncludePm

# 驗證 SDD 結構
.\scripts\validate-sdd.ps1

# 同步 TC 至 Google Sheet（供 PM 查閱）
npm run sync:sheet
```

---

## Slash Commands

| 指令 | 用途 |
|---|---|
| `/PM-import` | 匯入 PM 需求（直接寫 or .xlsx） |
| `/PM-report` | 審查並匯出 PM 報告（.docx） |
| `/QA-1-import-pm-request` | 建立 QA 工作區 |
| `/QA-clarify` | QA 整理假設備忘（不等 PM） |
| `/QA-design` | 產情境 + 測試案例（一次完成） |
| `/playwright-smoke-test` | 登入 SIT，截圖 + 取 DOM snapshot |
| `/QA-5-generate-automation` | 讀 snapshot 產 Cypress/pytest 草稿 |
| `/QA-6-generate-report` | 產 QA + PM 報告 |
| `/QA-bug-report` | Bug 整理成 RIDER 格式並推送 GitHub Issues |
| `/QA-knowledge-update` | 系統改版後同步知識庫 |
| `/check-project` | 掃描專案整體檔案結構 |
| `/project-init` | 清空舊內容、更新設定，快速切換至新系統 |

---

## 工具鏈

- E2E：Cypress + TypeScript
- API：Python + pytest
- 報告：Allure
- CI：GitHub Actions

GitHub Secrets：`CYPRESS_BASE_URL` / `API_BASE_URL` / `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`

---

## 詳細文件

`docs/architecture.md` · `docs/collaboration-guide.md` · `docs/environment-setup.md` · `docs/slash-commands.md` · `docs/toolchain.md`
