@echo off
echo Открываем порт 3000 в файрволе Windows...
netsh advfirewall firewall add rule name="Graduate Advisor Port 3000" dir=in action=allow protocol=TCP localport=3000
echo.
echo Готово! Теперь телефон может подключиться.
pause
