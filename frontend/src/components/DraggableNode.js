/**
 * DraggableNode.js — A single draggable chip in the toolbar.
 *
 * Uses the HTML5 Drag API to embed the node type in the dataTransfer payload,
 * which PipelineCanvas reads on drop to create the correct node.
 */

export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      draggable
      onDragStart={onDragStart}
      onDragEnd={(e) => (e.target.style.cursor = 'grab')}
    >
      <span className="draggable-node-icon">{icon}</span>
      <span className="draggable-node-label">{label}</span>
    </div>
  );
};
