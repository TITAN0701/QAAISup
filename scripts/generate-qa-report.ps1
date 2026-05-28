param(
    [Parameter(Mandatory=$false)]
    [string]$Feature,

    [Parameter(Mandatory=$false)]
    [string]$SpecDir,

    [Parameter(Mandatory=$false)]
    [string]$QaReport = "artifacts/generated/qa/test-report.md",

    [Parameter(Mandatory=$false)]
    [string]$PmSummary = "artifacts/generated/pm/release-summary.md",

    [Parameter(Mandatory=$false)]
    [string]$PmWord = "artifacts/generated/pm/release-summary.docx",

    [Parameter(Mandatory=$false)]
    [switch]$SkipPm,

    [Parameter(Mandatory=$false)]
    [switch]$SkipWord
)

$ErrorActionPreference = "Stop"

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

function Read-TextOrDefault {
    param(
        [string]$Path,
        [string]$Default = ""
    )

    if (Test-Path $Path) {
        return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    }

    return $Default
}

function Get-HeadingTitle {
    param(
        [string]$Content,
        [string]$Fallback
    )

    $match = [regex]::Match($Content, '(?m)^#\s+(.+?)\s*$')
    if ($match.Success) {
        return $match.Groups[1].Value.Trim()
    }

    return $Fallback
}

function Get-MarkdownSection {
    param(
        [string]$Content,
        [string]$HeadingPattern
    )

    $match = [regex]::Match($Content, "(?ms)^##+\s+$HeadingPattern\s*(.*?)(?=^##+\s+|\z)")
    if ($match.Success) {
        return $match.Groups[1].Value.Trim()
    }

    return ""
}

function Get-NestedMarkdownSection {
    param(
        [string]$Content,
        [string]$HeadingPattern
    )

    $match = [regex]::Match($Content, "(?ms)^###\s+$HeadingPattern\s*(.*?)(?=^###\s+|^##\s+|\z)")
    if ($match.Success) {
        return $match.Groups[1].Value.Trim()
    }

    return ""
}

function Get-BulletSummary {
    param(
        [string]$Content,
        [int]$MaxItems = 8,
        [string]$Fallback = "- 尚未整理。"
    )

    $items = @()
    foreach ($line in ($Content -split "`r?`n")) {
        if ($line -match '^\s*-\s+(.+?)\s*$') {
            $items += $Matches[1].Trim()
        }
    }

    if ($items.Count -eq 0) {
        return $Fallback
    }

    return (($items | Select-Object -First $MaxItems | ForEach-Object { "- $_" }) -join "`n")
}

function Count-Matches {
    param(
        [string]$Content,
        [string]$Pattern
    )

    return ([regex]::Matches($Content, $Pattern)).Count
}

function Get-TaskStats {
    param([string]$Content)

    $done = Count-Matches -Content $Content -Pattern '(?mi)^-\s+\[[xX]\]\s+'
    $open = Count-Matches -Content $Content -Pattern '(?m)^-\s+\[(\s)?\]\s+'

    return [PSCustomObject]@{
        Done = $done
        Open = $open
        Total = $done + $open
    }
}

function Get-OpenQuestionCount {
    param([string]$Content)

    if ([string]::IsNullOrWhiteSpace($Content)) {
        return 0
    }

    $statusCount = Count-Matches -Content $Content -Pattern '(?mi)^\s*-\s*Status\s*:\s*(Open|Pending|Blocked|Waiting|Waiting PM Answer|Need Clarification)\s*$'
    if ((Count-Matches -Content $Content -Pattern '(?mi)^\s*-\s*Status\s*:') -gt 0) {
        return $statusCount
    }

    return Count-Matches -Content $Content -Pattern '(?mi)^\s*-\s*PM Answer\s*:\s*$'
}

function Get-TestCaseCount {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return 0
    }

    try {
        $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($content.test_cases) {
            return @($content.test_cases).Count
        }
    } catch {
        return 0
    }

    return 0
}

