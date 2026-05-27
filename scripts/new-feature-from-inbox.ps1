param(
    [Parameter(Mandatory=$false)]
    [string]$FeatureName,

    [Parameter(Mandatory=$false)]
    [string]$InboxFile,

    [Parameter(Mandatory=$false)]
    [switch]$Yes,

    [Parameter(Mandatory=$false)]
    [switch]$SplitRequirements
)

$ErrorActionPreference = "Stop"

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

function ConvertTo-FeatureName {
    param([string]$FileName)

    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
    return $baseName.Trim().ToLowerInvariant() -replace '[^a-z0-9_-]+', '-'
}

function ConvertTo-RequirementFeatureName {
    param(
        [string]$Title,
        [int]$Index
    )

    if ($Title -match '\{#([a-zA-Z0-9_-]+)\}') {
        return $Matches[1].ToLowerInvariant()
    }

    $cleanTitle = $Title -replace '\{#[a-zA-Z0-9_-]+\}', ''
    $slug = $cleanTitle.Trim().ToLowerInvariant() -replace '[^a-z0-9_-]+', '-'
    $slug = $slug.Trim("-")

    if ($slug) {
        return $slug
    }

    if ($cleanTitle -match '登入') {
        return 'login'
    }
    if ($cleanTitle -match '忘記密碼|重設密碼') {
        return 'forgot-password'
    }
    if ($cleanTitle -match '創建帳號|註冊|建立帳號') {
        return 'register'
    }

    return "requirement-$Index"
}

function Get-RequirementTitle {
    param([string]$Title)

    return ($Title -replace '\s*\{#[a-zA-Z0-9_-]+\}\s*$', '').Trim()
}

function Get-RequirementSections {
    param([string]$Content)

    $matches = [regex]::Matches($Content, '(?m)^###\s*需求\s*(\d+)\s*[:：]\s*(.+?)\s*$')
    $sections = @()

    for ($i = 0; $i -lt $matches.Count; $i++) {
        $match = $matches[$i]
        if ($i + 1 -lt $matches.Count) {
            $nextStart = $matches[$i + 1].Index
        } else {
            $nextMajorHeading = [regex]::Match($Content.Substring($match.Index + $match.Length), '(?m)^##\s+')
            $nextStart = if ($nextMajorHeading.Success) {
                $match.Index + $match.Length + $nextMajorHeading.Index
            } else {
                $Content.Length
            }
        }
        $body = $Content.Substring($match.Index, $nextStart - $match.Index).Trim()
        $rawTitle = $match.Groups[2].Value.Trim()
        $index = [int]$match.Groups[1].Value

        $sections += [PSCustomObject]@{
            Index = $index
            Title = Get-RequirementTitle -Title $rawTitle
            FeatureName = ConvertTo-RequirementFeatureName -Title $rawTitle -Index $index
            Body = $body
        }
    }

    return $sections
}

function Initialize-SpecDirectory {
    param(
        [string]$TargetDir,
        [string]$TemplateDir
    )

    New-Item -ItemType Directory -Path $TargetDir | Out-Null

    if ($TemplateDir -and (Test-Path $TemplateDir)) {
        Copy-Item -Path (Join-Path $TemplateDir "*") -Destination $TargetDir -Recurse
        return
    }

    Set-Content -LiteralPath (Join-Path $TargetDir "README.md") -Value "# QA/AI Spec Workspace`n" -Encoding UTF8
    Set-Content -LiteralPath (Join-Path $TargetDir "questions.md") -Value "# QA/AI Questions for PM`n`n## Need Clarification`n`n## Confirmed Decisions`n" -Encoding UTF8
    Set-Content -LiteralPath (Join-Path $TargetDir "scenarios.md") -Value "# Test Scenarios`n" -Encoding UTF8
    Set-Content -LiteralPath (Join-Path $TargetDir "plan.md") -Value "# Test Plan`n" -Encoding UTF8
    Set-Content -LiteralPath (Join-Path $TargetDir "tasks.md") -Value "# Tasks`n" -Encoding UTF8
}

