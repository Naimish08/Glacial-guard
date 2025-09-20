# GlacialGuard Server Setup

## Quick Start

The community feedback system is now working with mock data when the server is not running. To enable full functionality with image uploads and data persistence:

### Option 1: Use the Batch File (Recommended for Windows)
1. Double-click `start-server.bat` in the project root
2. The server will start on `http://localhost:5000`

### Option 2: Manual Setup
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Navigate to the server directory: `cd server`
4. Install dependencies: `npm install`
5. Start the server: `npm run dev`

### Option 3: Use Command Prompt
1. Open Command Prompt (cmd)
2. Navigate to the server directory: `cd server`
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`

## Features Available

### Without Server (Mock Mode)
- ✅ Submit community reports
- ✅ Submit missing person reports
- ✅ Form validation
- ✅ Image preview (but not uploaded to server)
- ✅ Admin interface (shows empty data)

### With Server (Full Mode)
- ✅ All mock features plus:
- ✅ Image upload and storage
- ✅ Data persistence
- ✅ Admin can view and moderate reports
- ✅ Real-time data updates

## API Endpoints

When server is running:
- `POST /api/community/reports` - Submit community reports
- `GET /api/community/reports` - Get community reports
- `POST /api/community/missing-persons` - Submit missing person reports
- `GET /api/community/missing-persons` - Get missing person reports
- `GET /api/uploads/:filename` - Serve uploaded images

## Troubleshooting

If you see "Server not available" messages in the console, the mock system is working correctly. To enable full functionality, start the server using one of the methods above.

The system gracefully falls back to mock data when the server is not available, so you can test all the UI functionality immediately.
