param(
    [string]$CsvPath = "qa-workspace/execution-results.csv",
    [string]$SpecDir = "qa-workspace/specs"
)

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

if ($PSScriptRoot) {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    Set-Location $repoRoot
} else {
    $repoRoot = (Get-Location).Path
}

if (-not (Test-Path $CsvPath)) {
    Write-Output "CSV not found: $CsvPath"
    exit 1
}

$rows = Import-Csv -LiteralPath $CsvPath -Encoding UTF8
$features = $rows | ForEach-Object { $_.feature } | Select-Object -Unique

foreach ($feature in $features) {
    $jsonPath = Join-Path $SpecDir "$feature/execution-results.json"

    if (-not (Test-Path $jsonPath)) {
        Write-Output "Skip $feature : not found $jsonPath"
        continue
    }

    $rawJson = Get-Content -LiteralPath $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

    $scenarioReviews = @($rawJson.scenario_reviews | ForEach-Object {
        $h = [ordered]@{}
        $_.PSObject.Properties | ForEach-Object { $h[$_.Name] = $_.Value }
        $h
    })

    $testResults = @($rawJson.test_results | ForEach-Object {
        $h = [ordered]@{}
        $_.PSObject.Properties | ForEach-Object { $h[$_.Name] = $_.Value }
        $h
    })

    $scenarioRows = @($rows | Where-Object { $_.feature -eq $feature -and $_.record_type -eq "scenario" })
    foreach ($row in $scenarioRows) {
        $review = $scenarioReviews | Where-Object { $_["scenario_id"] -eq $row.item_id } | Select-Object -First 1
        if ($review) {
            if (-not [string]::IsNullOrWhiteSpace($row.status)) { $review["status"] = $row.status }
            if ($null -ne $row.notes) { $review["notes"] = $row.notes }
        }
    }

    $testRows = @($rows | Where-Object { $_.feature -eq $feature -and $_.record_type -eq "test_case" })
    foreach ($row in $testRows) {
        $result = $testResults | Where-Object { $_["test_case_id"] -eq $row.item_id } | Select-Object -First 1
        if ($result) {
            $result["status"]   = if (-not [string]::IsNullOrWhiteSpace($row.status)) { $row.status } else { "Not Run" }
            $result["platform"] = if ($null -ne $row.platform) { $row.platform } else { "" }
            $result["test_url"] = if ($null -ne $row.test_url) { $row.test_url } else { "" }
            $result["evidence"] = if ($null -ne $row.evidence) { $row.evidence } else { "" }
            $result["notes"]    = if ($null -ne $row.notes)    { $row.notes }    else { "" }
            if (-not [string]::IsNullOrWhiteSpace($row.status) -and $row.status -ne "Not Run") {
                if ([string]::IsNullOrWhiteSpace($result["executed_at"])) {
                    $result["executed_at"] = Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"
                }
            } else {
                $result["executed_at"] = ""
            }
        }
    }

    $output = [ordered]@{
        feature            = $rawJson.feature
        source_test_cases  = $rawJson.source_test_cases
        scenario_reviews   = $scenarioReviews
        test_results       = $testResults
    }

    $jsonOut = $output | ConvertTo-Json -Depth 10
    $absPath = Join-Path $repoRoot $jsonPath
    [System.IO.File]::WriteAllText($absPath, $jsonOut, $utf8NoBom)
    Write-Output "Synced: $jsonPath"
}

Write-Output ""
Write-Output "CSV to JSON sync done."
