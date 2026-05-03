import { BaseNode, labelStyle } from '../base/BaseNode';
import { NODE_TYPES } from '../../config/nodeConfig';

export const LLMNode = ({ id }) => {
  const handles = [
    { id: `${id}-system`,   type: 'target', style: { top: '33%' } },
    { id: `${id}-prompt`,   type: 'target', style: { top: '67%' } },
    { id: `${id}-response`, type: 'source' },
  ];

  return (
    <BaseNode id={id} title="LLM" color="#8b5cf6" icon="◈" handles={handles} description={NODE_TYPES.llm.description}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={labelStyle}>System</span>
        <span style={labelStyle}>Response →</span>
      </div>
      <span style={labelStyle}>Prompt</span>
      <div
        style={{
          marginTop:    8,
          padding:      '5px 8px',
          background:   '#8b5cf610',
          border:       '1px solid #8b5cf630',
          borderRadius: 5,
          color:        '#7c3aed',
          fontSize:     10,
        }}
      >
        Language model inference node
      </div>
    </BaseNode>
  );
};
