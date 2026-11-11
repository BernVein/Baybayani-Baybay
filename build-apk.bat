@echo off

rem Fall back to the local toolchain if this terminal was opened before
rem JAVA_HOME / ANDROID_HOME were set.
if not defined JAVA_HOME if exist "C:\Android\jdk-21" set "JAVA_HOME=C:\Android\jdk-21"
if not defined ANDROID_HOME if exist "C:\Android\sdk" set "ANDROID_HOME=C:\Android\sdk"

echo Building web app...
call npm run build || goto :error

echo Syncing to Android...
call npx cap sync android || goto :error

echo Building APK...
cd android || goto :error
call .\gradlew.bat assembleDebug || goto :error

echo Renaming APK...
cd app\build\outputs\apk\debug || goto :error

if exist Baybayani.apk del Baybayani.apk
rename app-debug.apk Baybayani.apk

echo Opening folder...
explorer .

echo.
echo DONE!
exit /b 0

:error
echo.
echo BUILD FAILED!
pause
exit /b 1