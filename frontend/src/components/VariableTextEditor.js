/**
 * VariableTextEditor.js
 *
 * A contentEditable-based rich text editor that:
 *  - Renders {{nodeId}} references as inline chip spans
 *  - Shows an autocomplete dropdown when the user types {{
 *  - Auto-closes: typing a complete {{nodeId}} converts it to a chip
 *  - Serializes content back to plain {{nodeId}} syntax for storage
 *
 * Props
 * ─────
 *   value          {string}   Controlled value — "Hello {{input_0}} world"
 *   onChange       {fn}       Called with serialized string on every edit
 *   availableNodes {Array}    [{ id, label, type }] for the dropdown list
 *   placeholder    {string}
 */

import { useRef, useEffect, useState, useCallback } from 'react';

// ── HTML ↔ text serialization ─────────────────────────────────────────────────

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function textToHTML(text) {
  if (!text) return '';
  return text
    .replace(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g, (_, name) =>
      `<span class="var-chip" contenteditable="false" data-var="${name}">${escapeHTML(name)}<span class="var-chip-x" data-remove="${name}">×</span></span>`
    )
    .replace(/\n/g, '<br>');
}

function htmlToText(div) {
  let result = '';
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.dataset?.var) {
        result += `{{${node.dataset.var}}}`;
      } else if (node.tagName === 'BR') {
        result += '\n';
      } else {
        node.childNodes.forEach(walk);
      }
    }
  }
  div.childNodes.forEach(walk);
  return result;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeChip(name) {
  const span = document.createElement('span');
  span.className = 'var-chip';
  span.contentEditable = 'false';
  span.dataset.var = name;
  span.innerHTML = `${escapeHTML(name)}<span class="var-chip-x" data-remove="${name}">×</span>`;
  return span;
}

/** Returns info about an open {{ trigger before the cursor, or null. */
function getOpenTrigger() {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (range.startContainer.nodeType !== Node.TEXT_NODE) return null;

  const textBefore = range.startContainer.textContent.slice(0, range.startOffset);
  const idx = textBefore.lastIndexOf('{{');
  if (idx === -1) return null;

  const after = textBefore.slice(idx + 2);
  // Already closed → not an open trigger
  if (after.includes('}')) return null;

  return { query: after, textNode: range.startContainer, triggerIdx: idx };
}

/** Returns caret position relative to the editor div. */
function getCaretOffset(editorEl) {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return { top: 24, left: 0 };
  const r = sel.getRangeAt(0).getBoundingClientRect();
  const b = editorEl.getBoundingClientRect();
  return { top: r.bottom - b.top + 4, left: Math.max(0, r.left - b.left) };
}

// ── Component ─────────────────────────────────────────────────────────────────

export const VariableTextEditor = ({ value, onChange, availableNodes = [], placeholder }) => {
  const divRef         = useRef(null);
  const isInternalRef  = useRef(false); // prevents re-rendering from our own onChange
  const triggerRef     = useRef(null);  // saved trigger when dropdown opens — avoids re-reading lost selection on click
  const [dropdown, setDropdown] = useState(null); // { top, left, query } | null

  // ── Initialize HTML on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (divRef.current) divRef.current.innerHTML = textToHTML(value || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync when value changes externally ───────────────────────────────────
  useEffect(() => {
    if (isInternalRef.current) { isInternalRef.current = false; return; }
    if (!divRef.current) return;
    const current = htmlToText(divRef.current);
    if (current !== value) divRef.current.innerHTML = textToHTML(value || '');
  }, [value]);

  // ── Insert a variable chip at the saved trigger position ─────────────────
  const insertVariable = useCallback((nodeId) => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const { textNode, triggerIdx, query } = trigger;

    // Select from {{ to cursor (removes the typed text including {{query)
    const range = document.createRange();
    range.setStart(textNode, triggerIdx);
    range.setEnd(textNode, triggerIdx + 2 + query.length);
    range.deleteContents();

    const chip = makeChip(nodeId);
    range.insertNode(chip);

    // Move cursor just after the chip
    const after = document.createRange();
    after.setStartAfter(chip);
    after.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(after);

    setDropdown(null);
    isInternalRef.current = true;
    onChange(htmlToText(divRef.current));
    divRef.current.focus();
  }, [onChange]);

  // ── Convert a fully-typed {{varName}} in a text node to a chip ────────────
  const autoConvert = useCallback((textNode) => {
    const COMPLETE = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/;
    const match = COMPLETE.exec(textNode.textContent);
    if (!match) return false;

    const range = document.createRange();
    range.setStart(textNode, match.index);
    range.setEnd(textNode, match.index + match[0].length);
    range.deleteContents();

    const chip = makeChip(match[1]);
    range.insertNode(chip);

    const after = document.createRange();
    after.setStartAfter(chip);
    after.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(after);

    return true;
  }, []);

  // ── Handle input ─────────────────────────────────────────────────────────
  const handleInput = useCallback(() => {
    const div = divRef.current;
    if (!div) return;

    // Try auto-convert complete {{...}} before showing dropdown
    const sel = window.getSelection();
    if (sel?.rangeCount) {
      const node = sel.getRangeAt(0).startContainer;
      if (node.nodeType === Node.TEXT_NODE && autoConvert(node)) {
        setDropdown(null);
        isInternalRef.current = true;
        onChange(htmlToText(div));
        return;
      }
    }

    // Show / update dropdown for open {{ trigger
    const trigger = getOpenTrigger();
    if (trigger) {
      triggerRef.current = trigger;
      setDropdown({ ...getCaretOffset(div), query: trigger.query });
    } else {
      triggerRef.current = null;
      setDropdown(null);
    }

    isInternalRef.current = true;
    onChange(htmlToText(div));
  }, [onChange, autoConvert]);

  // ── Handle clicking × on a chip ──────────────────────────────────────────
  const handleClick = useCallback((e) => {
    if (e.target.classList.contains('var-chip-x')) {
      const chip = e.target.closest('.var-chip');
      if (chip) {
        chip.remove();
        isInternalRef.current = true;
        onChange(htmlToText(divRef.current));
      }
    }
  }, [onChange]);

  // ── Keyboard: Escape closes dropdown ─────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setDropdown(null);
  }, []);

  // ── Filter nodes for the dropdown ─────────────────────────────────────────
  const query = dropdown?.query ?? '';
  const filtered = availableNodes.filter((n) =>
    n.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Editor */}
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className="var-text-editor nodrag"
      />

      {/* Autocomplete dropdown */}
      {dropdown && filtered.length > 0 && (
        <div
          className="var-dropdown nodrag"
          style={{ top: dropdown.top, left: dropdown.left }}
        >
          <div className="var-dropdown-header">NODES</div>
          {filtered.map((n) => (
            <div
              key={n.id}
              className="var-dropdown-item"
              onMouseDown={(e) => {
                e.preventDefault(); // keep editor focused
                insertVariable(n.id);
              }}
            >
              <span className="var-dropdown-id">{n.id}</span>
              <span className="var-dropdown-type">{n.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
