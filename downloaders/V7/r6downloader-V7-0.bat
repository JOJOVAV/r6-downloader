@shift /0
@echo off
setlocal enableextensions EnableDelayedExpansion
Color 0F
set "folder=%~dp0"
set "inifile=Resources\config.ini"
set "sectionS=settings"
set "ininame=username"
set "iniMAXDOWNLOADS=maxdownloads"
set backendscript=Resources\backend.ps1
set save=Resources\script.ps1
set "USERNAME="
set MAXDOWNLOADS=

call :onedrive
call :dotnetcheck
call :7zipcheck
call :DepotCheck
call :CrackCheck
call :CrackCheck2
call :cmdCheck
call :scriptcheck
call :backendcheck
call :checkini
call :checkname

@REM powershell -Command "$exclusion = Get-MpPreference | Where-Object { $_.ExclusionPath -like '*%folder%*' }; if ($exclusion) { Write-Host 'Exclusion found for the folder in Windows Defender Antivirus.' } else { Write-Host 'No exclusion found for the folder in Windows Defender Antivirus.' start view-source:https://puppetino.github.io/Throwback-FAQ/static/img/faq_img/Sequenz%\2001_1.gif }"

@REM pause >nul

:foridiots
Title Rainbow Six Siege Downloader
cls
MODE 87,10
echo ---------------------------------------------------------------------------------------
echo ^| If you come across a problem/issue, or have a question,                             ^|
echo ^| PLEASE read the FAQ and Guide section before asking for help in our discord server. ^|
echo ^| Your problem can most likely be resolved by reading the FAQ and Guide.              ^|
echo ---------------------------------------------------------------------------------------
echo.
timeout /T 10 >nul | echo 			 Wait 10 sec to continue^!
call :cmdMenuSel "                                 Continue" ""
@REM if %ERRORLEVEL% == 1 call :mainmenu

:mainmenu
Title Rainbow Six Siege Downloader  
cls
MODE 78,21
echo --------------------------------------------------------------------------
echo ^|      OG Rainbow Six Siege Downloader (V7.0) - Now maintained by JVAV   ^|
echo --------------------------------------------------------------------------
echo ^|                             %USERNAME%                                 ^|
echo --------------------------------------------------------------------------
echo ^| YOU MUST CLAIM FOR FREE A COPY OF SIEGE ON STEAM TO USE THE DOWNLOADER ^|
echo --------------------------------------------------------------------------
echo ^|                       Select an option below                           ^|
echo -------------------------------------------------------------------------- 
echo.
call :cmdMenuSel "  Game Downloader" "  verify the game" "  Heated Metal" "  4K Textures Download" "  Modding / Extra Tools" "  Claim Siege on Steam for free" "  Downloader Settings" "  Installation Guide and FAQ"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :downloadmenu
if %ERRORLEVEL% == 3 call :HeatedMetal
if %ERRORLEVEL% == 4 call :4ktextures
if %ERRORLEVEL% == 5 call :extratools
if %ERRORLEVEL% == 6 call :siegeclaim
if %ERRORLEVEL% == 7 call :moresettings
if %ERRORLEVEL% == 8 call :guidefaq


:downloadmenu
Title Rainbow Six Siege Seasons
cls
MODE 75,18
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Rainbow Six Siege you like to choose.   ^|
echo -------------------------------------------------------------------------
echo.
call :cmdMenuSel "  Main Menu" "  Refresh Menu" "  Season 1" "  Season 2" "  Season 3" "  Season 4" "  Season 5" "  Season 6" "  Season 7" "  Season 8" "  Season 9" "  Season 10"
if %ERRORLEVEL% == 1 call :mainmenu
if %ERRORLEVEL% == 2 call :downloadmenu
if %ERRORLEVEL% == 3 call :season1
if %ERRORLEVEL% == 4 call :season2
if %ERRORLEVEL% == 5 call :season3
if %ERRORLEVEL% == 6 call :season4
if %ERRORLEVEL% == 7 call :season5
if %ERRORLEVEL% == 8 call :season6
if %ERRORLEVEL% == 9 call :season7
if %ERRORLEVEL% == 10 call :season8
if %ERRORLEVEL% == 11 call :season9
if %ERRORLEVEL% == 12 call :season10


