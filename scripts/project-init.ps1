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

Write-Host "`n✅ 初始化完成！" -ForegroundColor Green
Write-Host "   專案：$ProjectName（$ProjectCode）"
Write-Host "   環境：$SitUrl"
Write-Host "`n下一步：將 PM 需求文件放入 pm-inbox/，然後執行 /QA-1-import-pm-request`n"
