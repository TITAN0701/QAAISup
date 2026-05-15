# QA Reports

QA 主要看這個資料夾。

## Files

```txt
test-report.md
failure-analysis.md
risk-notes.md
test-plan.md
test-cases.yaml
```

## Purpose

- `test-report.md`: 測試執行摘要與失敗案例
- `failure-analysis.md`: 失敗原因分類與建議 owner
- `risk-notes.md`: 測試前或測試後的風險筆記
- `test-plan.md`: 測試計畫
- `test-cases.yaml`: 結構化測試案例

## Difference From PM Report

QA report 可以包含較多技術細節，例如：

- failed test id
- assertion error
- screenshot / video / Allure link
- API response status
- retry recommendation

PM report 應避免大量技術細節，聚焦 release decision。
