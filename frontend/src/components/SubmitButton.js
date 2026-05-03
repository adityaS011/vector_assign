/**
 * SubmitButton.js — Sends the current pipeline to the backend for analysis.
 *
 * POST /pipelines/parse  →  { num_nodes, num_edges, is_dag }
 */

import { shallow } from 'zustand/shallow';
import { usePipelineStore } from '../store/pipelineStore';

const API_BASE_URL = 'http://localhost:8000';

const storeSelector = (s) => ({ nodes: s.nodes, edges: s.edges });

export const SubmitButton = () => {
  const { nodes, edges } = usePipelineStore(storeSelector, shallow);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/pipelines/parse`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const { num_nodes, num_edges, is_dag } = await res.json();

      alert(
        `Pipeline Analysis\n` +
        `─────────────────\n` +
        `Nodes:  ${num_nodes}\n` +
        `Edges:  ${num_edges}\n` +
        `Is DAG: ${is_dag ? '✓ Yes' : '✗ No (contains a cycle)'}`
      );
    } catch (err) {
      alert(
        `Could not reach the backend.\n\n${err.message}\n\n` +
        `Make sure the server is running on port 8000.`
      );
    }
  };

  return (
    <div className="submit-bar">
      <button className="submit-btn" onClick={handleSubmit}>
        Submit Pipeline
      </button>
    </div>
  );
};
