// api.js - helper to call backend APIs
const API_BASE = '/api';

async function fetchMetric(metric) {
  const res = await fetch(`${API_BASE}/${metric}`);
  if (!res.ok) throw new Error('Failed to fetch ' + metric);
  return res.json();
}

async function postMetric(metric, amount, date) {
  const res = await fetch(`${API_BASE}/${metric}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, date })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to post');
  }
  return res.json();
}
