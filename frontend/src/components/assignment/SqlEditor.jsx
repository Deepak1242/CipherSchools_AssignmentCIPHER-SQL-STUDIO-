import React from 'react';
import Editor from '@monaco-editor/react';
import Button from '../common/Button';

const SqlEditor = ({ value, onChange, onExecute, onGetHint, loading }) => {
  return (
    <div className="sql-editor">
      <div className="sql-editor__header">
        <h3>SQL Editor</h3>
        <div className="sql-editor__actions">
          <Button 
            size="small" 
            variant="secondary" 
            onClick={onGetHint}
            disabled={loading}
          >
            Get Hint
          </Button>
          <Button 
            size="small" 
            onClick={onExecute}
            disabled={loading || !value.trim()}
          >
            {loading ? 'Running...' : 'Execute Query'}
          </Button>
        </div>
      </div>
      <div className="sql-editor__monaco">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value}
          onChange={onChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
};

export default SqlEditor;
