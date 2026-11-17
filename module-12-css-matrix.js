/**
 * MODULE 12 // TACTICAL CSS & UNIT MATRIX CONVERTER
 * Pure vanilla ES6, zero runtime dependencies or external libraries.
 * Real-time bidirectional CSS unit matrix, fluid clamp calculator,
 * color space converter, WCAG contrast analyzer, and tactical box-shadow builder.
 */

function initModule12() {
  const rootBaseInput = document.getElementById('css-root-base');
  const vpWidthInput = document.getElementById('css-vp-width');
  const vpHeightInput = document.getElementById('css-vp-height');

  const unitInputs = {
    px: document.getElementById('u-px'),
    rem: document.getElementById('u-rem'),
    vw: document.getElementById('u-vw'),
    vh: document.getElementById('u-vh'),
    pt: document.getElementById('u-pt'),
    pct: document.getElementById('u-pct'),
    ch: document.getElementById('u-ch'),
    cm: document.getElementById('u-cm')
  };

  if (!unitInputs.px) return;

  let activeSource = 'px';
  let isUpdatingUnits = false;

  function getBaseParams() {
    const base = parseFloat(rootBaseInput.value) || 16;
    const vpw = parseFloat(vpWidthInput.value) || 1920;
    const vph = parseFloat(vpHeightInput.value) || 1080;
    return { base, vpw, vph };
  }

  function updateUnitsFromPx(pxVal) {
    if (isUpdatingUnits) return;
    isUpdatingUnits = true;
    const { base, vpw, vph } = getBaseParams();

    const rem = pxVal / base;
    const vw = (pxVal / vpw) * 100;
    const vh = (pxVal / vph) * 100;
    const pt = pxVal * 0.75;
    const pct = (pxVal / base) * 100;
    const ch = pxVal / (base * 0.5);
    const cm = (pxVal / 96) * 2.54;

    function formatVal(n) {
      if (isNaN(n) || !isFinite(n)) return '';
      const rounded = Math.round(n * 10000) / 10000;
      return rounded.toString();
    }

    if (activeSource !== 'px') unitInputs.px.value = formatVal(pxVal);
    if (activeSource !== 'rem') unitInputs.rem.value = formatVal(rem);
    if (activeSource !== 'vw') unitInputs.vw.value = formatVal(vw);
    if (activeSource !== 'vh') unitInputs.vh.value = formatVal(vh);
    if (activeSource !== 'pt') unitInputs.pt.value = formatVal(pt);
    if (activeSource !== 'pct') unitInputs.pct.value = formatVal(pct);
    if (activeSource !== 'ch') unitInputs.ch.value = formatVal(ch);
    if (activeSource !== 'cm') unitInputs.cm.value = formatVal(cm);

    isUpdatingUnits = false;
  }

  function handleUnitChange(sourceKey) {
    activeSource = sourceKey;
    const val = parseFloat(unitInputs[sourceKey].value);
    if (isNaN(val)) return;

    const { base, vpw, vph } = getBaseParams();
    let px = 0;

    switch (sourceKey) {
      case 'px': px = val; break;
      case 'rem': px = val * base; break;
      case 'vw': px = (val / 100) * vpw; break;
      case 'vh': px = (val / 100) * vph; break;
      case 'pt': px = val / 0.75; break;
      case 'pct': px = (val / 100) * base; break;
      case 'ch': px = val * (base * 0.5); break;
      case 'cm': px = (val / 2.54) * 96; break;
    }

    updateUnitsFromPx(px);
  }

  Object.keys(unitInputs).forEach(key => {
    unitInputs[key].addEventListener('input', () => handleUnitChange(key));
  });

  [rootBaseInput, vpWidthInput, vpHeightInput].forEach(inp => {
    inp.addEventListener('input', () => {
      const pxVal = parseFloat(unitInputs.px.value) || 24;
      activeSource = 'px';
      updateUnitsFromPx(pxVal);
      computeFluidClamp();
    });
  });

  window.setVpWidthM12 = function(w) {
    vpWidthInput.value = w;
    const pxVal = parseFloat(unitInputs.px.value) || 24;
    activeSource = 'px';
    updateUnitsFromPx(pxVal);
    computeFluidClamp();
  };

  // FLUID CLAMP
  const minVpInput = document.getElementById('clamp-min-vp');
  const maxVpInput = document.getElementById('clamp-max-vp');
  const minSzInput = document.getElementById('clamp-min-sz');
  const maxSzInput = document.getElementById('clamp-max-sz');
  const clampOut = document.getElementById('clamp-out');
  const clampMetaOut = document.getElementById('clamp-meta-out');

  function computeFluidClamp() {
    const minVp = parseFloat(minVpInput.value) || 390;
    const maxVp = parseFloat(maxVpInput.value) || 1440;
    const minSz = parseFloat(minSzInput.value) || 14;
    const maxSz = parseFloat(maxSzInput.value) || 24;
    const { base } = getBaseParams();

    if (maxVp === minVp) {
      clampOut.textContent = `font-size: ${(minSz / base).toFixed(4)}rem;`;
      return;
    }

    const slope = (maxSz - minSz) / (maxVp - minVp);
    const yInterceptPx = -minVp * slope + minSz;
    const slopeVw = (slope * 100).toFixed(4);
    const yInterceptRem = (yInterceptPx / base).toFixed(4);

    const minRem = (minSz / base).toFixed(4);
    const maxRem = (maxSz / base).toFixed(4);

    const sign = yInterceptPx >= 0 ? '+' : '-';
    const absInterceptRem = Math.abs(parseFloat(yInterceptRem)).toFixed(4);

    const clampStr = `font-size: clamp(${minRem}rem, ${slopeVw}vw ${sign} ${absInterceptRem}rem, ${maxRem}rem);`;
    clampOut.textContent = clampStr;

    clampMetaOut.textContent = `Slope: ${(slope * 100).toFixed(4)}% | Y-Intercept: ${yInterceptPx.toFixed(2)}px | Scale: ${minSz}px @ ${minVp}px \u2192 ${maxSz}px @ ${maxVp}px`;
  }

  [minVpInput, maxVpInput, minSzInput, maxSzInput].forEach(inp => {
    inp.addEventListener('input', computeFluidClamp);
  });

  window.copyClampM12 = function() {
    navigator.clipboard.writeText(clampOut.textContent.trim());
    const badge = document.getElementById('m12-status-badge');
    if (badge) {
      badge.textContent = 'CLAMP COPIED';
      setTimeout(() => { badge.textContent = 'SYSTEM ACTIVE'; }, 1500);
    }
  };

  // COLOR CONVERTER & CONTRAST
  const colorTextInput = document.getElementById('color-text-in');
  const colorPickerInput = document.getElementById('color-picker-in');
  const colorAlphaInput = document.getElementById('color-alpha-in');
  const colorAlphaVal = document.getElementById('color-alpha-val');
  const colOutHex = document.getElementById('col-out-hex');
  const colOutHex8 = document.getElementById('col-out-hex8');
  const colOutRgba = document.getElementById('col-out-rgba');
  const colOutHsla = document.getElementById('col-out-hsla');
  const colPreviewBox = document.getElementById('col-preview-box');
  const colContrastRatio = document.getElementById('col-contrast-ratio');
  const colContrastBadge = document.getElementById('col-contrast-badge');

  function parseColor(input) {
    const d = document.createElement('div');
    d.style.color = 'rgb(0, 0, 0)';
    d.style.color = input;
    if (d.style.color === '') return null;
    document.body.appendChild(d);
    const cs = window.getComputedStyle(d).color;
    document.body.removeChild(d);

    const m = cs.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    return {
      r: parseInt(m[1], 10),
      g: parseInt(m[2], 10),
      b: parseInt(m[3], 10),
      a: m[4] !== undefined ? parseFloat(m[4]) : 1.0
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function updateColorMatrix(parsed, alphaOverride = null) {
    if (!parsed) return;
    const alpha = alphaOverride !== null ? alphaOverride : parsed.a;
    colorAlphaVal.textContent = alpha.toFixed(2);
    colorAlphaInput.value = alpha;

    const hexR = parsed.r.toString(16).padStart(2, '0').toUpperCase();
    const hexG = parsed.g.toString(16).padStart(2, '0').toUpperCase();
    const hexB = parsed.b.toString(16).padStart(2, '0').toUpperCase();
    const hexA = Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase();

    const hex6 = `#${hexR}${hexG}${hexB}`;
    const hex8 = `#${hexR}${hexG}${hexB}${hexA}`;
    const rgbaStr = `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha.toFixed(2)})`;
    const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
    const hslaStr = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha.toFixed(2)})`;

    colOutHex.textContent = hex6;
    colOutHex8.textContent = hex8;
    colOutRgba.textContent = rgbaStr;
    colOutHsla.textContent = hslaStr;

    colorPickerInput.value = hex6;
    colPreviewBox.style.backgroundColor = rgbaStr;
    colPreviewBox.style.color = hsl.l > 55 ? '#000000' : '#FFFFFF';

    // Contrast against background #090A0F (Luminance approx 0.00388)
    const bgLum = getLuminance(9, 10, 15);
    const fgLum = getLuminance(parsed.r, parsed.g, parsed.b);
    const lum1 = Math.max(bgLum, fgLum);
    const lum2 = Math.min(bgLum, fgLum);
    const ratio = (lum1 + 0.05) / (lum2 + 0.05);

    colContrastRatio.textContent = `${ratio.toFixed(2)}:1`;
    if (ratio >= 7.0) {
      colContrastBadge.textContent = 'PASS AAA';
      colContrastBadge.style.color = 'var(--accent-green)';
    } else if (ratio >= 4.5) {
      colContrastBadge.textContent = 'PASS AA';
      colContrastBadge.style.color = 'var(--accent-green)';
    } else if (ratio >= 3.0) {
      colContrastBadge.textContent = 'PASS LARGE AA';
      colContrastBadge.style.color = 'var(--accent-amber)';
    } else {
      colContrastBadge.textContent = 'FAIL WCAG';
      colContrastBadge.style.color = 'var(--accent-red)';
    }
  }

  colorTextInput.addEventListener('input', () => {
    const parsed = parseColor(colorTextInput.value.trim());
    if (parsed) updateColorMatrix(parsed);
  });

  colorPickerInput.addEventListener('input', () => {
    colorTextInput.value = colorPickerInput.value;
    const parsed = parseColor(colorPickerInput.value);
    const alpha = parseFloat(colorAlphaInput.value) || 1.0;
    if (parsed) updateColorMatrix(parsed, alpha);
  });

  colorAlphaInput.addEventListener('input', () => {
    const alpha = parseFloat(colorAlphaInput.value);
    const parsed = parseColor(colorTextInput.value.trim());
    if (parsed) updateColorMatrix(parsed, alpha);
  });

  // TACTICAL SHADOW BUILDER
  const shX = document.getElementById('sh-x');
  const shY = document.getElementById('sh-y');
  const shBlur = document.getElementById('sh-blur');
  const shSpread = document.getElementById('sh-spread');
  const shColor = document.getElementById('sh-color');
  const shInset = document.getElementById('sh-inset');
  const shPreviewTarget = document.getElementById('sh-preview-target');
  const shCssOut = document.getElementById('sh-css-out');

  function updateShadow() {
    const x = parseInt(shX.value, 10) || 0;
    const y = parseInt(shY.value, 10) || 0;
    const blur = parseInt(shBlur.value, 10) || 0;
    const spread = parseInt(shSpread.value, 10) || 0;
    const col = shColor.value.trim() || 'rgba(255,51,68,0.7)';
    const insetStr = shInset.checked ? 'inset ' : '';

    const shadowVal = `${insetStr}${x}px ${y}px ${blur}px ${spread}px ${col}`;
    shPreviewTarget.style.boxShadow = shadowVal;
    shCssOut.textContent = `box-shadow: ${shadowVal};`;
  }

  [shX, shY, shBlur, shSpread, shColor, shInset].forEach(inp => {
    inp.addEventListener('input', updateShadow);
    inp.addEventListener('change', updateShadow);
  });

  window.loadShadowPresetM12 = function(type) {
    if (type === 'mecha') {
      shX.value = 0; shY.value = 0; shBlur.value = 16; shSpread.value = 2;
      shColor.value = 'rgba(255, 51, 68, 0.75)'; shInset.checked = false;
    } else if (type === 'brutalist') {
      shX.value = 5; shY.value = 5; shBlur.value = 0; shSpread.value = 0;
      shColor.value = '#FF3344'; shInset.checked = false;
    } else if (type === 'hud') {
      shX.value = 0; shY.value = 0; shBlur.value = 10; shSpread.value = 2;
      shColor.value = 'rgba(0, 255, 136, 0.4)'; shInset.checked = true;
    } else if (type === 'dark') {
      shX.value = 0; shY.value = 8; shBlur.value = 24; shSpread.value = 0;
      shColor.value = 'rgba(0, 0, 0, 0.85)'; shInset.checked = false;
    }
    updateShadow();
  };

  // Initial runs
  updateUnitsFromPx(24);
  computeFluidClamp();
  const initParsed = parseColor(colorTextInput.value.trim());
  if (initParsed) updateColorMatrix(initParsed);
  updateShadow();
}
