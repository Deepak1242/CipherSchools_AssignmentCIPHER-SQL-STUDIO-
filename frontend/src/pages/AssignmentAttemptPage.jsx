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
  const [checking, setChecking] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showValidation, setShowValidation] = useState(false);

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

  const handleCheckAnswer = async () => {
    if (!query.trim()) return;

    setChecking(true);
    setValidationResult(null);

    try {
      const response = await queryAPI.validate({
        assignmentId: id,
        query: query,
      });

      setValidationResult(response.data);
      setShowValidation(true);
    } catch (err) {
      setValidationResult({
        success: false,
        error: err.response?.data?.error || 'Validation failed',
        isCorrect: false,
      });
      setShowValidation(true);
    } finally {
      setChecking(false);
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
              onCheckAnswer={handleCheckAnswer}
              loading={executing}
              checking={checking}
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

      {showValidation && validationResult && (
        <div className="validation-modal" onClick={() => setShowValidation(false)}>
          <div className="validation-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className={`validation-modal__header ${validationResult.isCorrect ? 'validation-modal__header--success' : 'validation-modal__header--error'}`}>
              <h3>{validationResult.isCorrect ? '✓ Correct!' : '✗ Not Quite Right'}</h3>
              <button className="validation-modal__close" onClick={() => setShowValidation(false)}>
                ×
              </button>
            </div>
            <div className="validation-modal__body">
              {validationResult.success ? (
                <>
                  <p className="validation-modal__feedback">{validationResult.feedback}</p>
                  {!validationResult.isCorrect && (
                    <div className="validation-modal__details">
                      <p><strong>Your result:</strong> {validationResult.userRowCount} rows</p>
                      <p><strong>Expected result:</strong> {validationResult.expectedRowCount} rows</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="validation-modal__error">{validationResult.error}</p>
              )}
            </div>
            <div className="validation-modal__footer">
              <button className="validation-modal__button" onClick={() => setShowValidation(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentAttemptPage;
