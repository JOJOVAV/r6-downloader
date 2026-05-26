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
    [string]$DepotDownloader = "Resources\DepotDownloader\DepotDownloader.dll",
    [string]$OutputDir = "Downloads"
)

# -----------------------------
# Load Manifest Json
# -----------------------------
if (!$ManifestPath -or !(Test-Path $ManifestPath)) {
    $ManifestPath = Join-Path $PSScriptRoot 'manifest.json'
}

if (!$DepotDownloader -or !(Test-Path $DepotDownloader)) {
    $DepotDownloader = Join-Path $PSScriptRoot 'DepotDownloader\DepotDownloader.dll'
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

# $hmPatch = "Y5.S4.2" -or "Y9S2.0"

if ($Year -eq "Y5" -and $Season -eq "S4" -and $Patch -eq "2") {
    $downloadDir = Join-Path $OutputDir($Year.ToUpper() + $Season.ToUpper() + '_' + $seasonName + 'HM' -replace ' ', '')
}
elseif ($Year -eq "Y9" -and $Season -eq "S2" -and $Patch -eq "0") {
    $downloadDir = Join-Path $OutputDir($Year.ToUpper() + $Season.ToUpper() + '_' + $seasonName + 'HM' -replace ' ', '')
}
else {
    $downloadDir = Join-Path $OutputDir ($Year.ToUpper() + $Season.ToUpper() + '_' + $seasonName -replace ' ', '')
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
[int]$yearInt = $Year.Substring(1)
[int]$seasonInt = $Season.Substring(1)
[int]$patchInt = $Patch.Substring(0)



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


switch ($true) {
    # Y5S4.2
    { $yearInt -eq 5 -and $seasonInt -eq 4 -and $patchInt -eq 2 } {
        $files = @("$heliosPath\*.*")
        foreach ($file in $files) {
            if (Test-Path $file) {
                Copy-Item $file -Destination $downloadDir -Recurse -Force
            }
            else {
                Write-Host "File not found: $file"
            }
        }
        break
    }
    # Y9S2.0
    { $yearInt -eq 9 -and $seasonInt -eq 2 -and $patchInt -eq 0 } {
        $files = @("$heliosPath\*.*")
        foreach ($file in $files) {
            if (Test-Path $file) {
                Copy-Item $file -Destination $downloadDir -Recurse -Force
            }
            else {
                Write-Host "File not found: $file"
            }
        }
        break
    }
    # Y6+
    { ($yearInt -eq 6 -and $seasonInt -eq 4) -or ($yearInt -ge 7) } {
        $files = @("$throwbackPath\$($throwbackloaderFiles.f1)", "$throwbackPath\$($throwbackloaderFiles.f2)", "$throwbackPath\$($throwbackloaderFiles.f3)", "$throwbackPath\$($throwbackloaderFiles.f4)", "$throwbackPath\$($throwbackloaderFiles.f6)")
        foreach ($file in $files) {
            if (Test-Path $file) {
                Copy-Item $file -Destination $downloadDir -Force
            }
            else {
                Write-Host "File not found: $file"
            }
        }
        break
    }
    # Y6S3
    { $yearInt -eq 6 -and $seasonInt -eq 3 } {
        $files = @("$throwbackPath\$($throwbackloaderFiles.f1)", "$throwbackPath\$($throwbackloaderFiles.f2)", "$throwbackPath\$($throwbackloaderFiles.f3)", "$throwbackPath\$($throwbackloaderFiles.f4)", "$throwbackPath\$($throwbackloaderFiles.f5)")
        foreach ($file in $files) {
            if (Test-Path $file) {
                write-host "6.3"
                Copy-Item $file -Destination $downloadDir -Force
            }
            else {
                Write-Host "File not found: $file"
            }
        }
        break
    }
    # Y1 - Y6
    { ($yearInt -ge 1 -and $yearInt -le 5) -or ($yearInt -le 6 -and $seasonInt -le 2) } {
        $files = @("$throwbackPath\$($throwbackloaderFiles.f1)", "$throwbackPath\$($throwbackloaderFiles.f2)", "$throwbackPath\$($throwbackloaderFiles.f3)", "$throwbackPath\$($throwbackloaderFiles.f4)", "$throwbackPath\$($throwbackloaderFiles.f7)")
        foreach ($file in $files) {
            if (Test-Path $file) {
                Copy-Item $file -Destination $downloadDir -Force
            }
            else {
                Write-Host "File not found: $file"
            }
        }
        break
    }
    Default { Write-Host "It seems there are no matching seasons to copy the cracks, make sure to select the correct season." }
}


Write-Host "Download complete."
