import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import { api } from '../../services/api';
import { email as emailRule, minLength, required, validate } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';

// PUBLIC_INTERFACE
export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const rules = {
    email: [required, emailRule],
    password: [required, minLength(6)],
    role: [required],
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate(form, rules);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const resp = await api.signIn(form);
      // Expecting { token, role }
      login(resp.token, resp.role || form.role);
      navigate((resp.role || form.role) === 'staff' ? '/staff' : '/student');
    } catch (err) {
      setServerError(err.message || 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card" style={{ padding: 24, background: 'linear-gradient(180deg, #fff1f2, #ffffff)' }}>
        <h2 style={{ margin: 0 }}>Welcome back</h2>
        <p className="helper">Sign in to continue</p>
        {serverError ? <div className="error-text" style={{ marginBottom: 8 }}>{serverError}</div> : null}
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <FormField label="Email" error={errors.email}>
            <input className="input" type="email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} placeholder="you@college.edu" />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input className="input" type="password" value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </FormField>
          <FormField label="Role" error={errors.role}>
            <select className="select" value={form.role} onChange={(e)=>setForm({ ...form, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </FormField>
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <div style={{ marginTop: 12 }}>
          <span className="helper">New here?</span>{' '}
          <Link to="/auth/register/student">Create a student account</Link>{' '}|{' '}
          <Link to="/auth/register/staff">Register as staff</Link>
        </div>
      </div>
    </div>
  );
}
