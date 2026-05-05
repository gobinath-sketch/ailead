param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "prod")]
    $mode
)

$apiConfigPath = "frontend/src/lib/api-config.ts"
$envPath = ".env"

if ($mode -eq "local") {
    Write-Host "🔄 Switching to LOCAL mode..." -ForegroundColor Cyan
    
    # Update api-config.ts
    (Get-Content $apiConfigPath) -replace 'const FORCE_PRODUCTION = true;', 'const FORCE_PRODUCTION = false;' | Set-Content $apiConfigPath
    
    # Update .env (Comment out Prod API)
    (Get-Content $envPath) -replace '^NEXT_PUBLIC_API_BASE_URL="http://project.globalknowledgetech.com:4000"', '# NEXT_PUBLIC_API_BASE_URL="http://project.globalknowledgetech.com:4000"' | Set-Content $envPath
    (Get-Content $envPath) -replace '^# NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"', 'NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"' | Set-Content $envPath

    Write-Host "✅ Now in LOCAL mode. (localhost:4000)" -ForegroundColor Green
}
else {
    Write-Host "🔄 Switching to PRODUCTION mode..." -ForegroundColor Yellow
    
    # Update api-config.ts
    (Get-Content $apiConfigPath) -replace 'const FORCE_PRODUCTION = false;', 'const FORCE_PRODUCTION = true;' | Set-Content $apiConfigPath
    
    # Update .env (Uncomment Prod API)
    (Get-Content $envPath) -replace '^NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"', '# NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"' | Set-Content $envPath
    (Get-Content $envPath) -replace '^# NEXT_PUBLIC_API_BASE_URL="http://project.globalknowledgetech.com:4000"', 'NEXT_PUBLIC_API_BASE_URL="http://project.globalknowledgetech.com:4000"' | Set-Content $envPath

    Write-Host "🚀 Now in PRODUCTION mode. (project.globalknowledgetech.com:4000)" -ForegroundColor Green
}
