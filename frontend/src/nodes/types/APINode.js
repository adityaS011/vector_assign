import { useState } from 'react';
import { BaseNode, labelStyle, inputStyle, selectStyle, fieldStyle } from '../base/BaseNode';
import { NODE_TYPES } from '../../config/nodeConfig';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const APINode = ({ id, data }) => {
  const [url,    setUrl]    = useState(data?.url    || 'https://api.example.com');
  const [method, setMethod] = useState(data?.method || 'GET');

  const handles = [
    { id: `${id}-body`,     type: 'target', style: { top: '40%' } },
    { id: `${id}-headers`,  type: 'target', style: { top: '70%' } },
    { id: `${id}-response`, type: 'source' },
  ];

  return (
    <BaseNode id={id} title="API Call" color="#ef4444" icon="⟡" handles={handles} width={240} description={NODE_TYPES.api.description}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Method</label>
        <select style={selectStyle} value={method} onChange={(e) => setMethod(e.target.value)}>
          {HTTP_METHODS.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>URL</label>
        <input style={inputStyle} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={labelStyle}>Body ←</span>
        <span style={labelStyle}>Headers ←</span>
      </div>
    </BaseNode>
  );
};
