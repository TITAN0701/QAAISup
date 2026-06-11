# 架構改善清單

參考來源：[qa-claude-skill](https://github.com/TITAN0701/qa-claude-skill)
分析日期：2026-06-11

---

## 核心差異：QAAISup vs qa-claude-skill

| 面向 | QAAISup 現況 | qa-claude-skill 做法 | 影響 |
|------|-------------|---------------------|------|
| **設定系統** | 無 `config.json`，設定散落在 CLAUDE.md、.env、各 command 檔 | 單一 `config.json`（有 schema 驗證），含 JIRA/Slack/Google 設定 | 切換專案要改多個檔案，容易遺漏 |
| **運作模式** | 假設 MCP 一定可用，沒有 fallback | 三模式：`full-mcp` / `partial-mcp` / `markdown-only` | MCP 無法連線時 command 會卡住 |
| **Skill 結構** | 單一大型 `.md` 檔，全部邏輯塞在一起，重複邏輯分散在各 command | 每個 skill 有 `SKILL.md` + `modules/config-loader.md` + `modules/markdown-fallback.md` | 可透過在 command 內指示 AI 讀取 `.claude/modules/` 實現模組化，目前未導入 |
| **JIRA 整合** | 無 | 原生支援：建 bug ticket、設 reviewer、對應優先級 | Bug 只能推 GitHub Issues，PM 要另外看 |
| **通知機制** | 無 | Slack / Telegram：測試失敗時自動通知 | 測試結果只能手動查 |
| **Preset 設定** | 無（每次從頭設定） | government / enterprise / startup preset JSON | 換專案要重新設定所有參數 |
| **安裝腳本** | 無（要手動設定） | `install.ps1` / `install.sh` 一鍵安裝 | 新環境設定成本高 |
| **多語系** | 只有中文 | SKILL.md + SKILL.en.md | 跨團隊協作困難 |

### 值得移植的功能

| 功能 | 建議 | 說明 |
|------|------|------|
| `config.json` + schema | ✅ 值得 | 讓 `/project-init` 真正一鍵切換 |
| Skill 模組化（`.claude/modules/`） | ✅ 值得 | command 內指示 AI 讀取共用模組，消除 16 個 command 的重複邏輯 |
| `markdown-fallback` module | ✅ 值得 | 防止 MCP 斷線讓 smoke test 卡死 |
| government preset | ✅ 值得 | 醫療/政府場景的預設設定直接可用 |
| JIRA 整合 | ⏸ 暫緩 | 目前用 GitHub Issues 已足夠 |
| Slack 通知 | ⏸ 暫緩 | 專案規模還小 |

---

## 整體架構結構差異（撇除功能）

這四個結構差距是下方所有問題的根本原因：

| # | 結構差距 | QAAISup 現況 | qa-claude-skill 做法 | 對應問題 |
|---|---------|-------------|---------------------|---------|
| S1 | **Skill 自包含 vs 分散** | command 依賴 `qa-knowledge/`、CLAUDE.md、.env 三處才能完整運作，沒有單一入口 | 每個 skill 目錄內包含所有需要的東西，自給自足 | #3、#4 |
| S2 | **平鋪 vs 層次結構** | 16 個 command .md 全部同一層，沒有層次 | 明確三層：`config → modules → skill` | #4 |
| S3 | **輸入輸出定義分離** | 每個 command 的 Input/Output 定義在 CLAUDE.md 流程圖，和 command 檔是兩個地方 | Input/Output 定義在 SKILL.md 內，和指令放在一起 | #3 |
| S4 | **專案綁定 vs 可攜框架** | 框架和專案內容混在一起，無法拆出重用於其他系統 | 設計為可安裝到任何專案的獨立框架（install.ps1） | #3、#9 |

---

## P1 — 立即修復

### #1 `data-validation.test.py` BASE_URL 寫死

**根本原因：** 獨立程式碼問題（與架構無關）

**問題：** `automation/api/tests/data-validation.test.py` 內有 `BASE_URL = "http://localhost:3000"`，在 CI 或 SIT 環境執行時會連到不存在的位址，測試必然失敗。

**修法：**
```python
import os
BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:3000")
```

---

### #2 框架無運作模式切換，MCP 不可用時全面失效

**根本原因：** 核心差異「運作模式」缺失（對應 qa-claude-skill 的 full-mcp / partial-mcp / markdown-only 三模式）

**問題：** 整個框架假設 MCP 工具（Playwright、Google Drive）永遠可用，沒有任何降級機制。具體表現：
- `/playwright-smoke-test` MCP 斷線時直接卡住，沒有提示
- 沒有明確說明哪些 command 離線可用、哪些需要 MCP

**修法：**
1. 在 `.claude/commands/playwright-smoke-test.md` 開頭加入：
```
如果 Playwright MCP 工具無法使用，立即告知使用者「MCP 無法連線，請確認 Claude Code MCP 設定」，直接結束。
```
2. 在 CLAUDE.md 加入說明：`/QA-1` 到 `/QA-6` 完全離線可用；`/playwright-smoke-test` 需要 MCP。

---

## P2 — 近期處理

### #3 切換專案後 command 檔內容不會自動更新

**根本原因：** S1（分散）、S3（輸入輸出分離）、S4（專案綁定）

**問題：** 16 個 `.claude/commands/*.md` 內部硬寫路徑假設（如 `qa-workspace/specs/{feature}/`）。`/project-init` 只更新 `.env` 和 `CLAUDE.md`，command 邏輯不會跟著改。

**影響：** 換專案後 slash command 行為可能與新專案結構不符。

**修法：** 建立 `config.json` 集中管理路徑與專案設定，讓 command 讀取 config 而非硬寫假設；`/project-init` 只需更新 config.json 一個檔案。

---

### #4 Command 檔未模組化，重複邏輯分散

**根本原因：** S1（分散）、S2（平鋪）

**問題：** 16 個 command 有重複邏輯（登入流程假設、錯誤處理、路徑規則），各自維護，改一處不同步。

**影響：** command 行為不一致，維護成本高。

**修法：** 建立 `.claude/modules/` 目錄，共用邏輯抽出為獨立 `.md`，各 command 開頭加「先讀 `.claude/modules/xxx.md`」指示 AI 載入。

---

### #5 `ENGINEERING-TASKS.md` 51 個任務無優先順序

**根本原因：** 獨立執行管理問題（與架構無關）

**問題：** `automation/ENGINEERING-TASKS.md` 列出 51 個待補 `data-testid` 任務，全部平排，沒有依功能風險或測試重要性排序。

**影響：** QA / 工程師不知道先做哪個，高風險功能的 selector 可能遲遲沒有補上。

**修法：** 依 `qa-knowledge/test-strategy.md` 的風險分級，在每個任務前標記 `[🔴 HIGH]` / `[🟡 MED]` / `[🟢 LOW]`，並在檔案頂部按優先序排列。

---

## P3 — 長期優化

### #6 Bug 回報只進 GitHub Issues，PM 無法統一查閱


**根本原因：** S4（專案綁定，無統一輸出整合）

**問題：** `/QA-bug-report` 將 bug 推到 GitHub Issues。PM 通常不看 GitHub，需要另開系統對照。

**建議：** 在 `/QA-bug-report` 輸出時同步寫一份 `artifacts/generated/qa/bugs/{bug-id}.md`，並在下次 `npm run sync:sheet` 時一併推到 Google Sheet 的 Bug 頁籤。

---

### #7 `progress-bar` BLOCKED 無追蹤機制

**根本原因：** 獨立追蹤缺失問題（與架構無關）

**問題：** `progress-bar` 功能的 `test-cases.json` 因等待 PM 回答而標記 BLOCKED，但沒有任何地方記錄 blocker 是什麼、誰負責解除。

**修法：** 在 `qa-workspace/specs/progress-bar/` 下建立 `blocker.md`，記錄：
- 阻塞原因
- 需要 PM 回答的問題編號（對應 `questions.md`）
- 預計解除日期

---

### #8 沒有 Preset 設定

**根本原因：** S4（專案綁定，無可攜框架）

**問題：** 切換到新專案時所有設定從頭填入，沒有醫療/政府場景的預設值。

**建議：** 參考 qa-claude-skill 的 `government.json` preset，建立 `config/presets/medical-gov.json`，預設啟用：
- 4 大瀏覽器支援
- WCAG AA 無障礙要求
- 所有產出留存 `.md` 可審計格式

---

## 進度追蹤

| # | 問題 | 根本原因 | 優先 | 狀態 |
|---|------|---------|------|------|
| 1 | `data-validation.test.py` BASE_URL 寫死 | 獨立程式碼問題 | 🔴 P1 | ❌ 待修 |
| 2 | 框架無運作模式切換，MCP 不可用時全面失效 | 運作模式缺失 | 🔴 P1 | ❌ 待修 |
| 3 | 切換專案後 command 路徑假設不更新 | S1、S3、S4 | 🟡 P2 | ❌ 待修 |
| 4 | Command 檔未模組化，重複邏輯分散 | S1、S2 | 🟡 P2 | ❌ 待修 |
| 5 | ENGINEERING-TASKS.md 無優先排序 | 獨立執行管理問題 | 🟡 P2 | ❌ 待修 |
| 6 | Bug 回報無 Google Sheet 整合 | S4 | 🟢 P3 | ❌ 待修 |
| 7 | progress-bar BLOCKED 無追蹤機制 | 獨立追蹤缺失 | 🟢 P3 | ❌ 待修 |
| 8 | 沒有政府/醫療場景 Preset | S4 | 🟢 P3 | ❌ 待修 |
