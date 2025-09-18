export const required = (v) => (v === undefined || v === null || String(v).trim() === '' ? 'This field is required' : null);
export const email = (v) => {
  if (!v) return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(v).toLowerCase()) ? null : 'Enter a valid email address';
};
export const minLength = (n) => (v) => (v && String(v).length < n ? `Must be at least ${n} characters` : null);
export const numberRange = (min, max) => (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const num = Number(v);
  if (Number.isNaN(num)) return 'Must be a number';
  if (min !== undefined && num < min) return `Must be ≥ ${min}`;
  if (max !== undefined && num > max) return `Must be ≤ ${max}`;
  return null;
};
export const cgpa = numberRange(0, 10);
export const year = numberRange(1900, 2100);

export function validate(fields, rules) {
  const errors = {};
  Object.keys(rules).forEach((key) => {
    const validators = Array.isArray(rules[key]) ? rules[key] : [rules[key]];
    for (const fn of validators) {
      const msg = fn(fields[key]);
      if (msg) {
        errors[key] = msg;
        break;
      }
    }
  });
  return errors;
}
