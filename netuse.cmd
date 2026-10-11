@echo off
set "HOST=%~1"
if "%HOST%"=="" set "HOST=ThinkPadX1"

net use W: /delete >nul 2>&1
net use W: \\%HOST%\C$\prj\roncartoons\web /pers:no