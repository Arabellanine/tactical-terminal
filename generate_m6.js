const fs = require('fs');

const basePath = 'Ambitions/demonic-tactical-apps/tactical-terminal/base_index.html';
let html = fs.readFileSync(basePath, 'utf8');

// 1. Add nav tab after tab-btn-m5
const m5Tab = '<div class="nav-tab" id="tab-btn-m5" onclick="switchModule(5)">[MOD 05] SUBNET &amp; BITMASK MATRIX</div>';
const m6Tab = '<div class="nav-tab" id="tab-btn-m5" onclick="switchModule(5)">[MOD 05] SUBNET &amp; BITMASK MATRIX</div>\n      <div class="nav-tab" id="tab-btn-m6" onclick="switchModule(6)">[MOD 06] RADIX &amp; BASE CONVERTER</div>';

if (!html.includes('id="tab-btn-m5"')) {
  console.error("Cannot find tab-btn-m5 in base_index.html");
  process.exit(1);
}

// In base_index.html, let's see how tab-btn-m5 looks
html = html.replace(/(<div class="nav-tab" id="tab-btn-m5"[^>]*>.*?<\/div>)/, '$1\n      <div class="nav-tab" id="tab-btn-m6" onclick="switchModule(6)">[MOD 06] RADIX &amp; BASE CONVERTER</div>');

