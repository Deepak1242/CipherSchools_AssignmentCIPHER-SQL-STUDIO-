#!/bin/bash

cd "$(dirname "$0")/backend"
echo "Starting backend server..."
echo "Make sure you have:"
echo "  ✓ MongoDB running"
echo "  ✓ PostgreSQL running"
echo "  ✓ .env file configured"
echo ""
npm run dev
