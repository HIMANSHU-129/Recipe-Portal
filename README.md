# 🍽️ Recipe Sharing Portal

A minimal, 45-minute workshop project demonstrating a full-stack React and Node.js application.

## Features
- **Frontend**: React (Vite), React Router, Lucide Icons, Glassmorphism UI
- **Backend**: Node.js, Express, SQLite3 (in-memory/file based)
- **Authentication**: Minimoth OTP Mock API
- **Functionality**: Login/Register, View Recipes, Create Recipes

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm run dev # or node server.js
```
The backend will run on `http://localhost:5000`. It will create a `database.sqlite` file automatically.

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create a .env file based on .env.example
npm run dev
```
The frontend will run on `http://localhost:5173`.

### 3. Usage
1. Open the frontend in your browser.
2. Enter any phone number (e.g. `1234567890`) to log in.
3. Check the **backend console** for the mocked OTP.
4. Enter the 4-digit OTP to authenticate.
5. Create and view recipes!
