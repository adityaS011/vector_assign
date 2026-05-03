import { useState } from 'react';
import { BaseNode, labelStyle, selectStyle, fieldStyle } from '../base/BaseNode';
import { NODE_TYPES } from '../../config/nodeConfig';

export const OutputNode = ({ id, data }) => {
  const [type, setType] = useState(data?.outputType || 'Text');

  const handles = [
    { id: `${id}-value`, type: 'target' },
  ];

  return (
    <BaseNode id={id} title="Output" color="#10b981" icon="↗" handles={handles} description={NODE_TYPES.customOutput.description}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Type</label>
        <select style={selectStyle} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
