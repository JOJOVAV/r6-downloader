@echo off
Color 0F

@REM collour
for /f %%A in ('echo prompt $E^|cmd') do set "ESC=%%A"

set "green=%ESC%[32m"
set "brightgreen=%ESC%[92m"
set "bold=%ESC%[1m"
set "reset=%ESC%[0m"

@REM basic checks
call :onedrive
call :dotnetcheck
call :7zipcheck
call :DepotCheck
call :helioscheck


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
TIMEOUT /T 10


:mainmenu
Title Rainbow Six Siege Heated Metal Downloader  
cls
MODE 78,21
echo --------------------------------------------------------------------------
echo ^|              Heated Metal downloader made by JVAV                      ^|
echo --------------------------------------------------------------------------
echo ^|                 Consider donating to ZeroBytes:                        ^|
echo ^|           https://www.buymeacoffee.com/DataCluster0                    ^|
echo --------------------------------------------------------------------------
echo ^| YOU MUST CLAIM FOR FREE A COPY OF SIEGE ON STEAM TO USE THE DOWNLOADER ^|
echo --------------------------------------------------------------------------
echo ^|                       Choose an option below                           ^|
echo -------------------------------------------------------------------------- 
echo.
echo   %bold%%green%[1] Game Downloader (Download the game)%reset%
echo   [2] verify the game (To fix broken files)
echo   %bold%%brightgreen%[3] Download Heated Metal%reset%
echo   [4] Claim Siege on Steam for free
echo   [5] Consider joining the official Discord
  choice /c 12345 /n /m "Choose a number:"
if errorlevel 5 start https://discord.gg/7mR9VxBxWd && goto mainmenu
if errorlevel 4 goto siegeclaim
if errorlevel 3 goto HeatedMetal
if errorlevel 2 goto downloadmenu
if errorlevel 1 goto downloadmenu

:downloadmenu
Title Rainbow Six Siege Seasons
cls
MODE 78,21
echo -------------------------------------------------------------------------
echo ^|     Select a Rainbow Six Siege season you like to continue.         ^|
echo -------------------------------------------------------------------------
echo.
echo   [1] Main Menu  
echo   [2] Shadow Legacy    ^| Y5S3 ^| 88.0 GB   
echo   %green%[3] Neon Dawn        ^| Y5S4 ^| 57.0 GB (RECOMMENDED)%reset%
choice /c 123 /n /m "   choose a number: "
if errorlevel 3 goto Y5S4_NeonDawn
if errorlevel 2 goto Y5S3_ShadowLegacy
if errorlevel 1 goto mainmenu


:Y5S3_ShadowLegacy
MODE 120,50
Title Downloading Shadow Legacy...
cls
set /p username="Enter Steam Username:"
echo Heated Metal will NO longer be supported on Shadow Legacy! 
echo Last availible version is 0.2.3
echo Use the Neon Dawn option to use future Heated Metal versions, unless you wish to use older versions of Heated Metal.
echo Launch the game using the LaunchR6.bat file instead of the RainbowSix.exe or Lumaplay.exe^!
pause
dotnet Resources\DepotDownloader.dll -app 359550 -depot 377237 -manifest 85893637567200342 -username %username% -remember-password -dir "Downloads\Y5S3_ShadowLegacy" -validate -max-downloads %maxdownloads% 
dotnet Resources\DepotDownloader.dll -app 359550 -depot 377238 -manifest 4020038723910014041 -username %username% -remember-password -dir "Downloads\Y5S3_ShadowLegacy" -validate -max-downloads %maxdownloads% 
dotnet Resources\DepotDownloader.dll -app 359550 -depot 359551 -manifest 3089981610366186823 -username %username% -remember-password -dir "Downloads\Y5S3_ShadowLegacy" -validate -max-downloads %maxdownloads% 
pause
Robocopy Resources\HeliosLoader Downloads\Y5S2_SteelWave
@REM Robocopy Resources\ThrowbackLoader\Base Downloads\Y5S3_ShadowLegacy
@REM Robocopy Resources\ThrowbackLoader\Y1SX-Y6S2 Downloads\Y5S3_ShadowLegacy /s
::Robocopy Resources Downloads\Y5S3_ShadowLegacy localization.lang /IS /IT
goto downloadcomplete


:Y5S4_NeonDawn
MODE 120,50
Title Downloading Neon Dawn...
cls
set /p username="Enter Steam Username:"
echo Launch the game using the LaunchR6.bat file instead of the RainbowSix.exe^!
pause
dotnet Resources\DepotDownloader.dll -app 359550 -depot 377237 -manifest 3390446325154338855 -username %username% -remember-password -dir "Downloads\Y5S4_NeonDawnHM" -validate -max-downloads %maxdownloads% 
dotnet Resources\DepotDownloader.dll -app 359550 -depot 377238 -manifest 3175150742361965235 -username %username% -remember-password -dir "Downloads\Y5S4_NeonDawnHM" -validate -max-downloads %maxdownloads% 
dotnet Resources\DepotDownloader.dll -app 359550 -depot 359551 -manifest 6947060999143280245 -username %username% -remember-password -dir "Downloads\Y5S4_NeonDawnHM" -validate -max-downloads %maxdownloads% 
pause
Robocopy Resources\HeliosLoader Downloads\Y5S4_NeonDawnHM
@REM Robocopy Resources\ThrowbackLoader\Y1SX-Y6S2 Downloads\Y5S4_NeonDawnHM /s
::Robocopy Resources Downloads\Y5S4_NeonDawnHM localization.lang /IS /IT
goto downloadcomplete
:: MANIFEST


