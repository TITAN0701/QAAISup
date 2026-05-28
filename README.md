# AI-assisted Spec-Driven QA Automation

基於 SDD 架構，從 PM 需求到 QA 報告的全流程 AI 協作框架。

---

## 流程總覽

```
[PM 填需求]  /PM-1-create-intake
     ↓
[建立 QA 工作區]  new-feature-from-inbox.ps1
     ↓
[QA/AI 產規格 & 問題]  /QA-1  /QA-2  → spec.md  questions.md
     ↓
[PM 回答問題]  /PM-2-answer-questions  → questions.md PM Answer:
     ↓
[QA/AI 產情境 & 案例]  /QA-3  /QA-4  → scenarios.md  test-cases.json
     ↓
[QA/AI 產自動化草稿]  /QA-5  → *.cy.ts  test_*.py  ⚠ Engineer 補 data-testid
     ↓
[執行測試 & 回填結果]  execution-results.csv  ( Pass / Fail / Blocked )
     ↓
[產報告 & Excel]  /QA-6  或  refresh-qa-artifacts.ps1
     ↓
[test-report.md  scenario-matrix.xlsx]
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
```

---

## Slash Commands

| 指令 | 用途 |
|---|---|
| `/PM-1-create-intake` | PM 建立需求 |
| `/PM-2-answer-questions` | PM 回答問題 |
| `/QA-1-import-pm-request` | 匯入 PM 需求 |
| `/QA-2-generate-questions` | 產生釐清問題 |
| `/QA-3-generate-scenarios` | 產生測試情境 |
| `/QA-4-generate-testcases` | 產生測試案例 |
| `/QA-5-generate-automation` | 產自動化腳本草稿 |
| `/QA-6-generate-report` | 產 QA / PM 報告 |

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
