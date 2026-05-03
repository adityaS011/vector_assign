/**
 * ButtonEdge.js — Custom ReactFlow edge with a hover-reveal delete button.
 *
 * Renders:
 *   • A visible smoothstep path (the actual edge line)
 *   • An invisible wide path on top  →  wider hover hit-area
 *   • An × button at the midpoint   →  appears when hovered or selected
 */

import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from 'reactflow';

export const ButtonEdge = ({
  id,
  sourceX, sourceY, sourcePosition,
  targetX, targetY, targetPosition,
  markerEnd,
  selected,
}) => {
  const { setEdges } = useReactFlow();
  const [hovered, setHovered] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const show = hovered || selected;

  const onDelete = (e) => {
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      {/* Visible line */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: '#9ca3af', strokeWidth: 1.5 }}
      />

      {/* Wide transparent overlay — increases the hover hit-area */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Delete button — rendered as HTML via EdgeLabelRenderer portal */}
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            position:  'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            opacity:    show ? 1 : 0,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button
            onClick={onDelete}
            style={{
              width:        20,
              height:       20,
              borderRadius: '50%',
              background:   '#ffffff',
              border:       '1px solid #d1d5db',
              color:        '#6b7280',
              fontSize:     15,
              lineHeight:   1,
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              padding:      0,
              boxShadow:    '0 1px 4px rgba(0,0,0,0.12)',
              transition:   'color 0.12s, border-color 0.12s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color       = '#ef4444';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color       = '#6b7280';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
