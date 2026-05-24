$jsonUrl = "https://raw.githubusercontent.com/JOJOVAV/r6-downloader/refs/heads/main/update/update.json"

$data = Invoke-RestMethod -Uri $jsonUrl

# $BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Split-Path -Parent $PSScriptRoot
Set-Location $BaseDir

#write-host "$BaseDir"
#Pause

$updatePlan = @()

foreach ($item in $data.PSObject.Properties) {

    $entryName = $item.Name
    $url = $item.Value.url
    $files = $item.Value.files

    $isZip = $url.ToLower().EndsWith(".zip")

    $entryNeedsUpdate = $false

    foreach ($file in $files) {

        $relativePath = $file.path.TrimStart('/')
        $localPath = Join-Path $BaseDir $relativePath
        # $localPath = $BaseDir
        $expectedHash = $file.sha256

        if (!(Test-Path $localPath)) {
            $entryNeedsUpdate = $true
            break
        }

        $currentHash = (Get-FileHash $localPath -Algorithm SHA256).Hash

        if ($currentHash -ne $expectedHash) {
            $entryNeedsUpdate = $true
            break
        }
    }

    if ($entryNeedsUpdate) {
        $updatePlan += [PSCustomObject]@{
            Name = $entryName
            Url  = $url
            Files = $files
            IsZip = $isZip
        }

        Write-Host "Needs update: $entryName" -ForegroundColor Yellow
    }
    else {
        Write-Host "OK: $entryName" -ForegroundColor Green

    }
}



foreach ($item in $updatePlan) {

    Write-Host "`nUpdating: $($item.Name)" -ForegroundColor Cyan

    $url = $item.Url
    $files = $item.Files
    $isZip = $item.IsZip

    if ($isZip) {

        $zipFile = "$env:TEMP\update.zip"

        if (Test-Path $zipFile) {
            Remove-Item $zipFile -Force
        }

        curl.exe -L --fail --silent --show-error $url -o $zipFile


        Expand-Archive -Path $zipFile -DestinationPath $BaseDir -Force;
        Remove-Item $zipFile
        

        Write-Host "ZIP updated: $($item.Name)" -ForegroundColor Green
    }
    else {

        foreach ($file in $files) {

            $relativePath = $file.path.TrimStart('/')
            $localPath = Join-Path $BaseDir $relativePath
            $expectedHash = $file.sha256

            $dir = Split-Path $localPath
            if (!(Test-Path $dir)) {
                New-Item -ItemType Directory -Path $dir -Force | Out-Null
            }

            curl.exe -L --fail --silent --show-error $url -o $localPath

            $newHash = (Get-FileHash $localPath -Algorithm SHA256).Hash

            if ($newHash -ieq $expectedHash) {
                Write-Host "Updated: $relativePath" -ForegroundColor Green
                pause
            }
            else {
                Write-Host "Hash mismatch: $relativePath" -ForegroundColor Red
                Write-Host "Expected: $expectedHash"
                Write-Host "Got     : $newHash"
            }
        }
    }
}
write-host "`nUpdate process completed." -ForegroundColor Cyan
pause
