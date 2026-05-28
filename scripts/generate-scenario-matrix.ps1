param(
    [Parameter(Mandatory=$false)]
    [string]$SpecsRoot = "qa-workspace/specs",

    [Parameter(Mandatory=$false)]
    [string]$Output = "artifacts/generated/qa/scenario-matrix.md",

    [Parameter(Mandatory=$false)]
    [string]$ExcelOutput = "artifacts/generated/qa/scenario-matrix.xlsx",

    [Parameter(Mandatory=$false)]
    [switch]$SkipExcel
)

$ErrorActionPreference = "Stop"

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

function Get-FieldValue {
    param(
        [string]$Block,
        [string]$Field,
        [string]$Default = ""
    )

    $escaped = [regex]::Escape($Field)
    $match = [regex]::Match($Block, "(?m)^-\s+$escaped\s*:\s*(.+?)\s*$")
    if ($match.Success) {
        return ($match.Groups[1].Value.Trim() -replace '\|', '\|')
    }

    return $Default
}

function Get-ScenarioRows {
    param(
        [string]$Feature,
        [string]$Path
    )

    $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    $matches = [regex]::Matches($content, '(?m)^###\s+(SC-[A-Z0-9_-]+)\s*$')
    $rows = @()

    for ($i = 0; $i -lt $matches.Count; $i++) {
        $current = $matches[$i]
        $nextStart = if ($i + 1 -lt $matches.Count) { $matches[$i + 1].Index } else { $content.Length }
        $block = $content.Substring($current.Index, $nextStart - $current.Index)

        $rows += [PSCustomObject]@{
            Feature = $Feature
            ScenarioId = $current.Groups[1].Value
            SourceAcceptance = Get-FieldValue -Block $block -Field "Source acceptance"
            Type = Get-FieldValue -Block $block -Field "Type"
            Priority = Get-FieldValue -Block $block -Field "Priority"
            AutomationCandidate = Get-FieldValue -Block $block -Field "Automation candidate"
            Status = Get-FieldValue -Block $block -Field "Status" -Default "Not Marked"
            SourceFile = $Path
        }
    }

    return $rows
}

function Get-ScenarioReviewStatuses {
    param([string]$SpecsRoot)

    $statuses = @{}
    Get-ChildItem -Path $SpecsRoot -Directory |
        Where-Object { $_.Name -notmatch '^[._]' } |
        ForEach-Object {
            $path = Join-Path $_.FullName "execution-results.json"
            if (-not (Test-Path $path)) {
                return
            }

            try {
                $content = Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json
                foreach ($review in @($content.scenario_reviews)) {
                    if ($review.scenario_id) {
                        $statuses[$review.scenario_id] = if ([string]::IsNullOrWhiteSpace($review.status)) { "Not Marked" } else { $review.status }
                    }
                }
            } catch {
                Write-Warning "Cannot read scenario reviews: $path"
            }
        }

    return $statuses
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Test-Path $SpecsRoot)) {
    throw "Specs root not found: $SpecsRoot"
}

$allRows = @()
Get-ChildItem -Path $SpecsRoot -Directory |
    Where-Object { $_.Name -notmatch '^[._]' } |
    ForEach-Object {
        $path = Join-Path $_.FullName "scenarios.md"
        if (Test-Path $path) {
            $allRows += Get-ScenarioRows -Feature $_.Name -Path $path
        }
    }

New-Item -ItemType Directory -Force -Path (Split-Path $Output -Parent) | Out-Null

$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCommand) {
    $normalizeOutput = & $pythonCommand.Source scripts/validate-execution-results.py --specs-root $SpecsRoot --fix
    $normalizeOutput | Write-Output
}

$scenarioReviewStatuses = Get-ScenarioReviewStatuses -SpecsRoot $SpecsRoot
foreach ($row in $allRows) {
    if ($scenarioReviewStatuses.ContainsKey($row.ScenarioId)) {
        $row.Status = $scenarioReviewStatuses[$row.ScenarioId]
    }
}

$generatedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$total = $allRows.Count
$approved = ($allRows | Where-Object { $_.Status -eq "Approved" }).Count
$ready = ($allRows | Where-Object { $_.Status -eq "Ready" }).Count
$needConfirm = ($allRows | Where-Object { $_.Status -eq "Need Confirm" }).Count
$blocked = ($allRows | Where-Object { $_.Status -eq "Blocked" }).Count
$notMarked = ($allRows | Where-Object { $_.Status -eq "Not Marked" }).Count
$autoCandidates = ($allRows | Where-Object { $_.AutomationCandidate -match 'true|yes|是' }).Count

$matrixRows = if ($allRows.Count -gt 0) {
    ($allRows | Sort-Object Feature, ScenarioId | ForEach-Object {
        "| $($_.Feature) | $($_.ScenarioId) | $($_.SourceAcceptance) | $($_.Type) | $($_.Priority) | $($_.AutomationCandidate) | $($_.Status) |"
    }) -join "`n"
} else {
    "| 無 | 無 | 尚未找到測試情境 |  |  |  |  |"
}

$content = @"
# 測試情境矩陣

## 摘要

- 產生時間：$generatedAt
- 情境總數：$total
- Approved：$approved
- Ready：$ready
- Need Confirm：$needConfirm
- Blocked：$blocked
- Not Marked：$notMarked
- Automation Candidate：$autoCandidates

## 矩陣表

| 功能 | Scenario ID | 驗收來源 | 類型 | 優先級 | 適合自動化 | 狀態 |
|---|---|---|---|---|---|---|
$matrixRows

## 來源

- qa-workspace/specs/*/scenarios.md
"@

Set-Content -LiteralPath $Output -Value $content -Encoding UTF8

$excelStatus = "Skipped"
if (-not $SkipExcel) {
    if ($pythonCommand) {
        $pythonOutput = & $pythonCommand.Source scripts/generate-scenario-matrix-xlsx.py --specs-root $SpecsRoot --output $ExcelOutput
        $pythonOutput | Write-Output
        $outputLine = $pythonOutput | Where-Object { $_ -match '^Generated Excel scenario matrix:\s*(.+)$' } | Select-Object -First 1
        if ($outputLine -match '^Generated Excel scenario matrix:\s*(.+)$') {
            $excelStatus = $Matches[1]
        } else {
            $excelStatus = $ExcelOutput
        }
    } else {
        $excelStatus = "Python not found"
    }
}

Write-Output "Generated scenario matrix:"
Write-Output "  $Output"
Write-Output "Generated Excel scenario matrix:"
Write-Output "  $excelStatus"
Write-Output ""
Write-Output "Total scenarios: $total"



