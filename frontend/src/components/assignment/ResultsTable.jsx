import React from 'react';

const ResultsTable = ({ result, loading, error }) => {
  if (loading) {
    return (
      <div className="results-panel">
        <div className="results-panel__empty">
          <p>Executing query...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-panel">
        <div className="results-panel__header">
          <h3>Query Error</h3>
        </div>
        <div className="results-panel__error">
          {error}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-panel">
        <div className="results-panel__empty">
          <p>Write a SQL query and click "Execute Query" to see results</p>
        </div>
      </div>
    );
  }

  if (!result.data || result.data.length === 0) {
    return (
      <div className="results-panel">
        <div className="results-panel__header">
          <h3>Query Results</h3>
          <div className="results-panel__meta">
            {result.executionTime && `Executed in ${result.executionTime}ms`}
          </div>
        </div>
        <div className="results-panel__success">
          Query executed successfully! No rows returned.
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-panel__header">
        <h3>Query Results</h3>
        <div className="results-panel__meta">
          {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} 
          {result.executionTime && ` • ${result.executionTime}ms`}
        </div>
      </div>

      <div className="results-panel__success">
        Query executed successfully!
      </div>

      <div className="table__wrapper">
        <table className="table">
          <thead className="table__header">
            <tr>
              {Object.keys(result.data[0]).map((key) => (
                <th key={key} className="table__head-cell">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.data.map((row, idx) => (
              <tr key={idx} className="table__row">
                {Object.values(row).map((value, colIdx) => (
                  <td key={colIdx} className="table__cell">
                    {value !== null ? String(value) : 'NULL'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
