# $ErrorActionPreference = "Stop"
# Set-StrictMode -Version Latest

# -----------------------------
# Parameters
# -----------------------------
param (
    [Parameter(Mandatory)]
    [string]$Year,

    [Parameter(Mandatory)]
    [string]$Season,

    [Parameter(Mandatory)]
    [string]$Patch,

    [Parameter(Mandatory)]
    [string]$Username,

    [Parameter(Mandatory)]
    [int]$MaxDownloads,

    [string]$AppId = "359550",
    [string]$ManifestPath,
    [string]$DepotDownloader = "Resources\DepotDownloader.dll",
    [string]$OutputDir = "Downloads"
)

# -----------------------------
# Load Manifest Json
# -----------------------------
if (!$ManifestPath -or !(Test-Path $ManifestPath)) {
    $ManifestPath = Join-Path $PSScriptRoot 'manifest.json'
}

if (!$DepotDownloader -or !(Test-Path $DepotDownloader)) {
    $DepotDownloader = Join-Path $PSScriptRoot 'DepotDownloader.dll'
}
# try {
#     $manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json
# } catch {
#     Write-Host "Error reading manifest file: $ManifestPath"
#     Write-Host $_.Exception.Message
#     exit 1
# }

$manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json

# -----------------------------
# Validate Path
# -----------------------------
try {
    $patchData = $manifest.$Year.$Season.$Patch
    $seasonName = $manifest.$Year.$Season.name
} catch {
    throw "Invalid Year / Season / Patch selection"
}

# -----------------------------
# Prepare Output Folder
# -----------------------------
# $downloadDir = Join-Path $OutputDir ($Year + $Season + '_' + $seasonName -replace ' ', '')
# New-Item -ItemType Directory -Force -Path $downloadDir | Out-Null

$hmPatch = "Y5.S4.2"

if ($hmPatch -eq "$Year.$Season.$Patch") {
    $downloadDir = Join-Path $OutputDir($Year + $Season + '_' + $seasonName + 'HM' -replace ' ', '')
}
else {
    $downloadDir = Join-Path $OutputDir ($Year + $Season + '_' + $seasonName -replace ' ', '')
}
New-Item -ItemType Directory -Force -Path $downloadDir | Out-Null

# -----------------------------
# Download Function
# -----------------------------
function Invoke-DepotDownload {
    param (
        [string]$DepotId,
        [string]$ManifestId,
        [string]$AppId,
        [string]$Username,
        [string]$MaxDownloads
    )

    Write-Host "Attempting depot $DepotId with manifest $ManifestId"

    $args = @(
        $DepotDownloader
        "-app", $AppId
        "-depot", $DepotId
        "-manifest", $ManifestId
        "-username", $Username
        "-remember-password"
        "-dir", $downloadDir
        "-validate"
        "-max-downloads", $MaxDownloads
    )

    & dotnet $DepotDownloader -app $AppId -depot $DepotId -manifest $ManifestId -username $Username -remember-password -dir $downloadDir -validate -max-downloads $MaxDownloads
    # & dotnet @args
    # # Write-Host 
    # return $LASTEXITCODE
        # Run the dotnet command and capture the exit code
    # Start-Process -FilePath dotnet -ArgumentList $args -NoNewWindow -PassThru
    # $process.WaitForExit()
    # $exitCode = $process.ExitCode
    # write-Host "DepotDownloader exited with code $exitCode"
    # Pause > $null

    # return $exitCode
}

# -----------------------------
# Iterate Depots (Fallback Logic)
# -----------------------------
# [bool]$success = $false

foreach ($property in $patchData.PSObject.Properties) {
    if ($property.Name -match '^\d+$') {
        $depotId = $property.Name
        $manifestId = $property.Value

        Invoke-DepotDownload -app $AppId -DepotId $depotId -ManifestId $manifestId -Username $Username -remember-password -MaxDownloads $MaxDownloads
        
        # if ($exitCode -eq 0) {
        #     Write-Host "Year $Year Season $Season downloaded successfully"
        #     $success = $true
        #     continue
        # } else {
        #     Write-Warning "Year $Year Season $Season download failed, trying next..."
        # }
    }
}

#  if ($success = $false) {
#      throw "All depots failed"
#  }

# -----------------------------
# Post Processing
# -----------------------------
Write-Host "Running post-download copy tasks..."

# robocopy "Resources\ThrowbackLoader\Base" $downloadDir /E
# robocopy "Resources\ThrowbackLoader\Y1SX-Y6S2" $downloadDir /E

Write-Host "Download complete."
