import { useState } from 'react';
import { BaseNode, labelStyle, inputStyle } from '../base/BaseNode';
import { NODE_TYPES } from '../../config/nodeConfig';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || 'Add a note...');

  return (
    <BaseNode id={id} title="Note" color="#84cc16" icon="≡" handles={[]} width={200} description={NODE_TYPES.note.description}>
      <label style={labelStyle}>Content</label>
      <textarea
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
      />
    </BaseNode>
  );
};