:season1
Title Rainbow Six Siege Season 1 Download
set YEAR="Y1"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 1 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Vanilla          | Y1S0 | 14.2 GB" "  Black Ice        | Y1S1 | 16.7 GB" "  Dust Line        | Y1S2 | 20.9 GB" "  Skull Rain       | Y1S3 | 25.1 GB" "  Red Crow         | Y1S4 | 28.5 GB"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season1
if %ERRORLEVEL% == 3 call :Y1S0_Vanilla
if %ERRORLEVEL% == 4 call :Y1S1_Blackice
if %ERRORLEVEL% == 5 call :Y1S2_Dustline
if %ERRORLEVEL% == 6 call :Y1S3_Skullrain
if %ERRORLEVEL% == 7 call :Y1S4_Redcrow

:Y1S0_Vanilla
echo You have selected Vanilla Edition
set SEASON="S0"
set PATCH="0"
call :downloading
exit /b

:Y1S1_Blackice
echo You have selected Black Ice Edition
set SEASON="S1"
set PATCH="0"
call :downloading
exit /b

:Y1S2_Dustline
echo You have selected Dust Line Edition
set SEASON="S2"
set PATCH="0"
call :downloading
exit /b

:Y1S3_Skullrain
echo You have selected Skull Rain Edition
set SEASON="S3"
set PATCH="5"
call :downloading
exit /b

:Y1S4_Redcrow
echo You have selected Red Crow Edition
set SEASON="S4"
set PATCH="0"
call :downloading
exit /b

:season2
Title Rainbow Six Siege Season 2 Download
set YEAR="Y2"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 2 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Velvet Shell     | Y2S1 | 33.2 GB" "  Health           | Y2S2 | 34.0 GB" "  Blood Orchid     | Y2S3 | 34.3 GB" "  White Noise      | Y2S4 | 48.7 GB"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season2
if %ERRORLEVEL% == 3 call :Y2S1_VelvetShell
if %ERRORLEVEL% == 4 call :Y2S2_Health
if %ERRORLEVEL% == 5 call :Y2S3_BloodOrchid
if %ERRORLEVEL% == 6 call :Y2S4_WhiteNoise

:Y2S1_VelvetShell
echo You have selected Velvet Shell Edition
set SEASON="S1"
set PATCH="0"
call :downloading
exit /b

:Y2S2_Health
echo You have selected Health Edition
set SEASON="S2"
set PATCH="0"
call :downloading
exit /b

:Y2S3_BloodOrchid
echo You have selected Blood Orchid Edition
set SEASON="S3"
set PATCH="3"
call :downloading
exit /b

:Y2S4_WhiteNoise
echo You have selected White Noise Edition
set SEASON="S4"
set PATCH="1"
call :downloading
exit /b

:season3
Title Rainbow Six Siege Season 3 Download
set YEAR="Y3"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 3 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Chimera          | Y3S1 | 58.8 GB | Outbreak Event" "  Para Bellum      | Y3S2 | 63.3 GB" "  Grim Sky         | Y3S3 | 72.6 GB | Mad House Event " "  Wind Bastion     | Y3S4 | 76.9 GB"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season3
if %ERRORLEVEL% == 3 call :Y3S1_Chimera
if %ERRORLEVEL% == 4 call :Y3S2_Parabellum
if %ERRORLEVEL% == 5 call :Y3S3_GrimSky
if %ERRORLEVEL% == 6 call :Y3S4_WindBastion


:Y3S1_Chimera
echo You have selected Chimera Edition
set SEASON="S1"
set PATCH="0"
call :downloading
exit /b

:Y3S2_Parabellum
echo You have selected Para Bellum Edition
set SEASON="S2"
set PATCH="0"
call :downloading
exit /b

:Y3S3_GrimSky
echo You have selected Grim Sky Edition
set SEASON="S3"
set PATCH="5"
call :downloading
exit /b

:Y3S4_WindBastion
echo You have selected Wind Bastion Edition
set SEASON="S4"
set PATCH="0"
call :downloading
exit /b

:season4
Title Rainbow Six Siege Season 4 Download
set YEAR="Y4"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 4 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Burnt Horizon    | Y4S1 | 58.8 GB | Rainbow Is Magic Event" "  Phantom Sight    | Y4S2 | 67.1 GB | Showdown Event" "  Ember Rise       | Y4S3 | 69.6 GB | Doktor's Curse + Money Heist Event" "  Shifting Tides   | Y4S4 | 75.2 GB | Road to S.I. (stadium)"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season4
if %ERRORLEVEL% == 3 call :Y4S1_BurntHorizon
if %ERRORLEVEL% == 4 call :Y4S2_PhantomSight
if %ERRORLEVEL% == 5 call :Y4S3_EmberRise
if %ERRORLEVEL% == 6 call :Y4S4_ShiftingTides

