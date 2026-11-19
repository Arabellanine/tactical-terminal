/**
 * MODULE 11 // TACTICAL JWT & BEARER TOKEN INSPECTOR
 * Pure vanilla ES6, zero external libraries or dependencies.
 * Decodes header, payload, timestamps, signature validity, and checks token expiration in real time.
 */

function initModule11() {
  const jwtInput = document.getElementById('jwt-token-input');
  const statusBadge = document.getElementById('m11-status-badge');
  const headerOut = document.getElementById('jwt-header-out');
  const payloadOut = document.getElementById('jwt-payload-out');
  const sigOut = document.getElementById('jwt-signature-out');
  const expStatus = document.getElementById('jwt-exp-status');
  const algMetric = document.getElementById('m11-metric-alg');
  const typeMetric = document.getElementById('m11-metric-typ');
  const claimsMetric = document.getElementById('m11-metric-claims');

  if (!jwtInput) return;

  function base64UrlDecode(str) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }
    const raw = atob(output);
    return decodeURIComponent(
      Array.from(raw).map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
  }

  function formatTimestamp(epochSec) {
    if (!epochSec || typeof epochSec !== 'number') return 'N/A';
    const d = new Date(epochSec * 1000);
    return d.toISOString().replace('T', ' ').replace(/\..+/, ' UTC');
  }

  function parseAndInspect() {
    const raw = jwtInput.value.trim();
    if (!raw) {
      if (statusBadge) { statusBadge.textContent = 'STANDBY'; statusBadge.style.color = 'var(--text-muted)'; }
      if (headerOut) headerOut.textContent = '// AWAITING TOKEN';
      if (payloadOut) payloadOut.textContent = '// AWAITING TOKEN';
      if (sigOut) sigOut.textContent = '--';
      if (expStatus) expStatus.innerHTML = '--';
      if (algMetric) algMetric.textContent = '--';
      if (typeMetric) typeMetric.textContent = '--';
      if (claimsMetric) claimsMetric.textContent = '0';
      return;
    }

    const parts = raw.split('.');
    if (parts.length !== 3) {
      if (statusBadge) { statusBadge.textContent = 'MALFORMED (MUST HAVE 3 PARTS)'; statusBadge.style.color = 'var(--accent-red)'; }
      if (headerOut) headerOut.textContent = '// ERROR: JWT requires exactly 3 dot-separated segments.';
      if (payloadOut) payloadOut.textContent = '// ERROR: [Header].[Payload].[Signature] structure invalid.';
      if (sigOut) sigOut.textContent = 'INVALID STRUCTURE';
      if (expStatus) expStatus.innerHTML = '<span style="color:var(--accent-red)">INVALID JWT</span>';
      return;
    }

    let parsedHeader = null;
    let parsedPayload = null;

    try {
      const headerJson = base64UrlDecode(parts[0]);
      parsedHeader = JSON.parse(headerJson);
      if (headerOut) headerOut.textContent = JSON.stringify(parsedHeader, null, 2);
    } catch (err) {
      if (headerOut) headerOut.textContent = '// PARSE ERROR: ' + err.message;
    }

    try {
      const payloadJson = base64UrlDecode(parts[1]);
      parsedPayload = JSON.parse(payloadJson);
      if (payloadOut) payloadOut.textContent = JSON.stringify(parsedPayload, null, 2);
    } catch (err) {
      if (payloadOut) payloadOut.textContent = '// PARSE ERROR: ' + err.message;
    }

    if (sigOut) {
      sigOut.textContent = parts[2] ? parts[2] : '[EMPTY SIGNATURE]';
    }

    if (parsedHeader && parsedPayload) {
      if (statusBadge) { statusBadge.textContent = 'VALID JWT STRUCTURE'; statusBadge.style.color = 'var(--accent-green)'; }
      if (algMetric) algMetric.textContent = parsedHeader.alg || 'none';
      if (typeMetric) typeMetric.textContent = parsedHeader.typ || 'JWT';

      const claimKeys = Object.keys(parsedPayload);
      if (claimsMetric) claimsMetric.textContent = claimKeys.length.toString();

      // Check Expiration / Issued At / Not Before
      const nowEpoch = Math.floor(Date.now() / 1000);
      let expReport = [];

      if ('iat' in parsedPayload) {
        expReport.push(`<div>ISSUED AT (iat): <span style="color:var(--text-main);">${formatTimestamp(parsedPayload.iat)}</span></div>`);
      }
      if ('nbf' in parsedPayload) {
        const nbfActive = nowEpoch >= parsedPayload.nbf;
        const col = nbfActive ? 'var(--accent-green)' : 'var(--accent-amber)';
        expReport.push(`<div>NOT BEFORE (nbf): <span style="color:${col};">${formatTimestamp(parsedPayload.nbf)} (${nbfActive ? 'ACTIVE' : 'FUTURE'})</span></div>`);
      }
      if ('exp' in parsedPayload) {
        const isExpired = nowEpoch > parsedPayload.exp;
        const diffSec = Math.abs(nowEpoch - parsedPayload.exp);
        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const timeStr = `${hours}h ${minutes}m`;

        if (isExpired) {
          expReport.push(`<div>STATUS: <span style="color:var(--accent-red); font-weight:bold;">EXPIRED</span> (${timeStr} ago)</div>`);
          expReport.push(`<div>EXPIRES (exp): <span style="color:var(--text-muted);">${formatTimestamp(parsedPayload.exp)}</span></div>`);
          if (statusBadge) { statusBadge.textContent = 'EXPIRED TOKEN'; statusBadge.style.color = 'var(--accent-amber)'; }
        } else {
          expReport.push(`<div>STATUS: <span style="color:var(--accent-green); font-weight:bold;">ACTIVE / VALID</span> (expires in ${timeStr})</div>`);
          expReport.push(`<div>EXPIRES (exp): <span style="color:var(--text-muted);">${formatTimestamp(parsedPayload.exp)}</span></div>`);
        }
      } else {
        expReport.push(`<div>STATUS: <span style="color:var(--accent-blue);">NO EXPIRATION (IMMORTAL)</span></div>`);
      }

      if (expStatus) {
        expStatus.innerHTML = expReport.join('');
      }
    } else {
      if (statusBadge) { statusBadge.textContent = 'CORRUPTED PAYLOAD'; statusBadge.style.color = 'var(--accent-red)'; }
    }
  }

  // Presets
  window.loadJwtPresetM11 = function(preset) {
    const now = Math.floor(Date.now() / 1000);
    function b64UrlEncode(obj) {
      const str = JSON.stringify(obj);
      return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    if (preset === 'active') {
      const h = { alg: 'HS256', typ: 'JWT' };
      const p = {
        sub: 'pilot-09-arabella',
        role: 'operator',
        scope: ['telemetry:read', 'terminal:execute', 'recon:deploy'],
        iat: now - 300,
        exp: now + 3600,
        iss: 'arabellanine-auth-hub'
      };
      const s = '0eF92_qQ4A1tL5-XpZ90b2Nm11cK49A2dE9F10xZ_40';
      jwtInput.value = `${b64UrlEncode(h)}.${b64UrlEncode(p)}.${s}`;
    } else if (preset === 'expired') {
      const h = { alg: 'RS256', typ: 'JWT' };
      const p = {
        sub: 'mortal-recon-daemon',
        role: 'guest',
        iat: now - 86400,
        exp: now - 3600,
        iss: 'arabellanine-auth-hub'
      };
      const s = 's8F2_expiredSignature_d91K20bZm99cA';
      jwtInput.value = `${b64UrlEncode(h)}.${b64UrlEncode(p)}.${s}`;
    } else if (preset === 'claims') {
      const h = { alg: 'ES256', typ: 'JWT', kid: 'sig-core-v1' };
      const p = {
        sub: 'demonology-tactical-agent',
        tenant: 'presence-sp',
        clearance: 'LEVEL-4',
        org: 'Arabellanine',
        iat: now - 60,
        exp: now + 86400,
        custom: { zero_bloat: true, memory_mb: 256, protocol: 'vortex' }
      };
      const s = 'cKp890_TacticalES256SignatureValue_xx9';
      jwtInput.value = `${b64UrlEncode(h)}.${b64UrlEncode(p)}.${s}`;
    }
    parseAndInspect();
  };

  window.copyJwtSegment = function(seg) {
    let text = '';
    if (seg === 'header' && headerOut) text = headerOut.textContent;
    if (seg === 'payload' && payloadOut) text = payloadOut.textContent;
    if (seg === 'sig' && sigOut) text = sigOut.textContent;
    if (text) navigator.clipboard.writeText(text);
  };

  jwtInput.addEventListener('input', parseAndInspect);
  parseAndInspect();
}
