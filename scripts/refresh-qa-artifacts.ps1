param(
    [Parameter(Mandatory=$false)]
    [string]$SpecsRoot = "qa-workspace/specs",

    [Parameter(Mandatory=$false)]
    [switch]$IncludeWord
)

$ErrorActionPreference = "Stop"

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Output "Step 1/5 Validate SDD"
.\scripts\validate-sdd.ps1

Write-Output ""
Write-Output "Step 2/5 Validate test cases"
python scripts\validate-testcases.py --specs-root $SpecsRoot

Write-Output ""
Write-Output "Step 3/5 Auto-fill and validate execution results"
python scripts\validate-execution-results.py --specs-root $SpecsRoot --fix

Write-Output ""
Write-Output "Step 4/5 Generate scenario matrix and Excel"
.\scripts\generate-scenario-matrix.ps1 -SpecsRoot $SpecsRoot

Write-Output ""
Write-Output "Step 5/5 Generate QA / PM reports"
if ($IncludeWord) {
    .\scripts\generate-qa-report.ps1
} else {
    .\scripts\generate-qa-report.ps1 -SkipWord
}

Write-Output ""
Write-Output "QA artifacts refreshed."
