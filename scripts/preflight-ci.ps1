param(
    [Parameter(Mandatory=$false)]
    [string[]]$RequiredEnv = @(
        "CYPRESS_BASE_URL",
        "API_BASE_URL",
        "TEST_USER_EMAIL",
        "TEST_USER_PASSWORD"
    )
)

$ErrorActionPreference = "Stop"

$missing = @()
foreach ($name in $RequiredEnv) {
    $value = [Environment]::GetEnvironmentVariable($name)
    if ([string]::IsNullOrWhiteSpace($value)) {
        $missing += $name
    }
}

if ($missing.Count -gt 0) {
    throw "Missing required CI environment variables: $($missing -join ', '). Configure repository secrets before running QA automation."
}

Write-Output "CI preflight passed. Required QA automation environment variables are configured."
