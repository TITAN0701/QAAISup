param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,

    [Parameter(Mandatory=$true)]
    [string]$ProjectCode,

    [Parameter(Mandatory=$true)]
    [string]$SitUrl,

    [Parameter(Mandatory=$true)]
    [string]$TestEmail,

    [Parameter(Mandatory=$true)]
    [string]$TestPassword,

    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = ""
)

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

$Root = Split-Path -Parent $PSScriptRoot

Write-Host "`n🚀 開始初始化專案：$ProjectName ($ProjectCode)`n" -ForegroundColor Cyan

# ── 1. 清空 pm-inbox（保留 README.md）──
$pmInbox = Join-Path $Root "pm-inbox"
Get-ChildItem $pmInbox -File | Where-Object { $_.Name -ne "README.md" } | Remove-Item -Force
Write-Host "✓ pm-inbox 已清空（保留 README.md）"

# ── 2. 清空 qa-workspace/specs（保留 _template）──
$specsDir = Join-Path $Root "qa-workspace\specs"
Get-ChildItem $specsDir -Directory | Where-Object { $_.Name -ne "_template" } | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force
}
Write-Host "✓ qa-workspace/specs 已清空（保留 _template）"

# ── 3. 清空 automation/e2e/specs/*.cy.ts（保留 example.cy.ts）──
$e2eSpecs = Join-Path $Root "automation\e2e\specs"
Get-ChildItem $e2eSpecs -Filter "*.cy.ts" | Where-Object { $_.Name -ne "example.cy.ts" } | Remove-Item -Force
Write-Host "✓ automation/e2e/specs/*.cy.ts 已清空（保留 example.cy.ts）"

# ── 4. 清空 automation/api/tests/*.py ──
$apiTests = Join-Path $Root "automation\api\tests"
if (Test-Path $apiTests) {
    Get-ChildItem $apiTests -Filter "*.py" | Where-Object { $_.Name -ne "__init__.py" } | Remove-Item -Force
}
Write-Host "✓ automation/api/tests/*.py 已清空"

# ── 4b. 清空 automation/e2e/flows/*.ts ──
$flowsDir = Join-Path $Root "automation\e2e\flows"
if (Test-Path $flowsDir) {
    Get-ChildItem $flowsDir -Filter "*.ts" | Remove-Item -Force
}
Write-Host "✓ automation/e2e/flows/*.ts 已清空"

# ── 4c. 清空 automation/e2e/pages/*.ts ──
$pagesDir = Join-Path $Root "automation\e2e\pages"
if (Test-Path $pagesDir) {
    Get-ChildItem $pagesDir -Filter "*.ts" | Remove-Item -Force
}
Write-Host "✓ automation/e2e/pages/*.ts 已清空"

# ── 4d. 重置 automation/e2e/pages.md（清空頁面清單，保留標題結構）──
$pagesMd = Join-Path $Root "automation\e2e\pages.md"
$pagesMdContent = @"
# Pages

> 此檔案定義 Playwright smoke-test 巡覽的頁面清單。
> 換系統後請依新系統頁面更新各區塊。

## 登出狀態頁面

| 路徑 | 說明 |
|------|------|

## 登入後頁面（後台）

| 路徑 | 說明 |
|------|------|

## 前台頁面

| 路徑 | 說明 |
|------|------|
"@
[System.IO.File]::WriteAllText($pagesMd, $pagesMdContent, $utf8NoBom)
Write-Host "✓ automation/e2e/pages.md 已重置（保留標題結構）"

# ── 4e. 重置 automation/e2e/fixtures/ ──
$fixturesDir = Join-Path $Root "automation\e2e\fixtures"
if (Test-Path $fixturesDir) {
    Get-ChildItem $fixturesDir -File | Remove-Item -Force
}
$usersJson = @"
{
  "regular_user": {
    "email": "$TestEmail",
    "password": "$TestPassword"
  }
}
"@
[System.IO.File]::WriteAllText((Join-Path $fixturesDir "users.json"), $usersJson, $utf8NoBom)
Write-Host "✓ automation/e2e/fixtures/ 已重置（users.json 寫入新帳號）"

# ── 5. 清空 artifacts/generated/ ──
$artifactsGen = Join-Path $Root "artifacts\generated"
if (Test-Path $artifactsGen) {
    Remove-Item $artifactsGen -Recurse -Force
    New-Item -ItemType Directory -Path $artifactsGen | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $artifactsGen "qa\bugs") | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $artifactsGen "pm") | Out-Null
}
Write-Host "✓ artifacts/generated/ 已清空並重建目錄結構"

# ── 6. 清空 artifacts/raw/ ──
$artifactsRaw = Join-Path $Root "artifacts\raw"
if (Test-Path $artifactsRaw) {
    Remove-Item $artifactsRaw -Recurse -Force
    New-Item -ItemType Directory -Path $artifactsRaw | Out-Null
}
Write-Host "✓ artifacts/raw/ 已清空"

