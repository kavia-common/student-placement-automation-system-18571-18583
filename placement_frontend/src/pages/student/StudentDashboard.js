import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import FormField from '../../components/FormField';
import Modal from '../../components/Modal';
import { api } from '../../services/api';
import { cgpa, required, validate, year } from '../../utils/validation';

const defaultProfile = {
  name: '',
  email: '',
  phone: '',
  department: '',
  rollNumber: '',
  tenthPercent: '',
  twelfthPercent: '',
  cgpa: '',
  graduationYear: '',
  backlogs: 0,
  skills: '',
};

// PUBLIC_INTERFACE
export default function StudentDashboard() {
  const [profile, setProfile] = useState(defaultProfile);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({ status: '', message: '' });

  const rules = {
    name: [required],
    email: [required],
    phone: [required],
    department: [required],
    rollNumber: [required],
    cgpa: [required, cgpa],
    graduationYear: [required, year],
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getStudentProfile();
        setProfile({ ...defaultProfile, ...data });
      } catch {
        // first-time users may not have profile
      }
    })();
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    const errs = validate(profile, rules);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await api.updateStudentProfile(profile);
      setInfo({ status: 'success', message: 'Profile saved successfully' });
    } catch (err) {
      setInfo({ status: 'error', message: err.message || 'Failed to save profile' });
    } finally {
      setBusy(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setBusy(true);
    try {
      await api.uploadDocument(file, { type: 'resume' });
      setInfo({ status: 'success', message: 'File uploaded' });
      setUploadOpen(false);
      setFile(null);
    } catch (err) {
      setInfo({ status: 'error', message: err.message || 'Upload failed' });
    } finally {
      setBusy(false);
    }
  };

  const links = [
    { path: '/student', label: 'My Profile' },
  ];

  return (
    <div className="main">
      <Sidebar links={links} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="content">
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>My Profile</h3>
            {info.message ? (
              <div className={`badge ${info.status === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 10 }}>
                {info.message}
              </div>
            ) : null}
            <form onSubmit={onSave} style={{ display: 'grid', gap: 16 }}>
              <div className="form-row">
                <FormField label="Full Name" error={errors.name}>
                  <input className="input" value={profile.name} onChange={(e)=>setProfile({ ...profile, name: e.target.value })} />
                </FormField>
                <FormField label="Email" error={errors.email}>
                  <input className="input" value={profile.email} onChange={(e)=>setProfile({ ...profile, email: e.target.value })} type="email" />
                </FormField>
              </div>
              <div className="form-row">
                <FormField label="Phone" error={errors.phone}>
                  <input className="input" value={profile.phone} onChange={(e)=>setProfile({ ...profile, phone: e.target.value })} />
                </FormField>
                <FormField label="Department" error={errors.department}>
                  <select className="select" value={profile.department} onChange={(e)=>setProfile({ ...profile, department: e.target.value })}>
                    <option value="">Select</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </FormField>
              </div>
              <div className="form-row">
                <FormField label="Roll Number" error={errors.rollNumber}>
                  <input className="input" value={profile.rollNumber} onChange={(e)=>setProfile({ ...profile, rollNumber: e.target.value })} />
                </FormField>
                <FormField label="CGPA" error={errors.cgpa}>
                  <input className="input" value={profile.cgpa} onChange={(e)=>setProfile({ ...profile, cgpa: e.target.value })} type="number" step="0.01" />
                </FormField>
              </div>
              <div className="form-row">
                <FormField label="10th Percentage">
                  <input className="input" value={profile.tenthPercent} onChange={(e)=>setProfile({ ...profile, tenthPercent: e.target.value })} type="number" />
                </FormField>
                <FormField label="12th Percentage">
                  <input className="input" value={profile.twelfthPercent} onChange={(e)=>setProfile({ ...profile, twelfthPercent: e.target.value })} type="number" />
                </FormField>
              </div>
              <div className="form-row">
                <FormField label="Graduation Year" error={errors.graduationYear}>
                  <input className="input" value={profile.graduationYear} onChange={(e)=>setProfile({ ...profile, graduationYear: e.target.value })} type="number" />
                </FormField>
                <FormField label="Active Backlogs">
                  <input className="input" value={profile.backlogs} onChange={(e)=>setProfile({ ...profile, backlogs: e.target.value })} type="number" />
                </FormField>
              </div>
              <FormField label="Skills">
                <textarea className="textarea" rows={3} value={profile.skills} onChange={(e)=>setProfile({ ...profile, skills: e.target.value })} placeholder="React, Node.js, SQL, ..." />
              </FormField>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save Profile'}</button>
                <button className="btn btn-ghost" type="button" onClick={()=>setUploadOpen(true)}>Upload Resume/Docs</button>
              </div>
            </form>
          </div>
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Documents</h4>
            <div className="helper">Uploaded documents will appear here after integration with backend list endpoint.</div>
          </div>
        </div>
      </div>

      <Modal
        title="Upload Document"
        open={uploadOpen}
        onClose={()=>setUploadOpen(false)}
        actions={
          <>
            <button className="btn btn-ghost" onClick={()=>setUploadOpen(false)}>Cancel</button>
            <button className="btn btn-secondary" onClick={handleUpload} disabled={!file || busy}>{busy ? 'Uploading…' : 'Upload'}</button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 10 }}>
          <input className="input" type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
          <div className="helper">Accepted formats: PDF, DOCX, images. Max 5MB (enforced by backend).</div>
        </div>
      </Modal>
    </div>
  );
}