:Y4S1_BurntHorizon
echo You have selected Burnt Horizon Edition
set SEASON="S1"
set PATCH="2"
call :downloading
exit /b

:Y4S2_PhantomSight
echo You have selected Phantom Sight Edition
set SEASON="S2"
set PATCH="0"
call :downloading
exit /b

:Y4S3_EmberRise
echo You have selected Ember Rise Edition
set SEASON="S3"
set PATCH="4"
call :downloading
exit /b

:Y4S4_ShiftingTides
echo You have selected Shifting Tides Edition
set SEASON="S4"
set PATCH="0"
call :downloading
exit /b

:season5
Title Rainbow Six Siege Season 5 Download
set YEAR="Y5"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 5 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Void Edge        | Y5S1 | 74.3 GB | The Grand Larceny + Golden Gun Event" "  Steel Wave       | Y5S2 | 81.3 GB | M.U.T.E. Protocol Event" "  Shadow Legacy    | Y5S3 | 88.0 GB | Sugar Fright Event" "  Neon Dawn        | Y5S4 | 57.0 GB | SUPPORTS HEATED METAL" "  Neon Dawn        | Y5S4 | 57.0 GB | Road To S.I. 2021"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season5
if %ERRORLEVEL% == 3 call :Y5S1_VoidEdge
if %ERRORLEVEL% == 4 call :Y5S2_SteelWave
if %ERRORLEVEL% == 5 call :Y5S3_ShadowLegacy
if %ERRORLEVEL% == 6 call :HeatedMetal
if %ERRORLEVEL% == 7 call :Y5S4_NeonDawn

:Y5S1_VoidEdge
echo You have selected Void Edge Edition
set SEASON="S1"
set PATCH="5"
call :downloading
exit /b

:Y5S2_SteelWave
echo You have selected Steel Wave Edition
set SEASON="S2"
set PATCH="5"
call :downloading
exit /b

:Y5S3_ShadowLegacy
echo You have selected Shadow Legacy Edition
set SEASON="S3"
set PATCH="5"
call :downloading
exit /b

:HeatedMetal
echo You have selected Neon Dawn Edition with Heated Metal Support
set SEASON="S4"
set PATCH="2"
call :downloading
exit /b

:Y5S4_NeonDawn
echo You have selected Neon Dawn Edition
set SEASON="S4"
set PATCH="4"
call :downloading
exit /b

:season6
Title Rainbow Six Siege Season 6 Download
set YEAR="Y6"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 6 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Crimson Heist    | Y6S1 | 44.9 GB | Rainbow Is Magic 2 + Apocalypse Event" "  North Star       | Y6S2 | 62.1 GB | Nest Destruction " "  Crystal Guard    | Y6S3 | 50.3 GB | Showdown Event" "  High Calibre     | Y6S4 | 54.2 GB | Stadium + Snowball"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season6
if %ERRORLEVEL% == 3 call :Y6S1_CrimsonHeist
if %ERRORLEVEL% == 4 call :Y6S2_NorthStar
if %ERRORLEVEL% == 5 call :Y6S3_CrystalGuard
if %ERRORLEVEL% == 6 call :Y6S4_HighCalibre

:Y6S1_CrimsonHeist
echo You have selected Crimson Heist Edition
set SEASON="S1"
set PATCH="1"
call :downloading
exit /b

:Y6S2_NorthStar
echo You have selected North Star Edition
set SEASON="S2"
set PATCH="0"
call :downloading
exit /b

:Y6S3_CrystalGuard
echo You have selected Crystal Guard Edition
set SEASON="S3"
set PATCH="0"
call :downloading
exit /b

:Y6S4_HighCalibre
echo You have selected High Calibre Edition
set SEASON="S4"
set PATCH="3"
call :downloading
exit /b

:season7
Title Rainbow Six Siege Season 7 Download
set YEAR="Y7"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 7 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Demon Veil       | Y7S1 | 58.8 GB | TOKY Event" "  Vector Glare     | Y7S2 | 58.8 GB | M.U.T.E Protocol Reboot Event" "  Brutal Swarm     | Y7S3 | 49.2 GB | Doctors Sniper Event" "  Solar Raid       | Y7S4 | 51.1 GB | Snow Brawl Event"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season7
if %ERRORLEVEL% == 3 call :Y7S1_DemonVeil
if %ERRORLEVEL% == 4 call :Y7S2_VectorGlare
if %ERRORLEVEL% == 5 call :Y7S3_BrutalSwarm
if %ERRORLEVEL% == 6 call :Y7S4_SolarRaid

