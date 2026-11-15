/**
 * MODULE 09: TACTICAL JSON LENS & INSPECTOR
 * Zero-dependency parser, validator, formatter, minifier, and interactive collapsible tree inspector.
 * Part of Arabellanine Tactical Terminal suite.
 */

function initModule09() {
  const inputEl = document.getElementById('json-input');
  const treeContainer = document.getElementById('json-tree-container');
  const statusBadge = document.getElementById('m9-status-badge');
  const sizeMetric = document.getElementById('m9-metric-size');
  const depthMetric = document.getElementById('m9-metric-depth');
  const keysMetric = document.getElementById('m9-metric-keys');

  if (!inputEl) return;

  function calculateStats(obj, depth = 1) {
    let keys = 0;
    let maxDepth = depth;
    if (obj !== null && typeof obj === 'object') {
      const isArr = Array.isArray(obj);
      const entries = isArr ? obj : Object.keys(obj);
      keys += entries.length;
      for (const key of (isArr ? obj : Object.values(obj))) {
        if (key !== null && typeof key === 'object') {
          const sub = calculateStats(key, depth + 1);
          keys += sub.keys;
          if (sub.maxDepth > maxDepth) maxDepth = sub.maxDepth;
        }
      }
    }
    return { keys, maxDepth };
  }

  function renderTree(val, key = null, isLast = true) {
    const item = document.createElement('div');
    item.className = 'json-node';
    item.style.paddingLeft = '14px';
    item.style.position = 'relative';

    const line = document.createElement('div');
    line.style.display = 'flex';
    line.style.alignItems = 'baseline';
    line.style.gap = '4px';

    const keySpan = document.createElement('span');
    if (key !== null) {
      keySpan.textContent = `"${key}": `;
      keySpan.style.color = 'var(--accent-amber)';
    }

    if (val === null) {
      line.appendChild(keySpan);
      const nullSpan = document.createElement('span');
      nullSpan.textContent = 'null' + (isLast ? '' : ',');
      nullSpan.style.color = '#79c0ff';
      nullSpan.style.fontStyle = 'italic';
      line.appendChild(nullSpan);
      item.appendChild(line);
      return item;
    }

    const type = typeof val;

    if (type === 'boolean') {
      line.appendChild(keySpan);
      const bSpan = document.createElement('span');
      bSpan.textContent = val.toString() + (isLast ? '' : ',');
      bSpan.style.color = '#ff7b72';
      line.appendChild(bSpan);
      item.appendChild(line);
      return item;
    }

    if (type === 'number') {
      line.appendChild(keySpan);
      const numSpan = document.createElement('span');
      numSpan.textContent = val.toString() + (isLast ? '' : ',');
      numSpan.style.color = 'var(--accent-green)';
      line.appendChild(numSpan);
      item.appendChild(line);
      return item;
    }

    if (type === 'string') {
      line.appendChild(keySpan);
      const strSpan = document.createElement('span');
      strSpan.textContent = `"${val}"` + (isLast ? '' : ',');
      strSpan.style.color = '#a5d6ff';
      strSpan.style.wordBreak = 'break-all';
      line.appendChild(strSpan);
      item.appendChild(line);
      return item;
    }

    if (type === 'object') {
      const isArr = Array.isArray(val);
      const openBracket = isArr ? '[' : '{';
      const closeBracket = isArr ? ']' : '}';
      const keys = Object.keys(val);

      if (keys.length === 0) {
        line.appendChild(keySpan);
        const emptySpan = document.createElement('span');
        emptySpan.textContent = `${openBracket}${closeBracket}` + (isLast ? '' : ',');
        emptySpan.style.color = 'var(--text-muted)';
        line.appendChild(emptySpan);
        item.appendChild(line);
        return item;
      }

      // Collapsible toggle
      const toggle = document.createElement('span');
      toggle.textContent = '▼ ';
      toggle.style.cursor = 'pointer';
      toggle.style.userSelect = 'none';
      toggle.style.color = 'var(--accent-red)';
      toggle.style.fontSize = '10px';

      line.appendChild(toggle);
      line.appendChild(keySpan);
      const openSpan = document.createElement('span');
      openSpan.textContent = `${openBracket} (${keys.length})`;
      openSpan.style.color = 'var(--text-muted)';
      line.appendChild(openSpan);
      item.appendChild(line);

      const childrenContainer = document.createElement('div');
      childrenContainer.style.borderLeft = '1px solid rgba(255, 51, 68, 0.2)';
      childrenContainer.style.marginLeft = '4px';

      keys.forEach((k, idx) => {
        const childIsLast = idx === keys.length - 1;
        const childNode = renderTree(val[k], isArr ? null : k, childIsLast);
        childrenContainer.appendChild(childNode);
      });

      const closeLine = document.createElement('div');
      closeLine.textContent = closeBracket + (isLast ? '' : ',');
      closeLine.style.color = 'var(--text-muted)';
      closeLine.style.paddingLeft = '14px';

      item.appendChild(childrenContainer);
      item.appendChild(closeLine);

      toggle.addEventListener('click', () => {
        if (childrenContainer.style.display === 'none') {
          childrenContainer.style.display = 'block';
          closeLine.style.display = 'block';
          toggle.textContent = '▼ ';
          openSpan.textContent = `${openBracket} (${keys.length})`;
        } else {
          childrenContainer.style.display = 'none';
          closeLine.style.display = 'none';
          toggle.textContent = '▶ ';
          openSpan.textContent = `${openBracket}...${closeBracket} (${keys.length})`;
        }
      });

      return item;
    }

    return item;
  }

  function evaluate() {
    const raw = inputEl.value.trim();
    if (sizeMetric) sizeMetric.textContent = `${new TextEncoder().encode(raw).length} B`;

    if (!raw) {
      if (statusBadge) { statusBadge.textContent = 'EMPTY BUFFER'; statusBadge.style.color = 'var(--text-muted)'; }
      if (treeContainer) treeContainer.innerHTML = '<div style="color:var(--text-muted); padding:10px;">// ENTER JSON PAYLOAD TO INSPECT</div>';
      if (depthMetric) depthMetric.textContent = '0';
      if (keysMetric) keysMetric.textContent = '0';
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (statusBadge) { statusBadge.textContent = 'SYNTAX VALID'; statusBadge.style.color = 'var(--accent-green)'; }

      const stats = calculateStats(parsed);
      if (depthMetric) depthMetric.textContent = stats.maxDepth.toString();
      if (keysMetric) keysMetric.textContent = stats.keys.toString();

      if (treeContainer) {
        treeContainer.innerHTML = '';
        treeContainer.appendChild(renderTree(parsed, null, true));
      }
    } catch (err) {
      if (statusBadge) { statusBadge.textContent = 'SYNTAX ERROR'; statusBadge.style.color = 'var(--accent-red)'; }
      if (treeContainer) {
        treeContainer.innerHTML = `<div style="color:var(--accent-red); padding:10px; font-size:11px;">SYNTAX EXCEPTION: ${err.message}</div>`;
      }
      if (depthMetric) depthMetric.textContent = '--';
      if (keysMetric) keysMetric.textContent = '--';
    }
  }

  window.formatJsonM9 = function(spaces = 2) {
    try {
      const raw = inputEl.value.trim();
      if (!raw) return;
      const parsed = JSON.parse(raw);
      inputEl.value = JSON.stringify(parsed, null, spaces);
      evaluate();
    } catch (e) {
      evaluate();
    }
  };

  window.minifyJsonM9 = function() {
    try {
      const raw = inputEl.value.trim();
      if (!raw) return;
      const parsed = JSON.parse(raw);
      inputEl.value = JSON.stringify(parsed);
      evaluate();
    } catch (e) {
      evaluate();
    }
  };

  window.loadJsonPresetM9 = function(type) {
    if (type === 'telemetry') {
      inputEl.value = JSON.stringify({
        system: "TACTICAL_TERMINAL",
        version: "0.9.0",
        node: "arabellanine-mac",
        status: "ACTIVE",
        metrics: {
          uptime_seconds: 86400,
          memory_footprint_mb: 4.2,
          modules_loaded: 9
        },
        payload_routing: [
          { route: "api/recon", protocol: "https", secure: true, retry: 3 },
          { route: "api/telemetry", protocol: "wss", secure: true, retry: 5 }
        ],
        flags: { zero_bloat: true, telemetry_quarantine: false }
      }, null, 2);
    } else if (type === 'nested') {
      inputEl.value = JSON.stringify({
        tactical_grid: {
          quadrant: "SECTOR-09",
          coordinates: { x: 142.5, y: -88.1, z: 12.0 },
          sub_grids: [
            { id: "SG-01", status: "NOMINAL", active_sensors: [101, 102, 108] },
            { id: "SG-02", status: "WARNING", active_sensors: [204] }
          ]
        }
      }, null, 2);
    } else if (type === 'manifest') {
      inputEl.value = JSON.stringify([
        { id: "M01", name: "Hex Dump", type: "encoder" },
        { id: "M02", name: "Bitwise OP", type: "bitwise" },
        { id: "M07", name: "Hash Digest", type: "crypto" },
        { id: "M08", name: "Regex Matrix", type: "regex" },
        { id: "M09", name: "Tactical JSON Lens", type: "inspector" }
      ], null, 2);
    }
    evaluate();
  };

  inputEl.addEventListener('input', evaluate);
  evaluate();
}
