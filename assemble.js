const fs = require('fs');

const basePath = 'Ambitions/demonic-tactical-apps/tactical-terminal/base_index.html';
// Read base_index.html
let html = fs.readFileSync(basePath, 'utf8');

// 1. Nav tab: insert after id="tab-btn-m5"
const navTarget = '<div class="nav-tab" id="tab-btn-m5" onclick="switchModule(5)">[MOD 05] SUBNET &amp; BITMASK</div>';
const navReplacement = '<div class="nav-tab" id="tab-btn-m5" onclick="switchModule(5)">[MOD 05] SUBNET &amp; BITMASK</div>\n      <div class="nav-tab" id="tab-btn-m6" onclick="switchModule(6)">[MOD 06] RADIX &amp; BASE CONVERTER</div>';

if (html.includes(navTarget)) {
  html = html.replace(navTarget, navReplacement);
} else {
  console.error("Could not find navTarget");
}

// 2. View section: insert after module-5-view closing </div> before <footer>
const viewTarget = '  </div>\n\n  <footer>';
const viewReplacement = `  </div>

  <!-- MODULE 06: TACTICAL RADIX & BASE CONVERTER -->
  <div class="grid" id="module-6-view" style="display: none;">
    <div class="panel">
      <div class="panel-header">
        <span>[06A] PRIMARY VECTOR & RADIX DECOMPOSITION</span>
        <span id="m6-status-badge" style="color:var(--accent-green)">VALID VECTOR</span>
      </div>
      <div class="panel-body">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:10px; color:var(--text-dim); letter-spacing:1px;">PRIMARY VALUE (OPERAND A)</label>
          <input type="text" id="radix-input-a" value="0xDEADBEEF" placeholder="ENTER VALUE — 0x.. / 0b.. / 0o.. / RAW DIGITS">
        </div>

        <div class="pulse-control-grid" style="padding:8px;">
          <div class="ctrl-group">
            <label>INPUT BASE</label>
            <select id="radix-base-a" onchange="onRadixBaseChange()">
              <option value="16" selected>HEX (BASE 16)</option>
              <option value="10">DEC (BASE 10)</option>
              <option value="8">OCT (BASE 8)</option>
              <option value="2">BIN (BASE 2)</option>
              <option value="custom">CUSTOM (2-36)</option>
            </select>
          </div>
          <div class="ctrl-group">
            <label>CUSTOM INPUT BASE <span class="val" id="val-radix-custom-base-a">36</span></label>
            <input type="range" id="radix-custom-base-a" min="2" max="36" value="36" oninput="updateM6()" disabled>
          </div>
        </div>

        <div class="btn-row">
          <button onclick="setRadixPreset('0xDEADBEEF')">0xDEADBEEF</button>
          <button onclick="setRadixPreset('2147483647')">2147483647</button>
          <button onclick="setRadixPreset('-42')">-42</button>
          <button onclick="setRadixPreset('0b10101010')">0b10101010</button>
        </div>

        <div class="matrix-field-table">
          <div class="matrix-row">
            <span class="matrix-label">DECIMAL — SIGNED (32-BIT)</span>
            <span class="matrix-val" id="rdx-dec-s32">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">DECIMAL — SIGNED (64-BIT BIGINT)</span>
            <span class="matrix-val" id="rdx-dec-s64">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">DECIMAL — UNSIGNED (32-BIT)</span>
            <span class="matrix-val highlight" id="rdx-dec-u32">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">HEX — UPPERCASE (0x)</span>
            <span class="matrix-val" id="rdx-hex-upper">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">HEX — LOWERCASE</span>
            <span class="matrix-val" id="rdx-hex-lower">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">HEX — ZERO-PADDED (8 DIGIT)</span>
            <span class="matrix-val warn" id="rdx-hex-pad">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">OCTAL (0o)</span>
            <span class="matrix-val" id="rdx-oct">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">BASE-<select id="rdx-custom-base" onchange="updateM6()" style="padding:1px 3px; font-size:10px;"></select> (CUSTOM N)</span>
            <span class="matrix-val" id="rdx-custom" style="word-break:break-all; max-width:55%; text-align:right;">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">ASCII / PRINTABLE CHARS</span>
            <span class="matrix-val" id="rdx-ascii" style="word-break:break-all;">--</span>
          </div>
        </div>

        <div class="checksum-row">
          <div class="checksum-header">
            <span class="alg">BINARY — 4-BIT NIBBLE FORMAT (32-BIT)</span>
            <span style="cursor:pointer;color:var(--accent-red)" onclick="m6CopyBin()">[COPY]</span>
          </div>
          <div id="rdx-bin" class="checksum-val" style="letter-spacing:1px;">--</div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span>[06B] BITWISE TACTICAL OPS & TWO'S COMPLEMENT</span>
        <span>32-BIT ALU</span>
      </div>
      <div class="panel-body">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:10px; color:var(--text-dim); letter-spacing:1px;">SECONDARY VALUE (OPERAND B)</label>
          <input type="text" id="radix-input-b" value="0x0F0F0F0F" placeholder="ENTER OPERAND B — 0x.. / 0b.. / 0o.. / RAW">
        </div>

        <div class="pulse-control-grid" style="padding:8px;">
          <div class="ctrl-group">
            <label>OPERAND B BASE</label>
            <select id="radix-base-b" onchange="updateM6()">
              <option value="16" selected>HEX (BASE 16)</option>
              <option value="10">DEC (BASE 10)</option>
              <option value="8">OCT (BASE 8)</option>
              <option value="2">BIN (BASE 2)</option>
              <option value="custom">CUSTOM (A-SLIDER)</option>
            </select>
          </div>
          <div class="ctrl-group">
            <label>SHIFT AMOUNT (N) <span class="val" id="val-radix-shift">4</span></label>
            <input type="range" id="radix-shift-n" min="0" max="31" value="4" oninput="updateM6()">
          </div>
        </div>

        <div class="matrix-field-table">
          <div class="matrix-row"><span class="matrix-label">A AND B</span><span class="matrix-val" id="bw-and">--</span></div>
          <div class="matrix-row"><span class="matrix-label">A OR B</span><span class="matrix-val" id="bw-or">--</span></div>
          <div class="matrix-row"><span class="matrix-label">A XOR B</span><span class="matrix-val" id="bw-xor">--</span></div>
          <div class="matrix-row"><span class="matrix-label">NOT A (~A, 32-BIT)</span><span class="matrix-val" id="bw-not">--</span></div>
          <div class="matrix-row"><span class="matrix-label">A &lt;&lt; N (LEFT SHIFT)</span><span class="matrix-val" id="bw-shl">--</span></div>
          <div class="matrix-row"><span class="matrix-label">A &gt;&gt; N (ARITH RIGHT)</span><span class="matrix-val" id="bw-shr">--</span></div>
          <div class="matrix-row"><span class="matrix-label">A &gt;&gt;&gt; N (LOGICAL RIGHT)</span><span class="matrix-val" id="bw-ushr">--</span></div>
        </div>

        <div class="panel-header" style="padding:4px 6px; font-size:10px;">
          <span>32-BIT TWO'S COMPLEMENT BREAKDOWN</span>
          <span style="color:var(--accent-amber)">SIGNED INT32</span>
        </div>
        <div class="matrix-field-table">
          <div class="matrix-row"><span class="matrix-label">SIGN BIT (BIT 31)</span><span class="matrix-val" id="tc-sign">--</span></div>
          <div class="matrix-row"><span class="matrix-label">MAGNITUDE</span><span class="matrix-val highlight" id="tc-mag">--</span></div>
          <div class="matrix-row"><span class="matrix-label">ONE'S COMPLEMENT (~A)</span><span class="matrix-val" id="tc-ones">--</span></div>
          <div class="matrix-row"><span class="matrix-label">TWO'S COMPLEMENT (-A)</span><span class="matrix-val" id="tc-twos">--</span></div>
        </div>

        <div class="checksum-row">
          <div class="checksum-header">
            <span class="alg">A — 32-BIT BINARY (4-BIT NIBBLES)</span>
            <span style="cursor:pointer;color:var(--accent-red)" onclick="m6CopyBin()">[COPY]</span>
          </div>
          <div id="tc-bin" class="checksum-val" style="letter-spacing:1px;">--</div>
        </div>

        <div class="btn-row">
          <button onclick="m6CopyHex()">COPY HEX</button>
          <button onclick="m6CopyBin()">COPY BIN</button>
          <button onclick="m6CopyDec()">COPY DEC</button>
          <button onclick="m6Swap()">SWAP OPERANDS</button>
          <button onclick="m6Clear()">CLEAR</button>
        </div>

        <div class="metrics-bar" style="margin-top:auto;">
          <div class="metric-cell"><span class="label">OPERAND A (HEX)</span><span class="val" id="m6-metric-a" style="color:var(--accent-cyan); font-size:11px;">--</span></div>
          <div class="metric-cell"><span class="label">OPERAND B (HEX)</span><span class="val" id="m6-metric-b" style="color:var(--accent-amber); font-size:11px;">--</span></div>
          <div class="metric-cell"><span class="label">SHIFT N</span><span class="val" id="m6-metric-n">4</span></div>
          <div class="metric-cell"><span class="label">ALU WIDTH</span><span class="val" style="color:var(--accent-green)">32-BIT</span></div>
        </div>
      </div>
    </div>
  </div>

  <footer>`;