function Get-ScenarioStats {
    param([string]$Content)

    $total = Count-Matches -Content $Content -Pattern '(?m)^###\s+SC-'
    $passed = Count-Matches -Content $Content -Pattern '(?im)^\s*-\s+(Status|狀態)\s*:\s*(Passed|Pass|通過)\s*$'
    $failed = Count-Matches -Content $Content -Pattern '(?im)^\s*-\s+(Status|狀態)\s*:\s*(Failed|Fail|失敗)\s*$'
    $blocked = Count-Matches -Content $Content -Pattern '(?im)^\s*-\s+(Status|狀態)\s*:\s*(Blocked|阻塞)\s*$'
    $skipped = Count-Matches -Content $Content -Pattern '(?im)^\s*-\s+(Status|狀態)\s*:\s*(Skipped|Skip|略過)\s*$'
    $notRun = [Math]::Max(0, $total - $passed - $failed - $blocked - $skipped)

    return [PSCustomObject]@{
        Total = $total
        Passed = $passed
        Failed = $failed
        Blocked = $blocked
        Skipped = $skipped
        NotRun = $notRun
    }
}

function Get-ExecutionStats {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return $null
    }

    try {
        $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
        $results = @($content.test_results)
        $total = $results.Count
        $passed = @($results | Where-Object { $_.status -eq "Pass" }).Count
        $failed = @($results | Where-Object { $_.status -eq "Fail" }).Count
        $blocked = @($results | Where-Object { $_.status -eq "Blocked" }).Count
        $skipped = @($results | Where-Object { $_.status -eq "N/A" }).Count
        $notRun = @($results | Where-Object { $_.status -in @("Not Run", "Ready") }).Count

        return [PSCustomObject]@{
            Total = $total
            Passed = $passed
            Failed = $failed
            Blocked = $blocked
            Skipped = $skipped
            NotRun = $notRun
        }
    } catch {
        return $null
    }
}

function Get-ScenarioReviewStats {
    param([string]$Path)

    $default = [PSCustomObject]@{
        Total = 0
        Approved = 0
        Ready = 0
        NeedConfirm = 0
        Blocked = 0
        NotMarked = 0
    }

    if (-not (Test-Path $Path)) {
        return $default
    }

    try {
        $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
        $reviews = @($content.scenario_reviews)
        return [PSCustomObject]@{
            Total = $reviews.Count
            Approved = @($reviews | Where-Object { $_.status -eq "Approved" }).Count
            Ready = @($reviews | Where-Object { $_.status -eq "Ready" }).Count
            NeedConfirm = @($reviews | Where-Object { $_.status -eq "Need Confirm" }).Count
            Blocked = @($reviews | Where-Object { $_.status -eq "Blocked" }).Count
            NotMarked = @($reviews | Where-Object { $_.status -eq "Not Marked" }).Count
        }
    } catch {
        return $default
    }
}

function Get-ExecutionEvidenceStats {
    param([string]$Path)

    $default = [PSCustomObject]@{
        TestUrl = 0
        Evidence = 0
    }

    if (-not (Test-Path $Path)) {
        return $default
    }

    try {
        $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
        $results = @($content.test_results)
        return [PSCustomObject]@{
            TestUrl  = @($results | Where-Object { -not [string]::IsNullOrWhiteSpace($_.test_url) }).Count
            Evidence = @($results | Where-Object { -not [string]::IsNullOrWhiteSpace($_.evidence) }).Count
        }
    } catch {
        return $default
    }
}

function Get-ReleaseStatus {
    param(
        [object]$ScenarioStats,
        [object]$TaskStats,
        [int]$OpenQuestions
    )

    if ($ScenarioStats.Failed -gt 0 -or $ScenarioStats.Blocked -gt 0) {
        return "Not Recommended"
    }

    if ($ScenarioStats.Total -eq 0 -or $ScenarioStats.NotRun -gt 0) {
        return "Not Evaluated"
    }

    if ($OpenQuestions -gt 0 -or $TaskStats.Open -gt 0) {
        return "Conditional"
    }

    return "Recommended"
}

