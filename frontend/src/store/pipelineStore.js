/**
 * pipelineStore.js — Zustand store for pipeline state.
 *
 * Manages nodes, edges, and the counters used to generate unique node IDs.
 * Auto-wiring logic lives here: when a node is added, an edge is automatically
 * created from the previous node's source handle to the new node's target handle,
 * using the autoConnect config defined in nodeConfig.js.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import { NODE_TYPES } from '../config/nodeConfig';

const EDGE_DEFAULTS = {
  type:      'buttonEdge',
  markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
};

export const usePipelineStore = create(
  persist(
    (set, get) => ({
  nodes:        [],
  edges:        [],
  nodeCounters: {},   // { [nodeType]: count } — incremented per type

  /** Returns a unique, human-readable ID for the given node type (e.g. input_0, text_1). */
  getNodeID: (type) => {
    const counters  = { ...get().nodeCounters };
    counters[type]  = (counters[type] ?? -1) + 1;   // 0-based
    set({ nodeCounters: counters });
    const prefix    = NODE_TYPES[type]?.idPrefix ?? type;
    return `${prefix}_${counters[type]}`;
  },

  /** Adds a node to the canvas. */
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  /** Handles manual connections drawn by the user on the canvas. */
  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, ...EDGE_DEFAULTS }, get().edges) }),

  updateNodeField: (nodeId, field, value) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, [field]: value } } : n
      ),
    }),
    }),
    {
      name:    'pipeline-store',   // localStorage key
      partialize: (state) => ({    // only persist data, not functions
        nodes:        state.nodes,
        edges:        state.edges,
        nodeCounters: state.nodeCounters,
      }),
    }
  )
);