:Y7S1_DemonVeil
echo You have selected Demon Veil Edition
set SEASON="S1"
set PATCH="2"
call :downloading
exit /b

:Y7S2_VectorGlare
echo You have selected Vector Glare Edition
set SEASON="S2"
set PATCH="4"
call :downloading
exit /b

:Y7S3_BrutalSwarm
echo You have selected Brutal Swarm Edition
set SEASON="S3"
set PATCH="6"
call :downloading
exit /b

:Y7S4_SolarRaid
echo You have selected Solar Raid Edition
set SEASON="S4"
set PATCH="4"
call :downloading
exit /b

:season8
Title Rainbow Six Siege Season 8 Download
set YEAR="Y8"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 8 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Commanding Force | Y8S1 | 53.8 GB | RIM + TOKY Event" "  Dread Factor     | Y8S2 | xx.x GB | Rengoku Event" "  Heavy Mettle     | Y8S3 | 54.8 GB | Doktor's Curse Event + NO UNLOCKED OPERATORS" "  Deep Freeze      | Y8S4 | 52.9 GB | NO UNLOCKED OPERATORS"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season8
if %ERRORLEVEL% == 3 call :Y8S1_CommandingForce
if %ERRORLEVEL% == 4 call :Y8S2_DreadFactor
if %ERRORLEVEL% == 5 call :Y8S3_HeavyMettle
if %ERRORLEVEL% == 6 call :Y8S4_DeepFreeze

:Y8S1_CommandingForce
echo You have selected Commanding Force Edition
set SEASON="S1"
set PATCH="6"
call :downloading
exit /b

:Y8S2_DreadFactor
echo You have selected Dread Factor Edition
set SEASON="S2"
set PATCH="3"
call :downloading
exit /b

:Y8S3_HeavyMettle
echo You have selected Heavy Mettle Edition
set SEASON="S3"
set PATCH="3"
call :downloading
exit /b

:Y8S4_DeepFreeze
echo You have selected Deep Freeze Edition
set SEASON="S4"
set PATCH="4"
call :downloading
exit /b

:season9
Title Rainbow Six Siege Season 9 Download
set YEAR="Y9"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 9 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Deadly Omen      | Y9S1 | 54.4 GB | NO UNLOCKED OPERATORS" "  New Blood        | Y9S2 | 56.0 GB | NO UNLOCKED OPERATORS" "  Twin Shells      | Y9S3 | 59.2 GB | NO UNLOCKED OPERATORS" "  Collision Point  | Y9S4 | 59.2 GB | NO UNLOCKED OPERATORS"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season9
if %ERRORLEVEL% == 3 call :Y9S1_DeadlyOmen
if %ERRORLEVEL% == 4 call :Y9S2_NewBlood
if %ERRORLEVEL% == 5 call :Y9S3_TwinShells
if %ERRORLEVEL% == 6 call :Y9S4_CollisionPoint

:Y9S1_DeadlyOmen
echo You have selected Deadly Omen Edition
set SEASON="S1"
set PATCH="3"
call :downloading
exit /b

:Y9S2_NewBlood
echo You have selected New Blood Edition
set SEASON="S2"
set PATCH="6"
call :downloading
exit /b

:Y9S3_TwinShells
echo You have selected Twin Shells Edition
set SEASON="S3"
set PATCH="6"
call :downloading
exit /b

:Y9S4_CollisionPoint
echo You have selected Collision Point Edition
set SEASON="S4"
set PATCH="3"
call :downloading
exit /b

:season10
Title Rainbow Six Siege Season 10 Download
set YEAR="Y10"
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 10 you like to choose.           ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Prep Phase       | Y10S1| 51.4 GB | NO UNLOCKED OPERATORS" "  Daybreak         | Y10S2| 57.6 GB | NO UNLOCKED OPERATORS" "  High Stakes      | Y10S3| 64.1 GB | NO UNLOCKED OPERATORS" "  Tenfold Pursuit  | Y10S3| 64.1 GB | NO UNLOCKED OPERATORS"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season10
if %ERRORLEVEL% == 3 call :Y10S1_PrepPhase
if %ERRORLEVEL% == 4 call :Y10S2_Daybreak
if %ERRORLEVEL% == 5 call :Y10S3_HighStakes
if %ERRORLEVEL% == 6 call :Y10S4_TenfoldPursuit