function Get-FeatureReportData {
    param([string]$SpecDir)

    if (-not (Test-Path $SpecDir)) {
        throw "找不到功能資料夾: $SpecDir"
    }

    $featureName = Split-Path $SpecDir -Leaf
    $specPath = Join-Path $SpecDir "spec.md"
    $planPath = Join-Path $SpecDir "plan.md"
    $questionsPath = Join-Path $SpecDir "questions.md"
    $scenariosPath = Join-Path $SpecDir "scenarios.md"
    $testCasesPath = Join-Path $SpecDir "test-cases.json"
    $executionResultsPath = Join-Path $SpecDir "execution-results.json"
    $tasksPath = Join-Path $SpecDir "tasks.md"

    $spec = Read-TextOrDefault -Path $specPath
    $questions = Read-TextOrDefault -Path $questionsPath
    $scenarios = Read-TextOrDefault -Path $scenariosPath
    $tasks = Read-TextOrDefault -Path $tasksPath

    $title = Get-HeadingTitle -Content $spec -Fallback $featureName
    $scenarioStats = Get-ExecutionStats -Path $executionResultsPath
    if ($null -eq $scenarioStats) {
        $scenarioStats = Get-ScenarioStats -Content $scenarios
    }
    $scenarioReviewStats = Get-ScenarioReviewStats -Path $executionResultsPath
    $evidenceStats = Get-ExecutionEvidenceStats -Path $executionResultsPath
    $testCaseCount = Get-TestCaseCount -Path $testCasesPath
    $taskStats = Get-TaskStats -Content $tasks
    $openQuestions = Get-OpenQuestionCount -Content $questions
    $cypressSpecPath = Join-Path "automation/e2e/specs" "$featureName.cy.ts"
    $hasCypressSpec = Test-Path $cypressSpecPath
    $hasAllureResults = (Test-Path "artifacts/raw/allure-results") -and ((Get-ChildItem "artifacts/raw/allure-results" -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne ".gitkeep" } | Measure-Object).Count -gt 0)
    $releaseStatus = Get-ReleaseStatus -ScenarioStats $scenarioStats -TaskStats $taskStats -OpenQuestions $openQuestions
    $scopeContent = Get-NestedMarkdownSection -Content $spec -HeadingPattern "In Scope"
    $acceptanceContent = Get-MarkdownSection -Content $spec -HeadingPattern "Acceptance Criteria"
    $businessGoalContent = Get-MarkdownSection -Content $spec -HeadingPattern "Business Goal"

    return [PSCustomObject]@{
        FeatureName = $featureName
        SpecDir = $SpecDir
        Title = $title
        SpecPath = $specPath
        PlanPath = $planPath
        QuestionsPath = $questionsPath
        ScenariosPath = $scenariosPath
        TestCasesPath = $testCasesPath
        ExecutionResultsPath = $executionResultsPath
        TasksPath = $tasksPath
        ScenarioStats = $scenarioStats
        ScenarioReviewStats = $scenarioReviewStats
        EvidenceStats = $evidenceStats
        TestCaseCount = $testCaseCount
        TaskStats = $taskStats
        OpenQuestions = $openQuestions
        CypressSpecPath = $cypressSpecPath
        HasCypressSpec = $hasCypressSpec
        HasAllureResults = $hasAllureResults
        ReleaseStatus = $releaseStatus
        TestedFunctionsSummary = Get-BulletSummary -Content $scopeContent -MaxItems 8 -Fallback "- 尚未整理測試功能範圍。"
        AcceptanceSummary = Get-BulletSummary -Content $acceptanceContent -MaxItems 8 -Fallback "- 尚未整理驗收條件。"
        BusinessGoalSummary = Get-BulletSummary -Content $businessGoalContent -MaxItems 4 -Fallback "- 尚未整理功能目標。"
        SpecExistsStatus = if (Test-Path $specPath) { "OK" } else { "Missing" }
        PlanExistsStatus = if (Test-Path $planPath) { "OK" } else { "Missing" }
        CypressStatus = if ($hasCypressSpec) { "OK: $cypressSpecPath" } else { "Missing: $cypressSpecPath" }
        AllureStatus = if ($hasAllureResults) { "OK" } else { "Not Found" }
        CypressSummary = if ($hasCypressSpec) { "已找到" } else { "尚未建立" }
        AllureSummary = if ($hasAllureResults) { "已找到" } else { "尚未產生" }
    }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

# 先將 CSV 同步回各功能的 execution-results.json
$syncScript = Join-Path "scripts" "sync-csv-to-json.ps1"
if (Test-Path $syncScript) {
    Write-Output "Syncing CSV to JSON..."
    & ".\$syncScript"
    Write-Output ""
}

