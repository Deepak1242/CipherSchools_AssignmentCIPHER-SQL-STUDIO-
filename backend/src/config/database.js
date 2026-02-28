const mongoose = require('mongoose');
const { Pool } = require('pg');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const createPostgresPool = (schemaName = 'public') => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? {
      rejectUnauthorized: false
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL error:', err);
  });

  return pool;
};

const postgresPool = createPostgresPool();

const executeInSchema = async (schemaName, query, params = []) => {
  const client = await postgresPool.connect();
  try {
    await client.query(`SET search_path TO ${schemaName}, public`);
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

module.exports = {
  connectMongoDB,
  postgresPool,
  executeInSchema,
};
