@shift /0
@echo off
setlocal enableextensions
Color 0F
set "folder=%~dp0"
set "inifile=Resources\config.ini"
set "inifile=Resources\config.ini"
set "sectionS=settings"
set "ininame=username"
set "iniMAXDOWNLOADS=maxdownloads"
set backendscript=Resources\backend.ps1
set save=Resources\script.ps1
set USERNAME="jojovav"
set MAXDOWNLOADS=50

call :onedrive
call :dotnetcheck
call :7zipcheck
call :DepotCheck
call :CrackCheck
call :CrackCheck2
call :cmdCheck
call :scriptcheck
@REM call :checkini
@REM call :login

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
echo ^|                                                                        ^|
echo --------------------------------------------------------------------------
echo ^| YOU MUST CLAIM FOR FREE A COPY OF SIEGE ON STEAM TO USE THE DOWNLOADER ^|
echo --------------------------------------------------------------------------
echo ^|                       Select an option below                           ^|
echo -------------------------------------------------------------------------- 
echo.
call :cmdMenuSel "  Game Downloader" "  verify the game" "  Heated Metal" "  Test Server Downloader" "  4K Textures Download" "  Modding / Extra Tools" "  Claim Siege on Steam for free" "  Downloader Settings" "  Installation Guide and FAQ"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :downloadmenu
if %ERRORLEVEL% == 3 call :HeatedMetal
if %ERRORLEVEL% == 4 call :testservers
if %ERRORLEVEL% == 5 call :4ktextures
if %ERRORLEVEL% == 6 call :extratools
if %ERRORLEVEL% == 7 call :siegeclaim
if %ERRORLEVEL% == 8 call :moresettings
if %ERRORLEVEL% == 9 call :guidefaq

:notimplemented
Title Not Implemented
cls
MODE 60,10
echo -----------------------------------------------------------------------
echo ^| This feature is not yet implemented. Please check back later.      ^|
echo -----------------------------------------------------------------------
echo.
pause >nul
goto mainmenu

:quidefaq
start https://puppetino.github.io/Throwback-FAQ/Pages/getting_started.html
goto mainmenu

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
if %ERRORLEVEL% == 3 call :vanilla
if %ERRORLEVEL% == 4 call :blackice
if %ERRORLEVEL% == 5 call :dustline
if %ERRORLEVEL% == 6 call :skullrain
if %ERRORLEVEL% == 7 call :redcrow

:vanilla
echo You have selected Vanilla Edition
set YEAR="Y1"
set SEASON="S0"
set PATCH="0"
call :downloading

@REM pause >nul
goto downloadmenu

:season2
Title Rainbow Six Siege Season 2 Download
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
if %ERRORLEVEL% == 3 call :velvetshell
if %ERRORLEVEL% == 4 call :health
if %ERRORLEVEL% == 5 call :bloodorchid
if %ERRORLEVEL% == 6 call :whitenoise


:season3
Title Rainbow Six Siege Season 3 Download
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
if %ERRORLEVEL% == 3 call :chimera
if %ERRORLEVEL% == 4 call :parabellum
if %ERRORLEVEL% == 5 call :grimsky
if %ERRORLEVEL% == 6 call :windbastion

:season4
Title Rainbow Six Siege Season 4 Download
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
if %ERRORLEVEL% == 3 call :burnthorizon
if %ERRORLEVEL% == 4 call :phantomsight
if %ERRORLEVEL% == 5 call :emberrise
if %ERRORLEVEL% == 6 call :shiftingtides

:season5
Title Rainbow Six Siege Season 5 Download
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
if %ERRORLEVEL% == 3 call :voidedge
if %ERRORLEVEL% == 4 call :steelwave
if %ERRORLEVEL% == 5 call :shadowlegacy
if %ERRORLEVEL% == 6 call :HeatedMetal
if %ERRORLEVEL% == 7 call :neondawn

:season6
Title Rainbow Six Siege Season 6 Download
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 6 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Crimson Heist    | Y6S1 | 44.9 GB | Rainbow Is Magic 2 + Apocalypse Event" "  North Star       | Y6S2 | xx.x GB | Nest Destruction " "  Crystal Guard    | Y6S3 | xx.x GB | Showdown Event" "  High Calibre     | Y6S4 | xx.x GB | Stadium + Snowball"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season6
if %ERRORLEVEL% == 3 call :crimsonheist
if %ERRORLEVEL% == 4 call :northstar
if %ERRORLEVEL% == 5 call :crystalguard
if %ERRORLEVEL% == 6 call :highcalibre

