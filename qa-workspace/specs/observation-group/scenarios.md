# Test Scenarios: 觀察題組

## Source
- Feature: observation-group
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-OBSERVATION-GROUP-001: 所有年齡層完成 AI 模組後可進入觀察題組
- **Status**: Ready
- **Given**: 一名超過 15M 的個案完成 AI 模組的影片錄製與上傳
- **When**: 個案點擊「下一題」
- **Then**: 系統應正確跳轉至觀察題組，不應無反應
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #20

### SC-OBSERVATION-GROUP-002: 1 歲 3 個月以外年齡層也能進入觀察題組
- **Status**: Ready
- **Given**: 一名 24M 個案完成 AI 模組
- **When**: 個案點擊「下一題」
- **Then**: 系統應進入 24M 對應的觀察題組，不僅限於 1 歲 3 個月（15M）的題目
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #20

### SC-OBSERVATION-GROUP-003: AI 模組完成後無需取消重來即可進入觀察題組
- **Status**: Ready
- **Given**: 一名 39M 個案（霏霏）完成 AI 模組，點擊「下一題」原本無反應
- **When**: 修正後個案點擊「下一題」
- **Then**: 系統直接進入觀察題組，不需要先點「取消」再重新開始
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #21

### SC-OBSERVATION-GROUP-004: 重新進入觀察題組不需重做 AI 模組
- **Status**: Ready
- **Given**: 個案已完成 AI 模組，但進入觀察題組時發生問題後取消
- **When**: 個案再次嘗試進入觀察題組
- **Then**: 系統應保留已完成的 AI 模組結果，不需要重新錄製 AI 模組影片
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #21
