/**
 * nodeConfig.js — Single source of truth for every node type.
 *
 * Adding a new node in 3 steps:
 *   1. Create  src/nodes/types/YourNode.js  (uses BaseNode, ~15 lines)
 *   2. Add an entry below
 *   3. Import & register in  src/nodes/index.js
 *
 * Fields
 * ──────
 *   label       Toolbar chip label
 *   icon        Toolbar chip icon character
 *   color       Accent hex color  (header tint, handle dots, border)
 *   category    Toolbar grouping  ('General' | 'LLMs' | 'Utilities')
 *   autoConnect { source?, target? }  handle-name suffixes used for
 *               automatic wiring when nodes are dropped in sequence.
 *               Omit either key if the node has no source / no target.
 */

export const NODE_TYPES = {
  // ── General ───────────────────────────────────────────────────────────────
  customInput: {
    label:       'Input',
    icon:        '↙',
    color:       '#3b82f6',
    category:    'General',
    idPrefix:    'input',
    description: 'Pass data of different types into your workflow.',
    autoConnect: { source: 'value' },
  },
  customOutput: {
    label:       'Output',
    icon:        '↗',
    color:       '#10b981',
    category:    'General',
    idPrefix:    'output',
    description: 'Receive and display the final result of your pipeline.',
    autoConnect: { target: 'value' },
  },
  text: {
    label:       'Text',
    icon:        'T',
    color:       '#f59e0b',
    category:    'General',
    idPrefix:    'text',
    description: 'Write text and reference upstream nodes using {{node_id}} syntax.',
    autoConnect: { source: 'output' },
  },
  note: {
    label:       'Note',
    icon:        '≡',
    color:       '#84cc16',
    category:    'General',
    idPrefix:    'note',
    description: 'Add a freeform annotation or comment to document your pipeline.',
    autoConnect: {},
  },

  // ── LLMs ──────────────────────────────────────────────────────────────────
  llm: {
    label:       'LLM',
    icon:        '◈',
    color:       '#8b5cf6',
    category:    'LLMs',
    idPrefix:    'llm',
    description: 'Send a prompt to a language model and receive a generated response.',
    autoConnect: { source: 'response', target: 'prompt' },
  },

  // ── Utilities ─────────────────────────────────────────────────────────────
  api: {
    label:       'API Call',
    icon:        '⟡',
    color:       '#ef4444',
    category:    'Utilities',
    idPrefix:    'api',
    description: 'Make an HTTP request to an external API and pass the response downstream.',
    autoConnect: { source: 'response', target: 'body' },
  },
  condition: {
    label:       'Condition',
    icon:        '⋱',
    color:       '#06b6d4',
    category:    'Utilities',
    idPrefix:    'condition',
    description: 'Route flow down a true or false branch based on a boolean expression.',
    autoConnect: { source: 'true', target: 'input' },
  },
  transform: {
    label:       'Transform',
    icon:        '⇌',
    color:       '#ec4899',
    category:    'Utilities',
    idPrefix:    'transform',
    description: 'Apply a custom transformation or mapping function to the input data.',
    autoConnect: { source: 'output', target: 'input' },
  },
  merge: {
    label:       'Merge',
    icon:        '⊕',
    color:       '#f97316',
    category:    'Utilities',
    idPrefix:    'merge',
    description: 'Combine multiple upstream inputs into a single output object.',
    autoConnect: { source: 'output', target: 'inputA' },
  },
  math: {
    label:       'Math',
    icon:        '∑',
    color:       '#0ea5e9',
    category:    'Utilities',
    idPrefix:    'math',
    description: 'Perform arithmetic operations on numeric inputs and output the result.',
    autoConnect: { source: 'result', target: 'a' },
  },
};
