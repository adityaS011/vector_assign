import { useRef } from 'react';
import { usePipelineStore } from '../store/pipelineStore';

/**
 * DraggableNode.js — A single draggable chip in the toolbar.
 *
 * Uses the HTML5 Drag API to embed the node type in the dataTransfer payload,
 * which PipelineCanvas reads on drop to create the correct node.
 */

export const DraggableNode = ({ type, label, icon }) => {
  const createNode = usePipelineStore((s) => s.createNode);
  const draggedRef = useRef(false);

  const onDragStart = (event) => {
    draggedRef.current = true;
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      draggable
      onDragStart={onDragStart}
      onDragEnd={(e) => {
        e.target.style.cursor = 'grab';
        setTimeout(() => { draggedRef.current = false; }, 0);
      }}
      onClick={() => {
        if (!draggedRef.current) {
          createNode(type);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          createNode(type);
        }
      }}
    >
      <span className="draggable-node-icon">{icon}</span>
      <span className="draggable-node-label">{label}</span>
    </div>
  );
};
