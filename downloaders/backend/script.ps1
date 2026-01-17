param ( 
    [string]$iniFile, 
    [string]$section, 
    [string]$key, 
    [string]$newValue 
) 
$content = Get-Content -Path $iniFile 
$newContent = @() 
if ($section -eq "settings") { 
    foreach ($line in $content) { 
        if ($line -match "^\s*$key\s*=") { 
            $newLine = "$key=$newValue" 
            $newContent += $newLine 
        } else { 
            $newContent += $line 
        } 
    } 
} else { 
    foreach ($line in $content) { 
        if ($line -match "^\s*$key\s*=") { 
            $newLine = "$key=""$newValue""" 
            $newContent += $newLine 
        } else { 
            $newContent += $line 
        } 
    } 
} 
$newContent | Set-Content -Path $iniFile 
