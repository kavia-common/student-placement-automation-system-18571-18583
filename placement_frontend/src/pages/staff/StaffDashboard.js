import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import FormField from '../../components/FormField';
import { api } from '../../services/api';
import { cgpa, numberRange, required, validate } from '../../utils/validation';

const defaultCriteria = {
  minCGPA: '',
  maxBacklogs: '',
  minTenthPercent: '',
  minTwelfthPercent: '',
  graduationYearFrom: '',
  graduationYearTo: '',
  skills: '',
};

// PUBLIC_INTERFACE
export default function StaffDashboard() {
  const [departments, setDepartments] = useState(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']);
  const [department, setDepartment] = useState('CSE');
  const [criteria, setCriteria] = useState(defaultCriteria);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [students, setStudents] = useState([]);
  const [info, setInfo] = useState('');

  const rules = {
    minCGPA: cgpa,
    maxBacklogs: numberRange(0, 20),
    minTenthPercent: numberRange(0, 100),
    minTwelfthPercent: numberRange(0, 100),
  };

  useEffect(() => {
    (async () => {
      try {
        const depts = await api.listDepartments().catch(() => null);
        if (Array.isArray(depts) && depts.length) {
          setDepartments(depts);
          setDepartment(depts[0]);
        }
      } catch {
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const saved = await api.getCriteria(department);
        if (saved) setCriteria({ ...defaultCriteria, ...saved });
      } catch {
      }
    })();
  }, [department]);

  const onSaveCriteria = async (e) => {
    e.preventDefault();
    const errs = validate(criteria, rules);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await api.saveCriteria(department, criteria);
      setInfo('Criteria saved');
    } catch (err) {
      setInfo(err.message || 'Failed to save');
    } finally {
      setBusy(false);
    }
  };

  const onFilter = async () => {
    setBusy(true);
    try {
      const list = await api.filterStudents(department, criteria);
      setStudents(list || []);
    } catch (err) {
      setStudents([]);
      setInfo(err.message || 'Failed to fetch students');
    } finally {
      setBusy(false);
    }
  };

  const links = [
    { path: '/staff', label: 'Criteria & Lists' },
  ];

  return (
    <div className="main">
      <Sidebar links={links} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="content">
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Placement Criteria</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="helper">Department</span>
                <select className="select" value={department} onChange={(e)=>setDepartment(e.target.value)}>
                  {departments.map((d)=> <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            {info ? <div className="badge info" style={{ marginBottom: 10 }}>{info}</div> : null}
            <form onSubmit={onSaveCriteria} style={{ display: 'grid', gap: 12 }}>
              <div className="form-row">
                <FormField label="Min CGPA" error={errors.minCGPA}>
                  <input className="input" value={criteria.minCGPA} onChange={(e)=>setCriteria({ ...criteria, minCGPA: e.target.value })} type="number" step="0.01" />
                </FormField>
                <FormField label="Max Backlogs" error={errors.maxBacklogs}>
                  <input className="input" value={criteria.maxBacklogs} onChange={(e)=>setCriteria({ ...criteria, maxBacklogs: e.target.value })} type="number" />
                </FormField>
              </div>
              <div className="form-row">
                <FormField label="Min 10th %" error={errors.minTenthPercent}>
                  <input className="input" value={criteria.minTenthPercent} onChange={(e)=>setCriteria({ ...criteria, minTenthPercent: e.target.value })} type="number" />
                </FormField>
                <FormField label="Min 12th %" error={errors.minTwelfthPercent}>
                  <input className="input" value={criteria.minTwelfthPercent} onChange={(e)=>setCriteria({ ...criteria, minTwelfthPercent: e.target.value })} type="number" />
                </FormField>
              </div>
              <div className="form-row">
                <FormField label="Graduation Year From">
                  <input className="input" value={criteria.graduationYearFrom} onChange={(e)=>setCriteria({ ...criteria, graduationYearFrom: e.target.value })} type="number" />
                </FormField>
                <FormField label="Graduation Year To">
                  <input className="input" value={criteria.graduationYearTo} onChange={(e)=>setCriteria({ ...criteria, graduationYearTo: e.target.value })} type="number" />
                </FormField>
              </div>
              <FormField label="Preferred Skills (comma separated)">
                <input className="input" value={criteria.skills} onChange={(e)=>setCriteria({ ...criteria, skills: e.target.value })} placeholder="Java, React, Python" />
              </FormField>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save Criteria'}</button>
                <button className="btn btn-ghost" type="button" onClick={onFilter} disabled={busy}>{busy ? 'Filtering…' : 'Filter Students'}</button>
              </div>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Filtered/Shortlisted Students</h3>
            <div className="helper" style={{ marginBottom: 8 }}>Department: <strong>{department}</strong></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll</th>
                    <th>Dept</th>
                    <th>CGPA</th>
                    <th>Backlogs</th>
                    <th>10th%</th>
                    <th>12th%</th>
                    <th>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="helper">No students to show. Click "Filter Students" to fetch.</td>
                    </tr>
                  ) : students.map((s) => (
                    <tr key={s.id || `${s.rollNumber}-${s.email}`}>
                      <td>{s.name}</td>
                      <td>{s.rollNumber}</td>
                      <td>{s.department}</td>
                      <td>{s.cgpa}</td>
                      <td>{s.backlogs}</td>
                      <td>{s.tenthPercent}</td>
                      <td>{s.twelfthPercent}</td>
                      <td>{s.skills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
