/**
 * PipelineCanvas.js — ReactFlow canvas with drop-zone support.
 *
 * Responsibilities:
 *   • Render the ReactFlow graph (nodes + edges)
 *   • Handle drag-and-drop from the Toolbar to create new nodes
 *   • Provide Background, Controls, and MiniMap chrome
 */

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { usePipelineStore } from '../store/pipelineStore';
import { nodeTypes, edgeTypes } from '../nodes';
import { NODE_TYPES } from '../config/nodeConfig';

import 'reactflow/dist/style.css';

const SNAP_GRID   = [16, 16];
const PRO_OPTIONS = { hideAttribution: true };

const storeSelector = (s) => ({
  nodes:         s.nodes,
  edges:         s.edges,
  getNodeID:     s.getNodeID,
  addNode:       s.addNode,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect:     s.onConnect,
});

const miniMapColor = (node) => NODE_TYPES[node.type]?.color ?? '#6366f1';

export const PipelineCanvas = () => {
  const wrapperRef  = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    usePipelineStore(storeSelector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const { nodeType } = JSON.parse(raw);
      if (!nodeType) return;

      const bounds   = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(nodeType);
      addNode({ id: nodeID, type: nodeType, position, data: { id: nodeID, nodeType } });
    },
    [rfInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        snapToGrid
        snapGrid={SNAP_GRID}
        connectionLineType="smoothstep"
        deleteKeyCode="Delete"
        proOptions={PRO_OPTIONS}
      >
        <Background color="#d1d5db" gap={22} size={1} />
        <Controls />
        <MiniMap nodeColor={miniMapColor} />
      </ReactFlow>
    </div>
  );
};