:season7
Title Rainbow Six Siege Season 7 Download
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
if %ERRORLEVEL% == 3 call :demonveil
if %ERRORLEVEL% == 4 call :vectorglare
if %ERRORLEVEL% == 5 call :brutalswarm
if %ERRORLEVEL% == 6 call :solarraid

:season8
Title Rainbow Six Siege Season 8 Download
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 8 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Commanding Force | Y8S1 | xx.x GB | RIM + TOKY Event" "  Dread Factor     | Y8S2 | xx.x GB | Rengoku Event" "  Heavy Mettle     | Y8S3 | xx.x GB | Doktor's Curse Event + NO UNLOCKED OPERATORS" "  Deep Freeze      | Y8S4 | 52.9 GB | NO UNLOCKED OPERATORS"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season8
if %ERRORLEVEL% == 3 call :commandingforce
if %ERRORLEVEL% == 4 call :dreadfactor
if %ERRORLEVEL% == 5 call :heavymetal
if %ERRORLEVEL% == 6 call :deepfreeze

:season9
Title Rainbow Six Siege Season 9 Download
cls
MODE 70,20
echo -------------------------------------------------------------------------
echo ^| Click on one the seasons of Year 9 you like to choose.            ^|
echo -------------------------------------------------------------------------
echo.
call :format
echo.
call :cmdMenuSel "  Back to Seasons Menu" "  Refresh Menu" "  Deadly Omen      | Y9S1 | xx.x GB | NO UNLOCKED OPERATORS" "  New Blood        | Y9S2 | 56.0 GB | NO UNLOCKED OPERATORS" "  Twin Shells      | Y9S3 | 59.2 GB | NO UNLOCKED OPERATORS" "  Collision Point  | Y9S4 | 59.2 GB | NO UNLOCKED OPERATORS"
if %ERRORLEVEL% == 1 call :downloadmenu
if %ERRORLEVEL% == 2 call :season9
if %ERRORLEVEL% == 3 call :deadlyomen
if %ERRORLEVEL% == 4 call :newblood
if %ERRORLEVEL% == 5 call :twinshells
if %ERRORLEVEL% == 6 call :collisionpoint

:season10
Title Rainbow Six Siege Season 10 Download
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
if %ERRORLEVEL% == 3 call :prepphase
if %ERRORLEVEL% == 4 call :daybreak
if %ERRORLEVEL% == 5 call :highstakes
if %ERRORLEVEL% == 6 call :tenfoldpursuit


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
for /f "tokens=*" %%a in ('dotnet --list-sdks 2^>nul') do (
    if %%a GEQ 9 (
        echo %%a
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
  for /f %%A in ('
    powershell -NoProfile -Command ^
    "(Invoke-RestMethod https://api.github.com/repos/lungu19/ThrowbackLoader/releases/latest).assets[0].browser_download_url"
  ') do set DOWNLOAD_URL=%%A

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
echo Checking for settings file...
pause >nul
if not exist "%inifile%" (
    (
        echo ;the little settings configuration
        echo [settings]
        echo ;format username=yourusername
        echo username=
        echo maxdownloads=25
    ) > "%inifile%" && call :login
) else call :login

exit /b

:login
Title Steam Login
cls
MODE 60,10
echo -------------------------------------------
echo ^| You will now be prompted to login to Steam. ^|
echo -------------------------------------------
echo.
echo Checking for saved Steam Username...
pause >nul
for /f "tokens=2 delims==" %%A in ('find "%ininame%=" %inifile%') do (
    set "name=%%A"
)
echo the pause before if
pause >nul
if "%name%" == "" (
    set /p name= Enter your Steam Username: 
    powershell -ExecutionPolicy Bypass -File "%save%" -iniFile "%inifile%" -section "%sectionS%" -key "%ininame%" -newValue "%name%"
)
else 
(
    set USERNAME=%name%
    echo Logged in as %USERNAME%
)



@REM set "name="
@REM for /F "tokens=2 delims==" %%A in ('type %inifile% ^| findstr /i /r /c:"^username="') do (
@REM     set "name=%%A"
@REM )
@REM echo the pause before if
@REM pause >nul
@REM if not defined name (
@REM     set /p name= Enter your Steam Username: 
@REM     (echo [settings] && echo username=%name%) > %inifile%
@REM )
@REM echo the pause after if
@REM pause >nul
@REM echo %ininame%=%name%>> %inifile%

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

:format
echo   Season Name      ^| Year ^| Size   ^| Additional Notes
exit /b

