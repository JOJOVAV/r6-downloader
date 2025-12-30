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
    [string]$ManifestPath = "Resources\manifest.json",
    [string]$DepotDownloader = "Resources\DepotDownloader.dll",
    [string]$OutputDir = "Downloads"
)

# -----------------------------
# Load Manifest Json
# -----------------------------
if (-not (Test-Path $ManifestPath)) {
    throw "Manifest file not found: $ManifestPath"
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
} catch {
    throw "Invalid Year / Season / Patch selection"
}

# -----------------------------
# Prepare Output Folder
# -----------------------------
$downloadDir = Join-Path $OutputDir "${Year}${Season}"
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
    & dotnet @args
}

# -----------------------------
# Iterate Depots (Fallback Logic)
# -----------------------------
$downloadStatus = ""

foreach ($property in $patchData.PSObject.Properties) {
    if ($property.Name -match '^\d+$') {
        $depotId = $property.Name
        $manifestId = $property.Value

        $downloadStatus = Invoke-DepotDownload -app $AppId -DepotId $depotId -ManifestId $manifestId -Username $Username -remember-password -MaxDownloads $MaxDownloads
       
        pause > $null
       if ($exitCode -eq 0) {
            Write-Host "Year $Year Season $Season downloaded successfully"
            $success = $true
            continue
        } else {
            Write-Warning "Year $Year Season $Season download failed, trying next..."
        }
    }
}

# if ($success = $false) {
#     throw "All depots failed"
# }

# -----------------------------
# Post Processing
# -----------------------------
Write-Host "Running post-download copy tasks..."

robocopy "Resources\ThrowbackLoader\Base" $downloadDir /E
robocopy "Resources\ThrowbackLoader\Y1SX-Y6S2" $downloadDir /E

Write-Host "Download complete."
