import { useState } from 'react';
import { BaseNode, labelStyle, selectStyle, fieldStyle } from '../base/BaseNode';
import { NODE_TYPES } from '../../config/nodeConfig';

const OPERATIONS = [
  'JSON Parse', 'JSON Stringify',
  'Uppercase', 'Lowercase', 'Trim Whitespace',
  'Base64 Encode', 'Base64 Decode',
];

export const TransformNode = ({ id, data }) => {
  const [op, setOp] = useState(data?.transform || 'JSON Parse');

  const handles = [
    { id: `${id}-input`,  type: 'target' },
    { id: `${id}-output`, type: 'source' },
  ];

  return (
    <BaseNode id={id} title="Transform" color="#ec4899" icon="⇌" handles={handles} description={NODE_TYPES.transform.description}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Operation</label>
        <select style={selectStyle} value={op} onChange={(e) => setOp(e.target.value)}>
          {OPERATIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div
        style={{
          padding:      '4px 7px',
          background:   '#ec489910',
          border:       '1px solid #ec489930',
          borderRadius: 5,
          color:        '#be185d',
          fontSize:     10,
        }}
      >
        input → [{op}] → output
      </div>
    </BaseNode>
  );
};
