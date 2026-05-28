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

    $json = Get-Content -LiteralPath $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

    $scenarioRows = @($rows | Where-Object { $_.feature -eq $feature -and $_.record_type -eq "scenario" })
    foreach ($row in $scenarioRows) {
        $review = $json.scenario_reviews | Where-Object { $_.scenario_id -eq $row.item_id }
        if ($review) {
            if (-not [string]::IsNullOrWhiteSpace($row.status)) { $review.PSObject.Properties["status"].Value = $row.status }
            if ($null -ne $row.notes) { $review.PSObject.Properties["notes"].Value = $row.notes }
        }
    }

    $testRows = @($rows | Where-Object { $_.feature -eq $feature -and $_.record_type -eq "test_case" })
    foreach ($row in $testRows) {
        $result = $json.test_results | Where-Object { $_.test_case_id -eq $row.item_id }
        if ($result) {
            $result.PSObject.Properties["status"].Value   = if (-not [string]::IsNullOrWhiteSpace($row.status)) { $row.status } else { "Not Run" }
            $result.PSObject.Properties["platform"].Value = if ($null -ne $row.platform) { $row.platform } else { "" }
            $result.PSObject.Properties["test_url"].Value = if ($null -ne $row.test_url) { $row.test_url } else { "" }
            $result.PSObject.Properties["evidence"].Value = if ($null -ne $row.evidence) { $row.evidence } else { "" }
            $result.PSObject.Properties["notes"].Value    = if ($null -ne $row.notes)    { $row.notes }    else { "" }
            if (-not [string]::IsNullOrWhiteSpace($row.status) -and $row.status -ne "Not Run") {
                if ([string]::IsNullOrWhiteSpace($result.executed_at)) {
                    $result.PSObject.Properties["executed_at"].Value = Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"
                }
            } else {
                $result.PSObject.Properties["executed_at"].Value = ""
            }
        }
    }

    $jsonOut = $json | ConvertTo-Json -Depth 10
    $absPath = Join-Path $repoRoot $jsonPath
    [System.IO.File]::WriteAllText($absPath, $jsonOut, $utf8NoBom)
    Write-Output "Synced: $jsonPath"
}

Write-Output ""
Write-Output "CSV to JSON sync done."
