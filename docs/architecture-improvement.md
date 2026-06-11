# 架構改善清單

參考來源：[qa-claude-skill](https://github.com/TITAN0701/qa-claude-skill)
分析日期：2026-06-11

---

## 核心差異：QAAISup vs qa-claude-skill

| 面向 | QAAISup 現況 | qa-claude-skill 做法 | 影響 |
|------|-------------|---------------------|------|
| **設定系統** | 無 `config.json`，設定散落在 CLAUDE.md、.env、各 command 檔 | 單一 `config.json`（有 schema 驗證），含 JIRA/Slack/Google 設定 | 切換專案要改多個檔案，容易遺漏 |
| **運作模式** | 假設 MCP 一定可用，沒有 fallback | 三模式：`full-mcp` / `partial-mcp` / `markdown-only` | MCP 無法連線時 command 會卡住 |
| **Skill 結構** | 單一大型 `.md` 檔，全部邏輯塞在一起 | 每個 skill 有 `SKILL.md` + `modules/config-loader.md` + `modules/markdown-fallback.md` | AI 每次讀取整個 command，token 浪費 |
| **JIRA 整合** | 無 | 原生支援：建 bug ticket、設 reviewer、對應優先級 | Bug 只能推 GitHub Issues，PM 要另外看 |
| **通知機制** | 無 | Slack / Telegram：測試失敗時自動通知 | 測試結果只能手動查 |
| **Preset 設定** | 無（每次從頭設定） | government / enterprise / startup preset JSON | 換專案要重新設定所有參數 |
| **安裝腳本** | 無（要手動設定） | `install.ps1` / `install.sh` 一鍵安裝 | 新環境設定成本高 |
| **多語系** | 只有中文 | SKILL.md + SKILL.en.md | 跨團隊協作困難 |

### 值得移植的功能

| 功能 | 建議 | 說明 |
|------|------|------|
| `config.json` + schema | ✅ 值得 | 讓 `/project-init` 真正一鍵切換 |
| `markdown-fallback` module | ✅ 值得 | 防止 MCP 斷線讓 smoke test 卡死 |
| government preset | ✅ 值得 | 醫療/政府場景的預設設定直接可用 |
| JIRA 整合 | ⏸ 暫緩 | 目前用 GitHub Issues 已足夠 |
| Slack 通知 | ⏸ 暫緩 | 專案規模還小 |

---

## 改成 qa-claude-skill 做法的限制

| 面向 | 限制說明 |
|------|---------|
| **Skill 模組化** | Claude Code 的 slash command 是單一 `.md` 檔，**沒有 include 機制**。qa-claude-skill 的 modules/ 子目錄設計在 Claude Code 環境下無法直接複製，AI 不會自動讀取子目錄，模組化效果有限 |
| **config.json 統一設定** | 需重構 16 個 command 檔讓它們改讀 config.json；現有設定散落三處（CLAUDE.md、.env、command 內部），遷移是一次性但不小的工作量 |
| **三模式運作** | 每個 command 都要加條件判斷邏輯（MCP 是否可用），16 個 command 全部需要改寫，改寫量大 |
| **JIRA 整合** | 技術不難，但是決策問題：目前用 GitHub Issues，換 JIRA 代表 PM 要多一套工具；若不換則只能雙軌並行，維護成本增加 |
| **Slack / Telegram 通知** | 需要 Slack workspace + Bot token；SIT 環境若沒有 Slack 則完全無法使用 |
| **安裝腳本** | 現有 `project-init.ps1` 與 qa-claude-skill 的 install.ps1 功能重疊，直接複製會衝突，需要合併重構 |

---

## P1 — 立即修復

### #1 `data-validation.test.py` BASE_URL 寫死

**問題：** `automation/api/tests/data-validation.test.py` 內有 `BASE_URL = "http://localhost:3000"`，在 CI 或 SIT 環境執行時會連到不存在的位址，測試必然失敗。

**修法：**
```python
import os
BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:3000")
```

---

### #2 Playwright smoke test 沒有 MCP 斷線 fallback

**問題：** `/playwright-smoke-test` 完全依賴 Playwright MCP。MCP 無法連線時指令直接卡住，沒有任何提示或替代方案。

**修法：** 在 `.claude/commands/playwright-smoke-test.md` 開頭加入：

```
如果 Playwright MCP 工具無法使用（連線錯誤或工具不存在），
立即告知使用者「MCP 無法連線，請確認 Claude Code MCP 設定」，
不要嘗試其他替代操作，直接結束。
```

---

## P2 — 近期處理

### #3 切換專案後 command 檔內容不會自動更新

**問題：** 16 個 `.claude/commands/*.md` 檔內部有硬寫的路徑假設（如 `qa-workspace/specs/{feature}/`）。`/project-init` 執行後只更新 `.env` 和 `CLAUDE.md`，command 檔的邏輯不會跟著改。

**影響：** 換專案後 slash command 的行為可能與新專案結構不符。

**建議方向：** 參考 qa-claude-skill 的 `config.json` 設計，讓 command 讀取統一設定，而非在每個 command 檔重複寫死假設。短期先在 `CLAUDE.md` 的 project-init 步驟加上「確認 command 路徑假設與新專案一致」的提醒。

---

### #4 `ENGINEERING-TASKS.md` 51 個任務無優先順序

**問題：** `automation/ENGINEERING-TASKS.md` 列出 51 個待補 `data-testid` 任務，全部平排，沒有依功能風險或測試重要性排序。

**影響：** QA / 工程師不知道先做哪個，高風險功能的 selector 可能遲遲沒有補上。

**修法：** 依 `qa-knowledge/test-strategy.md` 的風險分級，在每個任務前標記 `[🔴 HIGH]` / `[🟡 MED]` / `[🟢 LOW]`，並在檔案頂部按優先序排列。

---

## P3 — 長期優化

### #5 Bug 回報只進 GitHub Issues，PM 無法統一查閱

**問題：** `/QA-bug-report` 將 bug 推到 GitHub Issues。PM 通常不看 GitHub，需要另開系統對照。

**建議：** 參考 qa-claude-skill bug-report skill 的做法，在 `/QA-bug-report` 輸出時同步寫一份 `artifacts/generated/qa/bugs/{bug-id}.md`，並在下次 `npm run sync:sheet` 時一併推到 Google Sheet 的 Bug 頁籤。

---

### #6 `progress-bar` BLOCKED 無追蹤機制

**問題：** `progress-bar` 功能的 `test-cases.json` 因等待 PM 回答而標記 BLOCKED，但沒有任何地方記錄 blocker 是什麼、誰負責解除。

**修法：** 在 `qa-workspace/specs/progress-bar/` 下建立 `blocker.md`，記錄：
- 阻塞原因
- 需要 PM 回答的問題編號（對應 `questions.md`）
- 預計解除日期

---

### #7 沒有 markdown-only 模式

**問題：** 目前框架假設 MCP 工具（Playwright、Google Drive）一定可用。qa-claude-skill 有明確的 `markdown-only` 模式，在工具不可用時仍能產出所有文件產物。

**建議：** 在 CLAUDE.md 加入說明：哪些 command 需要 MCP（`/playwright-smoke-test`）、哪些完全離線可用（`/QA-1` 到 `/QA-6`），讓使用者清楚哪些功能在受限環境下仍可運作。

---

### #8 沒有 Preset 設定

**問題：** 切換到新專案（`/project-init`）時，所有設定都要從頭填入，沒有針對「政府/醫療」場景的預設值。

**建議：** 參考 qa-claude-skill 的 `government.json` preset，在 `scripts/project-init.ps1` 加入「醫療/政府合規」選項，預設啟用：
- 4 大瀏覽器支援
- WCAG AA 無障礙要求
- 所有產出留存 `.md` 可審計格式

---

## 進度追蹤

| # | 問題 | 優先 | 狀態 |
|---|------|------|------|
| 1 | `data-validation.test.py` BASE_URL 寫死 | 🔴 P1 | ❌ 待修 |
| 2 | Playwright smoke test 無 MCP fallback | 🔴 P1 | ❌ 待修 |
| 3 | 切換專案後 command 路徑假設不更新 | 🟡 P2 | ❌ 待修 |
| 4 | ENGINEERING-TASKS.md 無優先排序 | 🟡 P2 | ❌ 待修 |
| 5 | Bug 回報無 Google Sheet 整合 | 🟢 P3 | ❌ 待修 |
| 6 | progress-bar BLOCKED 無追蹤機制 | 🟢 P3 | ❌ 待修 |
| 7 | 沒有 markdown-only 模式說明 | 🟢 P3 | ❌ 待修 |
| 8 | 沒有政府/醫療場景 Preset | 🟢 P3 | ❌ 待修 |
