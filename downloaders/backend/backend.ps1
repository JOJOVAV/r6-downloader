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
try {
    $manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json
} catch {
    Write-Host "Error reading manifest file: $ManifestPath"
    Write-Host $_.Exception.Message
    exit 1
}



# $manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json

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

}

# -----------------------------
# Iterate Depots (Fallback Logic)
# -----------------------------

foreach ($property in $patchData.PSObject.Properties) {
    if ($property.Name -match '^\d+$') {
        $depotId = $property.Name
        $manifestId = $property.Value

        Invoke-DepotDownload -app $AppId -DepotId $depotId -ManifestId $manifestId -Username $Username -remember-password -MaxDownloads $MaxDownloads
  
    }
}


# -----------------------------
# Post Processing
# -----------------------------
Write-Host "Running post-download copy tasks..."
Write-Host "Converting string to integers"
[int]$yearInt = $Year.Substring(1)
[int]$seasonInt = $Season.Substring(1)
[int]$patchInt = $Patch.Substring(1)
Write-Host "Year int is $yearInt"
Write-Host "Season int is $seasonInt"

$seasonString = $yearInt.$seasonInt.$patchInt
# helios path
$heliosPath = "$PSScriptRoot\HeliosLoader"
$throwbackPath = "$PSScriptRoot\ThrowbackLoader"
$throwbackloaderFiles = @{
    f1 = "defaultargs.dll";
    f2 = "LaunchR6.bat";
    f3 = "steam_api64.dll";
    f4 = "ThrowbackLoader.toml";
    f5 = "upc_r1_loader64.dll"; 
    f6 = "upc_r2_loader64.dll"; 
    f7 = "uplay_r1_loader64.dll" 
}

switch ($yearInt.$seasonInt.$patchInt) {
    {$YearInt -ge 1 -or ($YearInt -le 6 -and $seasonInt -le 2)} { Copy-Item $throwbackPath\$($throwbackloaderFiles.f1), $throwbackPath\$($throwbackloaderFiles.f2), $throwbackPath\$($throwbackloaderFiles.f3), $throwbackPath\$($throwbackloaderFiles.f4), $throwbackPath\$($throwbackloaderFiles.f7) -Destination $downloadDir -Force }
    5.4.2 { Copy-Item $heliosPath\*.* -Destination $downloadDir -Recurse -Force }
    6.3.* { Copy-Item "$throwbackPath\$($throwbackloaderFiles.f1)", "$throwbackPath\$($throwbackloaderFiles.f2)", "$throwbackPath\$($throwbackloaderFiles.f3)", "$throwbackPath\$($throwbackloaderFiles.f4)", "$throwbackPath\$($throwbackloaderFiles.f5)" -Destination $downloadDir -Force }
    {$yearInt -gt 6 -and $seasonInt -gt 3} { Copy-Item $throwbackPath\$($throwbackloaderFiles.f1), $throwbackPath\$($throwbackloaderFiles.f2), $throwbackPath\$($throwbackloaderFiles.f3), $throwbackPath\$($throwbackloaderFiles.f4), $throwbackPath\$($throwbackloaderFiles.f6) -Destination $downloadDir -Force }
    Default { Write-Host "It seems there are no files to copy, make sure to Throwbackloaderloader folder in your resource folder." }
}


Write-Host "Download complete."