// 2. Add Module 06 View before <footer>
const m6View = `
  <!-- MODULE 06: TACTICAL RADIX & BASE CONVERTER -->
  <div class="grid" id="module-6-view" style="display: none;">
    <div class="panel">
      <div class="panel-header">
        <span>[06A] MULTI-RADIX ARBITRARY BASE CONVERTER</span>
        <span id="m6-status-badge">BASE 10 ACTIVE</span>
      </div>
      <div class="panel-body">
        <div class="ctrl-group">
          <label>PRIMARY INPUT VALUE <span class="val" id="m6-input-len">0 CHARS</span></label>
          <input type="text" id="m6-input-val" value="255" placeholder="ENTER VALUE IN SELECTED BASE..." oninput="updateM6('input')">
        </div>

        <div class="ctrl-group" style="margin-top:6px;">
          <label>SOURCE INPUT RADIX / BASE <span class="val" id="m6-radix-label">BASE 10 (DECIMAL)</span></label>
          <div class="btn-row" style="margin-top:4px;">
            <button id="btn-radix-2" onclick="setM6SourceRadix(2)">BIN (2)</button>
            <button id="btn-radix-8" onclick="setM6SourceRadix(8)">OCT (8)</button>
            <button id="btn-radix-10" class="active" onclick="setM6SourceRadix(10)">DEC (10)</button>
            <button id="btn-radix-16" onclick="setM6SourceRadix(16)">HEX (16)</button>
            <button id="btn-radix-32" onclick="setM6SourceRadix(32)">BASE 32</button>
            <button id="btn-radix-36" onclick="setM6SourceRadix(36)">BASE 36</button>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <span style="font-size:10px; color:var(--text-dim);">CUSTOM RADIX (2-36):</span>
            <input type="range" id="m6-custom-radix" min="2" max="36" value="10" style="flex:1" oninput="setM6CustomRadix(this.value)">
            <span id="m6-custom-radix-val" style="font-size:11px; color:var(--accent-cyan); font-weight:bold; min-width:24px;">10</span>
          </div>
        </div>

        <div class="matrix-field-table" style="margin-top:8px;">
          <div class="matrix-row">
            <span class="matrix-label">DECIMAL (RADIX 10)</span>
            <span class="matrix-val highlight" id="m6-out-dec" style="cursor:pointer" onclick="copyM6Val('m6-out-dec')" title="Click to copy">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">HEXADECIMAL (RADIX 16)</span>
            <span class="matrix-val" id="m6-out-hex" style="cursor:pointer" onclick="copyM6Val('m6-out-hex')" title="Click to copy">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">OCTAL (RADIX 8)</span>
            <span class="matrix-val" id="m6-out-oct" style="cursor:pointer" onclick="copyM6Val('m6-out-oct')" title="Click to copy">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">BINARY (RADIX 2)</span>
            <span class="matrix-val" id="m6-out-bin" style="cursor:pointer" onclick="copyM6Val('m6-out-bin')" title="Click to copy">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">BASE 32 (RFC 4648 / TACTICAL)</span>
            <span class="matrix-val" id="m6-out-b32" style="cursor:pointer" onclick="copyM6Val('m6-out-b32')" title="Click to copy">--</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">BASE 36 (0-9, A-Z)</span>
            <span class="matrix-val" id="m6-out-b36" style="cursor:pointer" onclick="copyM6Val('m6-out-b36')" title="Click to copy">--</span>
          </div>
        </div>

        <div class="btn-row" style="margin-top:8px;">
          <button onclick="loadM6Preset(0)">LOAD 0</button>
          <button onclick="loadM6Preset(255)">LOAD 255 (0xFF)</button>
          <button onclick="loadM6Preset(65535)">LOAD 65535 (0xFFFF)</button>
          <button onclick="loadM6Preset(2147483647)">LOAD INT32_MAX</button>
          <button onclick="loadM6Preset(-1)">LOAD -1</button>
          <button onclick="clearM6()">PURGE</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span>[06B] 32-BIT TWO'S COMPLEMENT &amp; ALU BITWISE OPS</span>
        <span>TACTICAL ALU</span>
      </div>
      <div class="panel-body">
        <div class="matrix-field-table">
          <div class="matrix-row">
            <span class="matrix-label">INT32 (SIGNED 2'S COMPLEMENT)</span>
            <span class="matrix-val highlight" id="m6-int32-val">0</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">UINT32 (UNSIGNED 32-BIT)</span>
            <span class="matrix-val" id="m6-uint32-val">0</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">INT16 / UINT16</span>
            <span class="matrix-val" id="m6-int16-val">0 / 0</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">INT8 / UINT8 (BYTE)</span>
            <span class="matrix-val" id="m6-int8-val">0 / 0</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">POPCOUNT (ACTIVE BITS SET)</span>
            <span class="matrix-val warn" id="m6-popcount">0 BITS</span>
          </div>
          <div class="matrix-row">
            <span class="matrix-label">BYTE ORDER (ENDIAN SWAP 32)</span>
            <span class="matrix-val" id="m6-bswap">0x00000000</span>
          </div>
        </div>

        <div class="ctrl-group" style="margin-top:6px;">
          <label>TACTICAL BITWISE OPERATOR <span class="val" id="m6-op-label">BITWISE ALU</span></label>
          <div style="display:flex; gap:6px; margin-top:4px;">
            <select id="m6-alu-op" onchange="runM6Alu()" style="width:120px;">
              <option value="AND">AND (&amp;)</option>
              <option value="OR">OR (|)</option>
              <option value="XOR">XOR (^)</option>
              <option value="SHL">SHL (&lt;&lt;)</option>
              <option value="SHR">SHR (&gt;&gt;)</option>
              <option value="USHR">USHR (&gt;&gt;&gt;)</option>
              <option value="NOT">NOT (~)</option>
            </select>
            <input type="text" id="m6-alu-operand" value="15" placeholder="OPERAND (DEC/HEX)..." oninput="runM6Alu()" style="flex:1;">
          </div>
          <div class="matrix-field-table" style="margin-top:6px;">
            <div class="matrix-row">
              <span class="matrix-label">ALU RESULT (HEX)</span>
              <span class="matrix-val highlight" id="m6-alu-res-hex">--</span>
            </div>
            <div class="matrix-row">
              <span class="matrix-label">ALU RESULT (DEC)</span>
              <span class="matrix-val" id="m6-alu-res-dec">--</span>
            </div>
            <div class="matrix-row">
              <span class="matrix-label">ALU RESULT (BIN)</span>
              <span class="matrix-val" id="m6-alu-res-bin" style="word-break:break-all;">--</span>
            </div>
          </div>
        </div>

        <div class="bitmask-container" style="margin-top:auto;">
          <div style="font-size:10px; color:var(--text-dim); display:flex; justify-content:space-between;">
            <span>32-BIT WORD VISUALIZER</span>
            <span id="m6-bit-inspect-label">MSB [31] &lt;---&gt; LSB [0]</span>
          </div>
          <div id="m6-bit-cells" style="display:grid; grid-template-columns:repeat(16, 1fr); gap:2px; margin-top:4px;">
            <!-- 32 bits injected dynamically -->
          </div>
        </div>
      </div>
    </div>
  </div>
`;

html = html.replace('<footer>', m6View + '\n  <footer>');