function Get-MarkdownSection {
    param(
        [string]$Content,
        [string]$Heading
    )

    $escapedHeading = [regex]::Escape($Heading)
    $match = [regex]::Match($Content, "(?ms)^####\s+$escapedHeading\s*(.*?)(?=^####\s+|\z)")
    if ($match.Success) {
        return $match.Groups[1].Value.Trim()
    }

    return ""
}

function Get-Bullets {
    param([string]$Content)

    $bullets = @()
    foreach ($line in ($Content -split "`r?`n")) {
        if ($line -match '^\s*-\s+(.+?)\s*$') {
            $bullets += $Matches[1]
        }
    }

    return $bullets
}

function Test-EmptyOrTemplateFile {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return $true
    }

    $content = (Get-Content -LiteralPath $Path -Raw -Encoding UTF8).Trim()
    return (
        $content -eq "" -or
        $content -match '\$\(@\{' -or
        $content -match 'To be refined by QA/AI from PM Inbox Source' -or
        $content -match 'Review spec\.md and confirm the PM requirement was split correctly' -or
        $content -eq "# QA/AI Spec Workspace" -or
        $content -eq "# Test Plan" -or
        $content -eq "# Test Scenarios" -or
        $content -eq "# Tasks" -or
        $content -eq "# QA/AI Questions for PM`n`n## Need Clarification`n`n## Confirmed Decisions"
    )
}

function Set-IfEmptyOrTemplate {
    param(
        [string]$Path,
        [string]$Value
    )

    if (Test-EmptyOrTemplateFile -Path $Path) {
        Set-Content -LiteralPath $Path -Value $Value -Encoding UTF8
        return $true
    }

    return $false
}

function Convert-BulletsToMarkdown {
    param(
        [array]$Items,
        [string]$Fallback
    )

    if ($Items.Count -eq 0) {
        return "- $Fallback"
    }

    return (($Items | ForEach-Object { "- $_" }) -join "`n")
}

