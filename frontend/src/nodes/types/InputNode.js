import { useState, useEffect } from 'react';
import { BaseNode, labelStyle, selectStyle, fieldStyle } from '../base/BaseNode';
import { usePipelineStore } from '../../store/pipelineStore';
import { NODE_TYPES } from '../../config/nodeConfig';

export const InputNode = ({ id, data }) => {
  const updateNodeField = usePipelineStore((s) => s.updateNodeField);
  const [type, setType] = useState(data?.inputType || 'Text');

  // Store the node's id as its name so TextNode can reference it by {{id}}
  useEffect(() => {
    updateNodeField(id, 'inputName', id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handles = [
    { id: `${id}-value`, type: 'source' },
  ];

  return (
    <BaseNode id={id} title="Input" color="#3b82f6" icon="↙" handles={handles} description={NODE_TYPES.customInput.description}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Type</label>
        <select style={selectStyle} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};
