/**
 * MODULE 07: TACTICAL HASH DIGEST (SHA-1 / SHA-256 / SHA-384 / SHA-512)
 * Pure native Web Crypto SubtleCrypto implementation — zero runtime dependencies.
 * Part of Arabellanine Tactical Terminal suite.
 */

(function initModule07() {
  // Wire up event listeners once DOM is ready or inline
  const inputEl = document.getElementById('hash-input');
  const formatSel = document.getElementById('hash-input-format');
  const hmacKeyEl = document.getElementById('hash-hmac-key');
  const hmacToggle = document.getElementById('hash-hmac-toggle');
  const statusBadge = document.getElementById('m7-status-badge');

  if (!inputEl) return;

  async function computeHashes() {
    const rawText = inputEl.value;
    const format = formatSel ? formatSel.value : 'utf8';
    const useHmac = hmacToggle ? hmacToggle.checked : false;
    const hmacKeyText = hmacKeyEl ? hmacKeyEl.value : '';

    let dataBuffer;
    try {
      if (format === 'hex') {
        const cleanHex = rawText.replace(/[^0-9a-fA-F]/g, '');
        if (cleanHex.length % 2 !== 0) {
          if (statusBadge) {
            statusBadge.textContent = 'ODD HEX LENGTH';
            statusBadge.style.color = 'var(--accent-amber)';
          }
          return;
        }
        const bytes = new Uint8Array(cleanHex.length / 2);
        for (let i = 0; i < cleanHex.length; i += 2) {
          bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
        }
        dataBuffer = bytes.buffer;
      } else {
        dataBuffer = new TextEncoder().encode(rawText).buffer;
      }
    } catch (e) {
      if (statusBadge) {
        statusBadge.textContent = 'ENCODING ERROR';
        statusBadge.style.color = 'var(--accent-red)';
      }
      return;
    }

    const byteLen = dataBuffer.byteLength;
    const bitLen = byteLen * 8;
    const byteLenEl = document.getElementById('m7-metric-bytes');
    const bitLenEl = document.getElementById('m7-metric-bits');
    if (byteLenEl) byteLenEl.textContent = byteLen.toString();
    if (bitLenEl) bitLenEl.textContent = bitLen.toString();

    if (statusBadge) {
      statusBadge.textContent = useHmac ? 'HMAC ACTIVE' : 'DIGEST READY';
      statusBadge.style.color = useHmac ? 'var(--accent-amber)' : 'var(--accent-green)';
    }

    const algorithms = [
      { id: 'sha1', name: 'SHA-1' },
      { id: 'sha256', name: 'SHA-256' },
      { id: 'sha384', name: 'SHA-384' },
      { id: 'sha512', name: 'SHA-512' }
    ];

    for (const alg of algorithms) {
      try {
        let digestBuffer;
        if (useHmac && hmacKeyText.length > 0) {
          const keyBuffer = new TextEncoder().encode(hmacKeyText);
          const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'HMAC', hash: { name: alg.name } },
            false,
            ['sign']
          );
          digestBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
        } else {
          digestBuffer = await crypto.subtle.digest(alg.name, dataBuffer);
        }

        const digestArray = Array.from(new Uint8Array(digestBuffer));
        const hex = digestArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const outEl = document.getElementById(`hash-${alg.id}-out`);
        if (outEl) {
          outEl.textContent = hex.toUpperCase();
        }
      } catch (err) {
        const outEl = document.getElementById(`hash-${alg.id}-out`);
        if (outEl) outEl.textContent = 'CRYPTO API ERROR';
      }
    }
  }

  // Quick preset loader
  window.setHashPreset = function(type) {
    if (type === 'empty') inputEl.value = '';
    if (type === 'quickbrown') inputEl.value = 'The quick brown fox jumps over the lazy dog';
    if (type === 'arabella') inputEl.value = 'ARABELLANINE // TACTICAL SECURE SUITE';
    if (type === 'vector0') inputEl.value = '0123456789abcdef';
    computeHashes();
  };

  window.copyHashResult = function(algId) {
    const el = document.getElementById(`hash-${algId}-out`);
    if (el && el.textContent && !el.textContent.includes('ERROR')) {
      navigator.clipboard.writeText(el.textContent);
    }
  };

  window.toggleHmacMode = function() {
    const row = document.getElementById('hmac-key-row');
    if (row && hmacToggle) {
      row.style.display = hmacToggle.checked ? 'flex' : 'none';
    }
    computeHashes();
  };

  inputEl.addEventListener('input', computeHashes);
  if (formatSel) formatSel.addEventListener('change', computeHashes);
  if (hmacKeyEl) hmacKeyEl.addEventListener('input', computeHashes);

  // Initial computation
  computeHashes();
})();
