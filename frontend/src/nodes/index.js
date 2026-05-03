/**
 * Node & edge type registry.
 *
 * ReactFlow consumes nodeTypes / edgeTypes to map type-string keys
 * to React components. Import from here everywhere you need them.
 *
 * Adding a new node type:
 *   1. Create src/nodes/types/YourNode.js
 *   2. Add its entry to src/config/nodeConfig.js
 *   3. Import the component below and add it to nodeTypes
 */

import { InputNode }     from './types/InputNode';
import { OutputNode }    from './types/OutputNode';
import { LLMNode }       from './types/LLMNode';
import { TextNode }      from './types/TextNode';
import { APINode }       from './types/APINode';
import { ConditionNode } from './types/ConditionNode';
import { TransformNode } from './types/TransformNode';
import { NoteNode }      from './types/NoteNode';
import { MergeNode }     from './types/MergeNode';
import { MathNode }      from './types/MathNode';
import { ButtonEdge }    from './edges/ButtonEdge';

export const nodeTypes = {
  customInput:  InputNode,
  customOutput: OutputNode,
  llm:          LLMNode,
  text:         TextNode,
  api:          APINode,
  condition:    ConditionNode,
  transform:    TransformNode,
  note:         NoteNode,
  merge:        MergeNode,
  math:         MathNode,
};

export const edgeTypes = {
  buttonEdge: ButtonEdge,
};
