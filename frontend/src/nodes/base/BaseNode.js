/**
 * BaseNode.js — Shared wrapper for every pipeline node.
 *
 * Provides out-of-the-box:
 *   • Consistent card layout  (border, shadow, rounded corners)
 *   • Colored accent header   (title + icon)
 *   • Delete button           (appears on node hover, removes node + edges)
 *   • ReactFlow Handles       (styled, positioned from the `handles` prop)
 *
 * Also exports shared style tokens so every node's form fields look uniform
 * without duplicating CSS-in-JS across files.
 *
 * Props
 * ─────
 *   id       {string}  ReactFlow node id  (required for delete)
 *   title    {string}  Header label
 *   color    {string}  Hex accent color
 *   icon     {string}  Character / emoji shown before the title
 *   handles  {Array}   Handle descriptors — see shape below
 *   width    {number}  Card width in px  (default 220)
 *   style    {object}  Extra overrides for the outer wrapper
 *   children {node}    Body content
 *
 * Handle descriptor shape
 * ───────────────────────
 *   { id, type, position?, style? }
 *   • type     'source' | 'target'
 *   • position defaults: target → Left, source → Right
 *   • style    merged onto the Handle's inline style
 */

import { Handle, Position, useReactFlow } from 'reactflow';
import { Modal } from 'antd';

// ── Shared style tokens ───────────────────────────────────────────────────────
// Import these in any node file to keep form fields visually consistent.

export const labelStyle = {
  fontSize:      10,
  color:         '#64748b',
  fontWeight:    600,
  marginBottom:  3,
  display:       'block',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export const inputStyle = {
  width:       '100%',
  background:  '#f8fafc',
  border:      '1px solid #e2e8f0',
  borderRadius: 6,
  padding:     '5px 8px',
  color:       '#1e293b',
  fontSize:    12,
  outline:     'none',
  boxSizing:   'border-box',
  fontFamily:  'inherit',
  transition:  'border-color 0.15s',
};

export const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

export const fieldStyle = {
  marginBottom: 8,
};

// ── Component ─────────────────────────────────────────────────────────────────

export const BaseNode = ({
  id,
  title,
  color       = '#6366f1',
  icon        = '',
  handles     = [],
  children,
  description = '',
  width       = 220,
  style       = {},
}) => {
  const { setNodes, setEdges } = useReactFlow();

  const onDelete = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title:   'Delete node?',
      content: `Remove "${id}" and all its connections?`,
      okText:  'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => {
        setNodes((nodes) => nodes.filter((n) => n.id !== id));
        setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
      },
    });
  };

  return (
    <div
      style={{
        width,
        minHeight:    80,
        background:   '#ffffff',
        border:       `1px solid ${color}33`,
        borderRadius: 10,
        boxShadow:    '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        fontFamily:   '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize:     12,
        position:     'relative',
        ...style,
      }}
    >
      {/* ── Handles ── */}
      {handles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={
            h.position !== undefined
              ? h.position
              : h.type === 'target' ? Position.Left : Position.Right
          }
          style={{
            width:        10,
            height:       10,
            background:   color,
            border:       '2px solid #f9fafb',
            borderRadius: '50%',
            ...h.style,
          }}
        />
      ))}

      {/* ── Header ── */}
      <div
        style={{
          padding:      '7px 10px',
          background:   `${color}22`,
          borderBottom: `1px solid ${color}33`,
          borderRadius: '10px 10px 0 0',
          display:      'flex',
          alignItems:   'center',
          gap:          5,
        }}
      >
        {icon && (
          <span style={{ fontSize: 13, lineHeight: 1 }}>{icon}</span>
        )}
        <span
          style={{
            color,
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            flex:          1,
          }}
        >
          {title}
        </span>

        {/* Delete button — visible on node hover via CSS */}
        <button className="node-delete-btn" onClick={onDelete} title="Remove node">
          ×
        </button>
      </div>

      {/* ── Description + ID badge ── */}
      {(description || id) && (
        <div style={{ padding: '8px 10px 0', borderBottom: `1px solid ${color}18` }}>
          {description && (
            <p style={{
              margin:     '0 0 8px',
              fontSize:   11,
              color:      '#6b7280',
              lineHeight: 1.5,
            }}>
              {description}
            </p>
          )}
          {id && (
            <div style={{
              display:      'flex',
              justifyContent: 'center',
              marginBottom:  8,
            }}>
              <span style={{
                display:      'block',
                width:        '100%',
                textAlign:    'center',
                background:   `${color}14`,
                color:        color,
                fontSize:     12,
                fontWeight:   500,
                padding:      '4px 12px',
                borderRadius: 6,
                letterSpacing: '0.2px',
              }}>
                {id}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ padding: 10 }}>{children}</div>
    </div>
  );
};