// 3. Update switchModule logic to support module 6
// Find switchModule function and add module 6 handling
const scriptAddition = `
  // ================= MODULE 06: RADIX & BASE CONVERTER =================
  let m6SourceRadix = 10;

  function setM6SourceRadix(r) {
    m6SourceRadix = parseInt(r, 10);
    document.querySelectorAll('[id^="btn-radix-"]').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-radix-' + r);
    if (activeBtn) activeBtn.classList.add('active');
    document.getElementById('m6-custom-radix').value = m6SourceRadix;
    document.getElementById('m6-custom-radix-val').innerText = m6SourceRadix;
    document.getElementById('m6-radix-label').innerText = 'BASE ' + m6SourceRadix;
    document.getElementById('m6-status-badge').innerText = 'BASE ' + m6SourceRadix + ' ACTIVE';
    updateM6();
  }

  function setM6CustomRadix(val) {
    m6SourceRadix = parseInt(val, 10);
    document.querySelectorAll('[id^="btn-radix-"]').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-radix-' + val);
    if (activeBtn) activeBtn.classList.add('active');
    document.getElementById('m6-custom-radix-val').innerText = val;
    document.getElementById('m6-radix-label').innerText = 'CUSTOM BASE ' + val;
    document.getElementById('m6-status-badge').innerText = 'BASE ' + val + ' ACTIVE';
    updateM6();
  }

  function parseBigIntRadix(str, radix) {
    str = str.trim();
    if (!str) return 0n;
    let sign = 1n;
    if (str.startsWith('-')) {
      sign = -1n;
      str = str.slice(1);
    } else if (str.startsWith('+')) {
      str = str.slice(1);
    }
    if (radix === 16 && str.toLowerCase().startsWith('0x')) str = str.slice(2);
    if (radix === 2 && str.toLowerCase().startsWith('0b')) str = str.slice(2);
    if (radix === 8 && str.toLowerCase().startsWith('0o')) str = str.slice(2);
    if (!str) return 0n;

    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    const base = BigInt(radix);
    let result = 0n;
    for (let c of str.toLowerCase()) {
      const val = chars.indexOf(c);
      if (val === -1 || val >= radix) return null; // invalid
      result = result * base + BigInt(val);
    }
    return result * sign;
  }

  function updateM6() {
    const raw = document.getElementById('m6-input-val').value.trim();
    document.getElementById('m6-input-len').innerText = raw.length + ' CHARS';

    const parsed = parseBigIntRadix(raw, m6SourceRadix);
    if (parsed === null) {
      document.getElementById('m6-out-dec').innerText = 'SYNTAX ERROR (INVALID FOR BASE ' + m6SourceRadix + ')';
      document.getElementById('m6-out-hex').innerText = '--';
      document.getElementById('m6-out-oct').innerText = '--';
      document.getElementById('m6-out-bin').innerText = '--';
      document.getElementById('m6-out-b32').innerText = '--';
      document.getElementById('m6-out-b36').innerText = '--';
      return;
    }

    const n = parsed;
    // Arbitrary base conversions
    document.getElementById('m6-out-dec').innerText = n.toString(10);
    document.getElementById('m6-out-hex').innerText = (n >= 0n ? '0x' : '-0x') + (n >= 0n ? n : -n).toString(16).toUpperCase();
    document.getElementById('m6-out-oct').innerText = (n >= 0n ? '0o' : '-0o') + (n >= 0n ? n : -n).toString(8);
    document.getElementById('m6-out-bin').innerText = (n >= 0n ? '0b' : '-0b') + (n >= 0n ? n : -n).toString(2);
    document.getElementById('m6-out-b32').innerText = (n >= 0n ? '' : '-') + (n >= 0n ? n : -n).toString(32).toUpperCase();
    document.getElementById('m6-out-b36').innerText = (n >= 0n ? '' : '-') + (n >= 0n ? n : -n).toString(36).toUpperCase();

    // 32-bit views
    const i32 = Number(BigInt.asIntN(32, n));
    const u32 = Number(BigInt.asUintN(32, n));
    const i16 = (i32 << 16) >> 16;
    const u16 = u32 & 0xFFFF;
    const i8 = (i32 << 24) >> 24;
    const u8 = u32 & 0xFF;

    document.getElementById('m6-int32-val').innerText = i32.toLocaleString();
    document.getElementById('m6-uint32-val').innerText = u32.toLocaleString();
    document.getElementById('m6-int16-val').innerText = i16 + ' / ' + u16;
    document.getElementById('m6-int8-val').innerText = i8 + ' / ' + u8;

    // Popcount 32
    let pop = 0;
    for (let i = 0; i < 32; i++) {
      if ((u32 >>> i) & 1) pop++;
    }
    document.getElementById('m6-popcount').innerText = pop + ' OF 32 BITS (' + Math.round((pop/32)*100) + '%)';

    // Endian swap
    const b0 = (u32 >>> 24) & 0xFF;
    const b1 = (u32 >>> 16) & 0xFF;
    const b2 = (u32 >>> 8) & 0xFF;
    const b3 = u32 & 0xFF;
    const swapped = ((b3 << 24) | (b2 << 16) | (b1 << 8) | b0) >>> 0;
    document.getElementById('m6-bswap').innerText = '0x' + swapped.toString(16).padStart(8, '0').toUpperCase();

    // Render 32 bit grid
    renderM6Bits(u32);
    runM6Alu();
  }

  function renderM6Bits(u32) {
    const container = document.getElementById('m6-bit-cells');
    if (!container) return;
    let html = '';
    for (let i = 31; i >= 0; i--) {
      const bit = (u32 >>> i) & 1;
      const cls = bit ? 'bit-cell net-bit' : 'bit-cell';
      html += '<div class="' + cls + '" title="Bit ' + i + ' = ' + bit + '" style="cursor:pointer;" onclick="toggleM6Bit(' + i + ')">' + bit + '</div>';
    }
    container.innerHTML = html;
  }

  function toggleM6Bit(bitIdx) {
    const raw = document.getElementById('m6-input-val').value.trim();
    const parsed = parseBigIntRadix(raw, m6SourceRadix) || 0n;
    const u32 = BigInt.asUintN(32, parsed);
    const toggled = u32 ^ (1n << BigInt(bitIdx));
    document.getElementById('m6-input-val').value = toggled.toString(m6SourceRadix);
    updateM6();
  }

  function runM6Alu() {
    const rawA = document.getElementById('m6-input-val').value.trim();
    const valA = Number(BigInt.asIntN(32, parseBigIntRadix(rawA, m6SourceRadix) || 0n));
    const op = document.getElementById('m6-alu-op').value;
    const rawB = document.getElementById('m6-alu-operand').value.trim();
    let valB = 0;
    if (rawB.toLowerCase().startsWith('0x')) valB = parseInt(rawB.slice(2), 16) || 0;
    else if (rawB.toLowerCase().startsWith('0b')) valB = parseInt(rawB.slice(2), 2) || 0;
    else valB = parseInt(rawB, 10) || 0;

    let res = 0;
    if (op === 'AND') res = valA & valB;
    else if (op === 'OR') res = valA | valB;
    else if (op === 'XOR') res = valA ^ valB;
    else if (op === 'SHL') res = valA << (valB & 31);
    else if (op === 'SHR') res = valA >> (valB & 31);
    else if (op === 'USHR') res = (valA >>> (valB & 31));
    else if (op === 'NOT') res = ~valA;

    const ures = (res >>> 0);
    document.getElementById('m6-alu-res-hex').innerText = '0x' + ures.toString(16).toUpperCase().padStart(8, '0');
    document.getElementById('m6-alu-res-dec').innerText = res.toLocaleString() + ' (UINT: ' + ures.toLocaleString() + ')';
    document.getElementById('m6-alu-res-bin').innerText = ures.toString(2).padStart(32, '0');
  }

  function loadM6Preset(val) {
    document.getElementById('m6-input-val').value = val.toString(m6SourceRadix);
    updateM6();
  }

  function clearM6() {
    document.getElementById('m6-input-val').value = '0';
    updateM6();
  }

  function copyM6Val(id) {
    const text = document.getElementById(id).innerText;
    if (text && text !== '--') {
      navigator.clipboard.writeText(text);
    }
  }
`;

// Insert into script before </script>
html = html.replace('</script>', scriptAddition + '\n</script>');

// Also update switchModule definition to support module 6
// Replace switchModule function body or ensure views 1-6 are toggled
const switchModulePatch = `
  function switchModule(modId) {
    for (let i = 1; i <= 6; i++) {
      const tab = document.getElementById('tab-btn-m' + i);
      const view = document.getElementById('module-' + i + '-view');
      if (tab) {
        if (i === modId) tab.classList.add('active');
        else tab.classList.remove('active');
      }
      if (view) {
        view.style.display = (i === modId) ? 'grid' : 'none';
      }
    }
    if (modId === 6) updateM6();
  }
`;

// Replace existing switchModule in html
html = html.replace(/function switchModule\(modId\)\s*\{[\s\S]*?\n  \}/, switchModulePatch.trim());

fs.writeFileSync('Ambitions/demonic-tactical-apps/tactical-terminal/index.html', html, 'utf8');
console.log('Successfully generated index.html with Module 06, byte length:', html.length);
