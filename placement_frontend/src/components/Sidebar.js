import React from 'react';
import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Sidebar({ links }) {
  return (
    <aside className="sidebar">
      <div className="brand">Placement Portal</div>
      <nav className="nav">
        {links.map((l) => (
          <NavLink
            key={l.path}
            to={l.path}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {l.icon ? <span style={{ marginRight: 8 }}>{l.icon}</span> : null}
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
