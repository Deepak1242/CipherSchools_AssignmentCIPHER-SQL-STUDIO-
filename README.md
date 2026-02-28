# CipherSQLStudio

A web platform where students can practice SQL queries with real-time execution and AI-powered hints.

## What's Inside

- **Student Dashboard**: Browse SQL assignments by difficulty
- **Interactive SQL Editor**: Write queries with syntax highlighting (Monaco Editor)
- **Real-Time Execution**: Run queries against PostgreSQL sandbox databases
- **AI Hints**: Get helpful guidance from Google Gemini when stuck
- **Query History**: Track your attempts and progress
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

**Frontend**
- React 18
- SCSS (mobile-first responsive design)
- Monaco Editor (SQL code editor)
- Axios (API calls)

**Backend**
- Node.js + Express
- MongoDB (user accounts, assignments, query history)
- PostgreSQL (SQL query execution sandbox)
- JWT authentication
- Google Gemini AI (hint generation)

## Prerequisites

Make sure you have these installed:
- Node.js 18 or higher
- PostgreSQL 14 or higher
- MongoDB (local installation or Atlas cloud account)
- Google Gemini API key

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=cipher_sql_studio

JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key
```

**Important**: Replace the placeholder values with your actual credentials.

Run the database seed scripts to set up sample assignments:

```bash
npm run seed
```

This creates 4 practice assignments with sample data in PostgreSQL.

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The app will open at `http://localhost:3000`

## How to Use

1. **Sign Up**: Create an account on the signup page
2. **Browse Assignments**: View all available SQL practice problems
3. **Solve Problems**: 
   - Read the question and requirements
   - Check sample data to understand table structure
   - Write your SQL query in the editor
   - Click "Execute Query" to run it
   - Get "Hint" if you're stuck (doesn't give away the answer)
4. **View Results**: See your query results or error messages instantly

## Sample Assignments Included

1. **Basic SELECT** (Easy) - Filter customers by join date
2. **WHERE Filtering** (Easy) - Find orders above a certain amount
3. **JOIN Operations** (Medium) - Combine data from multiple tables
4. **Aggregations** (Medium) - Calculate totals and group data

## Project Structure

```
CipherSQLStudio/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/   # Database connections
│   │   ├── models/   # MongoDB schemas
│   │   ├── routes/   # API endpoints
│   │   └── services/ # Query execution & hints
│   └── seeds/        # Sample data scripts
│
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main pages
│   │   ├── styles/      # SCSS stylesheets
│   │   └── services/    # API integration
│   └── public/
│
└── README.md
```

## Security Features

- SQL injection protection (query sanitization)
- Only SELECT queries allowed (no destructive operations)
- JWT authentication for user sessions
- Rate limiting on query execution and hint requests
- Isolated PostgreSQL schemas per assignment

## Troubleshooting

**Backend won't start:**
- Check if MongoDB connection string is correct
- Verify PostgreSQL is running and credentials are correct
- Make sure port 5000 is not already in use

**Frontend can't connect to backend:**
- Confirm backend is running on port 5000
- Check `.env` file has correct API URL
- Look for CORS errors in browser console

**Seed script fails:**
- Ensure PostgreSQL database exists (create it if needed: `createdb cipher_sql_studio`)
- Check PostgreSQL user has permission to create schemas
- Verify MongoDB connection before running assignment seed

## Getting API Keys

**MongoDB Atlas** (free tier available):
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string

**Google Gemini API** (free tier available):
- Visit https://ai.google.dev/
- Get your API key from Google AI Studio

**PostgreSQL** (local installation):
- macOS: `brew install postgresql@14`
- Ubuntu: `sudo apt install postgresql-14`
- Windows: Download from postgresql.org

## Development Notes

- Backend runs on port 5000
- Frontend runs on port 3000
- Query execution timeout: 5 seconds
- Maximum result rows: 1000
- Rate limits: 10 queries/min, 5 hints/min per user
