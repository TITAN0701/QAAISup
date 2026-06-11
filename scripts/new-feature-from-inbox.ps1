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

    throw "需求 $Index「$Title」缺少 {#slug}。請在標題後補上，例如：$Title {#your-slug-here}"
}

function Get-RequirementTitle {
    param([string]$Title)

    return ($Title -replace '\s*\{#[a-zA-Z0-9_-]+\}\s*$', '').Trim()
}

function Get-RequirementSections {
    param([string]$Content)

    $reqMatches = [regex]::Matches($Content, '(?m)^###\s*需求\s*(\d+)\s*[:：]\s*(.+?)\s*$')
    $sections = @()

    for ($i = 0; $i -lt $reqMatches.Count; $i++) {
        $match = $reqMatches[$i]
        if ($i + 1 -lt $reqMatches.Count) {
            $nextStart = $reqMatches[$i + 1].Index
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

function Expand-Template {
    param(
        [string]$TemplatePath,
        [hashtable]$Vars
    )

    $content = Get-Content -LiteralPath $TemplatePath -Raw -Encoding UTF8
    foreach ($key in $Vars.Keys) {
        $content = $content.Replace("{{$key}}", $Vars[$key])
    }
    return $content
}

function Initialize-SpecDirectory {
    param([string]$TargetDir)

    New-Item -ItemType Directory -Path $TargetDir | Out-Null
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
        [string]$SourcePath = "pm-inbox/unknown.md",
        [Parameter(Mandatory=$true)][string]$TemplateDir
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

    $vars = @{
        FEATURE_NAME      = $featureName
        REQUIREMENT_TITLE = $requirementTitle
        SOURCE_PATH       = $SourcePath
        SECTION_BODY      = $Section.Body
        STORY             = $story
        SCOPE_LINES       = $scopeLines
        ACCEPTANCE_LINES  = $acceptanceLines
        NOTE_LINES        = $noteLines
        QUESTION_LINES    = ($questionLines -join "`n")
        SCENARIO_LINES    = ($scenarioLines -join "`n")
    }

    $specContent      = Expand-Template -TemplatePath (Join-Path $TemplateDir "spec.md")      -Vars $vars
    $questionsContent = Expand-Template -TemplatePath (Join-Path $TemplateDir "questions.md") -Vars $vars
    $scenariosContent = Expand-Template -TemplatePath (Join-Path $TemplateDir "scenarios.md") -Vars $vars
    $planContent      = Expand-Template -TemplatePath (Join-Path $TemplateDir "plan.md")      -Vars $vars
    $readmeContent    = Expand-Template -TemplatePath (Join-Path $TemplateDir "README.md")    -Vars $vars
    $tasksContent     = Expand-Template -TemplatePath (Join-Path $TemplateDir "tasks.md")     -Vars $vars

    $updated = @()
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "spec.md")      -Value $specContent)      { $updated += "spec.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "README.md")    -Value $readmeContent)    { $updated += "README.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "questions.md") -Value $questionsContent) { $updated += "questions.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "scenarios.md") -Value $scenariosContent) { $updated += "scenarios.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "plan.md")      -Value $planContent)      { $updated += "plan.md" }
    if (Set-IfEmptyOrTemplate -Path (Join-Path $TargetDir "tasks.md")     -Value $tasksContent)     { $updated += "tasks.md" }

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

$repoRoot    = Split-Path -Parent $PSScriptRoot
$inboxDir    = Join-Path $repoRoot "pm-inbox"
$specsDir    = Join-Path $repoRoot "qa-workspace\specs"
$templateDir = Join-Path $specsDir "_template"

if (-not (Test-Path $templateDir)) {
    throw "Template directory not found: $templateDir. Expected qa-workspace/specs/_template/"
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
            $updatedFiles = New-QaDraftDocs -TargetDir $sectionTargetDir -Section $section -SourcePath $sourceInboxPath -TemplateDir $templateDir
            if ($updatedFiles.Count -gt 0) {
                $updatedDrafts += ("{0}: {1}" -f $sectionTargetDir, ($updatedFiles -join ", "))
            } else {
                $skippedDirs += $sectionTargetDir
            }
            continue
        }

        Initialize-SpecDirectory -TargetDir $sectionTargetDir

        $sectionSpecContent = Expand-Template -TemplatePath (Join-Path $templateDir "spec-stub.md") -Vars @{
            FEATURE_NAME      = $section.FeatureName
            REQUIREMENT_TITLE = $section.Title
            SOURCE_PATH       = $sourceInboxPath
            SECTION_BODY      = $section.Body
        }
        Set-Content -LiteralPath (Join-Path $sectionTargetDir "spec.md") -Value $sectionSpecContent -Encoding UTF8

        [void](New-QaDraftDocs -TargetDir $sectionTargetDir -Section $section -SourcePath $sourceInboxPath -TemplateDir $templateDir)
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

Initialize-SpecDirectory -TargetDir $targetDir

$specContent = Expand-Template -TemplatePath (Join-Path $templateDir "spec-stub-single.md") -Vars @{
    FEATURE_NAME = $FeatureName
    SOURCE_PATH  = $sourceInboxPath
    SECTION_BODY = $inboxContent
}
Set-Content -LiteralPath (Join-Path $targetDir "spec.md") -Value $specContent -Encoding UTF8

Write-Output ""
Write-Output "Created feature directory:"
Write-Output "  $targetDir"
Write-Output ""
Write-Output "Next step:"
Write-Output "  Ask QA/AI to refine spec.md and generate questions.md."
