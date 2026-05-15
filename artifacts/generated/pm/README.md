# PM Reports

PM 主要看這個資料夾。

## Main Report

```txt
artifacts/generated/pm/release-summary.md
artifacts/generated/pm/release-summary.docx
```

用途：

- 快速了解本次測試是否可 release
- 看主要風險
- 看哪些功能受影響
- 看是否需要 PM 或客戶決策

## Export Word Report

PM 對外或跨部門傳閱時，建議使用 Word 版本：

```powershell
.\scripts\export-pm-report-docx.ps1
```

輸出：

```txt
artifacts/generated/pm/release-summary.docx
```

Markdown 版本保留給 Git 追蹤，Word 版本給 PM 使用。

## PM 不需要看什麼

PM 通常不需要看：

```txt
artifacts/generated/qa/failure-analysis.md
artifacts/raw/allure-results/
automation/
CI stack trace
```

如果 PM 需要細節，QA 再引用 QA report 或 Allure report 補充。

## Difference From QA Report

| Report | Audience | Focus |
|---|---|---|
| PM Release Summary | PM / lead / customer-facing owner | release 風險、功能影響、是否需要決策 |
| QA Test Report | QA | 測試數量、失敗案例、錯誤訊息、重跑建議 |
| Failure Analysis | QA / Engineer | 失敗原因、可能 owner、debug 線索 |