:Y10S1_PrepPhase
echo You have selected Prep Phase Edition
set SEASON="S1"
set PATCH="4"
call :downloading
exit /b

:Y10S2_Daybreak
echo You have selected Daybreak Edition
set SEASON="S2"
set PATCH="2"
call :downloading
exit /b

:Y10S3_HighStakes
echo You have selected High Stakes Edition
set SEASON="S3"
set PATCH="4"
call :downloading
exit /b

:Y10S4_TenfoldPursuit
echo You have selected Tenfold Pursuit Edition
set SEASON="S4"
set PATCH="4"
call :downloading
exit /b

:onedrive
Title OneDrive Folder Check
cls
ECHO %folder% | FIND /C "OneDrive" >NUL
IF NOT ERRORLEVEL 1 (
    start https://bit.ly/no-onedrive
cls
echo ----------------------------------------------------------------------------------------------------------------
echo ^| You ran this downloader inside of a OneDrive folder, move the downloader to a different location.            ^|
echo ^| If you can't figure out how to move it follow this guide: https://shorturl.at/qk3SX                          ^|
echo ^| PLEASE just check ALL of the Onedrive folder locations ^| DONT MAKE HELP POSTS ABOUT THIS - USE YOUR BRAIN   ^|
echo -----------------------------------------------------------------------------------------------------------------
echo Press any key to close the downloader. . .
pause >nul
exit
)
exit /b

:dotnetcheck
Title Dotnet Version Check
cls
set FOUND=0
for /f "tokens=*" %%D in ('dotnet --list-sdks 2^>nul') do (
    if %%D GEQ "9.0.0" (
        echo %%D
        set FOUND=1
    )
)

if NOT "%FOUND%" == "1" (
  echo Dotnet version 9.0.0 or higher is not installed.
  start https://dotnet.microsoft.com/en-us/download
  pause >nul
  exit
)
exit /b

::resourcescheck
:7zipcheck
title 7zip Check
cls
if NOT exist "Resources\7z.exe" (
    md Resources\ThrowbackLoader
    curl.exe -L "https://github.com/DataCluster0/R6TBBatchTool/raw/master/Requirements/7z.exe" --ssl-no-revoke --output 7z.exe
    move 7z.exe Resources\
  call :7zipcheck
)

:DepotCheck
title Depot Downloader Check
cls
if NOT exist "Resources\DepotDownloader.dll" (
  curl -L "https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_3.4.0/DepotDownloader-framework.zip" --ssl-no-revoke --output depot.zip
    ::Extract
    for %%I in ("depot.zip") do (
      "Resources\7z.exe" x -y -o"Resources" "%%I" -aoa && del %%I
    )
    call :DepotCheck
)

