/**
 * SubmitButton.js — Sends the current pipeline to the backend for analysis.
 *
 * POST /pipelines/parse  →  { num_nodes, num_edges, is_dag }
 */

import { shallow } from 'zustand/shallow';
import { usePipelineStore } from '../store/pipelineStore';
import { submitPipeline } from '../submit';

const storeSelector = (s) => ({ nodes: s.nodes, edges: s.edges });

export const SubmitButton = () => {
  const { nodes, edges } = usePipelineStore(storeSelector, shallow);

  const handleSubmit = async () => {
    try {
      const { num_nodes, num_edges, is_dag } = await submitPipeline(nodes, edges);

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
