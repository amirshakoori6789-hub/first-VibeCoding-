// API client — calls our PHP backend instead of base44

const BASE = '/api';

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== null) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Generic entity helpers ────────────────────────────────────────────────

function entity(name) {
  return {
    list: (sort) => request('GET', `/index.php?entity=${name}${sort ? `&sort=${sort}` : ''}`),
    filter: (params) => {
      const qs = new URLSearchParams({ entity: name }).toString();
      return request('GET', `/index.php?${qs}&${new URLSearchParams(params).toString()}`);
    },
    get: (id) => request('GET', `/index.php?entity=${name}&id=${id}`),
    create: (data) => request('POST', `/index.php?entity=${name}`, data),
    update: (id, data) => request('PUT', `/index.php?entity=${name}&id=${id}`, data),
    delete: (id) => request('DELETE', `/index.php?entity=${name}&id=${id}`),
  };
}

// ─── Upload ────────────────────────────────────────────────────────────────

async function uploadFile({ file }) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BASE}/upload.php`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  return res.json(); // { file_url: '...' }
}

// ─── Exported db object (matches old base44 shape) ─────────────────────────

export const db = {
  entities: new Proxy({}, {
    get(_, name) {
      return entity(name);
    },
  }),
  integrations: {
    Core: { UploadFile: uploadFile },
  },
};

export default db;
