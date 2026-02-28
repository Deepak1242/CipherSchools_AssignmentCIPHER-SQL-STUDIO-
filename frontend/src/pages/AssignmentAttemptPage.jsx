import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assignmentAPI, queryAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import QuestionPanel from '../components/assignment/QuestionPanel';
import SampleDataViewer from '../components/assignment/SampleDataViewer';
import SqlEditor from '../components/assignment/SqlEditor';
import ResultsTable from '../components/assignment/ResultsTable';

const AssignmentAttemptPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [sampleData, setSampleData] = useState({});
  const [tableSchema, setTableSchema] = useState({});
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await assignmentAPI.getById(id);
        setAssignment(response.data.assignment);
        setSampleData(response.data.sampleData);
        setTableSchema(response.data.tableSchema);
      } catch (err) {
        setError('Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleExecuteQuery = async () => {
    if (!query.trim()) return;

    setExecuting(true);
    setError('');
    setResult(null);

    try {
      const response = await queryAPI.execute({
        assignmentId: id,
        query: query,
      });

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Query execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const handleGetHint = async () => {
    setShowHint(true);
    setLoadingHint(true);
    setHint('');

    try {
      const response = await queryAPI.getHint({
        assignmentId: id,
        userQuery: query,
      });

      if (response.data.success) {
        setHint(response.data.hint);
      } else {
        setHint('Failed to generate hint. Please try again.');
      }
    } catch (err) {
      setHint('Failed to generate hint. Please try again.');
    } finally {
      setLoadingHint(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading assignment...</div>
      </>
    );
  }

  if (!assignment) {
    return (
      <>
        <Navbar />
        <div className="error-message">Assignment not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="assignment-attempt">
        <div className="assignment-attempt__sidebar">
          <QuestionPanel assignment={assignment} />
          <SampleDataViewer sampleData={sampleData} tableSchema={tableSchema} />
        </div>
        <div className="assignment-attempt__main">
          <div className="assignment-attempt__editor-section">
            <SqlEditor
              value={query}
              onChange={(value) => setQuery(value || '')}
              onExecute={handleExecuteQuery}
              onGetHint={handleGetHint}
              loading={executing}
            />
          </div>
          <div className="assignment-attempt__results-section">
            <ResultsTable result={result} loading={executing} error={error} />
          </div>
        </div>
      </div>

      {showHint && (
        <div className="hint-modal" onClick={() => setShowHint(false)}>
          <div className="hint-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="hint-modal__header">
              <h3>Hint</h3>
              <button className="hint-modal__close" onClick={() => setShowHint(false)}>
                ×
              </button>
            </div>
            {loadingHint ? (
              <div className="hint-modal__loading">Generating hint...</div>
            ) : (
              <div className="hint-modal__body">{hint}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentAttemptPage;
