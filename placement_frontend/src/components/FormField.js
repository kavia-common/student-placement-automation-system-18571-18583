import React from 'react';

// PUBLIC_INTERFACE
export default function FormField({ label, error, children, helper }) {
  return (
    <div>
      {label ? <label className="label">{label}</label> : null}
      {children}
      {helper ? <div className="helper">{helper}</div> : null}
      {error ? <div className="error-text">{error}</div> : null}
    </div>
  );
}
