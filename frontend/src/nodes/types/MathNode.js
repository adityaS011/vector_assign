import { useState } from 'react';
import { BaseNode, labelStyle, selectStyle, fieldStyle } from '../base/BaseNode';
import { NODE_TYPES } from '../../config/nodeConfig';

const OPERATIONS = [
  { value: '+', label: 'A + B  (Add)'      },
  { value: '-', label: 'A − B  (Subtract)' },
  { value: '*', label: 'A × B  (Multiply)' },
  { value: '/', label: 'A ÷ B  (Divide)'   },
];

export const MathNode = ({ id, data }) => {
  const [op, setOp] = useState(data?.op || '+');

  const handles = [
    { id: `${id}-a`,      type: 'target', style: { top: '35%' } },
    { id: `${id}-b`,      type: 'target', style: { top: '65%' } },
    { id: `${id}-result`, type: 'source' },
  ];

  return (
    <BaseNode id={id} title="Math" color="#0ea5e9" icon="∑" handles={handles} description={NODE_TYPES.math.description}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Operation</label>
        <select style={selectStyle} value={op} onChange={(e) => setOp(e.target.value)}>
          {OPERATIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={labelStyle}>Input A</span>
        <span style={labelStyle}>Input B</span>
      </div>
    </BaseNode>
  );
};
