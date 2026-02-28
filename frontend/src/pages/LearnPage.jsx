import React, { useState } from 'react';
import SqlEditor from '../components/assignment/SqlEditor';
import ResultsTable from '../components/assignment/ResultsTable';
import Button from '../components/common/Button';
import api from '../services/api';

const LearnPage = () => {
  const [activeLesson, setActiveLesson] = useState(0);
  const [editorQuery, setEditorQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSampleData, setShowSampleData] = useState(true);

  const lessons = [
    {
      id: 1,
      title: 'SELECT Basics',
      description: 'Learn how to retrieve data from a database using SELECT statements.',
      content: `
        <h3>The SELECT Statement</h3>
        <p>The SELECT statement is used to retrieve data from a database. The basic syntax is:</p>
        <pre><code>SELECT column1, column2 FROM table_name;</code></pre>
        
        <h4>Select All Columns</h4>
        <p>To select all columns, use the asterisk (*):</p>
        <pre><code>SELECT * FROM employees;</code></pre>
        
        <h4>Select Specific Columns</h4>
        <p>To select specific columns, list them separated by commas:</p>
        <pre><code>SELECT first_name, last_name, salary FROM employees;</code></pre>
      `,
      example: 'SELECT * FROM employees;',
      challenge: 'Try selecting only the first_name, department, and salary columns from the employees table.',
    },
    {
      id: 2,
      title: 'WHERE Clause',
      description: 'Filter your results using the WHERE clause with various conditions.',
      content: `
        <h3>Filtering with WHERE</h3>
        <p>The WHERE clause is used to filter records based on specific conditions:</p>
        <pre><code>SELECT * FROM employees WHERE department = 'Engineering';</code></pre>
        
        <h4>Comparison Operators</h4>
        <ul>
          <li><strong>=</strong> Equal to</li>
          <li><strong>!=</strong> or <strong>&lt;&gt;</strong> Not equal to</li>
          <li><strong>&gt;</strong> Greater than</li>
          <li><strong>&lt;</strong> Less than</li>
          <li><strong>&gt;=</strong> Greater than or equal to</li>
          <li><strong>&lt;=</strong> Less than or equal to</li>
        </ul>
        
        <h4>Example</h4>
        <pre><code>SELECT * FROM employees WHERE salary > 70000;</code></pre>
      `,
      example: "SELECT * FROM employees WHERE department = 'Engineering';",
      challenge: 'Find all employees with a salary greater than 65000.',
    },
    {
      id: 3,
      title: 'Logical Operators',
      description: 'Combine multiple conditions using AND, OR, and NOT operators.',
      content: `
        <h3>Combining Conditions</h3>
        <p>Use logical operators to create more complex filters:</p>
        
        <h4>AND Operator</h4>
        <p>Both conditions must be true:</p>
        <pre><code>SELECT * FROM employees 
WHERE department = 'Engineering' 
AND salary > 70000;</code></pre>
        
        <h4>OR Operator</h4>
        <p>At least one condition must be true:</p>
        <pre><code>SELECT * FROM employees 
WHERE department = 'Engineering' 
OR department = 'Sales';</code></pre>
        
        <h4>NOT Operator</h4>
        <p>Negates a condition:</p>
        <pre><code>SELECT * FROM employees 
WHERE NOT department = 'HR';</code></pre>
      `,
      example: "SELECT * FROM employees WHERE department = 'Engineering' AND salary > 70000;",
      challenge: 'Find all employees who work in Sales OR have a salary greater than 80000.',
    },
    {
      id: 4,
      title: 'ORDER BY',
      description: 'Sort your query results in ascending or descending order.',
      content: `
        <h3>Sorting Results</h3>
        <p>Use ORDER BY to sort your results:</p>
        
        <h4>Ascending Order (Default)</h4>
        <pre><code>SELECT * FROM employees ORDER BY salary;</code></pre>
        <p>Or explicitly:</p>
        <pre><code>SELECT * FROM employees ORDER BY salary ASC;</code></pre>
        
        <h4>Descending Order</h4>
        <pre><code>SELECT * FROM employees ORDER BY salary DESC;</code></pre>
        
        <h4>Multiple Columns</h4>
        <p>Sort by multiple columns:</p>
        <pre><code>SELECT * FROM employees 
ORDER BY department ASC, salary DESC;</code></pre>
      `,
      example: 'SELECT * FROM employees ORDER BY salary DESC;',
      challenge: 'Sort employees by department (ascending) and then by salary (descending).',
    },
    {
      id: 5,
      title: 'Aggregate Functions',
      description: 'Use COUNT, SUM, AVG, MIN, and MAX to perform calculations on your data.',
      content: `
        <h3>Performing Calculations</h3>
        <p>Aggregate functions perform calculations on a set of values:</p>
        
        <h4>COUNT</h4>
        <p>Count the number of rows:</p>
        <pre><code>SELECT COUNT(*) FROM employees;</code></pre>
        
        <h4>SUM</h4>
        <p>Calculate the total:</p>
        <pre><code>SELECT SUM(salary) FROM employees;</code></pre>
        
        <h4>AVG</h4>
        <p>Calculate the average:</p>
        <pre><code>SELECT AVG(salary) FROM employees;</code></pre>
        
        <h4>MIN and MAX</h4>
        <pre><code>SELECT MIN(salary), MAX(salary) FROM employees;</code></pre>
      `,
      example: 'SELECT AVG(salary) as avg_salary FROM employees;',
      challenge: 'Calculate the total sum of all salaries and the count of employees.',
    },
    {
      id: 6,
      title: 'GROUP BY',
      description: 'Group rows that have the same values and use aggregate functions.',
      content: `
        <h3>Grouping Data</h3>
        <p>GROUP BY groups rows with the same values into summary rows:</p>
        
        <h4>Basic Grouping</h4>
        <pre><code>SELECT department, COUNT(*) as employee_count
FROM employees
GROUP BY department;</code></pre>
        
        <h4>With Multiple Aggregates</h4>
        <pre><code>SELECT department, 
       COUNT(*) as count,
       AVG(salary) as avg_salary
FROM employees
GROUP BY department;</code></pre>
        
        <h4>HAVING Clause</h4>
        <p>Filter groups (like WHERE but for groups):</p>
        <pre><code>SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 70000;</code></pre>
      `,
      example: 'SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department;',
      challenge: 'Find the average salary for each department.',
    },
    {
      id: 7,
      title: 'JOIN Operations',
      description: 'Combine rows from multiple tables based on related columns.',
      content: `
        <h3>Joining Tables</h3>
        <p>JOINs combine data from multiple tables:</p>
        
        <h4>INNER JOIN</h4>
        <p>Returns matching rows from both tables:</p>
        <pre><code>SELECT orders.order_id, products.product_name, orders.quantity
FROM orders
INNER JOIN products ON orders.product_id = products.product_id;</code></pre>
        
        <h4>LEFT JOIN</h4>
        <p>Returns all rows from left table and matching rows from right:</p>
        <pre><code>SELECT employees.first_name, orders.order_id
FROM employees
LEFT JOIN orders ON employees.employee_id = orders.employee_id;</code></pre>
        
        <h4>Table Aliases</h4>
        <p>Use aliases to make queries shorter:</p>
        <pre><code>SELECT e.first_name, o.order_id
FROM employees e
LEFT JOIN orders o ON e.employee_id = o.employee_id;</code></pre>
      `,
      example: 'SELECT o.order_id, p.product_name, o.quantity FROM orders o INNER JOIN products p ON o.product_id = p.product_id;',
      challenge: 'Join orders and employees tables to show which employee made each order.',
    },
  ];

  const sampleData = {
    employees: [
      { employee_id: 1, first_name: 'John', last_name: 'Doe', department: 'Engineering', salary: 75000 },
      { employee_id: 2, first_name: 'Jane', last_name: 'Smith', department: 'Sales', salary: 68000 },
      { employee_id: 3, first_name: 'Bob', last_name: 'Johnson', department: 'Engineering', salary: 82000 },
    ],
    products: [
      { product_id: 1, product_name: 'Laptop', category: 'Electronics', price: 1200 },
      { product_id: 2, product_name: 'Desk Chair', category: 'Furniture', price: 299 },
      { product_id: 3, product_name: 'Monitor', category: 'Electronics', price: 450 },
    ],
    orders: [
      { order_id: 1, employee_id: 1, product_id: 1, quantity: 2, order_date: '2024-01-15' },
      { order_id: 2, employee_id: 2, product_id: 2, quantity: 5, order_date: '2024-01-16' },
      { order_id: 3, employee_id: 1, product_id: 3, quantity: 3, order_date: '2024-01-17' },
    ],
  };

  const handleRunQuery = async () => {
    if (!editorQuery.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await api.post('/query/playground', { query: editorQuery });
      
      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError(response.data.error || 'Query execution failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const handleTryExample = () => {
    setEditorQuery(lessons[activeLesson].example);
  };

  const currentLesson = lessons[activeLesson];

  return (
    <div className="learn-page">
      <div className="learn-page__container">
        <div className="learn-page__sidebar">
          <h2 className="learn-page__sidebar-title">SQL Lessons</h2>
          <div className="learn-page__lessons">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                className={`learn-page__lesson-item ${
                  activeLesson === index ? 'learn-page__lesson-item--active' : ''
                }`}
                onClick={() => setActiveLesson(index)}
              >
                <span className="learn-page__lesson-number">{index + 1}</span>
                <div className="learn-page__lesson-info">
                  <h3 className="learn-page__lesson-title">{lesson.title}</h3>
                  <p className="learn-page__lesson-desc">{lesson.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="learn-page__content">
          <div className="learn-page__lesson-content">
            <h1 className="learn-page__main-title">{currentLesson.title}</h1>
            <div
              className="learn-page__lesson-body"
              dangerouslySetInnerHTML={{ __html: currentLesson.content }}
            />
            
            <div className="learn-page__challenge">
              <h4 className="learn-page__challenge-title">Challenge</h4>
              <p className="learn-page__challenge-text">{currentLesson.challenge}</p>
              <Button onClick={handleTryExample} variant="secondary">
                Try Example Query
              </Button>
            </div>
          </div>

          <div className="learn-page__playground">
            <div className="learn-page__playground-header">
              <h3>Interactive SQL Playground</h3>
              <button
                className="learn-page__toggle-data"
                onClick={() => setShowSampleData(!showSampleData)}
              >
                {showSampleData ? 'Hide' : 'Show'} Sample Data
              </button>
            </div>

            {showSampleData && (
              <div className="learn-page__sample-data">
                <h4>Available Tables</h4>
                {Object.entries(sampleData).map(([tableName, rows]) => (
                  <div key={tableName} className="learn-page__table-preview">
                    <h5>{tableName}</h5>
                    <div className="learn-page__table-wrapper">
                      <table className="learn-page__preview-table">
                        <thead>
                          <tr>
                            {Object.keys(rows[0]).map((col) => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.slice(0, 3).map((row, idx) => (
                            <tr key={idx}>
                              {Object.values(row).map((val, i) => (
                                <td key={i}>{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="learn-page__table-note">Showing 3 of {rows.length} rows</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="learn-page__editor-section">
              <SqlEditor value={editorQuery} onChange={setEditorQuery} />
              <div className="learn-page__editor-actions">
                <Button onClick={handleRunQuery} disabled={loading}>
                  {loading ? 'Running...' : 'Run Query'}
                </Button>
              </div>
            </div>

            {error && (
              <div className="learn-page__error">
                <strong>Error:</strong> {error}
              </div>
            )}

            {results && (
              <div className="learn-page__results">
                <h4>Query Results</h4>
                <ResultsTable data={results} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
