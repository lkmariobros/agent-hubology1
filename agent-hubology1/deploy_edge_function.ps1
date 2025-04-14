# PowerShell script to deploy an edge function to Supabase
param (
    [Parameter(Mandatory=$true)]
    [string]$FunctionName
)

# Set Supabase project ID and API key
$env:SUPABASE_PROJECT_ID = "twttyqbqhlgyzntcblbz"
$env:SUPABASE_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHR5cWJxaGxneXpudGNibGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzY1NzkwNCwiZXhwIjoyMDQ5MjMzOTA0fQ.WWjfijPdb7B2nXQvIUhvMLabZMRfHFn1PZ2R2F07JNk"

# Path to the function
$functionPath = ".\edge_functions_to_deploy\$FunctionName.ts"

# Check if the function file exists
if (-not (Test-Path $functionPath)) {
    Write-Error "Function file not found: $functionPath"
    exit 1
}

# Read the function code
$functionCode = Get-Content $functionPath -Raw

# Create a temporary directory for the function
$tempDir = New-Item -ItemType Directory -Path ".\temp_function" -Force
$tempFunctionDir = New-Item -ItemType Directory -Path "$tempDir\$FunctionName" -Force
$tempSharedDir = New-Item -ItemType Directory -Path "$tempDir\_shared" -Force

# Create the function file
$functionCode | Out-File -FilePath "$tempFunctionDir\index.ts" -Encoding utf8

# Create the CORS file
@"
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json"
};
"@ | Out-File -FilePath "$tempSharedDir\cors.ts" -Encoding utf8

# Use curl to deploy the function
$url = "https://api.supabase.com/v1/projects/$env:SUPABASE_PROJECT_ID/functions"
$headers = @{
    "Authorization" = "Bearer $env:SUPABASE_ACCESS_TOKEN"
    "Content-Type" = "application/json"
}
$body = @{
    name = $FunctionName
    verify_jwt = $true
    body = $functionCode
} | ConvertTo-Json

Write-Host "Deploying function: $FunctionName"
$response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop

Write-Host "Function deployed successfully: $FunctionName"
Write-Host $response

# Clean up
Remove-Item -Path $tempDir -Recurse -Force
