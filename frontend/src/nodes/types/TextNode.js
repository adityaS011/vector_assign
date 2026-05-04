/**
 * TextNode.js
 *
 * Behaviours:
 *  1. Rich variable editor — type {{ to get an autocomplete dropdown of all
 *     node IDs in the pipeline. Selecting one (or typing {{nodeId}}) inserts
 *     an inline chip and creates a target Handle on the left edge.
 *
 *  2. Auto-link — when {{nodeId}} resolves to a real node, a ReactFlow edge
 *     is auto-created. The edge is removed when the variable is deleted.
 *
 *  3. Auto-resize — card width expands with the longest text line.
 */

import { useMemo, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Tag, Modal } from 'antd';
import { MarkerType } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { usePipelineStore } from '../../store/pipelineStore';
import { NODE_TYPES } from '../../config/nodeConfig';
import { VariableTextEditor } from '../../components/VariableTextEditor';
import { labelStyle } from '../base/BaseNode';

// ── Constants ─────────────────────────────────────────────────────────────────

const COLOR     = '#f59e0b';
const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const HEADER_H  = 32;
const BODY_PAD  = 10;
const LABEL_H   = 20;   // "TEXT" label height + margin
const VAR_ROW_H = 26;   // height of each variable row
const VAR_GAP   = 8;    // gap between editor and variable list

const EDITOR_MIN_H = 72; // approximate min editor height

const EDGE_DEFAULTS = {
  type:      'buttonEdge',
  markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractVariables(text) {
  const seen = new Set();
  let match;
  VAR_REGEX.lastIndex = 0;
  while ((match = VAR_REGEX.exec(text)) !== null) seen.add(match[1]);
  return [...seen];
}

function computeWidth(text) {
  if (!text) return 260;
  const maxLen = Math.max(...text.split('\n').map((l) => l.length), 15);
  return Math.min(480, Math.max(260, maxLen * 7.5 + 60));
}

// ── Component ─────────────────────────────────────────────────────────────────

export const TextNode = ({ id, data }) => {
  const { setEdges } = useReactFlow();

  const { nodes, updateNodeField, deleteNode } = usePipelineStore(
    (s) => ({ nodes: s.nodes, updateNodeField: s.updateNodeField, deleteNode: s.deleteNode }),
    shallow
  );

  const onDelete = (e) => {
    e.stopPropagation();
    Modal.confirm({
      title:   'Delete node?',
      content: `Remove "${id}" and all its connections?`,
      okText:  'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => deleteNode(id),
    });
  };

  const text = data?.text ?? '';

  const handleTextChange = (val) => updateNodeField(id, 'text', val);

  // All other nodes as dropdown options
  const availableNodes = useMemo(
    () =>
      nodes
        .filter((n) => n.id !== id)
        .map((n) => ({ id: n.id, label: NODE_TYPES[n.type]?.label ?? n.type })),
    [nodes, id]
  );

  // Build nodeId → node map for matching
  const idToNode = useMemo(() => {
    const map = {};
    nodes.forEach((n) => { if (n.id !== id) map[n.id] = n; });
    return map;
  }, [nodes, id]);

  const variables = useMemo(() => extractVariables(text), [text]);
  const nodeWidth  = computeWidth(text);

  // ── Auto-create / remove edges for matched variables ───────────────────────
  useEffect(() => {
    setEdges((edges) => {
      const kept = edges.filter((e) => !(e.target === id && e.data?.autoLinked));

      const autoEdges = variables
        .filter((v) => idToNode[v])
        .map((v) => {
          const srcNode     = idToNode[v];
          const srcHandle   = NODE_TYPES[srcNode.type]?.autoConnect?.source ?? 'output';
          return {
            id:           `auto-${srcNode.id}-${id}-${v}`,
            source:       srcNode.id,
            sourceHandle: `${srcNode.id}-${srcHandle}`,
            target:       id,
            targetHandle: `${id}-${v}`,
            data:         { autoLinked: true },
            ...EDGE_DEFAULTS,
          };
        });

      const existingIds = new Set(kept.map((e) => e.id));
      return [...kept, ...autoEdges.filter((e) => !existingIds.has(e.id))];
    });
  }, [variables, idToNode, id, setEdges]);

  // Handle pixel offsets — sit beside the variable rows
  const varHandleBaseTop = HEADER_H + BODY_PAD + LABEL_H + EDITOR_MIN_H + VAR_GAP;

  return (
    <div
      style={{
        width:        nodeWidth,
        minHeight:    80,
        background:   '#ffffff',
        border:       `1px solid ${COLOR}33`,
        borderRadius: 10,
        boxShadow:    '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        fontFamily:   '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize:     12,
        position:     'relative',
      }}
    >
      {/* Static source handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ width: 10, height: 10, background: COLOR, border: '2px solid #f9fafb', borderRadius: '50%' }}
      />

      {/* Dynamic target handles — one per {{variable}} */}
      {variables.map((varName, i) => (
        <Handle
          key={varName}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top:          varHandleBaseTop + i * VAR_ROW_H + VAR_ROW_H / 2,
            width:        10,
            height:       10,
            background:   idToNode[varName] ? '#3b82f6' : COLOR,
            border:       '2px solid #f9fafb',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Header */}
      <div
        style={{
          height:       HEADER_H,
          padding:      '7px 10px',
          background:   `${COLOR}22`,
          borderBottom: `1px solid ${COLOR}33`,
          borderRadius: '10px 10px 0 0',
          display:      'flex',
          alignItems:   'center',
          gap:          5,
        }}
      >
        <span style={{ fontSize: 13 }}>📝</span>
        <span style={{ color: COLOR, fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', flex: 1 }}>
          Text
        </span>
        <button className="node-delete-btn" onClick={onDelete} title="Remove node">×</button>
      </div>

      {/* Description + ID badge */}
      <div style={{ padding: '8px 10px 0', borderBottom: `1px solid ${COLOR}18` }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>
          Write text and reference upstream nodes using {'{{node_id}}'} syntax.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <span style={{
            display: 'block', width: '100%', textAlign: 'center',
            background: `${COLOR}14`, color: COLOR,
            fontSize: 12, fontWeight: 500, padding: '4px 12px',
            borderRadius: 6, letterSpacing: '0.2px',
          }}>
            {id}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: BODY_PAD }}>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Text</label>
          <VariableTextEditor
            value={text}
            onChange={handleTextChange}
            availableNodes={availableNodes}
            placeholder='Type text… use {{ to reference a node'
          />
        </div>

        {/* Variable rows — pixel-aligned with handles */}
        {variables.length > 0 && (
          <div style={{ marginTop: VAR_GAP }}>
            <label style={{ ...labelStyle, color: `${COLOR}99` }}>Variables</label>
            {variables.map((v) => {
              const linked = !!idToNode[v];
              return (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, height: VAR_ROW_H }}>
                  {linked ? (
                    <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>{v}</Tag>
                  ) : (
                    <>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR, flexShrink: 0 }} />
                      <span style={{ color: '#6b7280', fontSize: 11 }}>{v}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