if ($SpecDir) {
    $featureData = @(Get-FeatureReportData -SpecDir $SpecDir)
} elseif ($Feature) {
    $featureData = @(Get-FeatureReportData -SpecDir (Join-Path "qa-workspace/specs" $Feature))
} else {
    $featureData = Get-ChildItem -Path "qa-workspace/specs" -Directory |
        Where-Object { $_.Name -notmatch '^[._]' -and (Test-Path (Join-Path $_.FullName "spec.md")) } |
        ForEach-Object { Get-FeatureReportData -SpecDir $_.FullName }
}

if (-not $featureData -or $featureData.Count -eq 0) {
    throw "找不到可產生報告的功能資料夾。"
}

$isSingleFeature = $featureData.Count -eq 1
$primary = $featureData[0]
$title = if ($isSingleFeature) { $primary.Title } else { "全部測試功能" }
$generatedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$totalScenarios = ($featureData | ForEach-Object { $_.ScenarioStats.Total } | Measure-Object -Sum).Sum
$totalTestCases = ($featureData | ForEach-Object { $_.TestCaseCount } | Measure-Object -Sum).Sum
$passedScenarios = ($featureData | ForEach-Object { $_.ScenarioStats.Passed } | Measure-Object -Sum).Sum
$failedScenarios = ($featureData | ForEach-Object { $_.ScenarioStats.Failed } | Measure-Object -Sum).Sum
$blockedScenarios = ($featureData | ForEach-Object { $_.ScenarioStats.Blocked } | Measure-Object -Sum).Sum
$skippedScenarios = ($featureData | ForEach-Object { $_.ScenarioStats.Skipped } | Measure-Object -Sum).Sum
$notRunScenarios = ($featureData | ForEach-Object { $_.ScenarioStats.NotRun } | Measure-Object -Sum).Sum
$reviewTotal = ($featureData | ForEach-Object { $_.ScenarioReviewStats.Total } | Measure-Object -Sum).Sum
$reviewApproved = ($featureData | ForEach-Object { $_.ScenarioReviewStats.Approved } | Measure-Object -Sum).Sum
$reviewReady = ($featureData | ForEach-Object { $_.ScenarioReviewStats.Ready } | Measure-Object -Sum).Sum
$reviewNeedConfirm = ($featureData | ForEach-Object { $_.ScenarioReviewStats.NeedConfirm } | Measure-Object -Sum).Sum
$reviewBlocked = ($featureData | ForEach-Object { $_.ScenarioReviewStats.Blocked } | Measure-Object -Sum).Sum
$reviewNotMarked = ($featureData | ForEach-Object { $_.ScenarioReviewStats.NotMarked } | Measure-Object -Sum).Sum
$testUrlCount = ($featureData | ForEach-Object { $_.EvidenceStats.TestUrl } | Measure-Object -Sum).Sum
$evidenceCount = ($featureData | ForEach-Object { $_.EvidenceStats.Evidence } | Measure-Object -Sum).Sum
$totalTasks = ($featureData | ForEach-Object { $_.TaskStats.Total } | Measure-Object -Sum).Sum
$doneTasks = ($featureData | ForEach-Object { $_.TaskStats.Done } | Measure-Object -Sum).Sum
$openTasks = ($featureData | ForEach-Object { $_.TaskStats.Open } | Measure-Object -Sum).Sum
$openQuestionsTotal = ($featureData | ForEach-Object { $_.OpenQuestions } | Measure-Object -Sum).Sum
$releaseStatus = if (($featureData | Where-Object { $_.ReleaseStatus -eq "Not Recommended" }).Count -gt 0) {
    "Not Recommended"
} elseif (($featureData | Where-Object { $_.ReleaseStatus -eq "Not Evaluated" }).Count -gt 0) {
    "Not Evaluated"
} elseif (($featureData | Where-Object { $_.ReleaseStatus -eq "Conditional" }).Count -gt 0) {
    "Conditional"
} else {
    "Recommended"
}

$featureRows = ($featureData | ForEach-Object {
    "| $($_.FeatureName) | $($_.ReleaseStatus) | $($_.ScenarioReviewStats.NeedConfirm) | $($_.TestCaseCount) | $($_.ScenarioStats.Passed) | $($_.ScenarioStats.Failed) | $($_.ScenarioStats.NotRun) | $($_.EvidenceStats.TestUrl) | $($_.EvidenceStats.Evidence) | $($_.OpenQuestions) |"
}) -join "`n"

