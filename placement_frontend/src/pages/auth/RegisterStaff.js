import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import { api } from '../../services/api';
import { email as emailRule, minLength, required, validate } from '../../utils/validation';

// PUBLIC_INTERFACE
export default function RegisterStaff() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const rules = {
    name: [required],
    email: [required, emailRule],
    password: [required, minLength(6)],
    department: [required],
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate(form, rules);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await api.registerStaff(form);
      navigate('/auth/signin');
    } catch (err) {
      setServerError(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="card">
        <h2>Staff Registration</h2>
        <p className="helper">Register to manage placement criteria and shortlisting</p>
        {serverError ? <div className="error-text">{serverError}</div> : null}
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-row">
            <FormField label="Full Name" error={errors.name}>
              <input className="input" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
            </FormField>
            <FormField label="Email" error={errors.email}>
              <input className="input" type="email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} />
            </FormField>
          </div>
          <div className="form-row">
            <FormField label="Password" error={errors.password}>
              <input className="input" type="password" value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} />
            </FormField>
            <FormField label="Department" error={errors.department}>
              <select className="select" value={form.department} onChange={(e)=>setForm({ ...form, department: e.target.value })}>
                <option value="">Select department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </FormField>
          </div>
          <button className="btn btn-secondary" disabled={busy} type="submit">{busy ? 'Creating…' : 'Create account'}</button>
        </form>
        <div style={{ marginTop: 12 }} className="helper">
          Already registered? <Link to="/auth/signin">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
