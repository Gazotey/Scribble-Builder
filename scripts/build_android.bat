set ProjectName=%1
set AppDir=%2

REM ##### DEV DEV DEV DEV DEV DEV DEV DEV ####
cd "%AppDir%\build_dir\%ProjectName%\"
cmd.exe /c "%AppDir%\node_modules\cordova\bin\cordova.cmd" build android