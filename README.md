# CipherSQLStudio

Hey! This is CipherSQLStudio, a web app I built to help people practice SQL queries. It's basically a sandbox where you can write SQL, execute it in real-time, and even get some AI-generated hints if you're stuck on a problem.

## 🌐 Live Demo

- **Application:** https://sql-academy-fsjm-frontend-r2zz2zghl.vercel.app
- **Backend API:** https://sql-academy-oq8obg3pr-demoncommander12-1854s-projects.vercel.app
- **GitHub Repo:** https://github.com/Deepak1242/sql_academy

## What's in it?
- A dashboard to pick SQL problems based on difficulty.
- An interactive code editor that highlights your SQL syntax (built with Monaco Editor).
- A real PostgreSQL sandbox to safely test your queries.
- AI-powered hints using Google Gemini to gently guide you without giving the answer away.

## Tech Stack
- **Frontend**: React, SCSS 
- **Backend**: Node.js, Express
- **Databases**: MongoDB (for user accounts and history) & PostgreSQL (for executing the practice queries)
- **AI**: Google Gemini API

## Local Setup

You'll need Node.js, PostgreSQL, and MongoDB installed, plus a free Google Gemini API key.

1. **Start the Backend**:
   - `cd backend`
   - `npm install`
   - Create a `.env` file and add in your database connection strings, JWT secret, and Gemini API key. (You need `MONGODB_URI`, `DATABASE_URL`, and `GEMINI_API_KEY`).
   - Run `npm run seed` to load the database with some sample practice problems.
   - Start the server: `npm run dev`

2. **Start the Frontend**:
   - Open another terminal tab.
   - `cd frontend`
   - `npm install`
   - Start the React app: `npm run dev` (or `npm start`)

Once both servers are running, just go to `http://localhost:3000` in your browser, create a quick account, and start practicing!

## Troubleshooting Notes
- If the AI hints throw an error or stop working, you might have hit the free Gemini quota limit. The app will usually fall back to basic hardcoded hints though.
- If the frontend can't talk to the backend, make sure your backend is running and the `.env` API URLs match up.

Have fun writing SQL!
