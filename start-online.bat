@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════╗
echo ║   🌍 GRADUATE ADVISOR — Онлайн режим         ║
echo ╚══════════════════════════════════════════════╝
echo.

REM Проверяем токен
if "%NGROK_TOKEN%"=="" (
  if not exist "ngrok-token.txt" (
    echo Введи свой ngrok токен (с сайта ngrok.com/dashboard):
    set /p TOKEN="> "
    echo %TOKEN% > ngrok-token.txt
  )
  set /p TOKEN=<ngrok-token.txt
) else (
  set TOKEN=%NGROK_TOKEN%
)

REM Настраиваем ngrok
ngrok.exe config add-authtoken %TOKEN% >nul 2>&1

echo [1/3] Запускаем Ollama...
start /min cmd /c "ollama serve"
timeout /t 2 /nobreak >nul

echo [2/3] Запускаем сервер приложения...
start /min cmd /c "node server.js"
timeout /t 2 /nobreak >nul

echo [3/3] Открываем туннель в интернет...
echo.
echo Сейчас появится ПУБЛИЧНАЯ ССЫЛКА — отправь её другу!
echo (Нажми Ctrl+C чтобы закрыть доступ)
echo.
ngrok.exe http 3000