function New-QaDraftDocs {
    param(
        [string]$TargetDir,
        [object]$Section,
        [string]$SourcePath = "pm-inbox/unknown.md"
    )

    $story = Get-MarkdownSection -Content $Section.Body -Heading "使用者故事"
    $description = Get-MarkdownSection -Content $Section.Body -Heading "功能說明"
    $acceptance = Get-MarkdownSection -Content $Section.Body -Heading "驗收條件"
    $notes = Get-MarkdownSection -Content $Section.Body -Heading "PM 補充"
    $descriptionBullets = Get-Bullets -Content $description
    $acceptanceBullets = Get-Bullets -Content $acceptance
    $noteBullets = Get-Bullets -Content $notes
    $featureName = $Section.FeatureName
    $requirementTitle = $Section.Title
    $scopeLines = Convert-BulletsToMarkdown -Items $descriptionBullets -Fallback "待 QA/AI 根據 PM 需求補充測試範圍。"
    $acceptanceLines = Convert-BulletsToMarkdown -Items $acceptanceBullets -Fallback "待 QA/AI 根據 PM 需求補充驗收條件。"
    $noteLines = Convert-BulletsToMarkdown -Items $noteBullets -Fallback "無。"

    $specContent = @"
# Feature: $featureName

> Draft generated from PM inbox requirement "$requirementTitle". QA/AI should review and refine before automation.

## PM Inbox Source

- Source file: $SourcePath
- Requirement: $requirementTitle

~~~md
$($Section.Body)
~~~

## Customer Request

$story

## Background

此需求來自會員入口需求集合，目標是讓使用者可以完成「$requirementTitle」相關流程。

## Business Goal

- 支援會員入口的必要使用者流程。
- 降低使用者在登入、帳號存取或註冊入口上的阻塞。

## User Roles

- 一般使用者

## Scope

### In Scope

$scopeLines

### Out of Scope

- PM 標示為暫不納入或尚未確認的內容。
- 未在此需求章節列出的延伸流程。

## Acceptance Criteria

$acceptanceLines

## Business Rules

$noteLines

## Error Messages

- 依驗收條件與 PM 回答確認。
- 若文案尚未確認，測試應先標記為待釐清，不應硬編碼斷言。

## Dependencies

- 測試環境登入入口 URL。
- 穩定 selector 或 data-testid。
- 可用測試資料。
- 若涉及 API 或通知寄送，需後端/API 文件或測試替身。

## Open Questions

- 請參考 questions.md。
"@

    $scenarioLines = @()
    $caseIndex = 1
    foreach ($criterion in $acceptanceBullets) {
        $id = "{0:D3}" -f $caseIndex
        $scenarioLines += "### SC-$($Section.FeatureName.ToUpperInvariant())-$id"
        $scenarioLines += ""
        $scenarioLines += "- Source acceptance: $criterion"
        $scenarioLines += "- Type: e2e"
        $scenarioLines += "- Priority: high"
        $scenarioLines += "- Automation candidate: true"
        $scenarioLines += ""
        $caseIndex++
    }
    if ($scenarioLines.Count -eq 0) {
        $scenarioLines += "- 待 QA/AI 根據 PM 需求補充測試情境。"
    }

    $questionLines = @()
    $questionIndex = 1
    foreach ($note in $noteBullets) {
        if ($note -match '待確認|暫不納入|是否|未確認') {
            $questionLines += "$questionIndex. $note"
            $questionLines += "   - Impact: 影響驗收條件、測試資料或自動化斷言。"
            $questionLines += "   - PM Answer:"
            $questionLines += "   - Status: Open"
            $questionLines += ""
            $questionIndex++
        }
    }
    foreach ($criterion in $acceptanceBullets) {
        if ($criterion -match '提示|導向|成功|建立帳號|重設通知') {
            $questionLines += "$questionIndex. 請確認「$criterion」的實際畫面文案、URL 或成功狀態。"
            $questionLines += "   - Impact: 影響 E2E 測試斷言。"
            $questionLines += "   - PM Answer:"
            $questionLines += "   - Status: Open"
            $questionLines += ""
            $questionIndex++
        }
    }
    if ($questionLines.Count -eq 0) {
        $questionLines += "- 目前 PM 需求足以產生初版測試情境，暫無阻塞問題。"
    }

    $questionsContent = @"
# QA/AI Questions for PM: $requirementTitle

## Need Clarification

$($questionLines -join "`n")
## Confirmed Decisions

- Source requirement: $requirementTitle
- User story: $story
"@

    $scenariosContent = @"
# Test Scenarios: $requirementTitle

## Source

- Feature: $featureName
- Requirement: $requirementTitle

## Scenarios

$($scenarioLines -join "`n")
"@

    $planContent = @"
# Test Plan: $requirementTitle

## Status

- Draft generated from PM inbox.
- Feature workspace: qa-workspace/specs/$featureName/

## Test Scope

$scopeLines

## Acceptance Coverage

$acceptanceLines

## Out of Scope

- PM 標示為暫不納入或尚未確認的內容。
- API、selector、實際測試資料尚未提供前，不列為可執行自動化的硬性前提。

## Test Types

- E2E: 覆蓋主要使用者流程。
- Negative: 覆蓋必填、格式錯誤或錯誤輸入。
- UI Validation: 覆蓋欄位、導頁、提示訊息。
- Regression: 確認此功能不破壞相關入口或既有流程。

## Test Data

- Valid user data: 待 QA/PM 提供。
- Invalid input data: 依驗收條件設計。
- Empty input data: 用於必填驗證。

## Automation Candidate

- 驗收條件中的主要正向流程。
- 必填與格式錯誤等穩定負向流程。

## Risks

- Medium: PM 文案、URL、測試資料尚未完全確認，可能影響自動化斷言。
- Medium: 若缺少穩定 selector 或 API contract，自動化需等開發補齊。

## Open Questions

請參考 questions.md。
"@

    $readmeContent = @"
# $requirementTitle

## Purpose

此資料夾是 $featureName 功能的 QA/AI 工作區，從 PM 文件中的「$requirementTitle」需求拆分產生。

## Source

- PM inbox: $SourcePath
- Feature key: $featureName
- Requirement title: $requirementTitle

## User Story

$story

## Workspace Files

- spec.md: PM 原始需求與待整理規格。
- questions.md: QA/AI 需要 PM 釐清的問題。
- scenarios.md: 初版測試情境。
- plan.md: 初版測試計畫。
- tasks.md: QA、PM、Automation 後續任務。

## Review Checklist

- [ ] 確認此資料夾只包含 $requirementTitle 的需求。
- [ ] 檢查 questions.md 是否需要 PM 回答。
- [ ] 檢查 scenarios.md 是否完整覆蓋驗收條件。
- [ ] 檢查 plan.md 的測試範圍與風險是否合理。
- [ ] 補上測試資料、selector、API contract 或環境限制。

## Current Status

- Draft generated from PM inbox.
- 等待 QA review 與 PM answer。
"@

    $tasksContent = @"
# Tasks: $requirementTitle

## QA

- [ ] 檢查 spec.md，確認 PM 需求已正確拆分到此功能資料夾。
- [ ] 檢查 questions.md，整理需要 PM 回答的問題。
- [ ] 將 PM 回答補回 questions.md。
- [ ] 根據 PM 回答調整 scenarios.md。
- [ ] 根據實際測試範圍調整 plan.md。

## Automation

- [ ] 確認此功能所需的穩定 selector 或 data-testid。
- [ ] 準備必要測試資料。
- [ ] 驗收條件確認後，建立 Cypress E2E 測試。
- [ ] 執行 E2E 測試並產出測試結果。

## PM

- [ ] 回答 questions.md 中的待釐清問題。
- [ ] 確認成功訊息、錯誤訊息與頁面導向規則。
"@

    $updated = @()
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "spec.md") -Value $specContent) { $updated += "spec.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "README.md") -Value $readmeContent) { $updated += "README.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "questions.md") -Value $questionsContent) { $updated += "questions.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "scenarios.md") -Value $scenariosContent) { $updated += "scenarios.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "plan.md") -Value $planContent) { $updated += "plan.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "tasks.md") -Value $tasksContent) { $updated += "tasks.md" }

    return $updated
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
    $alternateTemplateDir = Join-Path $specsDir ".template"
    $templateDir = if (Test-Path $alternateTemplateDir) { $alternateTemplateDir } else { $null }
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

$resolvedInboxFile = (Resolve-Path -LiteralPath $InboxFile).Path
$sourceInboxPath = $resolvedInboxFile
if ($resolvedInboxFile.StartsWith($repoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    $sourceInboxPath = $resolvedInboxFile.Substring($repoRoot.Length).TrimStart("\", "/") -replace "\\", "/"
}

if (-not $FeatureName) {
    $FeatureName = ConvertTo-FeatureName -FileName (Split-Path $InboxFile -Leaf)
}

$targetDir = Join-Path $specsDir $FeatureName

Write-Output ""
Write-Output "Selected PM inbox file:"
Write-Output "  Inbox file : $InboxFile"
Write-Output "  Feature    : $FeatureName"
if ($SplitRequirements) {
    Write-Output "  Mode       : split requirements"
} else {
    Write-Output "  Target dir : $targetDir"
}
Write-Output ""

$inboxContent = Get-Content -LiteralPath $InboxFile -Raw -Encoding UTF8
$requirementSections = Get-RequirementSections -Content $inboxContent

if (-not $SplitRequirements -and -not $Yes -and $requirementSections.Count -gt 1) {
    Write-Output "Detected multiple requirements in this PM inbox file:"
    foreach ($section in $requirementSections) {
        Write-Output ("  - {0} -> qa-workspace/specs/{1}" -f $section.Title, $section.FeatureName)
    }
    Write-Output ""

    $splitChoice = Read-Host "Type SPLIT to create one folder per requirement, or SINGLE to create one folder for the whole PM file"
    if ($splitChoice -eq "SPLIT") {
        $SplitRequirements = $true
    } elseif ($splitChoice -ne "SINGLE") {
        Write-Output "Cancelled. No files were changed."
        exit 0
    }
}

if ($SplitRequirements -and $requirementSections.Count -eq 0) {
    throw "No requirement sections found. Expected headings like: ### 需求 1: 一般登入 {#login}"
}

if (-not $SplitRequirements -and (Test-Path $targetDir)) {
    Write-Output "A feature directory already exists for this item."
    Write-Output "No files were changed."
    exit 0
}

Write-Output "PM inbox preview:"
Write-Output "------------------------------------------------------------"
Write-Output $inboxContent
Write-Output "------------------------------------------------------------"
Write-Output ""

if ($SplitRequirements) {
    Write-Output "Detected requirements:"
    foreach ($section in $requirementSections) {
        Write-Output ("  - {0} -> qa-workspace/specs/{1}" -f $section.Title, $section.FeatureName)
    }
    Write-Output ""
}

if (-not $Yes) {
    $confirmMessage = if ($SplitRequirements) {
        "Create one qa-workspace/specs folder per detected requirement? Type YES to continue"
    } else {
        "Create qa-workspace/specs/$FeatureName from this PM inbox item? Type YES to continue"
    }
    $confirm = Read-Host $confirmMessage
    if ($confirm -ne "YES") {
        Write-Output "Cancelled. No files were changed."
        exit 0
    }
}

if ($SplitRequirements) {
    $createdDirs = @()
    $skippedDirs = @()
    $updatedDrafts = @()

    foreach ($section in $requirementSections) {
        $sectionTargetDir = Join-Path $specsDir $section.FeatureName

        if (Test-Path $sectionTargetDir) {
            $updatedFiles = New-QaDraftDocs -TargetDir $sectionTargetDir -Section $section -SourcePath $sourceInboxPath
            if ($updatedFiles.Count -gt 0) {
                $updatedDrafts += ("{0}: {1}" -f $sectionTargetDir, ($updatedFiles -join ", "))
            } else {
                $skippedDirs += $sectionTargetDir
            }
            continue
        }

        Initialize-SpecDirectory -TargetDir $sectionTargetDir -TemplateDir $templateDir

        $sectionSpecPath = Join-Path $sectionTargetDir "spec.md"
        $sectionSpecContent = @"
# Feature: $($section.FeatureName)

> This file was initialized from PM inbox requirement "$($section.Title)". QA/AI should refine it into a testable specification.

## PM Inbox Source

- Source file: $sourceInboxPath
- Requirement: $($section.Title)

~~~md
$($section.Body)
~~~

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

        Set-Content -LiteralPath $sectionSpecPath -Value $sectionSpecContent -Encoding UTF8
        [void](New-QaDraftDocs -TargetDir $sectionTargetDir -Section $section -SourcePath $sourceInboxPath)
        $createdDirs += $sectionTargetDir
    }

    Write-Output ""
    if ($createdDirs.Count -gt 0) {
        Write-Output "Created feature directories:"
        foreach ($dir in $createdDirs) {
            Write-Output "  $dir"
        }
    }

    if ($skippedDirs.Count -gt 0) {
        Write-Output ""
        Write-Output "Skipped existing feature directories with non-template QA docs:"
        foreach ($dir in $skippedDirs) {
            Write-Output "  $dir"
        }
    }

    if ($updatedDrafts.Count -gt 0) {
        Write-Output ""
        Write-Output "Updated empty/template QA draft files:"
        foreach ($item in $updatedDrafts) {
            Write-Output "  $item"
        }
    }

    Write-Output ""
    Write-Output "Next step:"
    Write-Output "  Review generated QA draft docs, then refine PM answers and automation details."
    exit 0
}

Initialize-SpecDirectory -TargetDir $targetDir -TemplateDir $templateDir

$specPath = Join-Path $targetDir "spec.md"
$specContent = @"
# Feature: $FeatureName

> This file was initialized from PM inbox. QA/AI should refine it into a testable specification.

## PM Inbox Source

- Source file: $sourceInboxPath

~~~md
$inboxContent
~~~

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

