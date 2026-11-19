/**
 * MODULE 10: TACTICAL URL & QUERY PARAM MATRIX
 * Zero-dependency URL parser, component breakdown, query parameter inspector,
 * query matrix modifier/serializer, and URI component encoder/decoder.
 * Part of Arabellanine Tactical Terminal suite.
 */

function initModule10() {
  const urlInput = document.getElementById('url-input');
  const statusBadge = document.getElementById('m10-status-badge');
  const metricProtocol = document.getElementById('m10-metric-proto');
  const metricHostname = document.getElementById('m10-metric-host');
  const metricParams = document.getElementById('m10-metric-params');
  const queryTableBody = document.getElementById('url-query-body');

  const compProto = document.getElementById('url-comp-proto');
  const compHost = document.getElementById('url-comp-host');
  const compPort = document.getElementById('url-comp-port');
  const compPath = document.getElementById('url-comp-path');
  const compHash = document.getElementById('url-comp-hash');

  const codecInput = document.getElementById('url-codec-input');
  const codecOutput = document.getElementById('url-codec-output');

  if (!urlInput) return;

  function parseCurrentUrl() {
    const raw = urlInput.value.trim();
    if (!raw) {
      if (statusBadge) { statusBadge.textContent = 'EMPTY BUFFER'; statusBadge.style.color = 'var(--text-muted)'; }
      if (metricProtocol) metricProtocol.textContent = '--';
      if (metricHostname) metricHostname.textContent = '--';
      if (metricParams) metricParams.textContent = '0';
      if (compProto) compProto.textContent = '--';
      if (compHost) compHost.textContent = '--';
      if (compPort) compPort.textContent = '--';
      if (compPath) compPath.textContent = '--';
      if (compHash) compHash.textContent = '--';
      if (queryTableBody) queryTableBody.innerHTML = '<tr><td colspan="4" style="color:var(--text-muted); padding:8px; text-align:center;">// NO QUERY PARAMETERS DETECTED</td></tr>';
      return;
    }

    try {
      // Support protocol-relative or partial URLs by fallback
      let parsed;
      try {
        parsed = new URL(raw);
      } catch (e) {
        if (!raw.includes('://')) {
          parsed = new URL('https://' + raw);
        } else {
          throw e;
        }
      }

      if (statusBadge) { statusBadge.textContent = 'PARSED VALID'; statusBadge.style.color = 'var(--accent-green)'; }
      if (metricProtocol) metricProtocol.textContent = parsed.protocol.replace(':', '').toUpperCase();
      if (metricHostname) metricHostname.textContent = parsed.hostname || '--';

      if (compProto) compProto.textContent = parsed.protocol || '--';
      if (compHost) compHost.textContent = parsed.hostname || '--';
      if (compPort) compPort.textContent = parsed.port ? `:${parsed.port}` : '(default)';
      if (compPath) compPath.textContent = parsed.pathname || '/';
      if (compHash) compHash.textContent = parsed.hash || '(none)';

      // Parse Query Parameters
      const searchParams = Array.from(parsed.searchParams.entries());
      if (metricParams) metricParams.textContent = searchParams.length.toString();

      if (queryTableBody) {
        if (searchParams.length === 0) {
          queryTableBody.innerHTML = '<tr><td colspan="4" style="color:var(--text-muted); padding:8px; text-align:center;">// NO QUERY PARAMETERS DETECTED</td></tr>';
        } else {
          queryTableBody.innerHTML = '';
          searchParams.forEach(([key, val], idx) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';

            const tdIdx = document.createElement('td');
            tdIdx.style.padding = '6px 8px';
            tdIdx.style.color = 'var(--text-muted)';
            tdIdx.textContent = (idx + 1).toString().padStart(2, '0');

            const tdKey = document.createElement('td');
            tdKey.style.padding = '6px 8px';
            tdKey.style.color = 'var(--accent-amber)';
            tdKey.style.fontWeight = 'bold';
            tdKey.textContent = key;

            const tdVal = document.createElement('td');
            tdVal.style.padding = '6px 8px';
            tdVal.style.color = '#a5d6ff';
            tdVal.style.wordBreak = 'break-all';
            tdVal.textContent = val;

            const tdActions = document.createElement('td');
            tdActions.style.padding = '6px 8px';
            tdActions.style.textAlign = 'right';

            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn';
            copyBtn.style.padding = '2px 6px';
            copyBtn.style.fontSize = '9px';
            copyBtn.textContent = 'COPY';
            copyBtn.onclick = () => navigator.clipboard.writeText(`${key}=${val}`);

            const delBtn = document.createElement('button');
            delBtn.className = 'btn';
            delBtn.style.padding = '2px 6px';
            delBtn.style.fontSize = '9px';
            delBtn.style.marginLeft = '4px';
            delBtn.style.borderColor = 'rgba(255,51,68,0.4)';
            delBtn.style.color = 'var(--accent-red)';
            delBtn.textContent = 'DEL';
            delBtn.onclick = () => removeQueryParamM10(key, val);

            tdActions.appendChild(copyBtn);
            tdActions.appendChild(delBtn);

            tr.appendChild(tdIdx);
            tr.appendChild(tdKey);
            tr.appendChild(tdVal);
            tr.appendChild(tdActions);
            queryTableBody.appendChild(tr);
          });
        }
      }
    } catch (err) {
      if (statusBadge) { statusBadge.textContent = 'SYNTAX INVALID'; statusBadge.style.color = 'var(--accent-red)'; }
      if (metricProtocol) metricProtocol.textContent = 'ERR';
      if (metricHostname) metricHostname.textContent = 'ERR';
      if (metricParams) metricParams.textContent = '--';
      if (compProto) compProto.textContent = '--';
      if (compHost) compHost.textContent = '--';
      if (compPort) compPort.textContent = '--';
      if (compPath) compPath.textContent = '--';
      if (compHash) compHash.textContent = '--';
      if (queryTableBody) queryTableBody.innerHTML = `<tr><td colspan="4" style="color:var(--accent-red); padding:8px;">MALFORMED URI: ${err.message}</td></tr>`;
    }
  }

  function removeQueryParamM10(targetKey, targetVal) {
    try {
      const parsed = new URL(urlInput.value.trim());
      const allVals = parsed.searchParams.getAll(targetKey);
      parsed.searchParams.delete(targetKey);
      allVals.filter(v => v !== targetVal).forEach(v => parsed.searchParams.append(targetKey, v));
      urlInput.value = parsed.toString();
      parseCurrentUrl();
    } catch (e) {
      parseCurrentUrl();
    }
  }

  window.addQueryParamM10 = function() {
    const keyInput = document.getElementById('url-new-key');
    const valInput = document.getElementById('url-new-val');
    if (!keyInput || !valInput) return;
    const key = keyInput.value.trim();
    const val = valInput.value.trim();
    if (!key) return;

    try {
      let raw = urlInput.value.trim();
      let parsed;
      try {
        parsed = new URL(raw);
      } catch (e) {
        parsed = new URL(raw.includes('://') ? raw : 'https://' + raw);
      }
      parsed.searchParams.append(key, val);
      urlInput.value = parsed.toString();
      keyInput.value = '';
      valInput.value = '';
      parseCurrentUrl();
    } catch (e) {
      parseCurrentUrl();
    }
  };

  window.loadUrlPresetM10 = function(preset) {
    if (preset === 'telemetry') {
      urlInput.value = 'https://arabellanine.github.io/tactical-terminal/index.html?node=arabella-mac&mode=stealth&sig=0xdeadbeef&retry=3#sector-09';
    } else if (preset === 'auth') {
      urlInput.value = 'https://auth.arabellanine.org/oauth/v2/authorize?client_id=tactical-suite&response_type=token&scope=recon%20tactical%20crypto&redirect_uri=https%3A%2F%2Fterminal.internal%2Fcallback&state=sig_9901';
    } else if (preset === 'api') {
      urlInput.value = 'https://api.constructor.tech/v1/presence/nodes?filter=active&tenant=sch-401&sort=desc&limit=50&api_key=tactical_key_demo';
    }
    parseCurrentUrl();
  };

  window.runUrlCodecM10 = function(mode) {
    if (!codecInput || !codecOutput) return;
    const text = codecInput.value;
    try {
      if (mode === 'encode') {
        codecOutput.textContent = encodeURIComponent(text);
      } else if (mode === 'decode') {
        codecOutput.textContent = decodeURIComponent(text);
      } else if (mode === 'encodeUri') {
        codecOutput.textContent = encodeURI(text);
      } else if (mode === 'decodeUri') {
        codecOutput.textContent = decodeURI(text);
      }
    } catch (err) {
      codecOutput.textContent = `CODEC ERROR: ${err.message}`;
    }
  };

  urlInput.addEventListener('input', parseCurrentUrl);
  parseCurrentUrl();
}
