# Test Scenarios: 後台管理

## Source
- Feature: admin-backend
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-ADMIN-BACKEND-001: 管理員可停用帳號
- **Status**: Ready
- **Given**: 管理員已登入後台，進入帳號管理頁面
- **When**: 管理員選擇目標帳號並執行「停用帳號」操作
- **Then**: 帳號狀態更新為停用，該帳號後續無法登入系統
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #47

### SC-ADMIN-BACKEND-002: 停用帳號後使用者無法登入
- **Status**: Ready
- **Given**: 管理員已將某帳號設為停用
- **When**: 被停用的使用者嘗試以其帳號登入
- **Then**: 系統拒絕登入並顯示帳號已停用的錯誤訊息
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #47

### SC-ADMIN-BACKEND-003: 管理員可修改他人資料（編輯按鈕已隱藏）
- **Status**: Ready
- **Given**: 管理員已登入後台，進入使用者資料管理頁面
- **When**: 管理員查看一般使用者的資料頁面
- **Then**: 原本開放給一般使用者的編輯按鈕應對一般使用者隱藏，僅管理員可執行修改
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #48

### SC-ADMIN-BACKEND-004: 一般使用者無法看到其他人的編輯按鈕
- **Status**: Ready
- **Given**: 一般使用者已登入系統，進入個人資料頁面
- **When**: 使用者查看自己或他人資料
- **Then**: 編輯他人資料的按鈕已隱藏，不顯示於頁面上
- **Type**: e2e
- **Priority**: medium
- **Issue Ref**: #48

### SC-ADMIN-BACKEND-005: 邀請規則（待內部測試）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #46 狀態為「待內部測試」，邀請規則尚未完成內部測試，無法建立 QA 測試情境。
- **Issue Ref**: #46

### SC-ADMIN-BACKEND-006: 帳號管理列表檢視權限（待內部測試）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #49 狀態為「待內部測試」，帳號管理列表的檢視權限規則尚未完成內部測試，無法建立測試情境。
- **Issue Ref**: #49

### SC-ADMIN-BACKEND-007: 局處／機構建立
- **Status**: BLOCKED
- **Blocked Reason**: Issue #50 無狀態記錄，需求與實作狀態不明，無法建立測試情境。
- **Issue Ref**: #50

### SC-ADMIN-BACKEND-008: 局處／機構維護頁面
- **Status**: BLOCKED
- **Blocked Reason**: Issue #51 無狀態記錄，需求與實作狀態不明，無法建立測試情境。
- **Issue Ref**: #51
