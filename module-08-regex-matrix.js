/**
 * MODULE 08: TACTICAL REGEX MATRIX
 * Live regex tester, flag matrix, match highlighter, and capture-group readout.
 * Pure native RegExp implementation — zero external dependencies.
 * Part of Arabellanine Tactical Terminal suite.
 */

function initModule08() {
  const patternEl = document.getElementById('regex-pattern');
  const textEl = document.getElementById('regex-test-text');
  const highlightEl = document.getElementById('regex-highlight-view');
  const groupsListEl = document.getElementById('regex-groups-list');
  const matchCountEl = document.getElementById('m8-metric-matches');
  const timeEl = document.getElementById('m8-metric-time');
  const statusBadge = document.getElementById('m8-status-badge');

  const flagG = document.getElementById('regex-flag-g');
  const flagI = document.getElementById('regex-flag-i');
  const flagM = document.getElementById('regex-flag-m');
  const flagS = document.getElementById('regex-flag-s');
  const flagU = document.getElementById('regex-flag-u');

  if (!patternEl || !textEl || !highlightEl) return;

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function runRegexMatrix() {
    const patternStr = patternEl.value;
    const textStr = textEl.value;

    let flags = '';
    if (flagG && flagG.checked) flags += 'g';
    if (flagI && flagI.checked) flags += 'i';
    if (flagM && flagM.checked) flags += 'm';
    if (flagS && flagS.checked) flags += 's';
    if (flagU && flagU.checked) flags += 'u';

    if (!patternStr) {
      highlightEl.innerHTML = escapeHtml(textStr) || '<span style="color:var(--text-muted)">// AWAITING TARGET PAYLOAD...</span>';
      if (groupsListEl) groupsListEl.innerHTML = '<div style="color:var(--text-muted); font-size:11px;">// NO ACTIVE PATTERN</div>';
      if (matchCountEl) matchCountEl.textContent = '0';
      if (timeEl) timeEl.textContent = '0.00ms';
      if (statusBadge) { statusBadge.textContent = 'PATTERN EMPTY'; statusBadge.style.color = 'var(--text-muted)'; }
      return;
    }

    let regex;
    try {
      regex = new RegExp(patternStr, flags);
    } catch (err) {
      highlightEl.innerHTML = escapeHtml(textStr);
      if (groupsListEl) {
        groupsListEl.innerHTML = `<div style="color:var(--accent-red); font-size:11px;">SYNTAX ERROR: ${escapeHtml(err.message)}</div>`;
      }
      if (matchCountEl) matchCountEl.textContent = 'ERR';
      if (timeEl) timeEl.textContent = '--';
      if (statusBadge) { statusBadge.textContent = 'SYNTAX ERROR'; statusBadge.style.color = 'var(--accent-red)'; }
      return;
    }

    const startTime = performance.now();
    const isGlobal = regex.global;
    const matches = [];

    try {
      if (isGlobal) {
        let m;
        let lastIdx = -1;
        while ((m = regex.exec(textStr)) !== null) {
          matches.push(m);
          if (m.index === regex.lastIndex) {
            regex.lastIndex++; // Prevent infinite loop on zero-width match
          }
          if (regex.lastIndex === lastIdx) break;
          lastIdx = regex.lastIndex;
        }
      } else {
        const m = regex.exec(textStr);
        if (m) matches.push(m);
      }
    } catch (execErr) {
      if (statusBadge) { statusBadge.textContent = 'EXEC ERROR'; statusBadge.style.color = 'var(--accent-red)'; }
      return;
    }

    const elapsed = (performance.now() - startTime).toFixed(2);
    if (timeEl) timeEl.textContent = `${elapsed}ms`;
    if (matchCountEl) matchCountEl.textContent = matches.length.toString();

    if (statusBadge) {
      if (matches.length > 0) {
        statusBadge.textContent = `TARGETS LOCKED (${matches.length})`;
        statusBadge.style.color = 'var(--accent-green)';
      } else {
        statusBadge.textContent = 'ZERO MATCHES';
        statusBadge.style.color = 'var(--accent-amber)';
      }
    }

    // Build highlighted HTML view
    let highlightedHtml = '';
    let cursor = 0;

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const matchStart = match.index;
      const matchEnd = match.index + match[0].length;

      if (matchStart > cursor) {
        highlightedHtml += escapeHtml(textStr.slice(cursor, matchStart));
      }

      const matchContent = escapeHtml(match[0]) || '&empty;';
      highlightedHtml += `<mark style="background:rgba(255,51,68,0.25); color:#fff; border:1px solid var(--accent-red); padding:1px 3px; border-radius:2px; font-weight:bold;">${matchContent}</mark>`;
      cursor = Math.max(cursor, matchEnd);
    }

    if (cursor < textStr.length) {
      highlightedHtml += escapeHtml(textStr.slice(cursor));
    }
    highlightEl.innerHTML = highlightedHtml || '<span style="color:var(--text-muted)">// EMPTY BUFFER</span>';

    // Build capture groups readout
    if (groupsListEl) {
      if (matches.length === 0) {
        groupsListEl.innerHTML = '<div style="color:var(--text-muted); font-size:11px;">// NO MATCHES FOUND</div>';
      } else {
        let groupsHtml = '';
        matches.forEach((m, idx) => {
          groupsHtml += `<div style="background:#090b12; border:1px solid var(--border-color); padding:8px; margin-bottom:6px; font-size:11px;">`;
          groupsHtml += `<div style="display:flex; justify-content:space-between; margin-bottom:4px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:3px;">`;
          groupsHtml += `<span style="color:var(--accent-amber); font-weight:bold;">MATCH #${idx + 1} [idx: ${m.index}..${m.index + m[0].length}]</span>`;
          groupsHtml += `<span style="color:var(--text-muted);">len: ${m[0].length}</span>`;
          groupsHtml += `</div>`;
          groupsHtml += `<div style="color:var(--accent-green); word-break:break-all; margin-bottom:6px;">${escapeHtml(m[0])}</div>`;

          // Capture groups
          if (m.length > 1) {
            groupsHtml += `<div style="padding-left:8px; border-left:2px solid var(--border-color); display:flex; flex-direction:column; gap:3px;">`;
            for (let g = 1; g < m.length; g++) {
              const groupVal = m[g] !== undefined ? escapeHtml(m[g]) : '<span style="color:var(--text-muted)">undefined</span>';
              groupsHtml += `<div><span style="color:var(--accent-blue); font-size:10px;">GROUP ${g}:</span> <span style="color:#fff;">${groupVal}</span></div>`;
            }
            groupsHtml += `</div>`;
          }

          // Named groups if present
          if (m.groups && Object.keys(m.groups).length > 0) {
            groupsHtml += `<div style="margin-top:4px; padding-left:8px; border-left:2px solid var(--accent-amber); display:flex; flex-direction:column; gap:3px;">`;
            for (const [name, val] of Object.entries(m.groups)) {
              const namedVal = val !== undefined ? escapeHtml(val) : '<span style="color:var(--text-muted)">undefined</span>';
              groupsHtml += `<div><span style="color:var(--accent-amber); font-size:10px;">?&lt;${escapeHtml(name)}&gt;:</span> <span style="color:#fff;">${namedVal}</span></div>`;
            }
            groupsHtml += `</div>`;
          }

          groupsHtml += `</div>`;
        });
        groupsListEl.innerHTML = groupsHtml;
      }
    }
  }

  // Preset button loader
  window.loadRegexPreset = function(type) {
    if (type === 'ipv4') {
      patternEl.value = '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b';
      textEl.value = 'Tactical uplink at 192.168.1.1 and gateway 10.0.0.254 connected to DNS 8.8.8.8.';
    } else if (type === 'email') {
      patternEl.value = '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+';
      textEl.value = 'Contact daemon at arabella@vrnik.com or sysadmin@construct.internal for triage.';
    } else if (type === 'jwt') {
      patternEl.value = 'ey[A-Za-z0-9_-]+\\.ey[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+';
      textEl.value = 'Bearer token eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozG6tJ_WvP98k verified.';
    } else if (type === 'groups') {
      patternEl.value = '(?<unit>NODE-[0-9]{2}):(?<status>[A-Z]+)=(?<val>[0-9]+)';
      textEl.value = 'Telemetry: NODE-01:ACTIVE=420 NODE-02:STANDBY=0 NODE-03:CRITICAL=999';
    }
    runRegexMatrix();
  };

  patternEl.addEventListener('input', runRegexMatrix);
  textEl.addEventListener('input', runRegexMatrix);
  [flagG, flagI, flagM, flagS, flagU].forEach(cb => {
    if (cb) cb.addEventListener('change', runRegexMatrix);
  });

  runRegexMatrix();
}
