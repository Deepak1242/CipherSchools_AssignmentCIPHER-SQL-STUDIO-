require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('../src/models/Assignment');

const assignments = [
  {
    title: 'Basic SELECT Query',
    description: 'Learn how to retrieve data from a single table using SELECT statement',
    difficulty: 'Easy',
    question: 'Write a query to retrieve all customers who joined in the year 2024. Display their name, email, and join date.',
    schemaName: 'assignment_1',
    tableNames: ['customers'],
    expectedOutput: 'List of customers with name, email, and join_date where year is 2024',
    expectedQuery: "SELECT name, email, join_date FROM customers WHERE EXTRACT(YEAR FROM join_date) = 2024",
  },
  {
    title: 'WHERE Clause Filtering',
    description: 'Practice filtering data using WHERE conditions',
    difficulty: 'Easy',
    question: 'Find all orders where the amount is greater than $100. Sort the results by amount in descending order.',
    schemaName: 'assignment_2',
    tableNames: ['orders'],
    expectedOutput: 'Orders with amount > 100, sorted by amount DESC',
    expectedQuery: "SELECT * FROM orders WHERE amount > 100 ORDER BY amount DESC",
  },
  {
    title: 'JOIN Operations',
    description: 'Master joining multiple tables to combine related data',
    difficulty: 'Medium',
    question: 'List each customer name along with the total number of orders they have placed. Include customers with zero orders.',
    schemaName: 'assignment_3',
    tableNames: ['customers', 'orders'],
    expectedOutput: 'Customer names with their order count using LEFT JOIN',
    expectedQuery: "SELECT c.name, COUNT(o.id) as order_count FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY c.name",
  },
  {
    title: 'Aggregation and GROUP BY',
    description: 'Learn to aggregate data and calculate statistics',
    difficulty: 'Medium',
    question: 'Calculate the total revenue for each region. Display region name and total revenue, ordered by revenue from highest to lowest.',
    schemaName: 'assignment_4',
    tableNames: ['sales'],
    expectedOutput: 'Regions with SUM(revenue), ordered by revenue DESC',
    expectedQuery: "SELECT region, SUM(revenue) as total_revenue FROM sales GROUP BY region ORDER BY total_revenue DESC",
  },
];

const seedAssignments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Assignment.deleteMany({});
    console.log('Cleared existing assignments');

    await Assignment.insertMany(assignments);
    console.log('Successfully seeded 4 assignments');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding assignments:', error);
    process.exit(1);
  }
};

seedAssignments();
