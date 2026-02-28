import React from 'react';

const Input = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error, 
  help,
  required = false 
}) => {
  return (
    <div className="input__group">
      {label && (
        <label htmlFor={name} className="input__label">
          {label} {required && <span style={{ color: '#D62828' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input__field"
        required={required}
      />
      {error && <div className="input__error">{error}</div>}
      {help && <div className="input__help">{help}</div>}
    </div>
  );
};

export default Input;
