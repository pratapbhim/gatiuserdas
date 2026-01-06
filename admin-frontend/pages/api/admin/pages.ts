import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Proxy to backend API (assumes backend running at http://localhost:4000)
  const backend = process.env.BACKEND_URL || 'http://localhost:4000';
  const url = `${backend}/admin/pages`;
  const method = req.method || 'GET';
  const fetchRes = await fetch(url, { method, body: method === 'GET' ? undefined : JSON.stringify(req.body), headers: { 'Content-Type': 'application/json' } });
  const data = await fetchRes.json().catch(() => ({}));
  res.status(fetchRes.status).json(data);
}