$testedFunctionsSummary = if ($isSingleFeature) {
    $primary.TestedFunctionsSummary
} else {
    ($featureData | ForEach-Object { "- $($_.FeatureName): $($_.Title)" }) -join "`n"
}

$acceptanceSummary = if ($isSingleFeature) {
    $primary.AcceptanceSummary
} else {
    ($featureData | ForEach-Object { "- $($_.FeatureName): 測試案例 $($_.ScenarioStats.Total) 筆，通過 $($_.ScenarioStats.Passed) 筆，未執行 $($_.ScenarioStats.NotRun) 筆；情境待確認 $($_.ScenarioReviewStats.NeedConfirm) 筆。" }) -join "`n"
}

$businessGoalSummary = if ($isSingleFeature) {
    $primary.BusinessGoalSummary
} else {
    "- 彙整 qa-workspace/specs/ 下所有功能的 QA 狀態與發布風險。"
}

$scenarioMatrixMd = "artifacts/generated/qa/scenario-matrix.md"
$scenarioMatrixXlsx = "artifacts/generated/qa/scenario-matrix.xlsx"

New-Item -ItemType Directory -Force -Path (Split-Path $QaReport -Parent) | Out-Null
if (-not $SkipPm) {
    New-Item -ItemType Directory -Force -Path (Split-Path $PmSummary -Parent) | Out-Null
}

$qaReportContent = @"
# QA 測試報告：$title

## 摘要

- 功能數量：$($featureData.Count)
- 測試案例數量：$totalTestCases
- 產生時間：$generatedAt
- 發布狀態：$releaseStatus
- QA 回填來源：qa-workspace/execution-results.csv

## 情境可測性統計

| 項目 | 數量 |
|---|---:|
| Total | $reviewTotal |
| Approved | $reviewApproved |
| Ready | $reviewReady |
| Need Confirm | $reviewNeedConfirm |
| Blocked | $reviewBlocked |
| Not Marked | $reviewNotMarked |

## 測試案例執行統計

| 項目 | 數量 |
|---|---:|
| Total | $totalScenarios |
| Passed | $passedScenarios |
| Failed | $failedScenarios |
| Blocked | $blockedScenarios |
| Skipped | $skippedScenarios |
| Not Run / Not Marked | $notRunScenarios |

## 佐證覆蓋

| 項目 | 數量 |
|---|---:|
| 已填測試位址 | $testUrlCount |
| 已填其他佐證 | $evidenceCount |

## 本次測試功能

$testedFunctionsSummary

## 驗收重點

$acceptanceSummary

## QA 任務統計

| 項目 | 數量 |
|---|---:|
| Total | $totalTasks |
| Done | $doneTasks |
| Open | $openTasks |

## 功能狀態明細

| 功能 | 狀態 | 情境待確認 | Test Cases | Passed | Failed | Not Run | URL | Evidence | Open PM Questions |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
$featureRows

## 檢查結果

| 檢查項目 | 數量 / 狀態 |
|---|---|
| 功能數量 | $($featureData.Count) |
| 測試案例數量 | $totalTestCases |
| 未回答 PM Answer | $openQuestionsTotal |
| Cypress spec 已建立 | $(($featureData | Where-Object { $_.HasCypressSpec }).Count) |
| Allure raw results | $(if (($featureData | Where-Object { $_.HasAllureResults }).Count -gt 0) { "OK" } else { "Not Found" }) |
| QA 回填總表 | qa-workspace/execution-results.csv |

## 測試範圍來源

- qa-workspace/specs/{feature}/plan.md
- qa-workspace/specs/{feature}/scenarios.md
- qa-workspace/specs/{feature}/test-cases.json
- qa-workspace/specs/{feature}/execution-results.json
- qa-workspace/execution-results.csv

## 測試情境矩陣

- Markdown：$scenarioMatrixMd
- Excel：$scenarioMatrixXlsx

## 待釐清問題

- 未回答 PM Answer 數量：$openQuestionsTotal
- 來源：qa-workspace/specs/{feature}/questions.md

## QA 結論

狀態：$releaseStatus

原因：

- 尚未標記測試結果的情境數量：$notRunScenarios
- 仍待確認的測試情境數量：$reviewNeedConfirm
- 未回答 PM 問題數量：$openQuestionsTotal
- 未完成任務數量：$openTasks
"@