# ── 6b. 重置 qa-workspace/.pipeline-state.json ──
$pipelineState = Join-Path $Root "qa-workspace\.pipeline-state.json"
$pipelineStateContent = @"
{
  "pipeline_id": "",
  "started_at": "",
  "last_updated": "",
  "scope": "all",
  "features": {},
  "totals": { "pass": 0, "pending": 0, "fail": 0, "specs": 0, "playwright_verified": 0 }
}
"@
[System.IO.File]::WriteAllText($pipelineState, $pipelineStateContent, $utf8NoBom)
Write-Host "✓ qa-workspace/.pipeline-state.json 已重置"

# ── 6c. 清空 qa-workspace/execution-results.csv ──
$execCsv = Join-Path $Root "qa-workspace\execution-results.csv"
if (Test-Path $execCsv) {
    Remove-Item $execCsv -Force
}
Write-Host "✓ qa-workspace/execution-results.csv 已清除"

# ── 7. 更新 .env ──
$envPath = Join-Path $Root ".env"
$apiLine = if ($ApiUrl) { $ApiUrl } else { "https://api-staging.example.com" }
$envContent = @"
CYPRESS_BASE_URL=$SitUrl
API_BASE_URL=$apiLine
TEST_USER_EMAIL=$TestEmail
TEST_USER_PASSWORD=$TestPassword
TEST_ENV=staging
"@
[System.IO.File]::WriteAllText($envPath, $envContent, $utf8NoBom)
Write-Host "✓ .env 已更新"

# ── 8. 更新 CLAUDE.md 專案資訊區塊 ──
$claudeMdPath = Join-Path $Root "CLAUDE.md"
$claudeContent = Get-Content $claudeMdPath -Raw -Encoding UTF8

# 更新目標環境 URL
$claudeContent = $claudeContent -replace 'https://sit-wetpaint\.nhri\.org\.tw/', $SitUrl

# 更新專案簡介第一行
$claudeContent = $claudeContent -replace '(?m)^AI 輔助、規格驅動的 QA 自動化框架。.*$',
    "AI 輔助、規格驅動的 QA 自動化框架。從 PM 需求到 QA 報告的全流程 AI 協作，針對「$ProjectName」（代號 $ProjectCode）進行測試。"

# 更新功能狀態快照（清空，只保留標題行）
$today = Get-Date -Format "yyyy-MM-dd"
$snapshotBlock = @"
## 功能狀態快照（$today）

| 功能 | spec | questions | scenarios | test-cases | .cy.ts |
|------|:----:|:---------:|:---------:|:----------:|:------:|
"@
$claudeContent = $claudeContent -replace '(?s)## 功能狀態快照.*', $snapshotBlock

[System.IO.File]::WriteAllText($claudeMdPath, $claudeContent, $utf8NoBom)
Write-Host "✓ CLAUDE.md 已更新（專案名稱、URL、功能快照清空）"

# ── 9. 更新 config.json ──
$configPath = Join-Path $Root "config.json"
$config = Get-Content $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
$config.project.name = $ProjectName
$config.project.code = $ProjectCode
$config.env.sitUrl = $SitUrl
$config.env.testEmail = $TestEmail
$config.env.apiBaseUrl = $ApiUrl
$config | ConvertTo-Json -Depth 10 | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::UTF8.GetBytes($_)) } | Set-Content $configPath -Encoding UTF8
Write-Host "✓ config.json 已更新（專案名稱、代號、URL、帳號）"

# ── 10. 重置 project memory ──
$memoryDir = Join-Path $env:USERPROFILE ".claude\projects\c--Users-suppo-Desktop-QAAI--\memory"
if (Test-Path $memoryDir) {
    $statusMem = Join-Path $memoryDir "project_qaai_status.md"
    if (Test-Path $statusMem) {
        $newStatus = @"
---
name: project-qaai-status
description: 新專案初始化（$ProjectName），pipeline 尚未執行
metadata:
  type: project
---

## 專案目標
系統：$ProjectName（代號：$ProjectCode）
SIT 環境：$SitUrl

## Pipeline 狀態
尚未執行，請從 /QA-1-import-pm-request 開始。
"@
        [System.IO.File]::WriteAllText($statusMem, $newStatus, $utf8NoBom)
        Write-Host "✓ project memory 已重置（project_qaai_status.md）"
    }
}

Write-Host "`n✅ 初始化完成！" -ForegroundColor Green
Write-Host "   專案：$ProjectName（$ProjectCode）"
Write-Host "   環境：$SitUrl"
Write-Host "`n下一步：將 PM 需求文件放入 pm-inbox/，然後執行 /QA-1-import-pm-request`n"
