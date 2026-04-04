#!/bin/bash
cd "$(dirname "$0")"

# Terminal title
echo "========================================"
echo "   foon 2.0 - Local Server Launcher   "
echo "========================================"

# Kill process on port 3000
echo "1. Checking for existing server on port 3000..."
PID=$(lsof -ti :3000)
if [ -n "$PID" ]; then
  echo "   - Found process $PID. Killing it..."
  kill -9 $PID
  echo "   - Process killed."
else
  echo "   - No process found on port 3000."
fi

# Start server
echo ""
echo "2. Starting foon server (npm run dev)..."
npm run dev &
SERVER_PID=$!

# Wait for server to be ready (simple delay + check)
echo ""
echo "3. Waiting for server to initialize..."
sleep 3

# Open browser
echo ""
echo "4. Opening http://localhost:3000..."
open http://localhost:3000

# Keep terminal open to see logs
echo ""
echo "Server is running! Press Ctrl+C to stop."
wait $SERVER_PID
