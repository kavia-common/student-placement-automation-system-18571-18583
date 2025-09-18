import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isAuthenticated, getRole, setRole, setToken, clearToken, clearRole } from '../utils/storage';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [role, setRoleState] = useState(getRole());

  useEffect(() => {
    setAuthed(isAuthenticated());
    setRoleState(getRole());
  }, []);

  const login = (token, userRole) => {
    setToken(token);
    setRole(userRole);
    setAuthed(true);
    setRoleState(userRole);
  };

  const logout = () => {
    clearToken();
    clearRole();
    setAuthed(false);
    setRoleState(undefined);
  };

  const value = useMemo(() => ({ authed, role, login, logout }), [authed, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
