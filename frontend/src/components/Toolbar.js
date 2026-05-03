/**
 * Toolbar.js — Top bar containing the brand and draggable node palette.
 *
 * Node chips are generated directly from NODE_TYPES in nodeConfig.js,
 * so adding a new node type automatically adds it to the toolbar.
 */

import { NODE_TYPES } from '../config/nodeConfig';
import { DraggableNode } from './DraggableNode';

export const Toolbar = () => (
  <div className="toolbar">
    <div className="toolbar-brand">
      <span className="toolbar-brand-icon">⚡</span>
      <span className="toolbar-brand-name">Pipeline Builder</span>
    </div>

    <div className="toolbar-divider" />

    <div className="toolbar-nodes">
      {Object.entries(NODE_TYPES).map(([type, config]) => (
        <DraggableNode
          key={type}
          type={type}
          label={config.label}
          icon={config.icon}
        />
      ))}
    </div>
  </div>
);
