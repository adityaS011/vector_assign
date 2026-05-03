import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, labelStyle, inputStyle, fieldStyle } from '../base/BaseNode';
import { NODE_TYPES } from '../../config/nodeConfig';

export const ConditionNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'value > 0');

  const handles = [
    { id: `${id}-input`, type: 'target' },
    { id: `${id}-true`,  type: 'source', position: Position.Right, style: { top: '30%' } },
    { id: `${id}-false`, type: 'source', position: Position.Right, style: { top: '70%' } },
  ];

  return (
    <BaseNode id={id} title="Condition" color="#06b6d4" icon="⋱" handles={handles} width={230} description={NODE_TYPES.condition.description}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Condition</label>
        <input
          style={inputStyle}
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g. value > 0"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
          <span style={{ ...labelStyle, color: '#16a34a', marginBottom: 0 }}>True →</span>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
          <span style={{ ...labelStyle, color: '#dc2626', marginBottom: 0 }}>False →</span>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171' }} />
        </div>
      </div>
    </BaseNode>
  );
};
