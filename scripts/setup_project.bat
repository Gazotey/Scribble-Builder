set ProjectName=%1
set PackageName=%2
set AppDir=%3

REM ##### CREATE BUILD DIRECTORY #####
if not exist "%AppDir%\build_dir" mkdir "%AppDir%\build_dir"

REM ##### CREATE NEW CORDOVA PROJECT #####
CD "%AppDir%\build_dir"
cmd.exe /c "%AppDir%\node_modules\cordova\bin\cordova.cmd" create %ProjectName% %PackageName% %ProjectName%

REM ##### ADD ANDROID PLATFORM TO THE PROJECT #####
CD "%AppDir%\build_dir\%PackageName%"
cmd.exe /c "%AppDir%\node_modules\cordova\bin\cordova.cmd" platform add android

REM ##### REMOVE DEFAULT CORDOVA PROJECT #####
rmdir /S /Q "%AppDir%\build_dir\%ProjectName%\www"

REM ##### COPY OVER DEFAULT SCRIBBLE APP PROJECT #####
xcopy "%AppDir%\app_template" "%AppDir%\build_dir\%ProjectName%\www\" /E/H

REM ##### ADD CORDOVA PLUGINS ####
cd "%AppDir%\build_dir\%ProjectName%\"
cmd.exe /c "%AppDir%\node_modules\cordova\bin\cordova.cmd" plugin add cordova-plugin-file