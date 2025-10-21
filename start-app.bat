@echo off
echo Starting Azure DevOps Project Retriever...
echo.
echo This will start both the backend server and frontend client
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:3001
echo.
echo Press any key to continue...
pause >nul

echo.
echo Installing dependencies and starting the application...
npm run dev

echo.
echo Application started! 
echo Open your browser and go to: http://localhost:3001
echo.
echo Press any key to exit...
pause >nul
