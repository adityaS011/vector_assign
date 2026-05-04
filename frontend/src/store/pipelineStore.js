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

  /** Returns the smallest available ID for the given node type (e.g. input_0, text_1). */
  getNodeID: (type) => {
    const prefix = NODE_TYPES[type]?.idPrefix ?? type;
    const used = new Set(get().nodes.map((node) => node.id));
    let next = 0;

    while (used.has(`${prefix}_${next}`)) {
      next += 1;
    }

    const counters = { ...get().nodeCounters, [type]: next };
    set({ nodeCounters: counters });
    return `${prefix}_${next}`;
  },

  /** Adds a node to the canvas. */
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  /** Creates a node of the requested type, optionally at a specific canvas position. */
  createNode: (type, position) => {
    const id = get().getNodeID(type);
    const fallbackOffset = get().nodes.length * 28;
    const nodePosition = position || {
      x: 120 + fallbackOffset,
      y: 120 + fallbackOffset,
    };

    get().addNode({
      id,
      type,
      position: nodePosition,
      data: { id, nodeType: type },
    });
  },

  /** Deletes a node and all edges connected to it. */
  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  onNodesChange: (changes) => {
    const removedIds = changes
      .filter((change) => change.type === 'remove')
      .map((change) => change.id);

    set({
      nodes: applyNodeChanges(changes, get().nodes),
      edges: removedIds.length
        ? get().edges.filter((edge) => !removedIds.includes(edge.source) && !removedIds.includes(edge.target))
        : get().edges,
    });
  },

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
