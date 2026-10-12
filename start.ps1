# ProjectConnect - PowerShell Startup Script
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "   PROJECTCONNECT: Social Collaboration Platform for Students & Devs" -ForegroundColor Cyan
Write-Host "   Enterprise Web Application (UTA024) - Thapar Institute" -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan

$env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.2"
$mavenCmd = "C:\Users\Tanve\apache-maven-3.9.6\bin\mvn.cmd"

Write-Host "`n[1/2] Starting Spring Boot Backend on http://localhost:8080..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k cd backend && `"$mavenCmd`" spring-boot:run"

Write-Host "[2/2] Starting React Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k cd frontend && npm run dev"

Write-Host "`n🚀 Launch initiated! Open http://localhost:5173 in your browser." -ForegroundColor Yellow
