const API_BASE_URL = 'http://localhost:8000';

export async function submitPipeline(nodes, edges) {
  const res = await fetch(`${API_BASE_URL}/pipelines/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges }),
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}
