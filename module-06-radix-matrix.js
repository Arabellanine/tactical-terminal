// --- MODULE 06: TACTICAL RADIX & BASE CONVERTER LOGIC ---
const MASK32 = 0xFFFFFFFFn;
const MASK64 = 0xFFFFFFFFFFFFFFFFn;

function initModule06() {
  const radixInputA = document.getElementById('radix-input-a');
  const radixBaseA = document.getElementById('radix-base-a');
  const radixCustomBaseA = document.getElementById('radix-custom-base-a');
  const valRadixCustomBaseA = document.getElementById('val-radix-custom-base-a');
  const radixInputB = document.getElementById('radix-input-b');
  const radixBaseB = document.getElementById('radix-base-b');
  const radixShiftN = document.getElementById('radix-shift-n');
  const valRadixShift = document.getElementById('val-radix-shift');
  const rdxCustomBase = document.getElementById('rdx-custom-base');
  const m6StatusBadge = document.getElementById('m6-status-badge');

  if (!radixInputA) return;

  // Populate custom OUTPUT base selector (2..36)
  if (rdxCustomBase && rdxCustomBase.options.length === 0) {
    for (let b = 2; b <= 36; b++) {
      const o = document.createElement('option');
      o.value = b; o.textContent = b;
      if (b === 36) o.selected = true;
      rdxCustomBase.appendChild(o);
    }
  }

  function m6set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // Parse a value string in a given base; honors sign + 0x/0o/0b prefixes. Returns BigInt or null.
  function parseByBase(str, base) {
    if (str == null) return null;
    let s = String(str).trim();
    if (s === '') return null;
    let neg = false;
    if (s[0] === '-') { neg = true; s = s.slice(1); }
    else if (s[0] === '+') { s = s.slice(1); }
    const low = s.toLowerCase();
    if (low.startsWith('0x')) { s = s.slice(2); base = 16; }
    else if (low.startsWith('0o')) { s = s.slice(2); base = 8; }
    else if (low.startsWith('0b')) { s = s.slice(2); base = 2; }
    if (s === '') return null;
    const B = BigInt(base);
    let val = 0n;
    for (const ch of s.toLowerCase()) {
      if (ch === '_') continue; // allow digit separators
      let d;
      if (ch >= '0' && ch <= '9') d = ch.charCodeAt(0) - 48;
      else if (ch >= 'a' && ch <= 'z') d = ch.charCodeAt(0) - 97 + 10;
      else return null;
      if (d >= base) return null;
      val = val * B + BigInt(d);
    }
    return neg ? -val : val;
  }

  function m6ActiveBaseA() {
    return (radixBaseA.value === 'custom')
      ? parseInt(radixCustomBaseA.value, 10)
      : parseInt(radixBaseA.value, 10);
  }

  function nibbleGroup(bin) {
    return bin.replace(/(.{4})/g, '$1 ').trim();
  }

  function fmt32Result(big) {
    const u = big & MASK32;
    const s = u >= 0x80000000n ? u - 0x100000000n : u;
    return '0x' + u.toString(16).padStart(8, '0').toUpperCase() + '  (' + s.toString() + ')';
  }

  function asciiFrom32(u32) {
    let out = '';
    for (let shift = 24n; shift >= 0n; shift -= 8n) {
      const byte = Number((u32 >> shift) & 0xFFn);
      out += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '·';
    }
    return out;
  }

  window.updateM6 = function() {
    if (!radixInputA) return;
    if (radixCustomBaseA) radixCustomBaseA.disabled = (radixBaseA.value !== 'custom');
    if (valRadixCustomBaseA) valRadixCustomBaseA.textContent = radixCustomBaseA.value;
    if (valRadixShift) valRadixShift.textContent = radixShiftN.value;

    const A = parseByBase(radixInputA.value, m6ActiveBaseA());

    if (A === null) {
      if (m6StatusBadge) {
        m6StatusBadge.textContent = 'INVALID INPUT';
        m6StatusBadge.style.color = 'var(--accent-red)';
      }
      ['rdx-dec-s32','rdx-dec-s64','rdx-dec-u32','rdx-hex-upper','rdx-hex-lower',
       'rdx-hex-pad','rdx-oct','rdx-custom','rdx-ascii','rdx-bin',
       'bw-and','bw-or','bw-xor','bw-not','bw-shl','bw-shr','bw-ushr',
       'tc-sign','tc-mag','tc-ones','tc-twos','tc-bin'].forEach(id => m6set(id, '--'));
      return;
    }
    if (m6StatusBadge) {
      m6StatusBadge.textContent = 'VALID VECTOR';
      m6StatusBadge.style.color = 'var(--accent-green)';
    }

    // Radix breakdown (operand A)
    const u32 = A & MASK32;
    const s32 = u32 >= 0x80000000n ? u32 - 0x100000000n : u32;
    const u64 = A & MASK64;
    const s64 = u64 >= 0x8000000000000000n ? u64 - 0x10000000000000000n : u64;
    const cb = rdxCustomBase ? parseInt(rdxCustomBase.value, 10) : 36;

    m6set('rdx-dec-s32', s32.toString());
    m6set('rdx-dec-s64', s64.toString());
    m6set('rdx-dec-u32', u32.toString());
    m6set('rdx-hex-upper', '0x' + u32.toString(16).toUpperCase());
    m6set('rdx-hex-lower', u32.toString(16));
    m6set('rdx-hex-pad', u32.toString(16).padStart(8, '0').toUpperCase());
    m6set('rdx-oct', '0o' + u32.toString(8));
    m6set('rdx-custom', A.toString(cb).toUpperCase());
    m6set('rdx-ascii', asciiFrom32(u32));
    m6set('rdx-bin', nibbleGroup(u32.toString(2).padStart(32, '0')));

    // Operand B (32-bit)
    const baseB = (radixBaseB.value === 'custom')
      ? parseInt(radixCustomBaseA.value, 10)
      : parseInt(radixBaseB.value, 10);
    const Bparsed = parseByBase(radixInputB.value, baseB);
    const B = (Bparsed === null ? 0n : Bparsed) & MASK32;
    const N = BigInt(parseInt(radixShiftN.value, 10));

    // Bitwise tactical ops (32-bit)
    m6set('bw-and', fmt32Result(u32 & B));
    m6set('bw-or',  fmt32Result(u32 | B));
    m6set('bw-xor', fmt32Result(u32 ^ B));
    m6set('bw-not', fmt32Result(~u32 & MASK32));
    m6set('bw-shl', fmt32Result((u32 << N) & MASK32));
    m6set('bw-shr', fmt32Result((s32 >> N) & MASK32));   // arithmetic (sign-preserving)
    m6set('bw-ushr', fmt32Result((u32 >> N) & MASK32));  // logical (zero-fill)

    // 32-bit two's complement breakdown
    const signBit = (u32 >> 31n) & 1n;
    const magnitude = signBit === 1n ? (0x100000000n - u32) : u32;
    const ones = ~u32 & MASK32;
    const twos = (~u32 + 1n) & MASK32;
    m6set('tc-sign', signBit.toString() + (signBit === 1n ? '  (NEGATIVE)' : '  (POSITIVE)'));
    m6set('tc-mag', magnitude.toString() + '  (0x' + magnitude.toString(16).toUpperCase() + ')');
    m6set('tc-ones', fmt32Result(ones));
    m6set('tc-twos', fmt32Result(twos));
    m6set('tc-bin', nibbleGroup(u32.toString(2).padStart(32, '0')));

    // Metrics
    m6set('m6-metric-a', '0x' + u32.toString(16).padStart(8, '0').toUpperCase());
    m6set('m6-metric-b', '0x' + B.toString(16).padStart(8, '0').toUpperCase());
    m6set('m6-metric-n', radixShiftN.value);
  };

  window.onRadixBaseChange = function() { window.updateM6(); };

  window.setRadixPreset = function(val) {
    radixInputA.value = val;
    const low = val.trim().toLowerCase().replace(/^[-+]/, '');
    if (low.startsWith('0x')) radixBaseA.value = '16';
    else if (low.startsWith('0b')) radixBaseA.value = '2';
    else if (low.startsWith('0o')) radixBaseA.value = '8';
    else radixBaseA.value = '10';
    window.updateM6();
  };

  window.m6CopyHex = function() {
    const t = document.getElementById('rdx-hex-pad').textContent;
    if (t && t !== '--') navigator.clipboard.writeText('0x' + t);
  };
  window.m6CopyBin = function() {
    const t = document.getElementById('rdx-bin').textContent;
    if (t && t !== '--') navigator.clipboard.writeText(t.replace(/ /g, ''));
  };
  window.m6CopyDec = function() {
    const t = document.getElementById('rdx-dec-s32').textContent;
    if (t && t !== '--') navigator.clipboard.writeText(t);
  };
  window.m6Swap = function() {
    const a = radixInputA.value, b = radixInputB.value;
    radixInputA.value = b; radixInputB.value = a;
    const ab = radixBaseA.value;
    radixBaseA.value = radixBaseB.value;
    radixBaseB.value = ab;
    window.updateM6();
  };
  window.m6Clear = function() {
    radixInputA.value = '0';
    radixInputB.value = '0';
    radixShiftN.value = 0;
    window.updateM6();
  };

  radixInputA.addEventListener('input', window.updateM6);
  radixInputB.addEventListener('input', window.updateM6);

  window.updateM6();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModule06);
} else {
  initModule06();
}
