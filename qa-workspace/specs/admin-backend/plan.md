# Test Plan: 後台管理

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/admin-backend/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-ADMIN-BACKEND-001 | #47 | 管理員可停用帳號 | Ready |
| SC-ADMIN-BACKEND-002 | #47 | 停用帳號後使用者無法登入 | Ready |
| SC-ADMIN-BACKEND-003 | #48 | 管理員可修改他人資料（編輯按鈕隱藏）| Ready |
| SC-ADMIN-BACKEND-004 | #48 | 一般使用者無法看到他人的編輯按鈕 | Ready |
| SC-ADMIN-BACKEND-005 | #46 | 邀請規則 | **BLOCKED** |
| SC-ADMIN-BACKEND-006 | #49 | 帳號管理列表檢視權限 | **BLOCKED** |
| SC-ADMIN-BACKEND-007 | #50 | 局處／機構建立 | **BLOCKED** |
| SC-ADMIN-BACKEND-008 | #51 | 局處／機構維護頁面 | **BLOCKED** |

## Test Scope

- Issue #47：已完成，可測試。
- Issue #48：已完成，可測試。
- Issue #46：待內部測試，BLOCKED。
- Issue #49：待內部測試，BLOCKED。
- Issue #50：無狀態，BLOCKED。
- Issue #51：無狀態，BLOCKED。

## Out of Scope

- 前台使用者操作（屬於其他功能範疇）。

## Test Types

- E2E: 覆蓋停用帳號、修改資料的後台管理流程。
- Permission: 驗證不同角色（管理員 vs 一般使用者）的操作權限邊界。
- Security: 確認權限控制不可被繞過。

## Risks

- High: 4 個 Issue（#46、#49、#50、#51）BLOCKED，後台管理測試覆蓋嚴重不足。
- Medium: 需要後台管理員帳號的測試環境配置。

## Open Questions

- 請參考 questions.md。
- Issue #50、#51 無狀態記錄，需與 John 確認需求與實作計畫。
