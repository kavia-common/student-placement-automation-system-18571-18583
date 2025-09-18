const TOKEN_KEY = 'pf_token';
const ROLE_KEY = 'pf_role';

export function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

export function setRole(role) { localStorage.setItem(ROLE_KEY, role); }
export function getRole() { return localStorage.getItem(ROLE_KEY); }
export function clearRole() { localStorage.removeItem(ROLE_KEY); }

export function isAuthenticated() { return !!getToken(); }
