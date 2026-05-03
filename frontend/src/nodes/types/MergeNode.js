import { BaseNode, labelStyle } from '../base/BaseNode';
import { NODE_TYPES } from '../../config/nodeConfig';

export const MergeNode = ({ id }) => {
  const handles = [
    { id: `${id}-inputA`, type: 'target', style: { top: '35%' } },
    { id: `${id}-inputB`, type: 'target', style: { top: '65%' } },
    { id: `${id}-output`, type: 'source' },
  ];

  return (
    <BaseNode id={id} title="Merge" color="#f97316" icon="⊕" handles={handles} description={NODE_TYPES.merge.description}>
      <span style={labelStyle}>Input A</span>
      <div style={{ marginBottom: 6 }} />
      <span style={labelStyle}>Input B</span>
      <div
        style={{
          marginTop:    8,
          padding:      '4px 7px',
          background:   '#f9731610',
          border:       '1px solid #f9731630',
          borderRadius: 5,
          color:        '#c2410c',
          fontSize:     10,
          textAlign:    'center',
        }}
      >
        [A] + [B] → merged output
      </div>
    </BaseNode>
  );
};
