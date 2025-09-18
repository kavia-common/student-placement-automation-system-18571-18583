import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Home() {
  return (
    <div className="container" style={{ maxWidth: 960 }}>
      <div className="card" style={{ padding: 28, background: 'linear-gradient(180deg, #fff7fb, #ffffff)' }}>
        <h1 style={{ marginTop: 0 }}>Student Placement Automation</h1>
        <p className="helper">Streamlined, elegant portal for students and staff</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          <Link className="btn btn-primary" to="/auth/signin">Sign In</Link>
          <Link className="btn btn-ghost" to="/auth/register/student">Register Student</Link>
          <Link className="btn btn-secondary" to="/auth/register/staff">Register Staff</Link>
        </div>
      </div>
    </div>
  );
}
