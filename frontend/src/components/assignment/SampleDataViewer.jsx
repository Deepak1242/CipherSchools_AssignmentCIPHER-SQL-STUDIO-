import React, { useState } from 'react';
import Button from '../common/Button';

const SampleDataViewer = ({ sampleData, tableSchema }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sampleData || Object.keys(sampleData).length === 0) {
    return null;
  }

  return (
    <div className="sample-data">
      <Button 
        variant="secondary" 
        size="small"
        fullWidth
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide' : 'Show'} Sample Data & Schema
      </Button>

      {isOpen && (
        <div className="sample-data__content">
          {Object.entries(sampleData).map(([tableName, rows]) => (
            <div key={tableName} className="sample-data__table-section">
              <h4>{tableName}</h4>
              
              {tableSchema[tableName] && (
                <div style={{ marginBottom: '12px', fontSize: '13px', color: '#6B6B6B' }}>
                  <strong>Schema:</strong>{' '}
                  {tableSchema[tableName].map(col => 
                    `${col.column_name} (${col.data_type})`
                  ).join(', ')}
                </div>
              )}

              <div className="table__wrapper">
                <table className="table">
                  <thead className="table__header">
                    <tr>
                      {rows.length > 0 && Object.keys(rows[0]).map((key) => (
                        <th key={key} className="table__head-cell">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default SampleDataViewer;
