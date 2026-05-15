param(
    [Parameter(Mandatory=$false)]
    [string]$Source = "artifacts/generated/pm/release-summary.md",

    [Parameter(Mandatory=$false)]
    [string]$Output = "artifacts/generated/pm/release-summary.docx"
)

$ErrorActionPreference = "Stop"

$localPython = Join-Path $env:LOCALAPPDATA "Programs\Python\Python313\python.exe"

if (Test-Path $localPython) {
    $python = $localPython
} else {
    $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCommand) {
        $python = $pythonCommand.Source
    }
}

if (-not $python) {
    throw "Python was not found. Install Python and run: pip install -r requirements.txt"
}

& $python scripts/export-pm-report-docx.py --source $Source --output $Output
