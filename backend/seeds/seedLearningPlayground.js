require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

const seedLearningPlayground = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Connected to PostgreSQL');
    console.log('Creating SQL Learning Playground schema...');

    await client.query('DROP SCHEMA IF EXISTS learning_playground CASCADE');
    await client.query('CREATE SCHEMA learning_playground');

    // Create sample employees table
    await client.query(`
      CREATE TABLE learning_playground.employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(50) NOT NULL,
        salary DECIMAL(10, 2) NOT NULL,
        hire_date DATE NOT NULL,
        city VARCHAR(50) NOT NULL
      )
    `);

    await client.query(`
      INSERT INTO learning_playground.employees (name, department, salary, hire_date, city) VALUES
      ('Alice Johnson', 'Engineering', 95000.00, '2022-01-15', 'San Francisco'),
      ('Bob Smith', 'Marketing', 75000.00, '2021-06-20', 'New York'),
      ('Carol Davis', 'Engineering', 105000.00, '2020-03-10', 'San Francisco'),
      ('David Wilson', 'Sales', 85000.00, '2022-09-05', 'Chicago'),
      ('Emma Brown', 'Engineering', 92000.00, '2023-02-14', 'Austin'),
      ('Frank Miller', 'HR', 68000.00, '2021-11-30', 'New York'),
      ('Grace Lee', 'Sales', 88000.00, '2022-07-18', 'Chicago'),
      ('Henry Garcia', 'Marketing', 72000.00, '2023-04-22', 'Los Angeles'),
      ('Ivy Martinez', 'Engineering', 98000.00, '2021-08-12', 'San Francisco'),
      ('Jack Robinson', 'Sales', 82000.00, '2022-12-03', 'Chicago')
    `);

    // Create sample products table
    await client.query(`
      CREATE TABLE learning_playground.products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL
      )
    `);

    await client.query(`
      INSERT INTO learning_playground.products (name, category, price, stock) VALUES
      ('Laptop Pro 15', 'Electronics', 1299.99, 45),
      ('Wireless Mouse', 'Accessories', 29.99, 150),
      ('USB-C Cable', 'Accessories', 12.99, 200),
      ('Monitor 27"', 'Electronics', 399.99, 30),
      ('Keyboard Mechanical', 'Accessories', 89.99, 75),
      ('Headphones Wireless', 'Audio', 149.99, 60),
      ('Desk Lamp LED', 'Furniture', 45.99, 90),
      ('Office Chair', 'Furniture', 299.99, 25),
      ('Webcam HD', 'Electronics', 79.99, 55),
      ('Phone Stand', 'Accessories', 19.99, 120)
    `);

    // Create sample orders table
    await client.query(`
      CREATE TABLE learning_playground.orders (
        id SERIAL PRIMARY KEY,
        product_id INT REFERENCES learning_playground.products(id),
        quantity INT NOT NULL,
        order_date DATE NOT NULL,
        customer_name VARCHAR(100) NOT NULL
      )
    `);

    await client.query(`
      INSERT INTO learning_playground.orders (product_id, quantity, order_date, customer_name) VALUES
      (1, 2, '2024-01-15', 'TechCorp Inc'),
      (2, 10, '2024-01-16', 'StartupXYZ'),
      (3, 25, '2024-01-17', 'TechCorp Inc'),
      (4, 3, '2024-01-18', 'Design Studio'),
      (5, 5, '2024-01-19', 'StartupXYZ'),
      (6, 8, '2024-01-20', 'Media Group'),
      (1, 1, '2024-01-21', 'Freelancer Joe'),
      (7, 12, '2024-01-22', 'Office Solutions'),
      (8, 6, '2024-01-23', 'Design Studio'),
      (9, 4, '2024-01-24', 'Media Group')
    `);

    console.log('✓ Learning Playground seeded successfully!');
    console.log('  - employees table: 10 rows');
    console.log('  - products table: 10 rows');
    console.log('  - orders table: 10 rows');

  } catch (error) {
    console.error('Error seeding learning playground:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seedLearningPlayground().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
