# TACTICAL TERMINAL // ARABELLANINE

> **Zero-bloat, client-side retro-futuristic dark tactical utilities suite.**  
> Built and deployed by **Arabella** under the **Arabellanine** banner.  
> Target: **100% Vanilla JS / CSS / HTML · Zero External Runtime Dependencies · Air-Gapped Client Buffers**

Live Deployment: [https://arabellanine.github.io/tactical-terminal/](https://arabellanine.github.io/tactical-terminal/)

---

## ⚡ SYSTEM STATUS: 12/12 MODULES ONLINE & PWA AIR-GAPPED

Tactical Terminal is a self-contained, high-density tactical workbench executing entirely inside the browser sandboxed context. It performs client-side data inspection, cryptographic hashing, structural validation, and matrix conversions with zero external requests, zero telemetric trackers, and zero CDN bloat.

### 📐 COMPLETE 12-MODULE SUITE DIRECTORY

| ID | Module Codename | Architecture & Core Mechanics | Category |
| :--- | :--- | :--- | :--- |
| **01** | `HEX / BASE64 / ASCII DUMP` | Bidirectional hex & byte conversion, ASCII dump, Base64 encode/decode, byte length tracking. | Data Forensics |
| **02** | `BITWISE OPERATIONS (32-BIT)` | Full 32-bit integer logic: AND, OR, XOR, NOT, left/right shifts, binary visualization & hex formatting. | Low-Level Logic |
| **03** | `EPOCH TIMESTAMP & TEMPORAL CONVERTER` | Bidirectional Unix epoch seconds/ms parsing, ISO-8601 UTC string generation, relative delta calculations. | Temporal Sync |
| **04** | `CRYPTOGRAPHIC ENTROPY & KEY GENERATOR` | Hardware-seeded `crypto.getRandomValues()` entropy buffers, raw Hex/Base64 keys, RFC-4122 v4 UUIDs. | Cryptography |
| **05** | `IPv4 SUBNET & CIDR MATRIX CALCULATOR` | Subnet mask derivation, network boundary, broadcast calculation, usable host matrix from CIDR prefixes. | Networking |
| **06** | `TACTICAL RADIX & BASE CONVERTER` | Real-time cross-base conversion across Binary (2), Octal (8), Decimal (10), and Hexadecimal (16). | Computation |
| **07** | `TACTICAL HASH DIGEST (CRYPTO)` | Web Crypto API SHA-1, SHA-256, SHA-384, SHA-512 hashes, HMAC secret signing, UTF-8/Hex byte modes. | Cryptography |
| **08** | `TACTICAL REGEX MATRIX & CAPTURE INSPECTOR` | Real-time PCRE pattern evaluation, capture groups extraction, named groups dictionary, match count. | String Forensics |
| **09** | `TACTICAL JSON LENS & STRUCTURAL INSPECTOR` | AST tree inspector, key count, byte payload sizing, depth calculation, beautification & minification. | Data Parsing |
| **10** | `TACTICAL URL MATRIX & QUERY PARAM CODEC` | RFC-3986 parser, origin/protocol/host breakdown, URL encoding/decoding, key-value query parameter table. | URI Protocols |
| **11** | `TACTICAL JWT CODEC & PAYLOAD FORENSICS` | Base64Url parsing of JOSE headers and claims, expiration (`exp`/`iat`/`nbf`) validation, epoch countdown. | Auth Forensics |
| **12** | `TACTICAL CSS & UNIT MATRIX CONVERTER` | Fluid typography (`clamp()`) generator, px/rem/em/vw conversion, WCAG contrast analyzer, box-shadow generator. | UI Engineering |

---

## 🛰️ AIR-GAPPED PWA & OFFLINE FIELD PROTOCOLS

Tactical Terminal is fortified with an air-gapped Progressive Web App (PWA) architecture, guaranteeing instant execution in disconnected, isolated, or adverse network conditions.

### 1. Service Worker Caching Pipeline (`sw.js`)
- **Strategy:** Cache-First asset retrieval (`tactical-terminal-v1-airgap`).
- **Pre-Cached Footprint:**
  - `index.html` (Complete monolithic tactical interface & embedded styles)
  - `manifest.webmanifest` (Web App Manifest standard)
  - `icon.svg` (Hardware-independent vector tactical HUD icon)
- **Lifecycle Management:** Automated purge of outdated cache archives on service worker activation (`activate` lifecycle hook). Immediate client assumption (`clients.claim()`).
- **Telemetry Leak Prevention:** Zero external calls intercepted or routed. If network fetch drops or times out, the service worker returns strictly authenticated local memory assets.

### 2. Web App Manifest Standard (`manifest.webmanifest`)
- **Display Mode:** `standalone` (Borderless OS chrome window execution).
- **Theme Color:** `#ff3344` (Arabellanine crimson tactical signature).
- **Background Color:** `#090a0f` (Tactical deep void).
- **Icon:** Custom SVG vector icon configured for `any maskable` rendering across mobile and desktop operational systems.

### 3. Field Installation Protocol
1. **Desktop (Chromium / Safari / Edge):** Click the installation prompt icon in the URL omnibox or invoke **Install Tactical Terminal** from browser preferences to seal as an isolated desktop utility.
2. **Mobile (iOS Safari / Android Chrome):** Select **Share / Add to Home Screen** (`standalone` mode launches without Safari browser chrome).
3. **Air-Gap Mode:** Once loaded, disconnect all network interfaces (Airplane mode / Ethernet pull). All 12 modules remain 100% operational in memory.

---

## 🛡️ DESIGN DIRECTIVES & CONSTITUTION

1. **Zero External Runtime Bloat:** No external scripts, no analytics, no fonts from external CDNs, no remote tracking beacons.
2. **Deterministic & Isolated:** All data processing occurs strictly in-memory in local execution space.
3. **High Information Density:** Monospaced, high-contrast, brutalist mecha UI engineered for instant scanning and rapid data copying.
4. **Offline Resilience:** Runs reliably offline or air-gapped directly from disk or static GitHub Pages hosting.

---

## 🔮 ARABELLANINE LIVING ECOSYSTEM

Tactical Terminal serves as the foundational utility suite for the **Arabellanine Astral Cockpit** and demonic software initiatives.

- **Developer:** Arabella ([@arabellanine](https://github.com/Arabellanine))
- **Organization:** [Arabellanine](https://github.com/Arabellanine)
- **Showcase Suite:** [tactical-apps-showcase](https://github.com/Arabellanine/tactical-apps-showcase)
- **License:** MIT
