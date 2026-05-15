param(
    [Parameter(Mandatory=$false)]
    [string]$FeatureName,

    [Parameter(Mandatory=$false)]
    [string]$InboxFile,

    [Parameter(Mandatory=$false)]
    [switch]$Yes
)

$ErrorActionPreference = "Stop"

function ConvertTo-FeatureName {
    param([string]$FileName)

    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
    return $baseName.Trim().ToLowerInvariant() -replace '[^a-z0-9_-]+', '-'
}

function Show-InboxList {
    param([array]$Items)

    Write-Output ""
    Write-Output "PM inbox items:"
    for ($i = 0; $i -lt $Items.Count; $i++) {
        $status = if ($Items[$i].ExistsAsSpec) { "already exists" } else { "new" }
        Write-Output ("[{0}] {1} -> {2} ({3})" -f ($i + 1), $Items[$i].File.Name, $Items[$i].FeatureName, $status)
    }
    Write-Output ""
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$inboxDir = Join-Path $repoRoot "pm-inbox"
$specsDir = Join-Path $repoRoot "qa-workspace\specs"
$templateDir = Join-Path $specsDir "_template"

if (-not (Test-Path $templateDir)) {
    throw "Template directory not found: $templateDir"
}

if (-not (Test-Path $inboxDir)) {
    throw "PM inbox directory not found: $inboxDir"
}

$inboxFiles = Get-ChildItem -LiteralPath $inboxDir -File -Filter "*.md" |
    Where-Object { $_.Name -ne "README.md" } |
    Sort-Object Name

if (-not $inboxFiles -or $inboxFiles.Count -eq 0) {
    Write-Output "No PM inbox request files found."
    exit 0
}

$items = @()
foreach ($file in $inboxFiles) {
    $derivedFeatureName = ConvertTo-FeatureName -FileName $file.Name
    $targetPath = Join-Path $specsDir $derivedFeatureName
    $items += [PSCustomObject]@{
        File = $file
        FeatureName = $derivedFeatureName
        TargetPath = $targetPath
        ExistsAsSpec = Test-Path $targetPath
    }
}

if (-not $InboxFile) {
    Show-InboxList -Items $items

    if (-not $FeatureName) {
        $selection = Read-Host "Select an inbox item number to inspect"
        if (-not ($selection -as [int])) {
            throw "Invalid selection: $selection"
        }

        $index = [int]$selection - 1
        if ($index -lt 0 -or $index -ge $items.Count) {
            throw "Selection out of range: $selection"
        }

        $selected = $items[$index]
        $FeatureName = $selected.FeatureName
        $InboxFile = $selected.File.FullName
    } else {
        $matched = $items | Where-Object { $_.FeatureName -eq $FeatureName } | Select-Object -First 1
        if (-not $matched) {
            $InboxFile = Join-Path $inboxDir "$FeatureName.md"
        } else {
            $InboxFile = $matched.File.FullName
        }
    }
}

if (-not (Test-Path $InboxFile)) {
    throw "Inbox file not found: $InboxFile"
}

if (-not $FeatureName) {
    $FeatureName = ConvertTo-FeatureName -FileName (Split-Path $InboxFile -Leaf)
}

$targetDir = Join-Path $specsDir $FeatureName

Write-Output ""
Write-Output "Selected PM inbox file:"
Write-Output "  Inbox file : $InboxFile"
Write-Output "  Feature    : $FeatureName"
Write-Output "  Target dir : $targetDir"
Write-Output ""

if (Test-Path $targetDir) {
    Write-Output "A feature directory already exists for this item."
    Write-Output "No files were changed."
    exit 0
}

$inboxContent = Get-Content -LiteralPath $InboxFile -Raw

Write-Output "PM inbox preview:"
Write-Output "------------------------------------------------------------"
Write-Output $inboxContent
Write-Output "------------------------------------------------------------"
Write-Output ""

if (-not $Yes) {
    $confirm = Read-Host "Create qa-workspace/specs/$FeatureName from this PM inbox item? Type YES to continue"
    if ($confirm -ne "YES") {
        Write-Output "Cancelled. No files were changed."
        exit 0
    }
}

New-Item -ItemType Directory -Path $targetDir | Out-Null
Copy-Item -Path (Join-Path $templateDir "*") -Destination $targetDir -Recurse

$specPath = Join-Path $targetDir "spec.md"
$specContent = @"
# Feature: $FeatureName

> This file was initialized from PM inbox. QA/AI should refine it into a testable specification.

## PM Inbox Source

````md
$inboxContent
````

## Customer Request

To be refined by QA/AI from PM Inbox Source.

## Background

To be refined by QA/AI from PM Inbox Source.

## Business Goal

Not confirmed.

## User Roles

- Not confirmed

## Scope

### In Scope

- To be refined

### Out of Scope

- Not confirmed

## Acceptance Criteria

- To be refined

## Business Rules

- Not confirmed

## Error Messages

Not confirmed.

## Dependencies

- Not confirmed

## Open Questions

- To be refined
"@

Set-Content -LiteralPath $specPath -Value $specContent -Encoding UTF8

Write-Output ""
Write-Output "Created feature directory:"
Write-Output "  $targetDir"
Write-Output ""
Write-Output "Next step:"
Write-Output "  Ask QA/AI to refine spec.md and generate questions.md."

