import React from 'react';

// PUBLIC_INTERFACE
export default function Modal({ title, children, open, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>{title}</strong>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: 12 }}>{children}</div>
        <div className="modal-actions">
          {actions}
        </div>
      </div>
    </div>
  );
}
