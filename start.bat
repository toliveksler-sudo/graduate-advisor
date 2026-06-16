@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════╗
echo ║   🎓 GRADUATE ADVISOR 2026                   ║
echo ║   Советник для выпускников 9 и 11 класса     ║
echo ╚══════════════════════════════════════════════╝
echo.

if not exist "node_modules" (
  echo Устанавливаем пакеты...
  npm install
  echo.
)

REM Проверяем наличие .env
if not exist ".env" (
  echo [Режим: OLLAMA - локальный ИИ без API ключа]
) else (
  findstr /i "ANTHROPIC_API_KEY=sk-" .env >nul 2>&1
  if errorlevel 1 (
    echo [Режим: OLLAMA - локальный ИИ без API ключа]
  ) else (
    echo [Режим: Claude API - облачный ИИ]
  )
)

echo.
echo Запускаем сервер...
echo Открой браузер: http://localhost:3000
echo.
echo Нажми Ctrl+C чтобы остановить
echo.
node server.js
pause
