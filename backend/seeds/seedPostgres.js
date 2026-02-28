require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('sslmode=require') ? {
    rejectUnauthorized: false
  } : false
});

const seedPostgres = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Connected to PostgreSQL');

    console.log('Creating Assignment 1: Basic SELECT...');
    await client.query('DROP SCHEMA IF EXISTS assignment_1 CASCADE');
    await client.query('CREATE SCHEMA assignment_1');
    await client.query(`
      CREATE TABLE assignment_1.customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        city VARCHAR(50),
        join_date DATE NOT NULL
      )
    `);
    await client.query(`
      INSERT INTO assignment_1.customers (name, email, city, join_date) VALUES
      ('John Smith', 'john@example.com', 'New York', '2024-01-15'),
      ('Sarah Johnson', 'sarah@example.com', 'Los Angeles', '2024-03-22'),
      ('Michael Brown', 'michael@example.com', 'Chicago', '2023-11-10'),
      ('Emily Davis', 'emily@example.com', 'Houston', '2024-02-08'),
      ('David Wilson', 'david@example.com', 'Phoenix', '2024-04-17'),
      ('Lisa Anderson', 'lisa@example.com', 'Philadelphia', '2023-09-25'),
      ('James Taylor', 'james@example.com', 'San Antonio', '2024-05-30'),
      ('Maria Garcia', 'maria@example.com', 'San Diego', '2024-01-12'),
      ('Robert Martinez', 'robert@example.com', 'Dallas', '2023-12-05'),
      ('Jennifer Rodriguez', 'jennifer@example.com', 'San Jose', '2024-06-20')
    `);
    console.log('✓ Assignment 1 seeded');

    console.log('Creating Assignment 2: WHERE Filtering...');
    await client.query('DROP SCHEMA IF EXISTS assignment_2 CASCADE');
    await client.query('CREATE SCHEMA assignment_2');
    await client.query(`
      CREATE TABLE assignment_2.orders (
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL,
        product VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        order_date DATE NOT NULL
      )
    `);
    await client.query(`
      INSERT INTO assignment_2.orders (customer_id, product, amount, order_date) VALUES
      (1, 'Laptop', 1299.99, '2024-02-10'),
      (2, 'Mouse', 29.99, '2024-02-11'),
      (3, 'Keyboard', 79.99, '2024-02-12'),
      (1, 'Monitor', 349.99, '2024-02-13'),
      (4, 'Headphones', 199.99, '2024-02-14'),
      (2, 'USB Cable', 12.99, '2024-02-15'),
      (5, 'Webcam', 89.99, '2024-02-16'),
      (3, 'Desk Chair', 259.99, '2024-02-17'),
      (6, 'Desk Lamp', 45.99, '2024-02-18'),
      (4, 'External SSD', 149.99, '2024-02-19'),
      (7, 'Graphics Card', 599.99, '2024-02-20'),
      (1, 'RAM', 119.99, '2024-02-21'),
      (8, 'Power Supply', 89.99, '2024-02-22'),
      (9, 'Motherboard', 299.99, '2024-02-23'),
      (10, 'CPU', 449.99, '2024-02-24')
    `);
    console.log('✓ Assignment 2 seeded');

    console.log('Creating Assignment 3: JOINs...');
    await client.query('DROP SCHEMA IF EXISTS assignment_3 CASCADE');
    await client.query('CREATE SCHEMA assignment_3');
    await client.query(`
      CREATE TABLE assignment_3.customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE assignment_3.orders (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES assignment_3.customers(id),
        product VARCHAR(100) NOT NULL,
        total DECIMAL(10, 2) NOT NULL
      )
    `);
    await client.query(`
      INSERT INTO assignment_3.customers (name, email) VALUES
      ('Alice Cooper', 'alice@example.com'),
      ('Bob Dylan', 'bob@example.com'),
      ('Charlie Parker', 'charlie@example.com'),
      ('Diana Ross', 'diana@example.com'),
      ('Edward Norton', 'edward@example.com')
    `);
    await client.query(`
      INSERT INTO assignment_3.orders (customer_id, product, total) VALUES
      (1, 'Laptop', 1200.00),
      (1, 'Mouse', 25.00),
      (2, 'Keyboard', 75.00),
      (3, 'Monitor', 300.00),
      (3, 'Webcam', 80.00),
      (3, 'Headphones', 150.00),
      (4, 'Tablet', 500.00)
    `);
    console.log('✓ Assignment 3 seeded');

    console.log('Creating Assignment 4: Aggregations...');
    await client.query('DROP SCHEMA IF EXISTS assignment_4 CASCADE');
    await client.query('CREATE SCHEMA assignment_4');
    await client.query(`
      CREATE TABLE assignment_4.sales (
        id SERIAL PRIMARY KEY,
        region VARCHAR(50) NOT NULL,
        product VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        revenue DECIMAL(10, 2) NOT NULL,
        sale_date DATE NOT NULL
      )
    `);
    await client.query(`
      INSERT INTO assignment_4.sales (region, product, quantity, revenue, sale_date) VALUES
      ('North', 'Laptop', 5, 6000.00, '2024-01-15'),
      ('North', 'Mouse', 20, 500.00, '2024-01-16'),
      ('South', 'Keyboard', 15, 1125.00, '2024-01-17'),
      ('South', 'Monitor', 8, 2400.00, '2024-01-18'),
      ('East', 'Headphones', 12, 1800.00, '2024-01-19'),
      ('East', 'Webcam', 10, 900.00, '2024-01-20'),
      ('West', 'Laptop', 7, 8400.00, '2024-01-21'),
      ('West', 'Tablet', 6, 3000.00, '2024-01-22'),
      ('North', 'Monitor', 4, 1200.00, '2024-01-23'),
      ('South', 'Headphones', 18, 2700.00, '2024-01-24'),
      ('East', 'Laptop', 3, 3600.00, '2024-01-25'),
      ('West', 'Mouse', 25, 625.00, '2024-01-26'),
      ('North', 'Keyboard', 10, 750.00, '2024-01-27'),
      ('South', 'Webcam', 8, 720.00, '2024-01-28'),
      ('East', 'Tablet', 5, 2500.00, '2024-01-29'),
      ('West', 'Headphones', 14, 2100.00, '2024-01-30'),
      ('North', 'Laptop', 6, 7200.00, '2024-02-01'),
      ('South', 'Mouse', 30, 750.00, '2024-02-02'),
      ('East', 'Monitor', 9, 2700.00, '2024-02-03'),
      ('West', 'Keyboard', 12, 900.00, '2024-02-04')
    `);
    console.log('✓ Assignment 4 seeded');

    console.log('\n✅ All PostgreSQL schemas and data seeded successfully!');
  } catch (error) {
    console.error('Error seeding PostgreSQL:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seedPostgres().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
