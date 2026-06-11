# Test Scenarios: 圖卡配對

## Source
- Feature: card-matching
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-CARD-MATCHING-001: 4M 個案不顯示圖卡配對題目
- **Status**: Ready
- **Given**: 一名 4M 個案進入測驗系統
- **When**: 系統決定出題類型
- **Then**: 不應出現圖卡配對題目（圖卡配對應從 8M 起才顯示）
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #9

### SC-CARD-MATCHING-002: 6M 個案不顯示圖卡配對題目
- **Status**: Ready
- **Given**: 一名 6M 個案進入測驗系統
- **When**: 系統決定出題類型
- **Then**: 不應出現圖卡配對題目
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #9

### SC-CARD-MATCHING-003: 8M 個案可正常顯示圖卡配對題目
- **Status**: Ready
- **Given**: 一名 8M 個案進入測驗系統
- **When**: 系統決定出題類型
- **Then**: 應出現圖卡配對題目，顯示正常
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #9

### SC-CARD-MATCHING-004: 圖卡配對跳題範圍限制（調整中）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #10 狀態為「調整中」，圖卡配對跳題上限規則（升一階）尚未確認完成，無法建立測試情境。
- **Issue Ref**: #10

### SC-CARD-MATCHING-005: 點擊圖案即算配對成功（維持現行邏輯）
- **Status**: Ready
- **Given**: 個案正在進行圖卡配對題目，畫面顯示彩色圖案與灰底目標區域
- **When**: 個案點擊彩色圖案
- **Then**: 系統應記錄為正確作答（依群健所回應，維持點選方式，不需拖拉）
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #11

### SC-CARD-MATCHING-006: 圖卡配對點擊正確圖案後進入下一題
- **Status**: Ready
- **Given**: 個案正在進行圖卡配對，點擊正確的彩色圖案
- **When**: 配對成功
- **Then**: 系統顯示正向回饋並進入下一題，不停留在同一題
- **Type**: e2e
- **Priority**: medium
- **Issue Ref**: #11