:CrackCheck
title ThrowbackLoader Check
cls
if NOT exist "Resources\ThrowbackLoader\LaunchR6.bat" (
  Title Downloading ThrowbackLoader
  cls
  MODE 79,20
  echo -------------------------------------------------------------------------------
  echo                      Downloading Throwback Loader...
  echo -------------------------------------------------------------------------------
  :: This downloads always the latest from the github repo (it calls a powershell command from command prompt)
  for /f %%B in ('
    powershell -NoProfile -Command ^
    "(Invoke-RestMethod https://api.github.com/repos/lungu19/ThrowbackLoader/releases/latest).assets[0].browser_download_url"
  ') do set DOWNLOAD_URL=%%B

  echo %DOWNLOAD_URL%
  curl -L -o ThrowbackLoader.zip %DOWNLOAD_URL% 

 
    ::Extract
    for %%I in ("ThrowbackLoader.zip") do (
  "Resources\7z.exe" x -y -o"Resources\ThrowbackLoader" "%%I" -aoa && del %%I
  )
)
exit /b

:CrackCheck2
title Crack Check
cls
if NOT exist "Resources\Cracks.zip" (
  curl -L "https://github.com/JOJOVAV/r6-downloader/raw/refs/heads/main/Cracks.zip" --ssl-no-revoke --output Cracks.zip
  move Cracks.zip Resources
  call :CrackCheck2
)
exit /b

:cmdCheck
title CmdMenuSel Check
cls
if NOT exist "Resources\cmdmenusel.exe" (
  curl -L "https://github.com/JOJOVAV/cod-Lan-Launcher/raw/main/cmdmenusel.exe" --ssl-no-revoke --output cmdmenusel.exe
  move cmdmenusel.exe Resources
  call :cmdCheck
)
exit /b

:backendcheck
title Backend Check
cls
if NOT exist "%backendscript%" (
  curl -L "https://github.com/JOJOVAV/r6-downloader/releases/download/Canary-V7.0/backend.ps1" --ssl-no-revoke --output "%backendscript%"
)
exit /b

:cmdMenuSel
Resources\cmdMenuSel 07f0 %*
exit /b

:scriptcheck
title Backend Script Check
cls
if NOT exist "%backendscript%" (
  curl -L "https://github.com/JOJOVAV/r6-downloader/raw/refs/heads/main/downloaders/V7/backend.ps1" --ssl-no-revoke --output "%backendscript%"
)

if NOT exist "%save%" (
  curl -L "https://github.com/JOJOVAV/r6-downloader/raw/refs/heads/main/downloaders/V7/script.ps1" --ssl-no-revoke --output "%save%"
)

exit /b

:checkini
Title INI File Check
cls
if not exist "%inifile%" (
    (
        echo ;the little settings configuration
        echo [settings]
        echo ;format username=yourusername
        echo username=
        echo maxdownloads=25
    ) > "%inifile%" && call :login
)

exit /b

:checkname
Title checking name
cls
MODE 60,10
echo -------------------------------------------
echo ^| Checking if your steam name is set.   ^|
echo -------------------------------------------
echo.
for /f "tokens=2 delims==" %%A in ('
    findstr /R "^[ ]*username=" "%inifile%"
') do (
    set "USERNAME=%%A"
)
if "!USERNAME!"=="" (
    goto login
)

exit /b

:login
Title Steam Login
cls
MODE 60,10
echo ---------------------------------------------
echo ^| Login into Steam, set your legacy name  ^|
echo ^| don't use username, only use login name ^|
echo ---------------------------------------------
echo.
set /p USERNAME="Enter Player name: "


powershell -ExecutionPolicy Bypass -File "%save%" -iniFile "%inifile%" -section "%sectionS%" -key "%ininame%" -newValue "%USERNAME%"

exit /b

:downloading
Title Downloading...
cls
MODE 60,10
echo -------------------------------------------
echo ^|       Downloading, please wait...      ^|
echo -------------------------------------------
echo.
powershell -ExecutionPolicy Bypass -File %backendscript% ^
    -Year %YEAR% ^
    -Season %SEASON% ^
    -Patch %PATCH% ^
    -Username %USERNAME% ^
    -MaxDownloads %MAXDOWNLOADS%

pause
exit /b

:format
echo   Season Name      ^| Year ^| Size   ^| Additional Notes
exit /b

:moresettings
Title Downloader Settings
cls
MODE 78,15
echo --------------------------------------------------------------------------
echo ^|                     Downloader Settings Menu                      ^|
echo --------------------------------------------------------------------------
echo.
call :cmdMenuSel "  Main Menu" "  Refresh Menu" "  Set Steam Username" "  Set Maximum Concurrent Downloads"
if %ERRORLEVEL% == 1 call :mainmenu
if %ERRORLEVEL% == 2 call :moresettings
if %ERRORLEVEL% == 3 call :login
if %ERRORLEVEL% == 4 call :setmaxdownloads

:setmaxdownloads
cls
MODE 60,10
echo ------------------------------------------------
echo ^|      Set Maximum Concurrent Downloads      ^|
echo ------------------------------------------------
echo ^| Default is set to 25, set lower if you have^|
echo ^| a slower internet connection and higher if ^|
echo ^| you have a faster connection.              ^|
echo ^| Maximum is 50 downloads at once.           ^|
echo ------------------------------------------------
echo.
set /p MAXDOWNLOADS= Enter the downloadspeed (default is set 25): 
if "%MAXDOWNLOADS%" == "" set MAXDOWNLOADS=25
powershell -ExecutionPolicy Bypass -File "%save%" -iniFile "%inifile%" -section "%sectionS%" -key "%iniMAXDOWNLOADS%" -newValue "%MAXDOWNLOADS%"
goto moresettings

:quidefaq
start https://puppetino.github.io/Throwback-FAQ/Pages/getting_started.html
goto mainmenu

:siegeclaim
start https://store.steampowered.com/app/359550/Rainbow_Six_Siege/
goto mainmenu
