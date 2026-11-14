/* MODULE 06 LOGIC */
const MASK32 = 0xFFFFFFFFn;
const MASK64 = 0xFFFFFFFFFFFFFFFFn;

function initModule06() {
  const inputEl = document.getElementById('radix-input-a');
  const baseEl = document.getElementById('radix-base-a');
  if (!inputEl || !baseEl) return;

  function update() {
    const raw = inputEl.value.trim();
    const base = parseInt(baseEl.value, 10);
    const outBin = document.getElementById('radix-out-bin');
    const outOct = document.getElementById('radix-out-oct');
    const outDec = document.getElementById('radix-out-dec');
    const outHex = document.getElementById('radix-out-hex');
    const badge = document.getElementById('m6-status-badge');

    if (!raw) {
      if (outBin) outBin.textContent = '0';
      if (outOct) outOct.textContent = '0';
      if (outDec) outDec.textContent = '0';
      if (outHex) outHex.textContent = '00';
      if (badge) { badge.textContent = 'IDLE'; badge.style.color = 'var(--text-muted)'; }
      return;
    }

    try {
      let val;
      if (base === 16) {
        val = BigInt('0x' + raw.replace(/^0x/i, ''));
      } else if (base === 2) {
        val = BigInt('0b' + raw.replace(/^0b/i, ''));
      } else if (base === 8) {
        val = BigInt('0o' + raw.replace(/^0o/i, ''));
      } else {
        val = BigInt(raw);
      }

      if (outBin) outBin.textContent = val.toString(2);
      if (outOct) outOct.textContent = val.toString(8);
      if (outDec) outDec.textContent = val.toString(10);
      if (outHex) outHex.textContent = val.toString(16).toUpperCase();
      if (badge) { badge.textContent = 'CONVERTED'; badge.style.color = 'var(--accent-green)'; }
    } catch (err) {
      if (badge) { badge.textContent = 'INVALID INPUT'; badge.style.color = 'var(--accent-red)'; }
    }
  }

  inputEl.addEventListener('input', update);
  baseEl.addEventListener('change', update);
  update();
}