$pmSummaryContent = @"
# PM 測試發布摘要：$title

## 整體狀態

$releaseStatus

## 摘要說明

本摘要根據 QA workspace 文件產生，包含 $($featureData.Count) 個功能。

- 產生時間：$generatedAt
- 測試案例數量：$totalTestCases
- QA 回填來源：qa-workspace/execution-results.csv

## 本次測試功能

$testedFunctionsSummary

## 驗收重點

$acceptanceSummary

## 功能目標

$businessGoalSummary

## 情境可測性統計

| 項目 | 數量 |
|---|---:|
| Total | $reviewTotal |
| Approved | $reviewApproved |
| Ready | $reviewReady |
| Need Confirm | $reviewNeedConfirm |
| Blocked | $reviewBlocked |
| Not Marked | $reviewNotMarked |

## 測試案例執行統計

| 項目 | 數量 |
|---|---:|
| Total | $totalScenarios |
| Passed | $passedScenarios |
| Failed | $failedScenarios |
| Blocked | $blockedScenarios |
| Skipped | $skippedScenarios |
| Not Run / Not Marked | $notRunScenarios |

## 佐證覆蓋

| 項目 | 數量 |
|---|---:|
| 已填測試位址 | $testUrlCount |
| 已填其他佐證 | $evidenceCount |

## QA 任務狀態

| 項目 | 數量 |
|---|---:|
| Done | $doneTasks |
| Open | $openTasks |

## 功能狀態明細

| 功能 | 狀態 | 情境待確認 | Test Cases | Passed | Failed | Not Run | URL | Evidence | Open PM Questions |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
$featureRows

## 發布建議

狀態：$releaseStatus

需要注意：

- 尚未回答 PM 問題：$openQuestionsTotal
- 尚未完成 QA 任務：$openTasks
- 尚未標記測試結果的情境：$notRunScenarios
- 仍待確認的測試情境：$reviewNeedConfirm

## 主要風險

- 若仍有 PM 問題未回答，測試斷言與驗收標準可能不穩定。
- 若 Cypress spec 尚未建立，代表自動化覆蓋尚未完成。
- 若 Allure raw results 尚未產生，代表尚未有正式自動化執行結果。

## 相關連結

- QA 測試報告：$QaReport
- 測試情境矩陣 Markdown：$scenarioMatrixMd
- 測試情境矩陣 Excel：$scenarioMatrixXlsx
- 功能規格：qa-workspace/specs/{feature}/spec.md
- 測試計畫：qa-workspace/specs/{feature}/plan.md
- 測試情境：qa-workspace/specs/{feature}/scenarios.md
- 測試案例：qa-workspace/specs/{feature}/test-cases.json
- 測試執行結果：qa-workspace/specs/{feature}/execution-results.json
- QA 回填總表：qa-workspace/execution-results.csv
"@

Set-Content -LiteralPath $QaReport -Value $qaReportContent -Encoding UTF8

$pmStatus = "Skipped"
$wordStatus = "Skipped"
if (-not $SkipPm) {
    Set-Content -LiteralPath $PmSummary -Value $pmSummaryContent -Encoding UTF8
    $pmStatus = $PmSummary
}

if (-not $SkipPm -and -not $SkipWord) {
    $exportScript = Join-Path "scripts" "export-pm-report-docx.ps1"
    if (Test-Path $exportScript) {
        $exportOutput = & ".\$exportScript" -Source $PmSummary -Output $PmWord
        $exportOutput | Write-Output
        $exportedLine = $exportOutput | Where-Object { $_ -match '^Exported PM Word report:\s*(.+)$' } | Select-Object -First 1
        if ($exportedLine -match '^Exported PM Word report:\s*(.+)$') {
            $wordStatus = $Matches[1]
        } else {
            $wordStatus = $PmWord
        }
    } else {
        $wordStatus = "Export script not found: $exportScript"
    }
}

Write-Output "Generated QA report:"
Write-Output "  $QaReport"
Write-Output "Generated PM summary:"
Write-Output "  $pmStatus"
Write-Output "Generated PM Word report:"
Write-Output "  $wordStatus"
Write-Output ""
Write-Output "Release status: $releaseStatus"

