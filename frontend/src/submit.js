const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

const STATIC_HANDLES = {
  customInput: { source: ['value'], target: [] },
  customOutput: { source: [], target: ['value'] },
  llm: { source: ['response'], target: ['system', 'prompt'] },
  api: { source: ['response'], target: ['body', 'headers'] },
  condition: { source: ['true', 'false'], target: ['input'] },
  transform: { source: ['output'], target: ['input'] },
  merge: { source: ['output'], target: ['inputA', 'inputB'] },
  math: { source: ['result'], target: ['a', 'b'] },
  note: { source: [], target: [] },
};

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

function extractTextHandles(node) {
  const text = node.data?.text || '';
  const variables = new Set();
  let match;

  VAR_REGEX.lastIndex = 0;
  while ((match = VAR_REGEX.exec(text)) !== null) {
    variables.add(match[1]);
  }

  return {
    source: [`${node.id}-output`],
    target: [...variables].map((name) => `${node.id}-${name}`),
  };
}

function getHandleIds(node) {
  if (node.type === 'text') {
    return extractTextHandles(node);
  }

  const config = STATIC_HANDLES[node.type] || { source: [], target: [] };

  return {
    source: config.source.map((name) => `${node.id}-${name}`),
    target: config.target.map((name) => `${node.id}-${name}`),
  };
}

function hasValidHandle(node, handleId, side) {
  const handles = getHandleIds(node)[side];

  if (handles.length === 0) {
    return !handleId;
  }

  return handles.includes(handleId);
}

function getValidEdges(nodes, edges) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const seen = new Set();

  return edges.filter((edge) => {
    const sourceNode = nodesById.get(edge.source);
    const targetNode = nodesById.get(edge.target);

    if (!sourceNode || !targetNode) {
      return false;
    }

    if (
      !hasValidHandle(sourceNode, edge.sourceHandle, 'source') ||
      !hasValidHandle(targetNode, edge.targetHandle, 'target')
    ) {
      return false;
    }

    const key = [
      edge.source,
      edge.sourceHandle || '',
      edge.target,
      edge.targetHandle || '',
    ].join('|');

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function submitPipeline(nodes, edges) {
  const validEdges = getValidEdges(nodes, edges);

  const res = await fetch(`${API_BASE_URL}/pipelines/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges: validEdges }),
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}
