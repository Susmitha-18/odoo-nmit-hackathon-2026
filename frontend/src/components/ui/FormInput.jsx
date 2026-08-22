import React from 'react';

/**
 * FormInput — reusable labeled input field.
 *
 * Props:
 *   id          string (required for accessibility)
 *   label       string
 *   error       string — validation error message
 *   type        string (default "text")
 *   ...rest     — any standard input props
 */
export function FormInput({ id, label, error, type = 'text', className = '', ...rest }) {
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        id={id}
        type={type}
        className={`${error ? 'form-input-error' : 'form-input'} ${className}`}
        {...rest}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

/**
 * FormSelect — reusable labeled select field.
 */
export function FormSelect({ id, label, error, children, className = '', ...rest }) {
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <select
        id={id}
        className={`${error ? 'form-input-error' : 'form-select'} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

/**
 * FormTextarea — reusable labeled textarea.
 */
export function FormTextarea({ id, label, error, rows = 3, className = '', ...rest }) {
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <textarea
        id={id}
        rows={rows}
        className={`${error ? 'form-input-error' : 'form-textarea'} ${className}`}
        {...rest}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