if (html.includes(viewTarget)) {
  html = html.replace(viewTarget, viewReplacement);
} else {
  console.error("Could not find viewTarget");
}

// 3. switchModule replacement
const switchTarget = `    function switchModule(mod) {
      document.getElementById('module-1-view').style.display = (mod === 1) ? 'grid' : 'none';
      document.getElementById('module-2-view').style.display = (mod === 2) ? 'grid' : 'none';
      document.getElementById('module-3-view').style.display = (mod === 3) ? 'grid' : 'none';
      document.getElementById('module-4-view').style.display = (mod === 4) ? 'grid' : 'none';
      document.getElementById('module-5-view').style.display = (mod === 5) ? 'grid' : 'none';
      document.getElementById('tab-btn-m1').className = (mod === 1) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m2').className = (mod === 2) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m3').className = (mod === 3) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m4').className = (mod === 4) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m5').className = (mod === 5) ? 'nav-tab active' : 'nav-tab';
      if (mod === 3 && typeof resizeScope === 'function') resizeScope();
    }`;

const switchReplacement = `    function switchModule(mod) {
      document.getElementById('module-1-view').style.display = (mod === 1) ? 'grid' : 'none';
      document.getElementById('module-2-view').style.display = (mod === 2) ? 'grid' : 'none';
      document.getElementById('module-3-view').style.display = (mod === 3) ? 'grid' : 'none';
      document.getElementById('module-4-view').style.display = (mod === 4) ? 'grid' : 'none';
      document.getElementById('module-5-view').style.display = (mod === 5) ? 'grid' : 'none';
      document.getElementById('module-6-view').style.display = (mod === 6) ? 'grid' : 'none';
      document.getElementById('tab-btn-m1').className = (mod === 1) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m2').className = (mod === 2) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m3').className = (mod === 3) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m4').className = (mod === 4) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m5').className = (mod === 5) ? 'nav-tab active' : 'nav-tab';
      document.getElementById('tab-btn-m6').className = (mod === 6) ? 'nav-tab active' : 'nav-tab';
      if (mod === 3 && typeof resizeScope === 'function') resizeScope();
    }`;