:downloadcomplete
MODE 70,6
Title Download Complete
cls
echo -------------------------
echo ^|   Download Complete!   ^|
echo -------------------------
echo.
echo Press any key to Continue
pause >nul
echo.
goto mainmenu


:HeatedMetal
Title Download the Heated Metal mod
cls
MODE 81,18 
echo ----------------------------------------------------------
echo ^| All tools will be in the Resources\HeatedMetal folder. ^|
echo ^|               Select an option below                   ^|
echo ----------------------------------------------------------
echo.
echo   [1] Back to Main Menu
echo   [2] Download Heated Metal 0.2.3 (Y5S3 ONLY)
echo   %green%[3] Download Heated Metal latest version (Y5S4 ONLY) RECOMMENDED%reset%
echo.
choice /c 123 /n /m "  Choose a number: "
if errorlevel 3 goto hm_nddownload
if errorlevel 2 goto hm_sldownload
if errorlevel 1 goto mainmenu




:hm_sldownload
cls
MODE 79,20
echo -------------------------------------------------------------------------------
echo                       Downloading Heated Metal 0.2.3...
echo -------------------------------------------------------------------------------
curl -L "https://github.com/DataCluster0/HeatedMetal/releases/download/0.2.3/HeatedMetal.7z" --ssl-no-revoke --output HeatedMetal.7z
::check if y5s3 is installed
if exist "Downloads\Y5S3_ShadowLegacy" (
		for %%I in ("HeatedMetal.7z") do (
			"Resources\7z.exe" x -y -o"Downloads\Y5S3_ShadowLegacy" "%%I" -aoa && del %%I
		)
	) else (
		for %%I in ("HeatedMetal.7z") do (
			"Resources\7z.exe" x -y -o"Resources\HeatedMetal\Y5S3_ShadowLegacy" "%%I" -aoa && del %%I
  )
)
pause
goto HeatedMetal

:hm_nddownload
cls
MODE 79,20
echo -------------------------------------------------------------------------------
echo                    Downloading Latest Version of Heated Metal
echo -------------------------------------------------------------------------------
for /f %%D in ('
    powershell -NoProfile -command ^
    "(Invoke-RestMethod https://api.github.com/repos/DataCluster0/HeatedMetal/releases/latest).assets[0].browser_download_url"
    ') do set DOWNLOAD_URL=%%D

echo %DOWNLOAD_URL%
  curl -L -o HeatedMetal.7z %DOWNLOAD_URL%

::check if y5s4 is installed
if exist "Downloads\Y5S4_NeonDawnHM" (
		for %%I in ("HeatedMetal.7z") do (
			"Resources\7z.exe" x -y -o"Downloads\Y5S4_NeonDawnHM" "%%I" -aoa && del %%I
		)
	) else (
		for %%I in ("HeatedMetal.7z") do (
			"Resources\7z.exe" x -y -o"Resources\HeatedMetal\Y5S4_NeonDawnHM" "%%I" -aoa && del %%I
  )
)
goto HeatedMetal


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
for /f "tokens=1 delims=." %%V in ('dotnet --list-sdks 2^>nul') do (
    if %%V GEQ 9 (
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
md Resources\HeatedMetal
cls
if NOT exist "Resources\7z.exe" (
    curl.exe -L "https://github.com/DataCluster0/R6TBBatchTool/raw/master/Requirements/7z.exe" --ssl-no-revoke --output 7z.exe
    move 7z.exe Resources\
  call :7zipcheck
)
exit /b

:DepotCheck
title Depot Downloader Check
cls
if NOT exist "Resources\DepotDownloader.dll" (
@REM   curl -L "https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_3.4.0/DepotDownloader-framework.zip" --ssl-no-revoke --output depot.zip
    for /f %%B in ('
    powershell -NoProfile -Command ^
    "(Invoke-RestMethod https://api.github.com/repos/SteamRE/DepotDownloader/releases/latest).assets[0].browser_download_url"
    ') do set DOWNLOAD_URL=%%B

    echo %DOWNLOAD_URL%
    curl -L -o depot.zip %DOWNLOAD_URL%
    ::Extract
    for %%I in ("depot.zip") do (
      "Resources\7z.exe" x -y -o"Resources" "%%I" -aoa && del %%I
    )
    call :DepotCheck
)

exit /b
:helioscheck
title Helios Check
cls
if NOT exist "Resources\HeliosLoader\HeliosLoader.json" (
  curl -L "https://github.com/JOJOVAV/r6-downloader/raw/refs/heads/main/HeliosLoader.zip" --ssl-no-revoke --output HeliosLoader.zip
  ::extract
  for %%I in ("HeliosLoader.zip") do (
  "Resources\7z.exe" x -y -o"Resources" "%%I" -aoa && del %%I
  )
  call :helioscheck
)
exit /b

:siegeclaim
start https://store.steampowered.com/app/359550/Rainbow_Six_Siege/
goto mainmenu