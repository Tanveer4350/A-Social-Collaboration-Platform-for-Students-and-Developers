@echo off
title ProjectConnect — Full Stack Platform Launcher
echo =========================================================================
echo    PROJECTCONNECT: Social Collaboration Platform for Students & Devs
echo    Enterprise Web Application (UTA024) - Thapar Institute
echo =========================================================================
echo.

set JAVA_HOME=C:\Program Files\Java\jdk-26.0.2
set MAVEN_CMD=C:\Users\Tanve\apache-maven-3.9.6\bin\mvn.cmd

echo [1/2] Starting Spring Boot Backend Server on port 8080...
start "ProjectConnect Backend (Port 8080)" cmd /k "cd backend && "%MAVEN_CMD%" spring-boot:run"

echo [2/2] Starting React Vite Frontend on port 5173...
start "ProjectConnect Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================================================
echo  Application is launching!
echo  - Frontend Web UI:  http://localhost:5173
echo  - Backend API Root: http://localhost:8080/api
echo  - H2 Database GUI:  http://localhost:8080/h2-console
echo.
echo  Demo Credentials:
echo    Username: tanveer     Password: password123 (Lead Developer)
echo    Username: simerose    Password: password123 (Frontend Student)
echo    Username: harleen     Password: password123 (Backend Student)
echo =========================================================================
echo.
pause