if (html.includes(switchTarget)) {
  html = html.replace(switchTarget, switchReplacement);
} else {
  console.error("Could not find switchTarget");
}

// 4. JS module 6 logic and initialization
const initTarget = `    // Initializations
    generateTokens();
    updateM5();`;

const m6Logic = `    // --- MODULE 06: TACTICAL RADIX & BASE CONVERTER LOGIC ---
    const MASK32 = 0xFFFFFFFFn;
    const MASK64 = 0xFFFFFFFFFFFFFFFFn;

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

    // Populate custom OUTPUT base selector (2..36)
    (function initCustomBaseSelect() {
      for (let b = 2; b <= 36; b++) {
        const o = document.createElement('option');
        o.value = b; o.textContent = b;
        if (b === 36) o.selected = true;
        rdxCustomBase.appendChild(o);
      }
    })();

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

    function updateM6() {
      radixCustomBaseA.disabled = (radixBaseA.value !== 'custom');
      valRadixCustomBaseA.textContent = radixCustomBaseA.value;
      valRadixShift.textContent = radixShiftN.value;

      const A = parseByBase(radixInputA.value, m6ActiveBaseA());

      if (A === null) {
        m6StatusBadge.textContent = 'INVALID INPUT';
        m6StatusBadge.style.color = 'var(--accent-red)';
        ['rdx-dec-s32','rdx-dec-s64','rdx-dec-u32','rdx-hex-upper','rdx-hex-lower',
         'rdx-hex-pad','rdx-oct','rdx-custom','rdx-ascii','rdx-bin',
         'bw-and','bw-or','bw-xor','bw-not','bw-shl','bw-shr','bw-ushr',
         'tc-sign','tc-mag','tc-ones','tc-twos','tc-bin'].forEach(id => m6set(id, '--'));
        return;
      }
      m6StatusBadge.textContent = 'VALID VECTOR';
      m6StatusBadge.style.color = 'var(--accent-green)';

      // Radix breakdown (operand A)
      const u32 = A & MASK32;
      const s32 = u32 >= 0x80000000n ? u32 - 0x100000000n : u32;
      const u64 = A & MASK64;
      const s64 = u64 >= 0x8000000000000000n ? u64 - 0x10000000000000000n : u64;
      const cb = parseInt(rdxCustomBase.value, 10);

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
    }

    function onRadixBaseChange() { updateM6(); }

    function setRadixPreset(val) {
      radixInputA.value = val;
      const low = val.trim().toLowerCase().replace(/^[-+]/, '');
      if (low.startsWith('0x')) radixBaseA.value = '16';
      else if (low.startsWith('0b')) radixBaseA.value = '2';
      else if (low.startsWith('0o')) radixBaseA.value = '8';
      else radixBaseA.value = '10';
      updateM6();
    }

    function m6CopyHex() {
      const t = document.getElementById('rdx-hex-pad').textContent;
      if (t && t !== '--') navigator.clipboard.writeText('0x' + t);
    }
    function m6CopyBin() {
      const t = document.getElementById('rdx-bin').textContent;
      if (t && t !== '--') navigator.clipboard.writeText(t.replace(/ /g, ''));
    }
    function m6CopyDec() {
      const t = document.getElementById('rdx-dec-s32').textContent;
      if (t && t !== '--') navigator.clipboard.writeText(t);
    }
    function m6Swap() {
      const a = radixInputA.value, b = radixInputB.value;
      radixInputA.value = b; radixInputB.value = a;
      const ab = radixBaseA.value;
      radixBaseA.value = radixBaseB.value;
      radixBaseB.value = ab;
      updateM6();
    }
    function m6Clear() {
      radixInputA.value = '0';
      radixInputB.value = '0';
      radixShiftN.value = 0;
      updateM6();
    }

    radixInputA.addEventListener('input', updateM6);
    radixInputB.addEventListener('input', updateM6);

    // Initializations
    generateTokens();
    updateM5();
    updateM6();`;

if (html.includes(initTarget)) {
  html = html.replace(initTarget, m6Logic);
} else {
  console.error("Could not find initTarget");
}

fs.writeFileSync('Ambitions/demonic-tactical-apps/tactical-terminal/index.html', html, 'utf8');
console.log('Successfully written index.html with Module 06!');
