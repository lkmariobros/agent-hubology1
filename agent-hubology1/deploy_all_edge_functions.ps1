# PowerShell script to deploy all edge functions to Supabase

# Set Supabase project ID and API key
$env:SUPABASE_PROJECT_ID = "twttyqbqhlgyzntcblbz"
$env:SUPABASE_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHR5cWJxaGxneXpudGNibGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzY1NzkwNCwiZXhwIjoyMDQ5MjMzOTA0fQ.WWjfijPdb7B2nXQvIUhvMLabZMRfHFn1PZ2R2F07JNk"

# Get all function files
$functionFiles = Get-ChildItem -Path ".\edge_functions_to_deploy" -Filter "*.ts"

Write-Host "Found $($functionFiles.Count) functions to deploy"

# Deploy each function
foreach ($file in $functionFiles) {
    $functionName = $file.BaseName
    Write-Host "Deploying function: $functionName"
    
    # Read the function code
    $functionCode = Get-Content $file.FullName -Raw
    
    # Use curl to deploy the function
    $url = "https://api.supabase.com/v1/projects/$env:SUPABASE_PROJECT_ID/functions"
    $headers = @{
        "Authorization" = "Bearer $env:SUPABASE_ACCESS_TOKEN"
        "Content-Type" = "application/json"
    }
    $body = @{
        name = $functionName
        verify_jwt = $true
        body = $functionCode
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop
        Write-Host "Function deployed successfully: $functionName"
    }
    catch {
        Write-Host "Error deploying function $functionName`: $_"
    }
    
    # Sleep for a second to avoid rate limiting
    Start-Sleep -Seconds 1
}

Write-Host "All functions deployed!"
