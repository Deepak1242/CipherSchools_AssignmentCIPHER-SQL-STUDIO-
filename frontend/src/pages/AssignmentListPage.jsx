import React, { useState, useEffect } from 'react';
import { assignmentAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import AssignmentCard from '../components/assignment/AssignmentCard';

const AssignmentListPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await assignmentAPI.getAll();
        setAssignments(response.data.assignments);
      } catch (err) {
        setError('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading assignments...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-message">{error}</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="assignment-list">
        <div className="assignment-list__header">
          <h1>SQL Assignments</h1>
          <p>Choose an assignment to practice your SQL skills</p>
        </div>
        <div className="assignment-list__grid">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={{ ...assignment, id: assignment._id }} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AssignmentListPage;
