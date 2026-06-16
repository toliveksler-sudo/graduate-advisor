@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   Установка Ollama (локальный ИИ без API ключа) ║
echo ╚══════════════════════════════════════════════════╝
echo.
echo Шаг 1: Открываем сайт для скачивания Ollama...
echo Скачай и установи: https://ollama.com/download/windows
echo.
start https://ollama.com/download/windows
echo.
pause
echo.
echo Шаг 2: После установки Ollama загружаем модель...
echo Это займёт 5-10 минут (размер ~4.7 ГБ)
echo.
echo Запускаем загрузку модели llama3.1...
ollama pull llama3.1
echo.
if errorlevel 1 (
  echo Попробуем меньшую модель mistral (4.1 ГБ)...
  ollama pull mistral
)
echo.
echo ✅ Готово! Теперь запусти start.bat
echo.
pause
