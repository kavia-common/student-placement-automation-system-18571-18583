import { getToken } from '../utils/storage';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

async function request(path, { method = 'GET', data, headers = {}, isForm = false } = {}) {
  const url = `${BASE_URL}${path}`;
  const auth = getToken();
  const finalHeaders = { ...headers };
  if (!isForm) finalHeaders['Content-Type'] = 'application/json';
  if (auth) finalHeaders['Authorization'] = `Bearer ${auth}`;

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: data ? (isForm ? data : JSON.stringify(data)) : undefined,
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message = (payload && payload.message) || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return payload;
}

// PUBLIC_INTERFACE
export const api = {
  // Auth endpoints
  // PUBLIC_INTERFACE
  async signIn({ email, password, role }) {
    return request('/api/auth/signin', { method: 'POST', data: { email, password, role } });
  },
  // PUBLIC_INTERFACE
  async registerStudent(payload) {
    return request('/api/auth/register/student', { method: 'POST', data: payload });
  },
  // PUBLIC_INTERFACE
  async registerStaff(payload) {
    return request('/api/auth/register/staff', { method: 'POST', data: payload });
  },

  // Student profile
  // PUBLIC_INTERFACE
  async getStudentProfile() {
    return request('/api/student/profile', { method: 'GET' });
  },
  // PUBLIC_INTERFACE
  async updateStudentProfile(payload) {
    return request('/api/student/profile', { method: 'PUT', data: payload });
  },

  // File uploads
  // PUBLIC_INTERFACE
  async uploadDocument(file, meta = {}) {
    const form = new FormData();
    form.append('file', file);
    Object.entries(meta).forEach(([k, v]) => form.append(k, v));
    return request('/api/student/upload', { method: 'POST', data: form, isForm: true });
  },

  // Staff: criteria and filtering
  // PUBLIC_INTERFACE
  async listDepartments() {
    return request('/api/staff/departments', { method: 'GET' });
  },
  // PUBLIC_INTERFACE
  async saveCriteria(department, criteria) {
    return request(`/api/staff/criteria/${encodeURIComponent(department)}`, { method: 'POST', data: criteria });
  },
  // PUBLIC_INTERFACE
  async getCriteria(department) {
    return request(`/api/staff/criteria/${encodeURIComponent(department)}`, { method: 'GET' });
  },
  // PUBLIC_INTERFACE
  async filterStudents(department, filters) {
    const query = new URLSearchParams({ department }).toString();
    return request(`/api/staff/students?${query}`, { method: 'POST', data: filters });
  },
};
