require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectMongoDB } = require('./config/database');

const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const queryRoutes = require('./routes/query');
const attemptRoutes = require('./routes/attempts');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB once
let mongoConnected = false;
const ensureMongoConnection = async () => {
  if (!mongoConnected) {
    await connectMongoDB();
    mongoConnected = true;
  }
};

app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'https://sql-academy-lhh1acujr-demoncommander12-1854s-projects.vercel.app',
  'https://sql-academy-demoncommander12-1854s-projects.vercel.app',
  'https://frontend-6snad6oq7-demoncommander12-1854s-projects.vercel.app',
  'https://frontend-demoncommander12-1854s-projects.vercel.app',
  'https://frontend-fhfiigo1e-demoncommander12-1854s-projects.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure MongoDB connection
app.use(async (req, res, next) => {
  try {
    await ensureMongoConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/attempts', attemptRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const startServer = async () => {
  try {
    await connectMongoDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
