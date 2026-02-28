import React from 'react';

const QuestionPanel = ({ assignment }) => {
  const getBadgeClass = (difficulty) => {
    return `question-panel__badge question-panel__badge--${difficulty.toLowerCase()}`;
  };

  return (
    <div className="question-panel">
      <div className="question-panel__header">
        <h2>{assignment.title}</h2>
        <span className={getBadgeClass(assignment.difficulty)}>
          {assignment.difficulty}
        </span>
      </div>
      
      <p style={{ color: '#6B6B6B', marginBottom: '16px' }}>
        {assignment.description}
      </p>

      <div className="question-panel__question">
        {assignment.question}
      </div>

      <div className="question-panel__tables">
        <h3>Available Tables</h3>
        <div>
          {assignment.tableNames?.map((table) => (
            <span key={table} className="question-panel__table-name">
              {table}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
