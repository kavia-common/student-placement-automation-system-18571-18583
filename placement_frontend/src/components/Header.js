import React from 'react';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Header() {
  const { role, logout } = useAuth();
  return (
    <header className="header gradient-hero">
      <div>
        <div style={{ fontWeight: 800 }}>Ocean Professional</div>
        <div className="helper">Elegant student placement automation</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="badge info">{role || 'guest'}</span>
        <button className="btn btn-ghost" onClick={logout}>Sign out</button>
      </div>
    </header>
  );
}
