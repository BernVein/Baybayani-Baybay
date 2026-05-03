@echo off

echo Building web app...
call npm run build || goto :error

echo Copying to Android...
call npx cap copy android || goto :error

echo Building APK...
cd android || goto :error
call gradlew.bat assembleDebug || goto :error

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