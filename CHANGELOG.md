# CHANGELOG

<!-- version list -->

## v2.42.0-beta.1 (2026-10-27)

### Bug Fixes

- Align main and init-server test mocks with credential-state API
  ([#1302](https://github.com/n24q02m/notion/pull/1302),
  [`39b2627`](https://github.com/n24q02m/notion/commit/39b2627c3e9a70b78f6b7c0af09ab19a1f268c72))

- Align registry and plugin metadata with renamed identity
  ([#1300](https://github.com/n24q02m/notion/pull/1300),
  [`a0cd5aa`](https://github.com/n24q02m/notion/commit/a0cd5aa5d78cd4fd40f747ac3fdffa7ad761a06c))

- Derive config state from the calling user's token
  ([#1302](https://github.com/n24q02m/notion/pull/1302),
  [`39b2627`](https://github.com/n24q02m/notion/commit/39b2627c3e9a70b78f6b7c0af09ab19a1f268c72))

- Format repo settings, drop stale archive banner and add skret config
  ([#1297](https://github.com/n24q02m/notion/pull/1297),
  [`510dbee`](https://github.com/n24q02m/notion/commit/510dbee8b8c703801390e89e0b68a4e78a462be4))

- Point homepage at docs.n24q02m.com/servers/notion/
  ([#1301](https://github.com/n24q02m/notion/pull/1301),
  [`6f87719`](https://github.com/n24q02m/notion/commit/6f8771913eb846b7efdebd1e9d903facf77ca544))

- Refuse removed relay subcommand with pointer to notion auth
  ([#1302](https://github.com/n24q02m/notion/pull/1302),
  [`39b2627`](https://github.com/n24q02m/notion/commit/39b2627c3e9a70b78f6b7c0af09ab19a1f268c72))

### Chores

- Bump mcp-core to 1.24.3 (backlog disposition pre-archive, user 2026-09-13)
  ([`ecc4409`](https://github.com/n24q02m/notion/commit/ecc44091b5635f300968461eb182b83dbdfb5495))

### Documentation

- Add mode badge, install matrix, CD-managed deployment note
  ([#1294](https://github.com/n24q02m/notion/pull/1294),
  [`637eb5d`](https://github.com/n24q02m/notion/commit/637eb5df93e945e763b63cdb22aab2d4dbe105fd))

- Align mode badge with fleet standard (label 'mode', color 5C6BC0)
  ([`72d65a6`](https://github.com/n24q02m/notion/commit/72d65a6a69c1059b91f98068bf244570fc447ec4))

- Archival notice — repo no longer maintained (2026-09-13)
  ([#1296](https://github.com/n24q02m/notion/pull/1296),
  [`ff7c08c`](https://github.com/n24q02m/notion/commit/ff7c08c646b095b3aa20bd763aabf887c02e5312))

### Features

- Make cd dispatch-only, add renovate minimum release age and repo settings contract
  ([#1297](https://github.com/n24q02m/notion/pull/1297),
  [`510dbee`](https://github.com/n24q02m/notion/commit/510dbee8b8c703801390e89e0b68a4e78a462be4))

- Remove cloudflare worker hosting surface ([#1299](https://github.com/n24q02m/notion/pull/1299),
  [`82cf6fc`](https://github.com/n24q02m/notion/commit/82cf6fc26fb17a329eafa5fbdab6c6e4679f7409))

- Rename identity to notion (npm @n24q02m/notion, image n24q02m/notion)
  ([#1298](https://github.com/n24q02m/notion/pull/1298),
  [`09ef615`](https://github.com/n24q02m/notion/commit/09ef615e8cbcb483efe060dd5dd7f97c1ae2af2a))

- Switch to hull 0.4 and drop relay credential flows
  ([#1302](https://github.com/n24q02m/notion/pull/1302),
  [`39b2627`](https://github.com/n24q02m/notion/commit/39b2627c3e9a70b78f6b7c0af09ab19a1f268c72))


## v2.41.6 (2026-09-13)

### Bug Fixes

- Bump mcp-core to 1.24.1 ([#1288](https://github.com/n24q02m/better-notion-mcp/pull/1288),
  [`d9fb801`](https://github.com/n24q02m/better-notion-mcp/commit/d9fb801711c2de02abb773ecd9ce9fd0fd14035c))


## v2.41.5 (2026-09-12)

### Bug Fixes

- **deps**: Update bun to v1.4.2 ([#1290](https://github.com/n24q02m/better-notion-mcp/pull/1290),
  [`3bc8bb1`](https://github.com/n24q02m/better-notion-mcp/commit/3bc8bb14b2c51ff0479fd031762cdec5f5e8ee54))

### Chores

- **release**: Fix stale two-branch comment (single-main lane)
  ([`d24dd8d`](https://github.com/n24q02m/better-notion-mcp/commit/d24dd8dfb506855eacea842312871cd3549350ec))

- **release**: Single-main release lane (staging branch retired)
  ([`6b42d19`](https://github.com/n24q02m/better-notion-mcp/commit/6b42d1910499f962f43cc33d27bbc5213a434e9c))


## v2.41.4 (2026-09-12)

### Bug Fixes

- **deps**: Update @n24q02m/mcp-core to v1.24.0
  ([#1286](https://github.com/n24q02m/better-notion-mcp/pull/1286),
  [`3bcbfe0`](https://github.com/n24q02m/better-notion-mcp/commit/3bcbfe0a556b3b3d4708c3afb3fa3aaa2a0ffce4))


## v2.41.3 (2026-09-12)

### Bug Fixes

- **deps**: Update @cloudflare/workers-types to ^5.20260905.1
  ([#1285](https://github.com/n24q02m/better-notion-mcp/pull/1285),
  [`90f8ac7`](https://github.com/n24q02m/better-notion-mcp/commit/90f8ac7bf85100e641d325a6633afbce97b5fbc4))

### Chores

- **rulesets**: Align IaC with repo-bootstrap template
  ([`2622ad7`](https://github.com/n24q02m/better-notion-mcp/commit/2622ad7460e6e4a4020b582bace83fdcb264768d))

- **rulesets**: Align IaC with repo-bootstrap template
  ([`a9f2f34`](https://github.com/n24q02m/better-notion-mcp/commit/a9f2f34abfe240d031e9fd9c363a617e7cfaca9a))


## v2.41.2 (2026-09-11)

### Bug Fixes

- **deps**: Update patch dependencies
  ([#1284](https://github.com/n24q02m/better-notion-mcp/pull/1284),
  [`4cecf43`](https://github.com/n24q02m/better-notion-mcp/commit/4cecf4389015ef0ccfbf76603e39c0e2184f768a))


## v2.41.1 (2026-09-11)

### Bug Fixes

- Pin better-semantic-release action to v1.6.1
  ([#1282](https://github.com/n24q02m/better-notion-mcp/pull/1282),
  [`35054b7`](https://github.com/n24q02m/better-notion-mcp/commit/35054b75018778d47bd7c34d01ae5fa0081fdcb8))


## v2.41.0 (2026-09-11)

### Bug Fixes

- Bump mcp-core to 1.23.2 ([#1254](https://github.com/n24q02m/better-notion-mcp/pull/1254),
  [`248e13d`](https://github.com/n24q02m/better-notion-mcp/commit/248e13dc4a01e339e1a8e38747b139bc29160f24))

- 🛡️ Sentinel: [MEDIUM] Fix false-positive KV prefix check in path traversal prevention
  ([#1270](https://github.com/n24q02m/better-notion-mcp/pull/1270),
  [`941b37e`](https://github.com/n24q02m/better-notion-mcp/commit/941b37e00beab6f5317e45fc2a3ce37d2a019564))

- **deps**: Lock file maintenance ([#1258](https://github.com/n24q02m/better-notion-mcp/pull/1258),
  [`5f4f346`](https://github.com/n24q02m/better-notion-mcp/commit/5f4f346193a901513cdb7b8288e5d5100995b449))

- **deps**: Lock file maintenance ([#1256](https://github.com/n24q02m/better-notion-mcp/pull/1256),
  [`b24b129`](https://github.com/n24q02m/better-notion-mcp/commit/b24b129792a5c0d3d7bf6a4e0e51507339f23378))

- **deps**: Update @biomejs/biome to ^2.5.11
  ([#1264](https://github.com/n24q02m/better-notion-mcp/pull/1264),
  [`1eb5c9a`](https://github.com/n24q02m/better-notion-mcp/commit/1eb5c9acb507c3993a88c7b0a29c543e1eac3894))

- **deps**: Update @cloudflare/workers-types to ^5.20260829.1
  ([#1265](https://github.com/n24q02m/better-notion-mcp/pull/1265),
  [`4a2fb66`](https://github.com/n24q02m/better-notion-mcp/commit/4a2fb6630b969cb465d861a5c436254674f33548))

- **deps**: Update @cloudflare/workers-types to ^5.20260831.1
  ([#1272](https://github.com/n24q02m/better-notion-mcp/pull/1272),
  [`af2e5e0`](https://github.com/n24q02m/better-notion-mcp/commit/af2e5e00fc0084d85c7a4a34831866590adc7bb6))

- **deps**: Update @cloudflare/workers-types to ^5.20260901.1
  ([#1277](https://github.com/n24q02m/better-notion-mcp/pull/1277),
  [`28cd37e`](https://github.com/n24q02m/better-notion-mcp/commit/28cd37e1703f81d48831137e71d411e9061f76d7))

- **deps**: Update @cloudflare/workers-types to ^5.20260902.1
  ([#1279](https://github.com/n24q02m/better-notion-mcp/pull/1279),
  [`2e50982`](https://github.com/n24q02m/better-notion-mcp/commit/2e509827a9af2a3a67f041e070edb2b1303d30e0))

- **deps**: Update minor dependencies
  ([#1280](https://github.com/n24q02m/better-notion-mcp/pull/1280),
  [`fae7135`](https://github.com/n24q02m/better-notion-mcp/commit/fae71356c675717a116aed170049429463f6bd50))

- **deps**: Update n24q02m/better-semantic-release action to v1.6.0
  ([#1262](https://github.com/n24q02m/better-notion-mcp/pull/1262),
  [`b63556d`](https://github.com/n24q02m/better-notion-mcp/commit/b63556d2395f0e548d25fbc227ece63695170f65))

- **deps**: Update non-major dev dependencies
  ([#1257](https://github.com/n24q02m/better-notion-mcp/pull/1257),
  [`15cbf7d`](https://github.com/n24q02m/better-notion-mcp/commit/15cbf7dad33d7802fcdebf91014ccc2f2548925e))

- **deps**: Update non-major dev dependencies
  ([#1255](https://github.com/n24q02m/better-notion-mcp/pull/1255),
  [`847112d`](https://github.com/n24q02m/better-notion-mcp/commit/847112d85fe0cb7c1be96cb3e102aff0a9ee4fce))

- **deps**: Update oven/bun:1-alpine Docker digest to d888c0a
  ([#1263](https://github.com/n24q02m/better-notion-mcp/pull/1263),
  [`567f668`](https://github.com/n24q02m/better-notion-mcp/commit/567f668fb36be4c587c4e5b9e6b162ccf7139825))

- **deps**: Update patch dependencies
  ([#1276](https://github.com/n24q02m/better-notion-mcp/pull/1276),
  [`b7778fd`](https://github.com/n24q02m/better-notion-mcp/commit/b7778fdd5513eb6936b2bc4a3cda8bbe56f0a791))

- **deps**: Update python-semantic-release/publish-action action to v10.6.2
  ([#1267](https://github.com/n24q02m/better-notion-mcp/pull/1267),
  [`7f459c4`](https://github.com/n24q02m/better-notion-mcp/commit/7f459c4cf48e3aea47e3b13953de973da830da15))

- **deps**: Update tsx to ^4.23.13 ([#1271](https://github.com/n24q02m/better-notion-mcp/pull/1271),
  [`5c57b5e`](https://github.com/n24q02m/better-notion-mcp/commit/5c57b5ed888c8f986cfb469a1698b4d09dab6326))

- **deps**: Update vitest monorepo to v5
  ([#1268](https://github.com/n24q02m/better-notion-mcp/pull/1268),
  [`401682c`](https://github.com/n24q02m/better-notion-mcp/commit/401682c47f1fb147b897db2a5d51a12840eea868))

- **notion**: Satisfy import ordering
  ([#1275](https://github.com/n24q02m/better-notion-mcp/pull/1275),
  [`fc5a18b`](https://github.com/n24q02m/better-notion-mcp/commit/fc5a18b38ae5f543974703027cb26efd49e069ba))

### Continuous Integration

- Fix duplicate env key in ladder wiring
  ([`7f56641`](https://github.com/n24q02m/better-notion-mcp/commit/7f56641845c360562207300728e2563bb9a3a324))

- Wire unified merge=release ladder (push staging=beta, main=stable)
  ([`d2f29f6`](https://github.com/n24q02m/better-notion-mcp/commit/d2f29f6bb2d8c7ed6b158e0c01c0f15a280d0efb))

### Features

- **notion**: Bound page content reads
  ([#1275](https://github.com/n24q02m/better-notion-mcp/pull/1275),
  [`fc5a18b`](https://github.com/n24q02m/better-notion-mcp/commit/fc5a18b38ae5f543974703027cb26efd49e069ba))


## Unreleased

### Bug Fixes

- Bound page content reads with continuation cursors and tighten KV traversal checks for legitimate dotted keys.

## v2.40.1 (2026-08-31)


## v2.40.1-beta.1 (2026-08-31)

### Bug Fixes

- Add bounded Notion provider acceptance
  ([#1252](https://github.com/n24q02m/better-notion-mcp/pull/1252),
  [`18347c3`](https://github.com/n24q02m/better-notion-mcp/commit/18347c339ddba5783c62ad48f1063a265802ca92))

- Isolate init-server transport mock
  ([#1249](https://github.com/n24q02m/better-notion-mcp/pull/1249),
  [`9867e1e`](https://github.com/n24q02m/better-notion-mcp/commit/9867e1e251c43d236b62fb6d12e7e780766004fa))

- Preserve notion acceptance errors
  ([#1252](https://github.com/n24q02m/better-notion-mcp/pull/1252),
  [`18347c3`](https://github.com/n24q02m/better-notion-mcp/commit/18347c339ddba5783c62ad48f1063a265802ca92))

- **deps**: Bump better-semantic-release and zod
  ([`f3d3c12`](https://github.com/n24q02m/better-notion-mcp/commit/f3d3c12783669de610992a128e63c8d698ea7ab7))

- **deps**: Bump mcp-core to 1.23.1
  ([`4f0a52a`](https://github.com/n24q02m/better-notion-mcp/commit/4f0a52a8209f02bf7a57a6ff134d79fbb688928b))

- **deps**: Lock file maintenance ([#1251](https://github.com/n24q02m/better-notion-mcp/pull/1251),
  [`f7e64aa`](https://github.com/n24q02m/better-notion-mcp/commit/f7e64aaf9c22680ed2ff899a76df9397e4b627ac))

- **deps**: Update @cloudflare/workers-types to ^5.20260822.1
  ([#1245](https://github.com/n24q02m/better-notion-mcp/pull/1245),
  [`690c150`](https://github.com/n24q02m/better-notion-mcp/commit/690c150cdff02a5cd9c218bbf44b3cd4d7b6c20d))

- **deps**: Update @cloudflare/workers-types to ^5.20260823.1
  ([#1250](https://github.com/n24q02m/better-notion-mcp/pull/1250),
  [`237b936`](https://github.com/n24q02m/better-notion-mcp/commit/237b936f980b5edad36b35a8f0487bff9535c1e5))


## v2.40.0 (2026-08-29)

### Bug Fixes

- Align Bun toolchain with lockfile v2
  ([#1241](https://github.com/n24q02m/better-notion-mcp/pull/1241),
  [`c24acd0`](https://github.com/n24q02m/better-notion-mcp/commit/c24acd023adb701edb6337e69ae30a0204caba03))

- Propagate Notion pagination limits
  ([#1230](https://github.com/n24q02m/better-notion-mcp/pull/1230),
  [`e7ceaed`](https://github.com/n24q02m/better-notion-mcp/commit/e7ceaedae17d407521743cbe57d874bd8b3fb005))

- Reject Unicode URL obfuscation characters
  ([#1229](https://github.com/n24q02m/better-notion-mcp/pull/1229),
  [`3746660`](https://github.com/n24q02m/better-notion-mcp/commit/3746660f27e0fa89ae5ebc2db427cb813cda7767))

- Remove retired hosted Notion surface
  ([#1232](https://github.com/n24q02m/better-notion-mcp/pull/1232),
  [`f4a2366`](https://github.com/n24q02m/better-notion-mcp/commit/f4a236652ed882ae2b5a93e47e47e69926b27d03))

- ⚡ Bolt: Use in-place array truncation in autoPaginate
  ([#1243](https://github.com/n24q02m/better-notion-mcp/pull/1243),
  [`d8d275b`](https://github.com/n24q02m/better-notion-mcp/commit/d8d275bca0d85c00a6533d78a1685038881fe7c1))

- **deps**: Lock file maintenance
  ([`353977c`](https://github.com/n24q02m/better-notion-mcp/commit/353977cab22d1a1edb9bba3a9e4bf40bca31626d))

- **deps**: Update @biomejs/biome to ^2.5.10
  ([#1242](https://github.com/n24q02m/better-notion-mcp/pull/1242),
  [`1278728`](https://github.com/n24q02m/better-notion-mcp/commit/1278728dffbd20e5f38b0314019fc796d597a5a2))

- **deps**: Update @biomejs/biome to ^2.5.8
  ([#1218](https://github.com/n24q02m/better-notion-mcp/pull/1218),
  [`64c7c86`](https://github.com/n24q02m/better-notion-mcp/commit/64c7c864e9bf576a869534ccd83195c43ee18a62))

- **deps**: Update @cloudflare/workers-types to ^5.20260809.1
  ([#1213](https://github.com/n24q02m/better-notion-mcp/pull/1213),
  [`ca69453`](https://github.com/n24q02m/better-notion-mcp/commit/ca69453df4a05d45709178c8dc53683c13e72f2d))

- **deps**: Update @cloudflare/workers-types to ^5.20260811.1
  ([#1216](https://github.com/n24q02m/better-notion-mcp/pull/1216),
  [`4161228`](https://github.com/n24q02m/better-notion-mcp/commit/41612283c15f24a75d2fda42e45864f2da2dd4d0))

- **deps**: Update @cloudflare/workers-types to ^5.20260813.1
  ([#1221](https://github.com/n24q02m/better-notion-mcp/pull/1221),
  [`53c9971`](https://github.com/n24q02m/better-notion-mcp/commit/53c99711a82d4959d51a993071b882b8a2015367))

- **deps**: Update @cloudflare/workers-types to ^5.20260814.1
  ([#1223](https://github.com/n24q02m/better-notion-mcp/pull/1223),
  [`98326f6`](https://github.com/n24q02m/better-notion-mcp/commit/98326f6cfda0f7248367afc72c51d3d6825aabe8))

- **deps**: Update @cloudflare/workers-types to ^5.20260815.1
  ([#1225](https://github.com/n24q02m/better-notion-mcp/pull/1225),
  [`99d8d09`](https://github.com/n24q02m/better-notion-mcp/commit/99d8d091f3f8e94ad2c2b386f1829f60d0e7406e))

- **deps**: Update @cloudflare/workers-types to ^5.20260816.1
  ([#1228](https://github.com/n24q02m/better-notion-mcp/pull/1228),
  [`60243ec`](https://github.com/n24q02m/better-notion-mcp/commit/60243eccd3865a9fec692a3d9f0d801c96c51156))

- **deps**: Update @cloudflare/workers-types to ^5.20260819.1
  ([#1236](https://github.com/n24q02m/better-notion-mcp/pull/1236),
  [`dfe8cb4`](https://github.com/n24q02m/better-notion-mcp/commit/dfe8cb4b1f7c88ac9ed2d7f53dd9502621b076a8))

- **deps**: Update @cloudflare/workers-types to ^5.20260821.1
  ([#1239](https://github.com/n24q02m/better-notion-mcp/pull/1239),
  [`cf476f2`](https://github.com/n24q02m/better-notion-mcp/commit/cf476f2469bebd0411998272b6c1448084587618))

- **deps**: Update esbuild to ^0.28.2
  ([#1209](https://github.com/n24q02m/better-notion-mcp/pull/1209),
  [`0d91e51`](https://github.com/n24q02m/better-notion-mcp/commit/0d91e510a45584eb16e9b3b992b1fa9f40dbe488))

- **deps**: Update minor dependencies
  ([#1210](https://github.com/n24q02m/better-notion-mcp/pull/1210),
  [`69daf6c`](https://github.com/n24q02m/better-notion-mcp/commit/69daf6c7e6a3828b8f259cd0c74e8e644b3e891e))

- **deps**: Update non-major dev dependencies
  ([#1206](https://github.com/n24q02m/better-notion-mcp/pull/1206),
  [`a32c915`](https://github.com/n24q02m/better-notion-mcp/commit/a32c9158b3e98fbd1c9c3f024e2625f33d45e3b4))

- **deps**: Update oven/bun:1-alpine Docker digest to 0723557
  ([#1220](https://github.com/n24q02m/better-notion-mcp/pull/1220),
  [`aa5cd61`](https://github.com/n24q02m/better-notion-mcp/commit/aa5cd61476588be311845c1154ba06a155a52932))

- **deps**: Update patch dependencies
  ([#1235](https://github.com/n24q02m/better-notion-mcp/pull/1235),
  [`627e33d`](https://github.com/n24q02m/better-notion-mcp/commit/627e33d340b1a2cc1c22d5f0a285a9f67ed5a0de))

- **deps**: Update tsx to ^4.23.12 ([#1215](https://github.com/n24q02m/better-notion-mcp/pull/1215),
  [`f34c27b`](https://github.com/n24q02m/better-notion-mcp/commit/f34c27b219f26f19ccb42de93c4a886678277829))

### Chores

- Bump better-semantic-release to v1.4.0
  ([#1234](https://github.com/n24q02m/better-notion-mcp/pull/1234),
  [`85b1da5`](https://github.com/n24q02m/better-notion-mcp/commit/85b1da5c2bc1acf482fdeec6e51a2483ea6919f9))

### Features

- Add hosted runtime tombstone ([#1232](https://github.com/n24q02m/better-notion-mcp/pull/1232),
  [`f4a2366`](https://github.com/n24q02m/better-notion-mcp/commit/f4a236652ed882ae2b5a93e47e47e69926b27d03))

- Dehost managed Cloudflare runtime
  ([#1232](https://github.com/n24q02m/better-notion-mcp/pull/1232),
  [`f4a2366`](https://github.com/n24q02m/better-notion-mcp/commit/f4a236652ed882ae2b5a93e47e47e69926b27d03))


## v2.39.0 (2026-08-14)


## v2.39.0-beta.2 (2026-08-14)

### Bug Fixes

- Update Cloudflare worker types ([#1205](https://github.com/n24q02m/better-notion-mcp/pull/1205),
  [`b26446e`](https://github.com/n24q02m/better-notion-mcp/commit/b26446eb898746cb4cc6dfd95baa5b2419f700b5))

- **deps**: Update patch dependencies
  ([#1203](https://github.com/n24q02m/better-notion-mcp/pull/1203),
  [`5d4612e`](https://github.com/n24q02m/better-notion-mcp/commit/5d4612e793b4126df28b6944b10c80dead0a116c))


## v2.39.0-beta.1 (2026-08-14)

### Bug Fixes

- Align live Cloudflare validation ([#1202](https://github.com/n24q02m/better-notion-mcp/pull/1202),
  [`b65efae`](https://github.com/n24q02m/better-notion-mcp/commit/b65efae903c2acc0f4ae0600c15d334dc3e53d6b))

- Anchor XPIA sanitization on the tag name instead of the padding
  ([#1153](https://github.com/n24q02m/better-notion-mcp/pull/1153),
  [`744640a`](https://github.com/n24q02m/better-notion-mcp/commit/744640a1d59f6ca74fe098d2d23c4047509513a0))

- Bump mcp-core to 1.23.0 ([#1199](https://github.com/n24q02m/better-notion-mcp/pull/1199),
  [`507cdaf`](https://github.com/n24q02m/better-notion-mcp/commit/507cdafcf25cc9f0273ee1e1535da04a8843445e))

- Describe the HTTP mode instead of advertising a personal instance
  ([`f0008c6`](https://github.com/n24q02m/better-notion-mcp/commit/f0008c66ea5ed94fe745b7db6227e5bf03d15e60))

- Drop code_quality from the main ruleset
  ([#1156](https://github.com/n24q02m/better-notion-mcp/pull/1156),
  [`db415ef`](https://github.com/n24q02m/better-notion-mcp/commit/db415efe53a2d8c4b78bb2c70db0a6a8ba34fb4c))

- Drop rangeStrategy from update-type package rules
  ([#1145](https://github.com/n24q02m/better-notion-mcp/pull/1145),
  [`528e43d`](https://github.com/n24q02m/better-notion-mcp/commit/528e43d16492ef8ea2ffb69e99a836b2302a37a3))

- Move this repo to Apache-2.0, preserving the MIT terms it received
  ([#1173](https://github.com/n24q02m/better-notion-mcp/pull/1173),
  [`94f5a5f`](https://github.com/n24q02m/better-notion-mcp/commit/94f5a5f7b6a3c261dce1b167b2a128bc968bebdd))

- Pin GitHub Action references to commit SHAs
  ([#1141](https://github.com/n24q02m/better-notion-mcp/pull/1141),
  [`5ae7b04`](https://github.com/n24q02m/better-notion-mcp/commit/5ae7b04dcbf41cec921b87a46c517dae469a949b))

- Pre-allocate arrays in markdown rendering
  ([`c9242fb`](https://github.com/n24q02m/better-notion-mcp/commit/c9242fb84034f4e31b0e8ebb7b038905b304795b))

- Record rejected Bolt proposals in the ledger
  ([#1154](https://github.com/n24q02m/better-notion-mcp/pull/1154),
  [`064a7b3`](https://github.com/n24q02m/better-notion-mcp/commit/064a7b395719b7a0d0617481593d6a92685e3584))

- Rerun PR title validation after edits
  ([#1200](https://github.com/n24q02m/better-notion-mcp/pull/1200),
  [`63ac740`](https://github.com/n24q02m/better-notion-mcp/commit/63ac740acf1f039161dc3d474cc2bacaa6b7e78d))

- **deps**: Lock file maintenance ([#1158](https://github.com/n24q02m/better-notion-mcp/pull/1158),
  [`95608d6`](https://github.com/n24q02m/better-notion-mcp/commit/95608d6cca11789fd64e872bc96bf1238cf5c6df))

- **deps**: Update @cloudflare/workers-types to ^5.20260716.1
  ([#1147](https://github.com/n24q02m/better-notion-mcp/pull/1147),
  [`c97367c`](https://github.com/n24q02m/better-notion-mcp/commit/c97367c7f4e49d631f1a2f108bcc30ea328a9013))

- **deps**: Update @cloudflare/workers-types to ^5.20260717.1
  ([#1150](https://github.com/n24q02m/better-notion-mcp/pull/1150),
  [`01cfd93`](https://github.com/n24q02m/better-notion-mcp/commit/01cfd93135d77ed9ed66eefdab754410416c6a88))

- **deps**: Update @cloudflare/workers-types to ^5.20260718.1
  ([#1157](https://github.com/n24q02m/better-notion-mcp/pull/1157),
  [`449e62a`](https://github.com/n24q02m/better-notion-mcp/commit/449e62a72167501042fb5e639f7a13c665bf6230))

- **deps**: Update actions/setup-node action to v7
  ([#1120](https://github.com/n24q02m/better-notion-mcp/pull/1120),
  [`1306813`](https://github.com/n24q02m/better-notion-mcp/commit/1306813e6b3182a726189e75fe8fec596570dbb7))

- **deps**: Update actions/setup-python action to v7
  ([#1149](https://github.com/n24q02m/better-notion-mcp/pull/1149),
  [`c2a1f04`](https://github.com/n24q02m/better-notion-mcp/commit/c2a1f04e87e512761390b4723244d7d3ec73e5f4))

- **deps**: Update minor dependencies
  ([#1148](https://github.com/n24q02m/better-notion-mcp/pull/1148),
  [`b0a3dc6`](https://github.com/n24q02m/better-notion-mcp/commit/b0a3dc6a29e93fd9b21ad1963f2e06608323afb6))

- **deps**: Update patch dependencies
  ([#1146](https://github.com/n24q02m/better-notion-mcp/pull/1146),
  [`cc1cb9f`](https://github.com/n24q02m/better-notion-mcp/commit/cc1cb9f7bf57f388073a1aa72b8a8a00a9c4b2ac))

- **deps**: Update typescript to v7
  ([#1105](https://github.com/n24q02m/better-notion-mcp/pull/1105),
  [`4c5aa0b`](https://github.com/n24q02m/better-notion-mcp/commit/4c5aa0b38eab051c6d631da9ab3711adde86ddbb))

### Features

- Govern duplicate bot pull requests
  ([#1201](https://github.com/n24q02m/better-notion-mcp/pull/1201),
  [`f661f0b`](https://github.com/n24q02m/better-notion-mcp/commit/f661f0ba808069a3f8171fc16e604aa25c8abacc))

- Sync cross-promo section ([#1163](https://github.com/n24q02m/better-notion-mcp/pull/1163),
  [`59b4c89`](https://github.com/n24q02m/better-notion-mcp/commit/59b4c8977500f6b3995d350fced43260e194015e))


## v2.38.0 (2026-07-18)

### Bug Fixes

- Add orphan-tag integrity guard to release CI
  ([#1131](https://github.com/n24q02m/better-notion-mcp/pull/1131),
  [`d5f35ba`](https://github.com/n24q02m/better-notion-mcp/commit/d5f35ba3bf785509c10ed0bd630c6014cbd106a4))

- Adopt better-semantic-release for built-in release guards
  ([`12d2b76`](https://github.com/n24q02m/better-notion-mcp/commit/12d2b767aaebbcd4b510d7b47e458a289545f11c))

- Broaden XPIA marker regex to catch whitespace-padded variants
  ([`10fe06f`](https://github.com/n24q02m/better-notion-mcp/commit/10fe06f27f399f3e52259ba00a570b71d7546aa5))

- Bump mcp-core floor to 1.19.0 stable
  ([#1128](https://github.com/n24q02m/better-notion-mcp/pull/1128),
  [`f5dab49`](https://github.com/n24q02m/better-notion-mcp/commit/f5dab497d4176cc51956f33b4b36551923e20949))

- Bump mcp-core to 1.20.0 ([#1140](https://github.com/n24q02m/better-notion-mcp/pull/1140),
  [`f24dcb4`](https://github.com/n24q02m/better-notion-mcp/commit/f24dcb4a2c3ebebecb9afb069c6bc40f2661958a))

- Drop redundant orphan-tag CI guard that blocked releases
  ([#1138](https://github.com/n24q02m/better-notion-mcp/pull/1138),
  [`048eb83`](https://github.com/n24q02m/better-notion-mcp/commit/048eb83d2dce85c9207aa7782f538cf92e231899))

- Optimize multiline prefixing in markdown renderer
  ([`723c765`](https://github.com/n24q02m/better-notion-mcp/commit/723c7657508a838c0e34142ab1c296fe25327750))

- Pin rangeStrategy on delayed packageRules to fix renovate artifacts failure
  ([#1132](https://github.com/n24q02m/better-notion-mcp/pull/1132),
  [`3a439a1`](https://github.com/n24q02m/better-notion-mcp/commit/3a439a19b73307a18100efb8e4eae410b0b3fac2))

- **deps**: Lock file maintenance ([#1129](https://github.com/n24q02m/better-notion-mcp/pull/1129),
  [`344aa53`](https://github.com/n24q02m/better-notion-mcp/commit/344aa53d54f868789cbe974171e63c4945cf4c2d))

- **deps**: Lock file maintenance ([#1121](https://github.com/n24q02m/better-notion-mcp/pull/1121),
  [`e3be0f7`](https://github.com/n24q02m/better-notion-mcp/commit/e3be0f719ec46adc25b77fcee5be0e47ab165850))

- **deps**: Update @cloudflare/workers-types to ^5.20260708.1
  ([#1125](https://github.com/n24q02m/better-notion-mcp/pull/1125),
  [`57bc8f2`](https://github.com/n24q02m/better-notion-mcp/commit/57bc8f221fd9eb033501b3d46f982cee8c53c7c4))

- **deps**: Update patch dependencies
  ([#1124](https://github.com/n24q02m/better-notion-mcp/pull/1124),
  [`ef2006e`](https://github.com/n24q02m/better-notion-mcp/commit/ef2006e995268c0462e1ba909f8f5686e62a2ec8))

### Features

- Add PR-title conventional-commit gate + no-bump release warning
  ([#1134](https://github.com/n24q02m/better-notion-mcp/pull/1134),
  [`6f3b0f7`](https://github.com/n24q02m/better-notion-mcp/commit/6f3b0f76cbecb2b5318453509d37db70f3609367))

- Add setup_status config action and BYO OAuth client CLI flags
  ([#1136](https://github.com/n24q02m/better-notion-mcp/pull/1136),
  [`887e175`](https://github.com/n24q02m/better-notion-mcp/commit/887e175d081cd310ab5ac9c6521e62c2e2cec9a1))

- Document CLI, smithery, and self-host endpoint in README
  ([#1123](https://github.com/n24q02m/better-notion-mcp/pull/1123),
  [`05fe9bb`](https://github.com/n24q02m/better-notion-mcp/commit/05fe9bbca3703004f5f2b45762f8bf092a59376e))

- Wire core buildCli for doctor/config/relay/--version
  ([#1135](https://github.com/n24q02m/better-notion-mcp/pull/1135),
  [`4790012`](https://github.com/n24q02m/better-notion-mcp/commit/47900123f7816493b0ed5481f5b3b50651400e26))


## v2.37.0 (2026-07-14)

### Bug Fixes

- Correct mention gate expression (balanced parens + precedence)
  ([#1113](https://github.com/n24q02m/better-notion-mcp/pull/1113),
  [`0f79c3e`](https://github.com/n24q02m/better-notion-mcp/commit/0f79c3e7e8c85d26a1a696e73d5437a726a9795c))

- Gate oc mention job on comment author write access
  ([#1113](https://github.com/n24q02m/better-notion-mcp/pull/1113),
  [`0f79c3e`](https://github.com/n24q02m/better-notion-mcp/commit/0f79c3e7e8c85d26a1a696e73d5437a726a9795c))

- Run opencode bot on hosted runners
  ([#1112](https://github.com/n24q02m/better-notion-mcp/pull/1112),
  [`10643a7`](https://github.com/n24q02m/better-notion-mcp/commit/10643a7bd1dca07427f13d47a53296240b1e5f32))

- **deps**: Lock file maintenance ([#1116](https://github.com/n24q02m/better-notion-mcp/pull/1116),
  [`c793e1d`](https://github.com/n24q02m/better-notion-mcp/commit/c793e1da2c9c7402b7de15b07ab5b812e571ac4b))

- **deps**: Lock file maintenance ([#1109](https://github.com/n24q02m/better-notion-mcp/pull/1109),
  [`04895d9`](https://github.com/n24q02m/better-notion-mcp/commit/04895d981ddef6fcfe04e13411ba2355b25ca2b0))

- **deps**: Update @cloudflare/workers-types to ^5.20260707.1
  ([#1115](https://github.com/n24q02m/better-notion-mcp/pull/1115),
  [`1823129`](https://github.com/n24q02m/better-notion-mcp/commit/1823129d1b369c08819381ea8f7ad7f4e8c28539))

- **deps**: Update patch dependencies to ^4.1.10
  ([#1114](https://github.com/n24q02m/better-notion-mcp/pull/1114),
  [`7ed21b6`](https://github.com/n24q02m/better-notion-mcp/commit/7ed21b66842181fa5429210c4522bdb41d79fda1))

### Features

- Add smithery.yaml for stdio deployment
  ([#1117](https://github.com/n24q02m/better-notion-mcp/pull/1117),
  [`5b616f2`](https://github.com/n24q02m/better-notion-mcp/commit/5b616f2a7e5e37bc7730fabc8e6656ac22cf27f6))


## v2.37.0-beta.3 (2026-07-12)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.18.2 ([#1100](https://github.com/n24q02m/better-notion-mcp/pull/1100),
  [`6b9f427`](https://github.com/n24q02m/better-notion-mcp/commit/6b9f427a0a00cb670d7e7f3c216f7fca6be115fc))

- Enforce fix(deps) semantic commit prefix in renovate config
  ([`7e81b3b`](https://github.com/n24q02m/better-notion-mcp/commit/7e81b3b834f74e601833a7dac95f1e0a02cb3218))

- Make renovate automerge effective (isolated groups, digest+lockfile automerge, 7-day cooldown)
  ([`531ccd5`](https://github.com/n24q02m/better-notion-mcp/commit/531ccd5602b096ac580c26e430f01b1e0df4f26c))

- Make untrusted marker override payload keys
  ([#1108](https://github.com/n24q02m/better-notion-mcp/pull/1108),
  [`071d49e`](https://github.com/n24q02m/better-notion-mcp/commit/071d49ed478baae145006e7be641c63dc15d9add))

- Mark untrusted source in structured content envelope
  ([#1108](https://github.com/n24q02m/better-notion-mcp/pull/1108),
  [`071d49e`](https://github.com/n24q02m/better-notion-mcp/commit/071d49ed478baae145006e7be641c63dc15d9add))

- Optimize markdown parser array allocations and regex compilation
  ([`cd5e3a0`](https://github.com/n24q02m/better-notion-mcp/commit/cd5e3a005d2bd7c097f21a1ed1d84c5aa66fa534))

- **deps**: Lock file maintenance ([#1107](https://github.com/n24q02m/better-notion-mcp/pull/1107),
  [`f9d0fe2`](https://github.com/n24q02m/better-notion-mcp/commit/f9d0fe265f9667227389c76f70a5417db74394b6))

- **deps**: Lock file maintenance ([#1106](https://github.com/n24q02m/better-notion-mcp/pull/1106),
  [`f385ecd`](https://github.com/n24q02m/better-notion-mcp/commit/f385ecdd1727b55169139fc4cbe4ba55f4b56789))

- **deps**: Update dependency @notionhq/client to ^5.23.0
  ([#1102](https://github.com/n24q02m/better-notion-mcp/pull/1102),
  [`bb0ab98`](https://github.com/n24q02m/better-notion-mcp/commit/bb0ab981fbe1acf12b9e57fd9f7cd4c451c24346))

### Chores

- **deps**: Lock file maintenance ([#1087](https://github.com/n24q02m/better-notion-mcp/pull/1087),
  [`3e6f745`](https://github.com/n24q02m/better-notion-mcp/commit/3e6f74555edacb5032fe5812d64f7b40393f243c))

- **deps**: Update actions/checkout action to v7
  ([#1103](https://github.com/n24q02m/better-notion-mcp/pull/1103),
  [`80ede00`](https://github.com/n24q02m/better-notion-mcp/commit/80ede0031fc18c06f095b7b7b8ff55595260b5c0))

### Features

- Declare output schemas and emit structured content
  ([#1108](https://github.com/n24q02m/better-notion-mcp/pull/1108),
  [`071d49e`](https://github.com/n24q02m/better-notion-mcp/commit/071d49ed478baae145006e7be641c63dc15d9add))


## v2.37.0-beta.2 (2026-07-10)

### Bug Fixes

- Decline standing GET /mcp SSE stream at the edge
  ([#1098](https://github.com/n24q02m/better-notion-mcp/pull/1098),
  [`536f1ce`](https://github.com/n24q02m/better-notion-mcp/commit/536f1ceaf095b1efc28aaa3b82ca3f73dca9669b))

- Fail the release when the computed version already exists on npm
  ([#1097](https://github.com/n24q02m/better-notion-mcp/pull/1097),
  [`31a997e`](https://github.com/n24q02m/better-notion-mcp/commit/31a997ebf4c931a9135f36f0c3ea1da5bdd629f7))


## v2.37.0-beta.1 (2026-07-10)

### Bug Fixes

- Cf container health check ping endpoint override
  ([`deafb24`](https://github.com/n24q02m/better-notion-mcp/commit/deafb24c77e050706935f59083d040f014965f41))

- Point NotionContainer pingEndpoint at /health (core-ts liveness route) so CF health passes
  ([#1094](https://github.com/n24q02m/better-notion-mcp/pull/1094),
  [`e0630ea`](https://github.com/n24q02m/better-notion-mcp/commit/e0630ea503a91092ba6c32a6e7d6a0d831e2ce96))

- Reject unauthenticated /mcp at the Worker edge
  ([#1096](https://github.com/n24q02m/better-notion-mcp/pull/1096),
  [`dea52ac`](https://github.com/n24q02m/better-notion-mcp/commit/dea52acf94f721f2dd0431407047a5740dbb12d8))

### Features

- Add opencode github agent (responds to /oc)
  ([`91da662`](https://github.com/n24q02m/better-notion-mcp/commit/91da662041b141245fe2f417187c7cbecf030a49))

- Add review-learnings store the automated reviewer must obey
  ([`fe9dc90`](https://github.com/n24q02m/better-notion-mcp/commit/fe9dc90222a53048119b2511304ccced391afe1c))

- Auto-respond only to issues and PRs opened by outside people
  ([`6e714e6`](https://github.com/n24q02m/better-notion-mcp/commit/6e714e6b8aef184ca2d0079c73753119417ec2c1))

- Reviewer must obey .github/review-learnings.md
  ([`5fdefaf`](https://github.com/n24q02m/better-notion-mcp/commit/5fdefafa32a0f998a5e53dd57ce3311b14b812ca))


## v2.36.1 (2026-07-05)


## v2.36.1-beta.1 (2026-07-05)

### Bug Fixes

- Assert BYO placeholder route in wrangler-config test
  ([#1074](https://github.com/n24q02m/better-notion-mcp/pull/1074),
  [`336fcb3`](https://github.com/n24q02m/better-notion-mcp/commit/336fcb3be9978402e74ae4771824053bcb28969a))

- Avoid spread operator for large array appends in autoPaginate
  ([`48049b1`](https://github.com/n24q02m/better-notion-mcp/commit/48049b152b89b939575b1885e9892df52b9e2aea))

- Clarify Workers Paid plan is required for Containers in Cloudflare deploy prerequisites
  ([#1074](https://github.com/n24q02m/better-notion-mcp/pull/1074),
  [`336fcb3`](https://github.com/n24q02m/better-notion-mcp/commit/336fcb3be9978402e74ae4771824053bcb28969a))

- Require PUBLIC_URL env only when wrangler.jsonc carries the placeholder
  ([#1074](https://github.com/n24q02m/better-notion-mcp/pull/1074),
  [`336fcb3`](https://github.com/n24q02m/better-notion-mcp/commit/336fcb3be9978402e74ae4771824053bcb28969a))

- Substitute PUBLIC_URL placeholder in cf-deploy.mjs and assert no leftover placeholders
  ([#1074](https://github.com/n24q02m/better-notion-mcp/pull/1074),
  [`336fcb3`](https://github.com/n24q02m/better-notion-mcp/commit/336fcb3be9978402e74ae4771824053bcb28969a))

- Use placeholders for PUBLIC_URL and routes in wrangler.jsonc (BYO-generic)
  ([#1074](https://github.com/n24q02m/better-notion-mcp/pull/1074),
  [`336fcb3`](https://github.com/n24q02m/better-notion-mcp/commit/336fcb3be9978402e74ae4771824053bcb28969a))

- **deps**: Update non-major dependencies
  ([`9320ae8`](https://github.com/n24q02m/better-notion-mcp/commit/9320ae8c3bbddc9c13fd4deee7170cd92047b080))

### Chores

- **deps**: Update dependency @cloudflare/workers-types to v5
  ([#1079](https://github.com/n24q02m/better-notion-mcp/pull/1079),
  [`8bc68ae`](https://github.com/n24q02m/better-notion-mcp/commit/8bc68ae04b36a310b5de044ea27d2a00d3fec535))

- **deps**: Update docker/build-push-action digest to 53b7df9
  ([#1075](https://github.com/n24q02m/better-notion-mcp/pull/1075),
  [`829764f`](https://github.com/n24q02m/better-notion-mcp/commit/829764fc70908feb662ea4a253503591017bad20))

- **deps**: Update docker/login-action digest to af1e73f
  ([#1076](https://github.com/n24q02m/better-notion-mcp/pull/1076),
  [`c83df6a`](https://github.com/n24q02m/better-notion-mcp/commit/c83df6ac14177ef8bd1bd0551d90fc4e9b3097c3))

- **deps**: Update docker/setup-buildx-action digest to bb05f3f
  ([#1077](https://github.com/n24q02m/better-notion-mcp/pull/1077),
  [`f763f26`](https://github.com/n24q02m/better-notion-mcp/commit/f763f26f79905d07601cb1a9397b1cabc36187dc))


## v2.36.0 (2026-07-02)

### Bug Fixes

- Bump mcp-core to 1.18.1 ([#1073](https://github.com/n24q02m/better-notion-mcp/pull/1073),
  [`52e3f16`](https://github.com/n24q02m/better-notion-mcp/commit/52e3f160616ec5e873c4f314f0b492337aa894d3))


## v2.36.0-beta.1 (2026-07-02)

### Features

- Deploy CF Worker+Container on release from cd.yml
  ([#1071](https://github.com/n24q02m/better-notion-mcp/pull/1071),
  [`2fbfd16`](https://github.com/n24q02m/better-notion-mcp/commit/2fbfd1692c7f0c31d835a09d3d0ecaaf3517cd8a))


## v2.35.0 (2026-07-01)


## v2.35.0-beta.9 (2026-07-01)

### Bug Fixes

- Wire durable KV-backed sessionKv for delegated OAuth on CF deploy
  ([#1069](https://github.com/n24q02m/better-notion-mcp/pull/1069),
  [`fd29c2a`](https://github.com/n24q02m/better-notion-mcp/commit/fd29c2adbdeb49a8993c84749f355cbc06fc1ec3))


## v2.35.0-beta.8 (2026-07-01)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.18.0-beta.23 for durable delegated-OAuth session state
  ([#1068](https://github.com/n24q02m/better-notion-mcp/pull/1068),
  [`6e53cb8`](https://github.com/n24q02m/better-notion-mcp/commit/6e53cb8ecc61c2a623a1d6e57404dc5cf399444a))

- Correct AGENTS.md file organization to match current src layout
  ([#1067](https://github.com/n24q02m/better-notion-mcp/pull/1067),
  [`268e626`](https://github.com/n24q02m/better-notion-mcp/commit/268e626ff5f27c25b9ae28d6ad2678f80ff73559))

- **deps**: Update non-major dependencies
  ([#1064](https://github.com/n24q02m/better-notion-mcp/pull/1064),
  [`9e887de`](https://github.com/n24q02m/better-notion-mcp/commit/9e887defcd45733edd0eefbe14e830103b9aa4a3))

### Chores

- **deps**: Lock file maintenance ([#1065](https://github.com/n24q02m/better-notion-mcp/pull/1065),
  [`25f3826`](https://github.com/n24q02m/better-notion-mcp/commit/25f3826efc60b84773a027905a5ae5b7db8e1d8b))


## v2.35.0-beta.7 (2026-06-30)

### Bug Fixes

- Add missing import os to cf_full_flow.py
  ([#1061](https://github.com/n24q02m/better-notion-mcp/pull/1061),
  [`dc0a5a5`](https://github.com/n24q02m/better-notion-mcp/commit/dc0a5a5407cee90c5e4361e2363ecf0f9757f468))

- Add nodejs_compat flag for CF worker bundle
  ([#1055](https://github.com/n24q02m/better-notion-mcp/pull/1055),
  [`b8d41fb`](https://github.com/n24q02m/better-notion-mcp/commit/b8d41fbf3b290996102c796c63df87f1f3250c44))

- Add richtext large-string test
  ([`5da5b45`](https://github.com/n24q02m/better-notion-mcp/commit/5da5b450c29e26ffb31ff1890a52b8c3beb8df3f))

- Bump @n24q02m/mcp-core beta.21 + cloudflare types
  ([`2c1f563`](https://github.com/n24q02m/better-notion-mcp/commit/2c1f5639e4cb2c08cf12ae88777d6d345b2e96d1))

- Cache base64 validation regex at module level
  ([`d6022fc`](https://github.com/n24q02m/better-notion-mcp/commit/d6022fc0e1665fab772d1f7639189c3245cede74))

- Canary Gate-A/B settle-retry to avoid false-fail on slow container startup
  ([#1054](https://github.com/n24q02m/better-notion-mcp/pull/1054),
  [`361a3a0`](https://github.com/n24q02m/better-notion-mcp/commit/361a3a0d7e0549d5a93acc1d938469dd910b8a3a))

- Collapse OAuth + per-sub routing to one DO (resolve max_instances=1 deadlock)
  ([#1060](https://github.com/n24q02m/better-notion-mcp/pull/1060),
  [`b57628c`](https://github.com/n24q02m/better-notion-mcp/commit/b57628c0be4cbdc5af9a9ec55821ae2591ff4d80))

- Correct http transport token-store selection
  ([`a6498a0`](https://github.com/n24q02m/better-notion-mcp/commit/a6498a08bba863722b4fca2d41202eba032400cb))

- Green notion main — single-DO worker test + symmetric KV-ready log
  ([#1063](https://github.com/n24q02m/better-notion-mcp/pull/1063),
  [`bef1cc4`](https://github.com/n24q02m/better-notion-mcp/commit/bef1cc45936c869adb87af6e09a3295bf6687a24))

- Notion cf_full_flow bootstrap passes Gate A relay-login
  ([#1062](https://github.com/n24q02m/better-notion-mcp/pull/1062),
  [`f20dbb3`](https://github.com/n24q02m/better-notion-mcp/commit/f20dbb39eacdc6c6733264fc4a07fef2f9fa28b0))

- Route OAuth /token refresh to the sub's DO to avoid max_instances=1 deadlock
  ([#1056](https://github.com/n24q02m/better-notion-mcp/pull/1056),
  [`6c64194`](https://github.com/n24q02m/better-notion-mcp/commit/6c64194d00810d8d1fc28dfad6e643f9cdc3f539))


## v2.35.0-beta.6 (2026-06-29)

### Bug Fixes

- Cap max_instances=1 for CF container cost (solo dev default)
  ([`2166e0a`](https://github.com/n24q02m/better-notion-mcp/commit/2166e0aa6bc35f4052954db07fa1a1d49b241390))

- Cover databases retrieval fallback + bulk paths
  ([`784ffb3`](https://github.com/n24q02m/better-notion-mcp/commit/784ffb376f7c697604fdb02837f4d5f5c930a66d))

- Cover deriveSubject/selectTokenStore/ready probe
  ([`a485aaf`](https://github.com/n24q02m/better-notion-mcp/commit/a485aafc178f5a76d510c405e98dd69a445af843))

- Cover extractUserId error paths
  ([`38d02f5`](https://github.com/n24q02m/better-notion-mcp/commit/38d02f53f29e77d9c3f1c705e99808186b3775eb))

- Cover NotionTokenStore.getAsync load-error path
  ([`23d159e`](https://github.com/n24q02m/better-notion-mcp/commit/23d159ef671e07759813339684c399ef2b24ddef))

- Enforce per-plugin KV key-prefix isolation in Worker proxy
  ([`3606a3c`](https://github.com/n24q02m/better-notion-mcp/commit/3606a3c8e944834610a47100c58aacb8b701b391))

- Expand control-char regex to block obfuscated javascript URLs
  ([`4f600fa`](https://github.com/n24q02m/better-notion-mcp/commit/4f600fa0d7979095bdfa25ccc035aec4e42fb54d))

- Precompute registry RESOURCES/TOOLS for O(1) dispatch
  ([`81b79c0`](https://github.com/n24q02m/better-notion-mcp/commit/81b79c0fc8373a08fdb6f91c531879d752221382))

- Remove debug logging exposing sub in HTTP transport
  ([`0a32e55`](https://github.com/n24q02m/better-notion-mcp/commit/0a32e55016ef849149477f8e29b6e89b80ee0791))

- Require credential key present before marking notion configured
  ([#1008](https://github.com/n24q02m/better-notion-mcp/pull/1008),
  [`46d7ac6`](https://github.com/n24q02m/better-notion-mcp/commit/46d7ac65831a1209dfedba928704e8c198f8a7a8))

- Single-pass buildSearchFilter to avoid redundant array allocation
  ([`94596c1`](https://github.com/n24q02m/better-notion-mcp/commit/94596c13196bb1d86dab863914bb7d0d7bb76a81))

- Verify JWT signature in Worker extractUserId routing
  ([`e1041d4`](https://github.com/n24q02m/better-notion-mcp/commit/e1041d43d2ba7ab1a764e2007b25331d4d676caa))

- **deps**: Update non-major dependencies
  ([#1024](https://github.com/n24q02m/better-notion-mcp/pull/1024),
  [`bdf7bb5`](https://github.com/n24q02m/better-notion-mcp/commit/bdf7bb5e9cf89d9d35c75c04043523cb39c35974))

### Chores

- **deps**: Lock file maintenance ([#1002](https://github.com/n24q02m/better-notion-mcp/pull/1002),
  [`1e947d5`](https://github.com/n24q02m/better-notion-mcp/commit/1e947d5d7474332e0fe467bf7a871e8d7f3d6bb3))

- **deps**: Update dawidd6/action-send-mail action to v18
  ([#1029](https://github.com/n24q02m/better-notion-mcp/pull/1029),
  [`f0e02fe`](https://github.com/n24q02m/better-notion-mcp/commit/f0e02fef6d9ecb37aed93b43048d906ae2537a3e))

### Testing

- **auth**: Add error path test for KvNotionTokenStore.getAsync
  ([`23d159e`](https://github.com/n24q02m/better-notion-mcp/commit/23d159ef671e07759813339684c399ef2b24ddef))


## v2.35.0-beta.5 (2026-06-22)

### Bug Fixes

- Bump mcp-core to 1.18.0b19 (relay model-search catalog + OAuth refresh-TTL)
  ([#1001](https://github.com/n24q02m/better-notion-mcp/pull/1001),
  [`442c626`](https://github.com/n24q02m/better-notion-mcp/commit/442c6265e64893833fe34a7d448f5a5bd7021d76))


## v2.35.0-beta.4 (2026-06-22)

### Bug Fixes

- Correct README + metadata to match current code
  ([#997](https://github.com/n24q02m/better-notion-mcp/pull/997),
  [`a50020e`](https://github.com/n24q02m/better-notion-mcp/commit/a50020e8ce01937a4a0d7bc486be3d0aea9ba7aa))

- Pin CF container max_instances to 3
  ([#1000](https://github.com/n24q02m/better-notion-mcp/pull/1000),
  [`61d68c9`](https://github.com/n24q02m/better-notion-mcp/commit/61d68c9589c1c413cdfe77b86dd0bb65ba2e0e59))

- **deps**: Update non-major dependencies to ^1.18.0-beta.17
  ([#998](https://github.com/n24q02m/better-notion-mcp/pull/998),
  [`8dd69d0`](https://github.com/n24q02m/better-notion-mcp/commit/8dd69d0eb85abdf922260ccab8569679483d2f6c))


## v2.35.0-beta.3 (2026-06-21)

### Bug Fixes

- Add cf:deploy script for live wrangler deploy
  ([#996](https://github.com/n24q02m/better-notion-mcp/pull/996),
  [`ccdacc3`](https://github.com/n24q02m/better-notion-mcp/commit/ccdacc3eda0f4588a842a8bb7e57fafc6d3ba8c9))

- Cross-platform DOCS_DIR containment for path traversal guard
  ([#992](https://github.com/n24q02m/better-notion-mcp/pull/992),
  [`cd64b4f`](https://github.com/n24q02m/better-notion-mcp/commit/cd64b4fbae6ef48aa7c04eb615a4208c7823aed6))

- Drop env-derived value from cf_deploy log (CodeQL js/clear-text-logging)
  ([#996](https://github.com/n24q02m/better-notion-mcp/pull/996),
  [`ccdacc3`](https://github.com/n24q02m/better-notion-mcp/commit/ccdacc3eda0f4588a842a8bb7e57fafc6d3ba8c9))

- Make canary gate utf-8-safe (decode+encode) and Cloudflare-UA-aware
  ([`8c347ab`](https://github.com/n24q02m/better-notion-mcp/commit/8c347abf319cf8cdd7968a010b40897d9094708d))

- Make canary gate utf-8-safe and Cloudflare-UA-aware
  ([`8c347ab`](https://github.com/n24q02m/better-notion-mcp/commit/8c347abf319cf8cdd7968a010b40897d9094708d))

- Neutral default endpoint + env-first secrets in CF self-host scripts
  ([`2904b66`](https://github.com/n24q02m/better-notion-mcp/commit/2904b6670d07e08e94a6abf815dd6bc25fb21837))

- Right-size CF container to cut GiB-second cost
  ([#995](https://github.com/n24q02m/better-notion-mcp/pull/995),
  [`952f5b9`](https://github.com/n24q02m/better-notion-mcp/commit/952f5b959d80253332b94b55202c69183350d9dc))

- Use contextlib.suppress for stdout reconfigure (SIM105)
  ([`8c347ab`](https://github.com/n24q02m/better-notion-mcp/commit/8c347abf319cf8cdd7968a010b40897d9094708d))

- **deps**: Update non-major dependencies
  ([#986](https://github.com/n24q02m/better-notion-mcp/pull/986),
  [`1eb7318`](https://github.com/n24q02m/better-notion-mcp/commit/1eb7318807ef84318f95c1820c93fecdb6006fa2))

### Chores

- **deps**: Lock file maintenance ([#988](https://github.com/n24q02m/better-notion-mcp/pull/988),
  [`5ca832c`](https://github.com/n24q02m/better-notion-mcp/commit/5ca832cd1217027563e2038a076facf3608d9b9c))

- **deps**: Update actions/checkout action to v7
  ([#987](https://github.com/n24q02m/better-notion-mcp/pull/987),
  [`04e26fc`](https://github.com/n24q02m/better-notion-mcp/commit/04e26fce2e10e826262d3eebee30ac72c04de5a8))

- **deps**: Update dependency @types/node to v26
  ([#990](https://github.com/n24q02m/better-notion-mcp/pull/990),
  [`9a42e03`](https://github.com/n24q02m/better-notion-mcp/commit/9a42e03ea02fedb217824be7283606e49789a5b4))


## v2.35.0-beta.2 (2026-06-18)

### Bug Fixes

- Add post-deploy canary gate with auto-rollback to deploy_cf.py
  ([`d087f19`](https://github.com/n24q02m/better-notion-mcp/commit/d087f193232f4b374ef69f3833752417bb33cba4))

- Forward MCP_RELAY_PASSWORD into CF container so Gate A is enforced
  ([#977](https://github.com/n24q02m/better-notion-mcp/pull/977),
  [`91ba1a7`](https://github.com/n24q02m/better-notion-mcp/commit/91ba1a78fb5140422afd4e5d1c4e599678621fc6))

- Persist per-sub Notion token to KV so it survives container recreate
  ([#976](https://github.com/n24q02m/better-notion-mcp/pull/976),
  [`9714d3b`](https://github.com/n24q02m/better-notion-mcp/commit/9714d3b58173e4117275d537cf3bdb6913fa853e))

- Prefix unused account var to satisfy RUF059
  ([`d087f19`](https://github.com/n24q02m/better-notion-mcp/commit/d087f193232f4b374ef69f3833752417bb33cba4))

- Refresh lockfile (renovate maintenance)
  ([`e8d59c2`](https://github.com/n24q02m/better-notion-mcp/commit/e8d59c2f3525d3d3d43a98d1bfc58e2b33bca2d3))

- Refresh lockfile (renovate maintenance)
  ([`e43f95b`](https://github.com/n24q02m/better-notion-mcp/commit/e43f95b40bdba2c27f35958b499c72597e55fff0))

- Reject path traversal in resource read via DOCS_DIR boundary check
  ([`5200400`](https://github.com/n24q02m/better-notion-mcp/commit/52004000cc953b836c3318d670c8ccb4c49449f1))

- Update node.js base image
  ([`751cb8f`](https://github.com/n24q02m/better-notion-mcp/commit/751cb8faf370a3b59d0d8b69d9a74402aa9b7e04))

- Update non-major dependencies
  ([`aa1c811`](https://github.com/n24q02m/better-notion-mcp/commit/aa1c8113290011d391661c4b8502897a4715415a))

- Update non-major dependencies
  ([`c33cc96`](https://github.com/n24q02m/better-notion-mcp/commit/c33cc96c4f3c2b0efe78ca4993dd6c35acb0879c))

### Features

- Add post-deploy canary gate with auto-rollback to deploy_cf.py
  ([`d087f19`](https://github.com/n24q02m/better-notion-mcp/commit/d087f193232f4b374ef69f3833752417bb33cba4))

- Deploy notion to Cloudflare at notion.n24q02m.com
  ([#975](https://github.com/n24q02m/better-notion-mcp/pull/975),
  [`0856ebd`](https://github.com/n24q02m/better-notion-mcp/commit/0856ebde90e27883a9c52cdf19101527ade92aa1))


## v2.35.0-beta.1 (2026-06-15)

### Bug Fixes

- Bump mcp-core to 1.18.0-beta.7 for storage barrel subpath export
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Bump node alpine base image digest
  ([`18f5b53`](https://github.com/n24q02m/better-notion-mcp/commit/18f5b53a0de971a8f2a6261380e162b0e1b10ad1))

- Correct action count to 45 and drop stale daemon-respawn wording
  ([#940](https://github.com/n24q02m/better-notion-mcp/pull/940),
  [`64aa22a`](https://github.com/n24q02m/better-notion-mcp/commit/64aa22a76a0226fd1fe7a3f46fc6e91a2eae0a06))

- Correct action count, drop daemon-respawn wording, remove v<auto> placeholder
  ([#940](https://github.com/n24q02m/better-notion-mcp/pull/940),
  [`64aa22a`](https://github.com/n24q02m/better-notion-mcp/commit/64aa22a76a0226fd1fe7a3f46fc6e91a2eae0a06))

- Correct stdio config path and live deployment host in docs
  ([`a2baa17`](https://github.com/n24q02m/better-notion-mcp/commit/a2baa17531f82eb993b9541654d0299b317c522d))

- Cover tool-registry path-traversal and factory error guards
  ([`45df13b`](https://github.com/n24q02m/better-notion-mcp/commit/45df13b1de10df63c845e928fb61e0e4fd49cfc4))

- Guard error mapping against non-object thrown values
  ([`7774db4`](https://github.com/n24q02m/better-notion-mcp/commit/7774db4f6c63c32579e69d00e3b10c7f08e15eb6))

- Isolate CF worker type-check with workers-types and esModuleInterop
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Redact unsanitized input echoed in validation error path
  ([`46fd6c8`](https://github.com/n24q02m/better-notion-mcp/commit/46fd6c84eee662a2114ba7f7bfc8ee4ab9c75294))

- Refresh lock file for transitive dependency maintenance
  ([`1706bf2`](https://github.com/n24q02m/better-notion-mcp/commit/1706bf2a8d02f6319a698ebfc4033ccc9760d6c0))

- Remove literal v<auto> placeholder from stabilization note
  ([#940](https://github.com/n24q02m/better-notion-mcp/pull/940),
  [`64aa22a`](https://github.com/n24q02m/better-notion-mcp/commit/64aa22a76a0226fd1fe7a3f46fc6e91a2eae0a06))

- Remove orphaned Qodo pr-agent config
  ([#938](https://github.com/n24q02m/better-notion-mcp/pull/938),
  [`aef33cf`](https://github.com/n24q02m/better-notion-mcp/commit/aef33cf4cdae1d37cb00e6c9e40232a0e9a9487f))

- Restore PSR changelog generation and backfill version history
  ([#939](https://github.com/n24q02m/better-notion-mcp/pull/939),
  [`9152b2a`](https://github.com/n24q02m/better-notion-mcp/commit/9152b2ac954e46c4eab84b289e13252d145f63ca))

- Sync README tagline to current capability description
  ([#942](https://github.com/n24q02m/better-notion-mcp/pull/942),
  [`02b96e8`](https://github.com/n24q02m/better-notion-mcp/commit/02b96e8643d972a02c6f04d22a6379652267df3c))

- Update non-major dev dependencies
  ([`80781d5`](https://github.com/n24q02m/better-notion-mcp/commit/80781d5b22989e37a7aa1940765379a3f30cb516))

### Features

- Add @cloudflare/containers dependency for CF worker
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Add CF worker fronting per-sub Notion container with KV outbound
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Add Cloudflare deploy template and README section
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Add KV write-through Notion token store via PerPluginStore
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Add NotionTokenStoreLike interface for interchangeable token stores
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Add wrangler config with KV-only bindings and EdDSA secret wiring
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Bump mcp-core to 1.18.0-beta.5 floor for CfKv and EdDSA seam
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Cloudflare serverless migration (Worker + Container + KV write-through)
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Document and verify CREDENTIAL_SECRET EdDSA signing for CF deploy
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Regression-guard per-sub isolation and eviction-safe lock refresh
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Select KV token store for cf-kv backend in http transport
  ([#973](https://github.com/n24q02m/better-notion-mcp/pull/973),
  [`6ad49e0`](https://github.com/n24q02m/better-notion-mcp/commit/6ad49e06e201cf10f5ea5f1881082ec0c2208bbf))

- Split block handlers into typed helpers with discriminated-union returns
  ([`7d4d2ad`](https://github.com/n24q02m/better-notion-mcp/commit/7d4d2ad78df7c1bc8f39807f5750ccebf175c580))

- Sync cross-promo section ([#943](https://github.com/n24q02m/better-notion-mcp/pull/943),
  [`7c56493`](https://github.com/n24q02m/better-notion-mcp/commit/7c56493eb60af7d8c2e9d0306b649e96ddcabcc7))


## v2.34.8-beta.3 (2026-06-10)

### Bug Fixes

- Flatten deeply nested if in comments error handling
  ([#923](https://github.com/n24q02m/better-notion-mcp/pull/923),
  [`cdf8134`](https://github.com/n24q02m/better-notion-mcp/commit/cdf8134f1aa0e7812fe2bddcd5c6714adb6279ae))

- Optimize bulk database operations with standardized concurrency and retries
  ([#931](https://github.com/n24q02m/better-notion-mcp/pull/931),
  [`f530ed9`](https://github.com/n24q02m/better-notion-mcp/commit/f530ed9be3ba4af8ac2a02208f03f38c103a14c3))

- Optimize N+1 block deletion with batching and retries
  ([#911](https://github.com/n24q02m/better-notion-mcp/pull/911),
  [`d42a53c`](https://github.com/n24q02m/better-notion-mcp/commit/d42a53c0bb3c382509ec48cbaed0bc4ca19aae1b))

- Reconcile notionClientFactory test with auto-invoke registerTools mock
  ([#936](https://github.com/n24q02m/better-notion-mcp/pull/936),
  [`b9811e3`](https://github.com/n24q02m/better-notion-mcp/commit/b9811e3bd3129656c72bddd3dfb858ab1bb53598))

- Relocate fork-bomb protection to startServer
  ([#928](https://github.com/n24q02m/better-notion-mcp/pull/928),
  [`52e0cac`](https://github.com/n24q02m/better-notion-mcp/commit/52e0cac26b98c05317d9592595194f0cfc4a16eb))

- Remove token status exposure from console logs
  ([#920](https://github.com/n24q02m/better-notion-mcp/pull/920),
  [`51b12f3`](https://github.com/n24q02m/better-notion-mcp/commit/51b12f37b2f51a0241ae313a4427b98afbb865d6))

### Chores

- **helpers**: Tighten base64 length limit to 20MB
  ([#916](https://github.com/n24q02m/better-notion-mcp/pull/916),
  [`77cd511`](https://github.com/n24q02m/better-notion-mcp/commit/77cd511502bf9951f15d8d411b91d642e7220e85))

### Performance Improvements

- **pages**: Optimize string joining for title and rich_text properties
  ([#903](https://github.com/n24q02m/better-notion-mcp/pull/903),
  [`33257ac`](https://github.com/n24q02m/better-notion-mcp/commit/33257acf93de24c343c9d70d9f77a8b0a87a0be1))

### Testing

- Achieve 100% coverage for src/main.ts
  ([#924](https://github.com/n24q02m/better-notion-mcp/pull/924),
  [`ae9e959`](https://github.com/n24q02m/better-notion-mcp/commit/ae9e959a8008373d1b2ef49a069a84b425e9b4a6))

- Achieve 100% coverage for src/main.ts and fix constructor mock
  ([#924](https://github.com/n24q02m/better-notion-mcp/pull/924),
  [`ae9e959`](https://github.com/n24q02m/better-notion-mcp/commit/ae9e959a8008373d1b2ef49a069a84b425e9b4a6))

- Add comprehensive tests for createMCPServer
  ([#908](https://github.com/n24q02m/better-notion-mcp/pull/908),
  [`fcbf4c5`](https://github.com/n24q02m/better-notion-mcp/commit/fcbf4c5bc6e2e0bca400aef8628f597d462b7f06))

- Add comprehensive tests for startHttp in http transport
  ([#901](https://github.com/n24q02m/better-notion-mcp/pull/901),
  [`055c1ac`](https://github.com/n24q02m/better-notion-mcp/commit/055c1acbc337ce5d675bbb1bbe913a492fc48925))

- Add comprehensive unit and integration tests for initServer
  ([#919](https://github.com/n24q02m/better-notion-mcp/pull/919),
  [`56fb95b`](https://github.com/n24q02m/better-notion-mcp/commit/56fb95b63c268939ab446fd5697a732b485579ab))

- Add missing tests for formatIcon and improve robustness
  ([#914](https://github.com/n24q02m/better-notion-mcp/pull/914),
  [`f553cdd`](https://github.com/n24q02m/better-notion-mcp/commit/f553cdd0160672d2665137e1fa0af5f6a8c98504))

- **auth**: Add missing tests for getNotionToken and refactor resolver for coverage
  ([#917](https://github.com/n24q02m/better-notion-mcp/pull/917),
  [`73528db`](https://github.com/n24q02m/better-notion-mcp/commit/73528db47c73ab4d2225ddbcf9754e25ccfbc690))

- **covers**: Add comprehensive tests for formatCover and fix prototype pollution
  ([#922](https://github.com/n24q02m/better-notion-mcp/pull/922),
  [`a4408a4`](https://github.com/n24q02m/better-notion-mcp/commit/a4408a4dec247a61e356d1c68e582ad19ae4ebb3))

- **helpers**: Add missing edge cases for isValidBase64
  ([#934](https://github.com/n24q02m/better-notion-mcp/pull/934),
  [`274b528`](https://github.com/n24q02m/better-notion-mcp/commit/274b528e7b8e592381ec9a06a2d8f09776eef711))

- **id**: Add missing tests for formatId
  ([#921](https://github.com/n24q02m/better-notion-mcp/pull/921),
  [`328f943`](https://github.com/n24q02m/better-notion-mcp/commit/328f9437e97a6eb284ef3468f8db1d76ed632934))

- **id**: Add targeted robustness tests for isValidNotionId
  ([#930](https://github.com/n24q02m/better-notion-mcp/pull/930),
  [`f2719bb`](https://github.com/n24q02m/better-notion-mcp/commit/f2719bb26949685365da29cfe1e3846fbb3c43c6))

- **id**: Add unit tests for normalizeId
  ([#918](https://github.com/n24q02m/better-notion-mcp/pull/918),
  [`801cf40`](https://github.com/n24q02m/better-notion-mcp/commit/801cf402c41fa0ace02bc2197212b70c6bf480d8))

- **main**: Fix missing tests for getTransportMode and improve main.ts coverage
  ([#935](https://github.com/n24q02m/better-notion-mcp/pull/935),
  [`3a38a00`](https://github.com/n24q02m/better-notion-mcp/commit/3a38a0033baabbdd6b78eff90d721a4f741ce742))

- **properties**: Add tests for convertToNotionProperties and fix relation handling
  ([#926](https://github.com/n24q02m/better-notion-mcp/pull/926),
  [`81a639f`](https://github.com/n24q02m/better-notion-mcp/commit/81a639fcca77f9c38c86a67744cafcc9dc8d71f4))


## v2.34.8-beta.2 (2026-06-10)

### Bug Fixes

- Add Comparison capability matrix to README
  ([#900](https://github.com/n24q02m/better-notion-mcp/pull/900),
  [`0aa46df`](https://github.com/n24q02m/better-notion-mcp/commit/0aa46df647692454e21bb83a7bc9f2f6aaeb7b38))

- Correct tool-count drift and stale tool references in docs
  ([#899](https://github.com/n24q02m/better-notion-mcp/pull/899),
  [`6c2d616`](https://github.com/n24q02m/better-notion-mcp/commit/6c2d616fb784e99de875133f8aa34f430486daba))


## v2.34.8-beta.1 (2026-06-10)

### Bug Fixes

- **deps**: Update non-major dependencies to v1.17.4
  ([#896](https://github.com/n24q02m/better-notion-mcp/pull/896),
  [`ecbf29d`](https://github.com/n24q02m/better-notion-mcp/commit/ecbf29d1dc92e76991c445fe3a0465ffab721808))

### Chores

- **deps**: Lock file maintenance ([#897](https://github.com/n24q02m/better-notion-mcp/pull/897),
  [`39fcde3`](https://github.com/n24q02m/better-notion-mcp/commit/39fcde323f3d574eadccd23dd221f28a77f80c22))

- **deps**: Update step-security/harden-runner digest to 9af89fc
  ([#895](https://github.com/n24q02m/better-notion-mcp/pull/895),
  [`25ee784`](https://github.com/n24q02m/better-notion-mcp/commit/25ee784ec295e641dc590df0041ba8c5d9a81dfa))


## v2.34.7 (2026-06-09)


## v2.34.7-beta.1 (2026-06-09)

### Bug Fixes

- Drop redundant package-lock.json (bun.lock is authoritative)
  ([#854](https://github.com/n24q02m/better-notion-mcp/pull/854),
  [`e64e654`](https://github.com/n24q02m/better-notion-mcp/commit/e64e654aa91a0b43d7c771d89630ddbce26d805d))

### Chores

- **deps**: Update codecov/codecov-action action to v7
  ([#857](https://github.com/n24q02m/better-notion-mcp/pull/857),
  [`fcea9ca`](https://github.com/n24q02m/better-notion-mcp/commit/fcea9ca67a41123b3e063c5fee52de05ba07a230))

- **deps**: Update non-major dependencies
  ([#856](https://github.com/n24q02m/better-notion-mcp/pull/856),
  [`a3751f0`](https://github.com/n24q02m/better-notion-mcp/commit/a3751f0a2d0570b222a0d9782661bf04b5185ed0))


## v2.34.6 (2026-06-07)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.17.3 ([#853](https://github.com/n24q02m/better-notion-mcp/pull/853),
  [`8bcd5ad`](https://github.com/n24q02m/better-notion-mcp/commit/8bcd5ad4b7002fecc2cd25185ce1ffbc066284c6))


## v2.34.5 (2026-06-07)


## v2.34.5-beta.1 (2026-06-07)

### Bug Fixes

- Add base64 length check to isValidBase64 to prevent OOM
  ([`d54b3c1`](https://github.com/n24q02m/better-notion-mcp/commit/d54b3c17003bd3611307bf168be06f3406435ef1))

- Add limit option to autoPaginate and wire pagination into user search
  ([`edd6fb9`](https://github.com/n24q02m/better-notion-mcp/commit/edd6fb9449bb42ac02cd6e3598e18dedb201baf8))

- Add tests for convertToNotionProperties fallthrough in properties.ts
  ([`7f4d929`](https://github.com/n24q02m/better-notion-mcp/commit/7f4d929c619f65619d01201b2363c9ed0cabb1df))

- Add tests for createMCPServer in create-server.ts
  ([`6a0c7da`](https://github.com/n24q02m/better-notion-mcp/commit/6a0c7da092923c7b7cd628523b2579944e030ee6))

- Add tests for formatCover in covers.ts
  ([`2fa7026`](https://github.com/n24q02m/better-notion-mcp/commit/2fa70260f98fd6fb26d4d1fdae3f1d35c1ba1e9f))

- Add tests for formatIcon in icons.ts
  ([`cb8344f`](https://github.com/n24q02m/better-notion-mcp/commit/cb8344fb6949eb34980490ece1c7be090e09c8c7))

- Add tests for isValidNotionId in id.ts
  ([`d1f05dd`](https://github.com/n24q02m/better-notion-mcp/commit/d1f05dd7c090d43cfb43d5862aa1820309895c36))

- Add tests for suggestFixes in errors.ts
  ([`f651eaa`](https://github.com/n24q02m/better-notion-mcp/commit/f651eaa83421430fba62c93dcf7e5fcd694ff5b7))

- Harden XPIA breakout regex to match closing-tag attributes in wrapToolResult
  ([`1dc2e1e`](https://github.com/n24q02m/better-notion-mcp/commit/1dc2e1eddac2ca7181bbde86a9a7ebe741b38b4e))

- Lock file maintenance
  ([`61afa1f`](https://github.com/n24q02m/better-notion-mcp/commit/61afa1f76759d3d7a7fe93ffa2fe9e390d4840ab))

- Prevent data loss in updatePage by gating block replacement behind explicit replace flag
  ([`bdf8e7d`](https://github.com/n24q02m/better-notion-mcp/commit/bdf8e7d02d458199671e0d2c4bc7b2b02ad2236f))

- Update actions/checkout digest to df4cb1c
  ([`b363ab0`](https://github.com/n24q02m/better-notion-mcp/commit/b363ab0c7425dc9d7990f09e18fb72163649520f))


## v2.34.4 (2026-06-01)

### Bug Fixes

- Pin mcp-core 1.17.2 (stable)
  ([`584ec47`](https://github.com/n24q02m/better-notion-mcp/commit/584ec47cdda5d87d1d59afdcb1c8f445a4331105))


## v2.34.4-beta.1 (2026-06-01)

### Bug Fixes

- Bump mcp-core to 1.17.2-beta.1 for beta testing
  ([`6320a2d`](https://github.com/n24q02m/better-notion-mcp/commit/6320a2dfe1bf85fc75ee8e62eeb9d05a369d012b))

- Repoint dead docs/setup-manual.md link to hosted setup guide
  ([#775](https://github.com/n24q02m/better-notion-mcp/pull/775),
  [`05b29f2`](https://github.com/n24q02m/better-notion-mcp/commit/05b29f2fcf0526f003dbe99b1c9c8c311aefab4a))

- Sync docs with current code (env vars, modes, file structure)
  ([#774](https://github.com/n24q02m/better-notion-mcp/pull/774),
  [`a7c08d8`](https://github.com/n24q02m/better-notion-mcp/commit/a7c08d84a2e5ac26abf9217ce6d4c42f62e57204))


## v2.34.3 (2026-05-29)

### Bug Fixes

- Pin mcp-core 1.17.1 (BearerMCPApp resource_metadata #260)
  ([`05abc3f`](https://github.com/n24q02m/better-notion-mcp/commit/05abc3f320b2555ce3aff7896613c7f21a78ec3f))


## v2.34.2 (2026-05-29)

### Bug Fixes

- Pin mcp-core 1.17.0 (stable OAuth refresh_token)
  ([`a7f3215`](https://github.com/n24q02m/better-notion-mcp/commit/a7f32159564c4ebfaccba733bcb9041806454723))


## v2.34.2-beta.1 (2026-05-29)

### Bug Fixes

- Add fork-bomb bootstrap guard to prevent recursive server starts
  ([#754](https://github.com/n24q02m/better-notion-mcp/pull/754),
  [`ea7e70b`](https://github.com/n24q02m/better-notion-mcp/commit/ea7e70b63cd50fa7f3b2cd2e6de3cbc2ee9b6aa9))

- Add isSafeWebUrl security test coverage
  ([#747](https://github.com/n24q02m/better-notion-mcp/pull/747),
  [`afa24f9`](https://github.com/n24q02m/better-notion-mcp/commit/afa24f95bca661aaa4ed32305ae038fd1c3aff6a))

- Bump mcp-core to 1.17.0-beta.1 for OAuth refresh_token
  ([`b77e067`](https://github.com/n24q02m/better-notion-mcp/commit/b77e067eaccd598f35c50b59b95a29300cc754dc))

- Lock file maintenance ([#766](https://github.com/n24q02m/better-notion-mcp/pull/766),
  [`ea95af4`](https://github.com/n24q02m/better-notion-mcp/commit/ea95af4affac51dbf81c8a85b2be6d7700c5562a))

- Redact error object to message-only in bootstrap failure log
  ([#741](https://github.com/n24q02m/better-notion-mcp/pull/741),
  [`d9acb1a`](https://github.com/n24q02m/better-notion-mcp/commit/d9acb1a06c83b4460531543af057e8f1e71f7b61))


## v2.34.1 (2026-05-28)

### Bug Fixes

- Drop biome-rejected parens in authScope ternary
  ([`b45aa74`](https://github.com/n24q02m/better-notion-mcp/commit/b45aa74f43ce390f2b02a45c6543ab7caec869f6))

- Regenerate bun.lock to satisfy frozen-lockfile CI check
  ([`e2939e7`](https://github.com/n24q02m/better-notion-mcp/commit/e2939e7a72762e5ed268c27cce31a21d8e7bef85))

- **deps**: Update non-major dependencies
  ([#727](https://github.com/n24q02m/better-notion-mcp/pull/727),
  [`9caccc8`](https://github.com/n24q02m/better-notion-mcp/commit/9caccc8fc14fc8b16fa50b234b9dacc702a79687))


## v2.34.0 (2026-05-26)


## v2.34.0-beta.1 (2026-05-26)

### Chores

- **deps**: Lock file maintenance ([#724](https://github.com/n24q02m/better-notion-mcp/pull/724),
  [`da06d02`](https://github.com/n24q02m/better-notion-mcp/commit/da06d027190e3d2dcc8efb31680c898613372726))

- **deps**: Lock file maintenance ([#722](https://github.com/n24q02m/better-notion-mcp/pull/722),
  [`cfec26d`](https://github.com/n24q02m/better-notion-mcp/commit/cfec26dd100503fb463255191aaff69d7c0d0b87))

### Features

- Cut new beta to expose MCP_AUTH_DISABLE wired in #725 squash
  ([`6c1a1e3`](https://github.com/n24q02m/better-notion-mcp/commit/6c1a1e3ce93a9187c201a8be5a8799ed84bb420c))


## v2.33.1-beta.1 (2026-05-24)

### Bug Fixes

- Redact headers case-insensitively, optimize property extraction
  ([#713](https://github.com/n24q02m/better-notion-mcp/pull/713),
  [`a44da32`](https://github.com/n24q02m/better-notion-mcp/commit/a44da32cb359e8b68f9ec0f568877c41e81eb317))

- **ci**: Restore plugin.json formatting after version bump
  ([#713](https://github.com/n24q02m/better-notion-mcp/pull/713),
  [`a44da32`](https://github.com/n24q02m/better-notion-mcp/commit/a44da32cb359e8b68f9ec0f568877c41e81eb317))

- **deps**: Regenerate bun.lock and sync biome schema ref
  ([#692](https://github.com/n24q02m/better-notion-mcp/pull/692),
  [`15d8fb6`](https://github.com/n24q02m/better-notion-mcp/commit/15d8fb645b21b8d6d852a8df930d3410bee71278))

- **deps**: Update non-major dependencies
  ([#692](https://github.com/n24q02m/better-notion-mcp/pull/692),
  [`15d8fb6`](https://github.com/n24q02m/better-notion-mcp/commit/15d8fb645b21b8d6d852a8df930d3410bee71278))

- **security**: Redact sensitive headers regardless of casing
  ([#713](https://github.com/n24q02m/better-notion-mcp/pull/713),
  [`a44da32`](https://github.com/n24q02m/better-notion-mcp/commit/a44da32cb359e8b68f9ec0f568877c41e81eb317))

- **security**: Wrap file_uploads responses with XPIA safety markers
  ([#713](https://github.com/n24q02m/better-notion-mcp/pull/713),
  [`a44da32`](https://github.com/n24q02m/better-notion-mcp/commit/a44da32cb359e8b68f9ec0f568877c41e81eb317))

### Chores

- **deps**: Lock file maintenance ([#690](https://github.com/n24q02m/better-notion-mcp/pull/690),
  [`923387f`](https://github.com/n24q02m/better-notion-mcp/commit/923387f27cb0d7c4be327dc4e7beaa896fe49c7c))

- **deps**: Update actions/create-github-app-token digest to bcd2ba4
  ([#696](https://github.com/n24q02m/better-notion-mcp/pull/696),
  [`a16a5df`](https://github.com/n24q02m/better-notion-mcp/commit/a16a5dfd521df83992a34e22bdda1a9a6b581b73))

- **deps**: Update actions/dependency-review-action action to v5
  ([#691](https://github.com/n24q02m/better-notion-mcp/pull/691),
  [`0bb9637`](https://github.com/n24q02m/better-notion-mcp/commit/0bb96375c6c3ee635fe09d6c8afed0d90bb76237))

- **deps**: Update codecov/codecov-action digest to e79a696
  ([#714](https://github.com/n24q02m/better-notion-mcp/pull/714),
  [`0e8e57b`](https://github.com/n24q02m/better-notion-mcp/commit/0e8e57bf95e5b477232ea6ab72a15fdb2868bf76))

- **deps**: Update docker/build-push-action digest to f9f3042
  ([#715](https://github.com/n24q02m/better-notion-mcp/pull/715),
  [`38c7725`](https://github.com/n24q02m/better-notion-mcp/commit/38c772558c74092748d2bc4c795f3fe02cd1d20f))

- **deps**: Update docker/login-action digest to 650006c
  ([#716](https://github.com/n24q02m/better-notion-mcp/pull/716),
  [`79d42aa`](https://github.com/n24q02m/better-notion-mcp/commit/79d42aa5986711a3bc2845eadc92966dba0d2119))

- **deps**: Update docker/setup-buildx-action digest to d7f5e7f
  ([#717](https://github.com/n24q02m/better-notion-mcp/pull/717),
  [`60e2b6a`](https://github.com/n24q02m/better-notion-mcp/commit/60e2b6af7fb3b0c4398b94245230c0dd44911c9f))

- **deps**: Update oven/bun:1-alpine docker digest to 5acc90a
  ([#697](https://github.com/n24q02m/better-notion-mcp/pull/697),
  [`6e39e08`](https://github.com/n24q02m/better-notion-mcp/commit/6e39e080e7e21f128a78a5bf215c72b2fd95e727))

- **deps**: Update step-security/harden-runner digest to ab7a940
  ([#718](https://github.com/n24q02m/better-notion-mcp/pull/718),
  [`1fad417`](https://github.com/n24q02m/better-notion-mcp/commit/1fad4173a2bd8ea2404b02ace876a7132275bd3c))

### Performance Improvements

- **properties**: Cache p.type and nested arrays in extractPageProperties
  ([#713](https://github.com/n24q02m/better-notion-mcp/pull/713),
  [`a44da32`](https://github.com/n24q02m/better-notion-mcp/commit/a44da32cb359e8b68f9ec0f568877c41e81eb317))


## v2.33.0 (2026-05-09)


## v2.33.0-beta.1 (2026-05-08)

### Bug Fixes

- Add edge case test for extractPageProperties
  ([`9523139`](https://github.com/n24q02m/better-notion-mcp/commit/9523139a3619513a3dec265a94b87d8cd7a74e7e))

- Add error test in documentation resource
  ([`6842dca`](https://github.com/n24q02m/better-notion-mcp/commit/6842dca71b0535740a5d54ac8a356ffc0bf07f2a))

- Add missing error path test in users tool
  ([`f9dc730`](https://github.com/n24q02m/better-notion-mcp/commit/f9dc730d6054dfaab3465a8f6f4b2913209c8de4))

- Improve comments.list 404 error UX with suggestion fallbacks
  ([`14d1019`](https://github.com/n24q02m/better-notion-mcp/commit/14d10198fc186afd85abab66ae951feef24c77e6))

- Optimize normalizeId fast path with early-return
  ([`b539125`](https://github.com/n24q02m/better-notion-mcp/commit/b539125f60c6cc0a17c9fb6364a01ddb6c791afc))

- Refactor deeply nested blocks-to-markdown conversion
  ([`042cc1c`](https://github.com/n24q02m/better-notion-mcp/commit/042cc1c2871ee4bcb310d6304611af5094cc47fc))

- Remove commented-out console.log statements
  ([`5520118`](https://github.com/n24q02m/better-notion-mcp/commit/552011853ad4ae4dc1ccafec77f07609ddfd6463))

- Remove excessive any cast in populateDeepChildren
  ([`f7e445b`](https://github.com/n24q02m/better-notion-mcp/commit/f7e445b0ee65c1e10a1c209486ba90e9c444be04))

- Remove explicit any cast for properties in pages tool
  ([`b5f902b`](https://github.com/n24q02m/better-notion-mcp/commit/b5f902b5f097290c0d9745b6c862523efeb3a8ce))

- Remove redundant duplicate any cast in pages tool
  ([`2058127`](https://github.com/n24q02m/better-notion-mcp/commit/2058127346702d7e9ecbd3fb074ca739a1e545ec))

- Resolve TODO for unchecked checkbox parsing in markdown
  ([`ce8d696`](https://github.com/n24q02m/better-notion-mcp/commit/ce8d696bc526ab9ca16eb5de3b96b55809ad79e6))

- Simplify enhanceError error mapping logic
  ([`4f5da25`](https://github.com/n24q02m/better-notion-mcp/commit/4f5da25f152e1ea951cea2ecb80a5fb7242aec80))

- Split overly long formatIcon function in icons helper
  ([`3f3cc7f`](https://github.com/n24q02m/better-notion-mcp/commit/3f3cc7fa26ac7370684876d60e9d687cfefdf047))

- Update setup-manual.md refs in error messages to mcp.n24q02m.com
  ([`a55a682`](https://github.com/n24q02m/better-notion-mcp/commit/a55a682c73b4c2b3ef2366a6ff4a831aa4376f84))

- **deps**: Lock file maintenance
  ([`5753ce3`](https://github.com/n24q02m/better-notion-mcp/commit/5753ce3de7652c238c698f5e364247fbe7c02039))

- **deps**: Refresh bun.lock for non-major bumps
  ([`ae02289`](https://github.com/n24q02m/better-notion-mcp/commit/ae0228969dc9ab578c59706a4bd4a2fc9599e297))

- **deps**: Update non-major dependencies
  ([`ae02289`](https://github.com/n24q02m/better-notion-mcp/commit/ae0228969dc9ab578c59706a4bd4a2fc9599e297))

### Features

- Add Table of contents heading + auto-generated link list (Spec E Wave 2)
  ([`853e522`](https://github.com/n24q02m/better-notion-mcp/commit/853e5222495d3bb8ae90845e755ba9f349d2b382))

- Add tests for formatId function
  ([`0ffcb99`](https://github.com/n24q02m/better-notion-mcp/commit/0ffcb99765a673d22dcc4735cfd96e6af08a474b))

- Add tests for startHttp function in http transport
  ([`9b5ad61`](https://github.com/n24q02m/better-notion-mcp/commit/9b5ad6187f2dfc6361b7105fed631017dfd266ad))

- Link to mcp.n24q02m.com unified docs site (Spec F Phase 4)
  ([`be2390a`](https://github.com/n24q02m/better-notion-mcp/commit/be2390ae7ed013568b2d2514857c27fe7430ea20))

- Sync cross-promo section ([#688](https://github.com/n24q02m/better-notion-mcp/pull/688),
  [`40f153b`](https://github.com/n24q02m/better-notion-mcp/commit/40f153bee62570be1236590fec8cdd4dc5563c83))


## v2.32.0 (2026-05-06)


## v2.32.0-beta.1 (2026-05-06)

### Bug Fixes

- Consolidate setup docs body to 3 methods (drop legacy Method 4/5)
  ([#646](https://github.com/n24q02m/better-notion-mcp/pull/646),
  [`718c289`](https://github.com/n24q02m/better-notion-mcp/commit/718c289a925064fcec7b74cfe48ae2b363b0bd45))

- Regenerate bun.lock after non-major dep bumps
  ([`8f3c0e8`](https://github.com/n24q02m/better-notion-mcp/commit/8f3c0e8d414636eb4279761a96f0228c18c379f3))

- **deps**: Update non-major dependencies
  ([#634](https://github.com/n24q02m/better-notion-mcp/pull/634),
  [`d66e012`](https://github.com/n24q02m/better-notion-mcp/commit/d66e012c84278c9e24b9ba7fd38cba864e000e93))

### Chores

- **deps**: Lock file maintenance ([#635](https://github.com/n24q02m/better-notion-mcp/pull/635),
  [`accba4c`](https://github.com/n24q02m/better-notion-mcp/commit/accba4c53a69f2387bbf2c6db43466b28d9d574b))

- **deps**: Update step-security/harden-runner digest to a5ad31d
  ([#633](https://github.com/n24q02m/better-notion-mcp/pull/633),
  [`ee2b924`](https://github.com/n24q02m/better-notion-mcp/commit/ee2b9246871793b23cbc92c95f6639177a52ab1c))

### Features

- Add explicit Method overview section to setup docs
  ([#645](https://github.com/n24q02m/better-notion-mcp/pull/645),
  [`808217f`](https://github.com/n24q02m/better-notion-mcp/commit/808217fe3b974277a2682cecc49af4f7346f1869))

- Clarify Method 1 vs Method 3 mutually exclusive (CC scope-by-endpoint)
  ([#650](https://github.com/n24q02m/better-notion-mcp/pull/650),
  [`4780756`](https://github.com/n24q02m/better-notion-mcp/commit/4780756c7f6aac02977e707cdc771245e13de554))

- Declare userConfig schema and document install prompt
  ([#647](https://github.com/n24q02m/better-notion-mcp/pull/647),
  [`97d0317`](https://github.com/n24q02m/better-notion-mcp/commit/97d031711d9ef7f5003f953eecfeecf017990bd4))

- Document userConfig credential prompts per plugin
  ([#649](https://github.com/n24q02m/better-notion-mcp/pull/649),
  [`736e3a1`](https://github.com/n24q02m/better-notion-mcp/commit/736e3a16045b5f276c36697d9a3c6ecbd3f1c204))

- Include Method 2 (Docker stdio) in mutual exclusivity rule
  ([#650](https://github.com/n24q02m/better-notion-mcp/pull/650),
  [`4780756`](https://github.com/n24q02m/better-notion-mcp/commit/4780756c7f6aac02977e707cdc771245e13de554))

### Performance Improvements

- Hoist callout maps out of helper functions
  ([#651](https://github.com/n24q02m/better-notion-mcp/pull/651),
  [`b37b715`](https://github.com/n24q02m/better-notion-mcp/commit/b37b71535bd41b66e79d5da8ecd30d13e52c5f43))


## v2.31.0 (2026-05-04)

### Bug Fixes

- Bump mcp-core to 1.13.0 (STABLE) ([#644](https://github.com/n24q02m/better-notion-mcp/pull/644),
  [`931c1f3`](https://github.com/n24q02m/better-notion-mcp/commit/931c1f347aaa6b9c8f787f7a7b7f7d3fde753221))


## v2.31.0-beta.6 (2026-05-03)

### Bug Fixes

- Bump mcp-core to 1.13.0-beta.9 for /login form shell refactor
  ([#641](https://github.com/n24q02m/better-notion-mcp/pull/641),
  [`1ec995b`](https://github.com/n24q02m/better-notion-mcp/commit/1ec995b7ef1d9bc86fb73415bc66374f76f017a4))


## v2.31.0-beta.5 (2026-05-03)

### Bug Fixes

- Bump mcp-core to 1.13.0-beta.8 for delegated /login gate
  ([#640](https://github.com/n24q02m/better-notion-mcp/pull/640),
  [`b7a4274`](https://github.com/n24q02m/better-notion-mcp/commit/b7a4274c0564ed480d9ea9c85918c3aa541fdaf4))


## v2.31.0-beta.4 (2026-05-03)

### Features

- Bump mcp-core to 1.13.0-beta.7 ([#639](https://github.com/n24q02m/better-notion-mcp/pull/639),
  [`56d474b`](https://github.com/n24q02m/better-notion-mcp/commit/56d474bd9ce650ed12f392c0fb0865b2e32f53ff))

- Document MCP_RELAY_PASSWORD edge auth gate
  ([#638](https://github.com/n24q02m/better-notion-mcp/pull/638),
  [`d352bfc`](https://github.com/n24q02m/better-notion-mcp/commit/d352bfc954ba12238926e4509c0ef0b8e0ccbb83))

- Pass MCP_RELAY_PASSWORD env to HTTP container
  ([#637](https://github.com/n24q02m/better-notion-mcp/pull/637),
  [`0d1404d`](https://github.com/n24q02m/better-notion-mcp/commit/0d1404d91848a49f6ac75625918fcb5fc1540aa7))


## v2.31.0-beta.3 (2026-05-02)

### Bug Fixes

- Setup docs + README reflect stdio-pure architecture
  ([#632](https://github.com/n24q02m/better-notion-mcp/pull/632),
  [`4ca8d25`](https://github.com/n24q02m/better-notion-mcp/commit/4ca8d25b67e0f1fbb0a0ec849ecfa4fed27b117e))

### Chores

- **deps**: Lock file maintenance ([#626](https://github.com/n24q02m/better-notion-mcp/pull/626),
  [`733c1ea`](https://github.com/n24q02m/better-notion-mcp/commit/733c1ea6904a75870d274c4d47098d54c29f374d))

- **deps**: Update dawidd6/action-send-mail action to v17
  ([#625](https://github.com/n24q02m/better-notion-mcp/pull/625),
  [`290bb31`](https://github.com/n24q02m/better-notion-mcp/commit/290bb311fc523f19bb7052c53cae524a689f4da7))

### Features

- Stdio-pure + http-multi-user (drop daemon-bridge)
  ([#631](https://github.com/n24q02m/better-notion-mcp/pull/631),
  [`911b62e`](https://github.com/n24q02m/better-notion-mcp/commit/911b62e4b8772cdb03e373833fdbc1cc9e76cb31))

### Performance Improvements

- **security**: Optimize URL delimiter parsing
  ([#629](https://github.com/n24q02m/better-notion-mcp/pull/629),
  [`eb99588`](https://github.com/n24q02m/better-notion-mcp/commit/eb99588b61ba40c14b325f1756caa656c0780747))


## v2.31.0-beta.2 (2026-04-30)

### Bug Fixes

- Move stdio-direct test to tests/live (requires build artifact)
  ([#623](https://github.com/n24q02m/better-notion-mcp/pull/623),
  [`a14602c`](https://github.com/n24q02m/better-notion-mcp/commit/a14602cfa2c3eb2f6067b9e41fc1e69136168304))

### Features

- Route stdio mode to MCP SDK direct + multi-target Dockerfile
  ([#623](https://github.com/n24q02m/better-notion-mcp/pull/623),
  [`a14602c`](https://github.com/n24q02m/better-notion-mcp/commit/a14602cfa2c3eb2f6067b9e41fc1e69136168304))

- **docs**: Add trust model section to README
  ([#623](https://github.com/n24q02m/better-notion-mcp/pull/623),
  [`a14602c`](https://github.com/n24q02m/better-notion-mcp/commit/a14602cfa2c3eb2f6067b9e41fc1e69136168304))


## v2.31.0-beta.1 (2026-04-30)

### Bug Fixes

- Move stdio-direct test to tests/live (requires build artifact)
  ([#621](https://github.com/n24q02m/better-notion-mcp/pull/621),
  [`98c03ce`](https://github.com/n24q02m/better-notion-mcp/commit/98c03ce4758f1d3458a22ff57146b9bb8bba869f))

### Features

- Route stdio mode to FastMCP/MCP SDK direct + multi-target Dockerfile
  ([#621](https://github.com/n24q02m/better-notion-mcp/pull/621),
  [`98c03ce`](https://github.com/n24q02m/better-notion-mcp/commit/98c03ce4758f1d3458a22ff57146b9bb8bba869f))

- Route stdio mode to MCP SDK direct + multi-target Dockerfile
  ([#621](https://github.com/n24q02m/better-notion-mcp/pull/621),
  [`98c03ce`](https://github.com/n24q02m/better-notion-mcp/commit/98c03ce4758f1d3458a22ff57146b9bb8bba869f))


## v2.30.6 (2026-04-29)

### Bug Fixes

- Rebuild against mcp-core 1.11.5 fork-bomb fix
  ([#620](https://github.com/n24q02m/better-notion-mcp/pull/620),
  [`b1bf88a`](https://github.com/n24q02m/better-notion-mcp/commit/b1bf88a7939e9cd94746d50c9c71ff75ce505216))


## v2.30.5 (2026-04-29)


## v2.30.5-beta.1 (2026-04-29)

### Bug Fixes

- Revert eagerRelaySchema usage (D18 rollback)
  ([#617](https://github.com/n24q02m/better-notion-mcp/pull/617),
  [`857b80a`](https://github.com/n24q02m/better-notion-mcp/commit/857b80a44fd345b4603ecb173919d7c8d05de0db))


## v2.30.4 (2026-04-29)

### Bug Fixes

- Pass RELAY_SCHEMA as eagerRelaySchema for stdio mode + bump mcp-core to 1.11.3
  ([#616](https://github.com/n24q02m/better-notion-mcp/pull/616),
  [`fa2c547`](https://github.com/n24q02m/better-notion-mcp/commit/fa2c54755f1ef68e871d4289c1e0cab63e2089a5))

- Pin @latest in plugin.json to bypass npx cache stale versions
  ([#614](https://github.com/n24q02m/better-notion-mcp/pull/614),
  [`1eef664`](https://github.com/n24q02m/better-notion-mcp/commit/1eef66411a332853a310cf4230bb4d4d0d132927))

- Register config__open_relay tool (Transparent Bridge Wave 3)
  ([#614](https://github.com/n24q02m/better-notion-mcp/pull/614),
  [`1eef664`](https://github.com/n24q02m/better-notion-mcp/commit/1eef66411a332853a310cf4230bb4d4d0d132927))


## v2.30.3 (2026-04-29)

### Bug Fixes

- Register config__open_relay tool (Transparent Bridge Wave 3)
  ([#612](https://github.com/n24q02m/better-notion-mcp/pull/612),
  [`a948941`](https://github.com/n24q02m/better-notion-mcp/commit/a9489418f35e147d7970ff686a90ac5d12ba7f22))

- Switch plugin.json to stdio proxy for local relay testing
  ([#609](https://github.com/n24q02m/better-notion-mcp/pull/609),
  [`9195dea`](https://github.com/n24q02m/better-notion-mcp/commit/9195dea4a9569aebe94cacb016ed9b6458316993))

- **deps**: Bump @n24q02m/mcp-core to 1.10.0 — Transparent Bridge waves 1-3
  ([#609](https://github.com/n24q02m/better-notion-mcp/pull/609),
  [`9195dea`](https://github.com/n24q02m/better-notion-mcp/commit/9195dea4a9569aebe94cacb016ed9b6458316993))


## v2.30.2 (2026-04-28)

### Bug Fixes

- Document MCP_MODE remote-oauth vs local-relay in setup docs
  ([#606](https://github.com/n24q02m/better-notion-mcp/pull/606),
  [`6789f86`](https://github.com/n24q02m/better-notion-mcp/commit/6789f86f8d2a31b585c7154d3fa059b47c93293a))

- **deps**: Bump @n24q02m/mcp-core to 1.10.0 — Transparent Bridge waves 1-3
  ([#608](https://github.com/n24q02m/better-notion-mcp/pull/608),
  [`984dbdc`](https://github.com/n24q02m/better-notion-mcp/commit/984dbdc9e0ee108d4c7bef7bdabaf89917c8190b))


## v2.30.1 (2026-04-28)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.9.0 ([#605](https://github.com/n24q02m/better-notion-mcp/pull/605),
  [`8ef32ad`](https://github.com/n24q02m/better-notion-mcp/commit/8ef32ad171bc75b901e831a415fbf8e6548335d1))

- **deps**: Update dependency @n24q02m/mcp-core to ^1.8.1
  ([#599](https://github.com/n24q02m/better-notion-mcp/pull/599),
  [`782ec10`](https://github.com/n24q02m/better-notion-mcp/commit/782ec10ffa17cabbed03b4d9e61303459c6035d8))

### Chores

- **deps**: Lock file maintenance ([#600](https://github.com/n24q02m/better-notion-mcp/pull/600),
  [`2aaec9c`](https://github.com/n24q02m/better-notion-mcp/commit/2aaec9c11eaaf4a9f37b87e216be69889c5eb4c4))


## v2.30.0 (2026-04-27)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.8.0 ([#597](https://github.com/n24q02m/better-notion-mcp/pull/597),
  [`327bf30`](https://github.com/n24q02m/better-notion-mcp/commit/327bf30570c464a30c6fe8e87264f0f06b1498f1))

### Chores

- **deps**: Lock file maintenance ([#592](https://github.com/n24q02m/better-notion-mcp/pull/592),
  [`3d65a19`](https://github.com/n24q02m/better-notion-mcp/commit/3d65a19e9cbd447fda6a95f668cdeb1775e14063))

### Features

- Add ## E2E section to CLAUDE.md per Task 21 docs rollout
  ([#597](https://github.com/n24q02m/better-notion-mcp/pull/597),
  [`327bf30`](https://github.com/n24q02m/better-notion-mcp/commit/327bf30570c464a30c6fe8e87264f0f06b1498f1))

- Add ## E2E section to CLAUDE.md per Task 21 docs rollout
  ([#595](https://github.com/n24q02m/better-notion-mcp/pull/595),
  [`4c88af1`](https://github.com/n24q02m/better-notion-mcp/commit/4c88af1a84ccea91645c294e9a32463aaddc6041))


## v2.29.2-beta.1 (2026-04-27)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.8.0-beta.1 for /mcp session-routing fix
  ([`a74c7a1`](https://github.com/n24q02m/better-notion-mcp/commit/a74c7a113309b5d634eb390e4a801be3812d82fe))

- Sweep doppler/infisical refs to skret SSM
  ([`9dd9cd8`](https://github.com/n24q02m/better-notion-mcp/commit/9dd9cd886c302aaa9ea7df25e4942b5fe518878b))


## v2.29.1 (2026-04-24)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.7.6 ([#591](https://github.com/n24q02m/better-notion-mcp/pull/591),
  [`ccc2c71`](https://github.com/n24q02m/better-notion-mcp/commit/ccc2c71ebbb7b2be5b42d7013032a02270fefaa0))


## v2.29.0 (2026-04-24)

### Bug Fixes

- Bump @n24q02m/mcp-core to ^1.7.0 for transport subpath export
  ([#583](https://github.com/n24q02m/better-notion-mcp/pull/583),
  [`bc6a910`](https://github.com/n24q02m/better-notion-mcp/commit/bc6a91091c01d65bf4174df3ab08c186f7249ab4))

- Regenerate bun.lock after @n24q02m/mcp-core 1.7.5 bump
  ([#589](https://github.com/n24q02m/better-notion-mcp/pull/589),
  [`7e43296`](https://github.com/n24q02m/better-notion-mcp/commit/7e43296cfb42ba5a31b2501b9ffe0e1aaf428dde))

- Regenerate bun.lock after @n24q02m/mcp-core 1.7.5 bump
  ([#579](https://github.com/n24q02m/better-notion-mcp/pull/579),
  [`f0015a9`](https://github.com/n24q02m/better-notion-mcp/commit/f0015a9410aa7a64617eb74ba77f061702673cf9))

- Report per-JWT-sub has_token in remote-oauth config status
  ([#589](https://github.com/n24q02m/better-notion-mcp/pull/589),
  [`7e43296`](https://github.com/n24q02m/better-notion-mcp/commit/7e43296cfb42ba5a31b2501b9ffe0e1aaf428dde))

- **deps**: Update non-major dependencies
  ([#589](https://github.com/n24q02m/better-notion-mcp/pull/589),
  [`7e43296`](https://github.com/n24q02m/better-notion-mcp/commit/7e43296cfb42ba5a31b2501b9ffe0e1aaf428dde))

- **deps**: Update non-major dependencies
  ([#579](https://github.com/n24q02m/better-notion-mcp/pull/579),
  [`f0015a9`](https://github.com/n24q02m/better-notion-mcp/commit/f0015a9410aa7a64617eb74ba77f061702673cf9))

### Chores

- **deps**: Lock file maintenance ([#580](https://github.com/n24q02m/better-notion-mcp/pull/580),
  [`62531e4`](https://github.com/n24q02m/better-notion-mcp/commit/62531e45e7335cf466ca29d0d8f93575ec255185))

- **deps**: Lock file maintenance ([#578](https://github.com/n24q02m/better-notion-mcp/pull/578),
  [`ca892fc`](https://github.com/n24q02m/better-notion-mcp/commit/ca892fc04af03fed6627bb4515e34ab8449aae18))

### Features

- Migrate stdio transport to 1-Daemon architecture (runSmartStdioProxy)
  ([`6093949`](https://github.com/n24q02m/better-notion-mcp/commit/60939495480ed8ac0b87b78a62581c7c232102e9))


## v2.28.10 (2026-04-22)

### Bug Fixes

- Sync credential-state after local-relay token save
  ([#577](https://github.com/n24q02m/better-notion-mcp/pull/577),
  [`b9fb62b`](https://github.com/n24q02m/better-notion-mcp/commit/b9fb62b10e6e112582793eac27932a7417ae68a7))


## v2.28.9 (2026-04-22)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.6.3 (relay form follow redirect_url)
  ([#576](https://github.com/n24q02m/better-notion-mcp/pull/576),
  [`816e4ae`](https://github.com/n24q02m/better-notion-mcp/commit/816e4aeece9f8371ddf50117091ef8cde73c8ef9))


## v2.28.8 (2026-04-22)

### Bug Fixes

- Mark state=configured in remote-oauth mode
  ([#574](https://github.com/n24q02m/better-notion-mcp/pull/574),
  [`26703a3`](https://github.com/n24q02m/better-notion-mcp/commit/26703a3a518001ffbb8bcaf18d16d4d6c88a17a5))


## v2.28.7 (2026-04-22)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.6.2 + return sub from onTokenReceived
  ([#573](https://github.com/n24q02m/better-notion-mcp/pull/573),
  [`e017691`](https://github.com/n24q02m/better-notion-mcp/commit/e0176915ee6840a5dbdf4b125d8bd694245d6a14))


## v2.28.6 (2026-04-22)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.5.1
  ([`2a8a5bf`](https://github.com/n24q02m/better-notion-mcp/commit/2a8a5bfa25ce0f20f988dbfd0002bdfcfc70f69e))

- Bump @n24q02m/mcp-core to 1.6.1 ([#571](https://github.com/n24q02m/better-notion-mcp/pull/571),
  [`dfe028c`](https://github.com/n24q02m/better-notion-mcp/commit/dfe028cd04f286c01af5254e3693eccc2ed59e8e))

- Refresh bun.lock after non-major bumps
  ([#567](https://github.com/n24q02m/better-notion-mcp/pull/567),
  [`e32cd7f`](https://github.com/n24q02m/better-notion-mcp/commit/e32cd7ff3da3e5a0298f84e20e0196672b665c9d))

- Refresh bun.lock for mcp-core 1.5.1 bump
  ([`6a91c19`](https://github.com/n24q02m/better-notion-mcp/commit/6a91c1975e95b3a3ea3b99cbec7b1c7d61a6d2ba))

- **deps**: Update non-major dependencies
  ([#567](https://github.com/n24q02m/better-notion-mcp/pull/567),
  [`e32cd7f`](https://github.com/n24q02m/better-notion-mcp/commit/e32cd7ff3da3e5a0298f84e20e0196672b665c9d))

### Chores

- **deps**: Lock file maintenance ([#568](https://github.com/n24q02m/better-notion-mcp/pull/568),
  [`074916b`](https://github.com/n24q02m/better-notion-mcp/commit/074916bf812dde5fca25b4dbf981d1c597adc34c))


## v2.28.5 (2026-04-21)

### Bug Fixes

- Bump actions/setup-node digest to 48b55a0
  ([`070534a`](https://github.com/n24q02m/better-notion-mcp/commit/070534ac6eb47e97be51eb5545524438c54fc013))

- Bump oven/bun:1-alpine docker digest to 4de4753
  ([`65684e9`](https://github.com/n24q02m/better-notion-mcp/commit/65684e99590328752c2299f5396839ec061a000a))

- Bump step-security/harden-runner digest to 8d3c67d
  ([`8f11d19`](https://github.com/n24q02m/better-notion-mcp/commit/8f11d198182c01c70e195f8f1c85cf880f5b2180))


## v2.28.4 (2026-04-21)

### Bug Fixes

- Persist token + notify relay safely in local-relay mode
  ([`1d5b2d9`](https://github.com/n24q02m/better-notion-mcp/commit/1d5b2d9e5742e29908d495bd5ac412f2fb30386b))

- Prevent command injection in tryOpenBrowser via URL safety validator
  ([`a798afe`](https://github.com/n24q02m/better-notion-mcp/commit/a798afec8c9b6de7b91e1e96ba3990fff3e1fae6))

- Stdio fallback spawns local HTTP, never hits remote URL
  ([`df721e0`](https://github.com/n24q02m/better-notion-mcp/commit/df721e0bfd124b9be69cb51b59edd6c3647a0004))

- **deps**: Bump mcp-core to 1.4.3
  ([`41eb9c5`](https://github.com/n24q02m/better-notion-mcp/commit/41eb9c5e129a508765220a1c63ea8391befbb212))

- **deps**: Lock file maintenance (eventsource-parser 3.0.7->3.0.8)
  ([`8a356d9`](https://github.com/n24q02m/better-notion-mcp/commit/8a356d9b33da7a5f435440aa3442883a571ad1be))

- **deps**: Update actions/upload-artifact digest to 043fb46
  ([`4e4bee5`](https://github.com/n24q02m/better-notion-mcp/commit/4e4bee55d9b7cabfd43e7a72baf9082af908d917))

- **deps**: Update oven/bun:1-alpine docker digest to 26d8996
  ([`4f44e18`](https://github.com/n24q02m/better-notion-mcp/commit/4f44e1857aea64c2e17ced5ab86ddfc1e4a41532))

- **deps**: Update step-security/harden-runner digest to 6c3c2f2
  ([`04a5282`](https://github.com/n24q02m/better-notion-mcp/commit/04a528270ed18b49ebe1fd014b1646e0fe045efe))


## v2.28.3 (2026-04-20)

### Bug Fixes

- Bump @n24q02m/mcp-core to ^1.4.2 ([#558](https://github.com/n24q02m/better-notion-mcp/pull/558),
  [`10ba266`](https://github.com/n24q02m/better-notion-mcp/commit/10ba2660d7048548e3138abbee043aa59d547338))


## v2.28.2 (2026-04-20)

### Bug Fixes

- Bump @n24q02m/mcp-core to ^1.4.1 ([#556](https://github.com/n24q02m/better-notion-mcp/pull/556),
  [`951cd14`](https://github.com/n24q02m/better-notion-mcp/commit/951cd141ecb637f7782016584282e3fca72f556c))


## v2.28.1 (2026-04-20)

### Bug Fixes

- Restore http remote-oauth default mode (regression from #517)
  ([#554](https://github.com/n24q02m/better-notion-mcp/pull/554),
  [`55f1eaa`](https://github.com/n24q02m/better-notion-mcp/commit/55f1eaa82933c70f098598113779834bad4bbd0e))


## v2.28.0 (2026-04-19)

### Bug Fixes

- Bump n24q02m-mcp-core to 1.4.0 ([#551](https://github.com/n24q02m/better-notion-mcp/pull/551),
  [`19a9644`](https://github.com/n24q02m/better-notion-mcp/commit/19a9644606250a2db84ffc0768cf53132066a539))

- **comments**: Clarify external Notion API limitation in comments
  ([#456](https://github.com/n24q02m/better-notion-mcp/pull/456),
  [`8eee919`](https://github.com/n24q02m/better-notion-mcp/commit/8eee919b11bcf71209bb1e2de3fe5168c6c9e29d))

- **deps**: Update non-major dependencies
  ([#543](https://github.com/n24q02m/better-notion-mcp/pull/543),
  [`65fc722`](https://github.com/n24q02m/better-notion-mcp/commit/65fc72218a45473f67c909584c1f49f871f6edef))

- **pagination**: Resolve N+1 query issue in fetchChildrenRecursive
  ([#531](https://github.com/n24q02m/better-notion-mcp/pull/531),
  [`1a82f2b`](https://github.com/n24q02m/better-notion-mcp/commit/1a82f2b084b6170dc3078ee0b8cfff87ecfa9ebb))

- **workspace**: Add caching for bot info
  ([#517](https://github.com/n24q02m/better-notion-mcp/pull/517),
  [`0a18513`](https://github.com/n24q02m/better-notion-mcp/commit/0a185130e09af09672cc009ca2e49ccd3187179a))

- **workspace**: Add caching for bot info and fix linting
  ([#517](https://github.com/n24q02m/better-notion-mcp/pull/517),
  [`0a18513`](https://github.com/n24q02m/better-notion-mcp/commit/0a185130e09af09672cc009ca2e49ccd3187179a))

### Chores

- **deps**: Lock file maintenance ([#544](https://github.com/n24q02m/better-notion-mcp/pull/544),
  [`9c3f3d6`](https://github.com/n24q02m/better-notion-mcp/commit/9c3f3d6700a36f7fea702e3585a6edfb5f28208f))

- **deps**: Update actions/create-github-app-token digest to 1b10c78
  ([#545](https://github.com/n24q02m/better-notion-mcp/pull/545),
  [`bde222b`](https://github.com/n24q02m/better-notion-mcp/commit/bde222b90eca405ee70d1989e0c702b0d0de8a9d))

### Performance Improvements

- Optimize tool name caching in registry
  ([#505](https://github.com/n24q02m/better-notion-mcp/pull/505),
  [`889b9e2`](https://github.com/n24q02m/better-notion-mcp/commit/889b9e247f8692d4e009b13cfbd321990b5992eb))

- **errors**: Optimize findClosestMatch by hoisting bigram calculations
  ([#540](https://github.com/n24q02m/better-notion-mcp/pull/540),
  [`a742817`](https://github.com/n24q02m/better-notion-mcp/commit/a74281730ba56e6f4c17514dd988cc1c376f78eb))

### Testing

- Add robust tests for startServer in main.ts
  ([#525](https://github.com/n24q02m/better-notion-mcp/pull/525),
  [`fc4140a`](https://github.com/n24q02m/better-notion-mcp/commit/fc4140a5c3f1660d8954c1f23c7b346a79d59aee))


## v2.28.0-beta.1 (2026-04-18)

### Bug Fixes

- [FIX] Notion API bug test ([#522](https://github.com/n24q02m/better-notion-mcp/pull/522),
  [`8ccc4b0`](https://github.com/n24q02m/better-notion-mcp/commit/8ccc4b02054ae38fbebfa2589347cec0303efa01))

- Bump @n24q02m/mcp-core to ^1.3.0 (delegated OAuth primitives released)
  ([#541](https://github.com/n24q02m/better-notion-mcp/pull/541),
  [`5fe14e4`](https://github.com/n24q02m/better-notion-mcp/commit/5fe14e45a6e70ccd6cfa52807f75a6c915f9f7fc))

- Document Phase L2 mode restoration in notion CLAUDE.md
  ([#541](https://github.com/n24q02m/better-notion-mcp/pull/541),
  [`5fe14e4`](https://github.com/n24q02m/better-notion-mcp/commit/5fe14e45a6e70ccd6cfa52807f75a6c915f9f7fc))

- Implement and optimize security checks in security helper
  ([#528](https://github.com/n24q02m/better-notion-mcp/pull/528),
  [`83307d3`](https://github.com/n24q02m/better-notion-mcp/commit/83307d3340997708e5c418f2841e8913eee494cb))

- Mitigate Notion API object_not_found bug
  ([#533](https://github.com/n24q02m/better-notion-mcp/pull/533),
  [`7a3cd38`](https://github.com/n24q02m/better-notion-mcp/commit/7a3cd389dbc5c57633e0de26f8676e66a8dea0a3))

- Wire subjectContext via authScope for notion remote-oauth token lookup
  ([#541](https://github.com/n24q02m/better-notion-mcp/pull/541),
  [`5fe14e4`](https://github.com/n24q02m/better-notion-mcp/commit/5fe14e45a6e70ccd6cfa52807f75a6c915f9f7fc))

### Features

- Rename setup tool to config with unified action set
  ([#541](https://github.com/n24q02m/better-notion-mcp/pull/541),
  [`5fe14e4`](https://github.com/n24q02m/better-notion-mcp/commit/5fe14e45a6e70ccd6cfa52807f75a6c915f9f7fc))

- Restore http remote-oauth default via delegated Notion OAuth
  ([#541](https://github.com/n24q02m/better-notion-mcp/pull/541),
  [`5fe14e4`](https://github.com/n24q02m/better-notion-mcp/commit/5fe14e45a6e70ccd6cfa52807f75a6c915f9f7fc))

- Restore notion remote-oauth default via delegated OAuth
  ([#541](https://github.com/n24q02m/better-notion-mcp/pull/541),
  [`5fe14e4`](https://github.com/n24q02m/better-notion-mcp/commit/5fe14e45a6e70ccd6cfa52807f75a6c915f9f7fc))

### Performance Improvements

- **security**: Optimize isSafeUrl performance
  ([#516](https://github.com/n24q02m/better-notion-mcp/pull/516),
  [`a17448c`](https://github.com/n24q02m/better-notion-mcp/commit/a17448c52c9f5a50394a3a16c750db33115927c5))

### Testing

- **security**: Add missing error path tests for isSafeUrl
  ([#521](https://github.com/n24q02m/better-notion-mcp/pull/521),
  [`a612635`](https://github.com/n24q02m/better-notion-mcp/commit/a6126352ac31c9ee722e3e88f5a8182398899067))


## v2.27.6 (2026-04-17)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.2.0 (authlib CVE + auto-issue CD)
  ([`d9ba489`](https://github.com/n24q02m/better-notion-mcp/commit/d9ba489426e91aca4b8029a733419b7be34e62f4))


## v2.27.5 (2026-04-17)

### Bug Fixes

- Bump @n24q02m/mcp-core to 1.1.1 for OAuth issuer fix
  ([`4656530`](https://github.com/n24q02m/better-notion-mcp/commit/46565300d516e84102517a8b321670027380e10c))

- Bump version to rebuild with mcp-core 1.1.1
  ([`aacc455`](https://github.com/n24q02m/better-notion-mcp/commit/aacc455bbe1cc8e799c1f68805305ddd1f73ce81))


## v2.27.4 (2026-04-17)

### Bug Fixes

- Add diacritic preservation pre-commit hook
  ([#537](https://github.com/n24q02m/better-notion-mcp/pull/537),
  [`01481eb`](https://github.com/n24q02m/better-notion-mcp/commit/01481ebd3b6824feaf167391cb8a0bd6818f4d3f))

- Allow HOST env override for container bind address
  ([`3b7f0eb`](https://github.com/n24q02m/better-notion-mcp/commit/3b7f0ebcefbdae77d4eeda92a4dfa3733c4d089f))

- Guard browser launch with isSafeWebUrl against shell flag injection
  ([#509](https://github.com/n24q02m/better-notion-mcp/pull/509),
  [`f0850f9`](https://github.com/n24q02m/better-notion-mcp/commit/f0850f9c515b04c3151d0e0735f64adc42d710c7))

- Ignore coverage.xml and htmlcov artifacts
  ([#536](https://github.com/n24q02m/better-notion-mcp/pull/536),
  [`43096c3`](https://github.com/n24q02m/better-notion-mcp/commit/43096c37091e478d14da05c388b8ac929cee3ea1))

- Ignore coverage.xml and htmlcov artifacts
  ([`3e65fbf`](https://github.com/n24q02m/better-notion-mcp/commit/3e65fbf1ba4f076d9dbba0986e875a93f31c6fec))

- Remove direct better-sqlite3 dep; add trustedDependencies for Bun script skip
  ([`43fcd3b`](https://github.com/n24q02m/better-notion-mcp/commit/43fcd3b2b4bfb78f105b51f3769a075bf47ac0de))

- Sync docs with Phase M completion reality
  ([#536](https://github.com/n24q02m/better-notion-mcp/pull/536),
  [`43096c3`](https://github.com/n24q02m/better-notion-mcp/commit/43096c37091e478d14da05c388b8ac929cee3ea1))

- Sync version files to match v2.27.4 tag for PSR compatibility
  ([`4ebafe2`](https://github.com/n24q02m/better-notion-mcp/commit/4ebafe2a0acbc9473a1160049b2fb3898063f00a))

- Use mcp-core tryOpenBrowser, remove local duplicate
  ([`8ea6aa4`](https://github.com/n24q02m/better-notion-mcp/commit/8ea6aa41127450c0835c2ade144b90cf58171e44))

- **deps**: Bump actions/create-github-app-token digest to 1b10c78
  ([#498](https://github.com/n24q02m/better-notion-mcp/pull/498),
  [`d2a4424`](https://github.com/n24q02m/better-notion-mcp/commit/d2a4424ada0c1986d0c8bbf00baf5dbbab4765e1))

- **deps**: Bump actions/upload-artifact digest to 043fb46
  ([#490](https://github.com/n24q02m/better-notion-mcp/pull/490),
  [`ce6a327`](https://github.com/n24q02m/better-notion-mcp/commit/ce6a327d288ed19c64a247d353df96303ee93279))

- **deps**: Bump non-major dependencies
  ([#500](https://github.com/n24q02m/better-notion-mcp/pull/500),
  [`3b95663`](https://github.com/n24q02m/better-notion-mcp/commit/3b956637ba23c563c41660304dbf1f263a2e744e))

- **deps**: Bump oven/bun:1-alpine docker digest to 26d8996
  ([#499](https://github.com/n24q02m/better-notion-mcp/pull/499),
  [`8770096`](https://github.com/n24q02m/better-notion-mcp/commit/8770096aec9fa1c5cd93a682f7d9eceaec3ab8dd))

- **deps**: Bump step-security/harden-runner digest to 6c3c2f2
  ([#489](https://github.com/n24q02m/better-notion-mcp/pull/489),
  [`ce208df`](https://github.com/n24q02m/better-notion-mcp/commit/ce208df967c25f15dc25852c4d39007afc52d591))

### Chores

- Ignore AI assistant traces
  ([`4207a2e`](https://github.com/n24q02m/better-notion-mcp/commit/4207a2ee60f0cec487ff35e5a089ac04faf27c29))


## v2.27.3 (2026-04-13)

### Bug Fixes

- Install python3+make+g++ for better-sqlite3 source build
  ([`0f11f8e`](https://github.com/n24q02m/better-notion-mcp/commit/0f11f8e7f1c42420c3703d081a0a2ba041acce8b))


## v2.27.2 (2026-04-13)

### Bug Fixes

- Pin Bun image to alpine 7ed9f74 for better-sqlite3 compat
  ([`3c38c6e`](https://github.com/n24q02m/better-notion-mcp/commit/3c38c6e1d1cc27a361c10b36d174a9e636c6000f))


## v2.27.1 (2026-04-13)

### Bug Fixes

- Pin better-sqlite3 to ^12.9.0 for Bun prebuild support
  ([`3c4a9cf`](https://github.com/n24q02m/better-notion-mcp/commit/3c4a9cf25816060728a03a5722bcce208e9f3394))


## v2.27.0 (2026-04-13)

### Bug Fixes

- Add tests for credential state ([#459](https://github.com/n24q02m/better-notion-mcp/pull/459),
  [`247af7f`](https://github.com/n24q02m/better-notion-mcp/commit/247af7ff15378823651e8b5aec72fc6234d31f01))

- Add tests for isSafeUrl error path ([#460](https://github.com/n24q02m/better-notion-mcp/pull/460),
  [`c7045a7`](https://github.com/n24q02m/better-notion-mcp/commit/c7045a7976b04eca55c213510b380a3ad6fbcd26))

- Add tests for startServer in main ([#474](https://github.com/n24q02m/better-notion-mcp/pull/474),
  [`d723dc5`](https://github.com/n24q02m/better-notion-mcp/commit/d723dc5eb731c0ea5b10c292912b996264dfde75))

- Bump @n24q02m/mcp-core to 1.0.0-beta.4
  ([`2d37987`](https://github.com/n24q02m/better-notion-mcp/commit/2d379871edd29e9f332ecdb41732ac6599552044))

- Bump @n24q02m/mcp-core to ^1.0.0 stable
  ([`7197316`](https://github.com/n24q02m/better-notion-mcp/commit/7197316e3c02c4d1b3fe34cdb231d958816de07d))

- Clarify security check comment in isSafeUrl
  ([`8fbd284`](https://github.com/n24q02m/better-notion-mcp/commit/8fbd28480af33aa214fdd5d496eb0148c29a37de))

- Correct README tool count to 10 and add missing setup tool
  ([`081554e`](https://github.com/n24q02m/better-notion-mcp/commit/081554ea828a2aa8190b649432bc90a5e5b88bd6))

- Delete .Jules directory
  ([`28bb83b`](https://github.com/n24q02m/better-notion-mcp/commit/28bb83b2a7b5d7263571e606fa6b7418cee9bcad))

- Delete .jules_review_request.json
  ([`f6bebb8`](https://github.com/n24q02m/better-notion-mcp/commit/f6bebb8a5047b4ee391f0dc57335c8c7c92b1096))

- Enhance relay setup security and logging
  ([#439](https://github.com/n24q02m/better-notion-mcp/pull/439),
  [`2431716`](https://github.com/n24q02m/better-notion-mcp/commit/243171657343da2a9fef9add60142224dcc559cd))

- Enhance relay setup security and logging (final)
  ([#439](https://github.com/n24q02m/better-notion-mcp/pull/439),
  [`2431716`](https://github.com/n24q02m/better-notion-mcp/commit/243171657343da2a9fef9add60142224dcc559cd))

- Force LF line endings in .gitattributes to unblock Windows CI
  ([`3918aec`](https://github.com/n24q02m/better-notion-mcp/commit/3918aecd37eb0c430bf6efbb6ee2fe913be4c47a))

- Handle Notion API Object Not Found in comments.list
  ([`2e7f055`](https://github.com/n24q02m/better-notion-mcp/commit/2e7f055a08baa7d5c6d033302fef4e0b74e6393d))

- Loop optimization in extractPlainText
  ([`301e220`](https://github.com/n24q02m/better-notion-mcp/commit/301e220ec173280d6e115541d0ff9b8bf92f3af6))

- Make Notion token error message more actionable
  ([`ebc5e69`](https://github.com/n24q02m/better-notion-mcp/commit/ebc5e6908d2a5778e85836cb2475a130ced3642b))

- Optimize parseTable with single-pass manual loop
  ([`778b8d0`](https://github.com/n24q02m/better-notion-mcp/commit/778b8d0a1cbebc754a8588f56c6ee39bc091446f))

- Pin @n24q02m/mcp-core to published 1.0.0-beta.3 instead of local editable path
  ([`7427a6e`](https://github.com/n24q02m/better-notion-mcp/commit/7427a6e02192646cd703ee7867dbade319bdbbc1))

- Potential path traversal in documentation reading
  ([`b31378d`](https://github.com/n24q02m/better-notion-mcp/commit/b31378d6a78611cc1d14b0254a153cbdce8d3738))

- Sync local changes from workspace
  ([`c294f8c`](https://github.com/n24q02m/better-notion-mcp/commit/c294f8c9487e26d0cb051198467e56647b331f7b))

- Update comment reference from mcp-relay-core to mcp-core
  ([`a43d630`](https://github.com/n24q02m/better-notion-mcp/commit/a43d630b1c95459ae5e6616e6b764d97748f5d43))

- Update docker/build-push-action digest to bcafcac
  ([`402c9c6`](https://github.com/n24q02m/better-notion-mcp/commit/402c9c61893c7ba1ea9302ebb600ae84b12e0d6e))

- Update oven/bun:1-alpine docker digest to 26d8996
  ([`160b857`](https://github.com/n24q02m/better-notion-mcp/commit/160b85783a6a26329d0a4acbeac3bb950409b018))

- **security**: Update dependencies to fix npm audit vulnerabilities
  ([`17177d0`](https://github.com/n24q02m/better-notion-mcp/commit/17177d0573969deebe72246076e51a37406c0a79))

### Chores

- **deps**: Lock file maintenance ([#450](https://github.com/n24q02m/better-notion-mcp/pull/450),
  [`7bd49a7`](https://github.com/n24q02m/better-notion-mcp/commit/7bd49a779d89c1267f98fc4042da3d6cd970accb))

- **deps**: Update non-major dependencies
  ([#491](https://github.com/n24q02m/better-notion-mcp/pull/491),
  [`d9d221d`](https://github.com/n24q02m/better-notion-mcp/commit/d9d221d5456a079dd33834eb8b83d5229cd5ad40))

### Features

- Add cross-OS CI matrix (ubuntu/windows/macos)
  ([`c998e40`](https://github.com/n24q02m/better-notion-mcp/commit/c998e40110e77632435d1b580577603309a363d9))

- Add setup tool for credential management via relay
  ([`0606ce7`](https://github.com/n24q02m/better-notion-mcp/commit/0606ce79e725eba16d8096294f9d7565e19b7911))

- Default to HTTP transport, --stdio for backward compat
  ([`fb99551`](https://github.com/n24q02m/better-notion-mcp/commit/fb995513e03c10ad8a40f3959df7a25d28888d20))

- Migrate from mcp-relay-core to mcp-core
  ([`a729e7d`](https://github.com/n24q02m/better-notion-mcp/commit/a729e7dc8757d8ed4e8ac7d0f312a4b43e5e160c))

- Migrate HTTP transport to mcp-core runLocalServer
  ([`83773a8`](https://github.com/n24q02m/better-notion-mcp/commit/83773a85eca86bc40e2da8909ac4e4b21c46f55a))

- Show relay URL in tool response instead of just stderr
  ([`36a6f56`](https://github.com/n24q02m/better-notion-mcp/commit/36a6f56135c993bb935e44425ac9cf5d5bf974e1))

### Performance Improvements

- **markdown**: Optimize parseTable with single-pass manual loop
  ([`778b8d0`](https://github.com/n24q02m/better-notion-mcp/commit/778b8d0a1cbebc754a8588f56c6ee39bc091446f))

- **pagination**: Optimize block tree traversal and batch processing
  ([#437](https://github.com/n24q02m/better-notion-mcp/pull/437),
  [`fdabd87`](https://github.com/n24q02m/better-notion-mcp/commit/fdabd8762b732a4892135348af5212a3f327ac23))

- **pagination**: Optimize block tree traversal and batch processing (Acknowledged PR closure)
  ([#437](https://github.com/n24q02m/better-notion-mcp/pull/437),
  [`fdabd87`](https://github.com/n24q02m/better-notion-mcp/commit/fdabd8762b732a4892135348af5212a3f327ac23))

### Refactoring

- Simplify parseRichText with InlineParser class
  ([#436](https://github.com/n24q02m/better-notion-mcp/pull/436),
  [`7e2aa79`](https://github.com/n24q02m/better-notion-mcp/commit/7e2aa7908b4b3106e02ea7fd0e8ea21895b25b0a))

### Testing

- 🧪 [TEST] Missing test file for relay-schema.ts
  ([#442](https://github.com/n24q02m/better-notion-mcp/pull/442),
  [`70a5dc0`](https://github.com/n24q02m/better-notion-mcp/commit/70a5dc094530a6c290673d03bfcfbe1882f7c6c9))

- 🧪 [TEST] Missing test file for relay-schema.ts (final acknowledgement)
  ([#442](https://github.com/n24q02m/better-notion-mcp/pull/442),
  [`70a5dc0`](https://github.com/n24q02m/better-notion-mcp/commit/70a5dc094530a6c290673d03bfcfbe1882f7c6c9))


## v2.26.0 (2026-04-07)

### Bug Fixes

- Remove BETA markers and promote relay as primary setup method
  ([`c8814e9`](https://github.com/n24q02m/better-notion-mcp/commit/c8814e95ea28e90021497874e39d3ba3a8219533))

- **databases**: Refactor queryDatabase complexity
  ([#406](https://github.com/n24q02m/better-notion-mcp/pull/406),
  [`8ff5171`](https://github.com/n24q02m/better-notion-mcp/commit/8ff51717374f7400e5503e15887a8480864475ef))

- **deps**: Update dependency @n24q02m/mcp-relay-core to ^1.4.0
  ([#392](https://github.com/n24q02m/better-notion-mcp/pull/392),
  [`c8054d1`](https://github.com/n24q02m/better-notion-mcp/commit/c8054d132afc931e0d5c6cc76919abb999bf51cb))

### Features

- Migrate code review from Qodo to CodeRabbit
  ([#415](https://github.com/n24q02m/better-notion-mcp/pull/415),
  [`8485a3f`](https://github.com/n24q02m/better-notion-mcp/commit/8485a3fd07bd9735aa051c8be450c4e1f60d3a98))

### Performance Improvements

- **markdown**: Optimize table rendering loop
  ([#395](https://github.com/n24q02m/better-notion-mcp/pull/395),
  [`7fb64ba`](https://github.com/n24q02m/better-notion-mcp/commit/7fb64ba8549b71734e5aa56a3faa8d080f063f8b))

### Refactoring

- Abstract handleNotionError switch statement into NOTION_ERROR_MAP
  ([#399](https://github.com/n24q02m/better-notion-mcp/pull/399),
  [`de5076a`](https://github.com/n24q02m/better-notion-mcp/commit/de5076a55c15eba537dc72f7957403180a237a66))

### Testing

- 🧪 [TEST] handle known Notion API bug in comments.list live test
  ([#409](https://github.com/n24q02m/better-notion-mcp/pull/409),
  [`21a5d55`](https://github.com/n24q02m/better-notion-mcp/commit/21a5d550a061f8c29a9e97264c2bd7e07fc94d54))

- 🧪 [TEST] Missing edge case tests in normalizeId for non-hex strings
  ([#398](https://github.com/n24q02m/better-notion-mcp/pull/398),
  [`e746e94`](https://github.com/n24q02m/better-notion-mcp/commit/e746e9463d85331354f7e40d2c5938d708661e94))

- 🧪 [TEST] Missing error path test in security.ts (relative URLs)
  ([#407](https://github.com/n24q02m/better-notion-mcp/pull/407),
  [`6c8d4d6`](https://github.com/n24q02m/better-notion-mcp/commit/6c8d4d6395defee42404dfd7aae5d1da6f17215b))

- 🧪 [TEST] Untested main module entrypoint mode selection
  ([#404](https://github.com/n24q02m/better-notion-mcp/pull/404),
  [`7e3ad39`](https://github.com/n24q02m/better-notion-mcp/commit/7e3ad397aab2f73519da64141627b3336132cb37))


## v2.25.0 (2026-04-06)

### Bug Fixes

- Mark relay as BETA, promote env vars as primary setup method
  ([`ef708cb`](https://github.com/n24q02m/better-notion-mcp/commit/ef708cb6d25ddd7ec2ca39ff7b488bcd5f945b58))

### Features

- Non-blocking relay with state machine and lazy trigger
  ([`ca2d637`](https://github.com/n24q02m/better-notion-mcp/commit/ca2d6370fca5f57e77c9f221ebb5f4b0f8cf3f01))


## v2.24.0 (2026-04-04)

### Bug Fixes

- Consolidated Jules PR review - security, perf, tests, deps
  ([#391](https://github.com/n24q02m/better-notion-mcp/pull/391),
  [`e72af13`](https://github.com/n24q02m/better-notion-mcp/commit/e72af13606626cd5e6be8b5c157138c3eca1d420))

- Scope marketplace sync token to claude-plugins repo
  ([`6c8f518`](https://github.com/n24q02m/better-notion-mcp/commit/6c8f518a2e3be7460d1b307a08adec4942c0c717))

### Features

- Add agent/manual setup guides, simplify README, cleanup root
  ([`7e97edc`](https://github.com/n24q02m/better-notion-mcp/commit/7e97edc10f0a82a37fc8a1d800e7959d5cb4bf58))


## v2.23.0 (2026-04-03)

### Features

- Remove deprecated Gemini CLI extension support
  ([`d2d4c21`](https://github.com/n24q02m/better-notion-mcp/commit/d2d4c21b01b11d4d077eab83858304bf62f74d5b))


## v2.23.0-beta.1 (2026-04-03)

### Bug Fixes

- Add missing error path tests
  ([`af4cc9a`](https://github.com/n24q02m/better-notion-mcp/commit/af4cc9aa023fa22a7fe09179fdb101096317340f))

- Add missing error path tests
  ([`b2cd842`](https://github.com/n24q02m/better-notion-mcp/commit/b2cd8425c4ef5691ac1ea8f36815c2063414e179))

- Add missing error path tests
  ([`0e076a0`](https://github.com/n24q02m/better-notion-mcp/commit/0e076a03abd68696455f86208c544bf69393faf4))

- Add missing error path tests
  ([`d7a0732`](https://github.com/n24q02m/better-notion-mcp/commit/d7a0732c9dc1acf8ef6fad0aa939f42e12657404))

- Add missing error path tests
  ([`32986cb`](https://github.com/n24q02m/better-notion-mcp/commit/32986cb3d2ff84286e93fe7bbfb4f7908d316406))

- Add missing error path tests
  ([`90c48f5`](https://github.com/n24q02m/better-notion-mcp/commit/90c48f55daf21985dce9c38b702d5c3013d6c2ef))

- Add missing error path tests
  ([`8a30f7d`](https://github.com/n24q02m/better-notion-mcp/commit/8a30f7d295ce4ee7e802c14276c6cf42d6d1825f))

- Add missing error path tests
  ([`e8bb22b`](https://github.com/n24q02m/better-notion-mcp/commit/e8bb22ba72058b97bf0fd712a46968ff3c618f60))

- Add missing error path tests
  ([`7cd0722`](https://github.com/n24q02m/better-notion-mcp/commit/7cd0722597c3dcd44aac8d777c9e1442b761cf85))

- Add missing error path tests
  ([`c4bb406`](https://github.com/n24q02m/better-notion-mcp/commit/c4bb406820afebc8533a4aa8dd6ed51b22db024b))

- Correct comments.list test assertion from results to comments
  ([`882c570`](https://github.com/n24q02m/better-notion-mcp/commit/882c5705c7f1c22f100ef307a8c364ccd945331c))

- Extract complex block type handlers from blocksToMarkdown
  ([`9f173dc`](https://github.com/n24q02m/better-notion-mcp/commit/9f173dc9c738f53edb0c714d3616533c39420155))

- Extract shared deep children population into populateDeepChildren
  ([`60f0112`](https://github.com/n24q02m/better-notion-mcp/commit/60f0112860941bcc5304ba8272c7c782cec0b169))

- Reject URLs with control characters in isSafeUrl
  ([`4b4d79a`](https://github.com/n24q02m/better-notion-mcp/commit/4b4d79a6c50f4d0e1b4c8400c742410c0dcb09a9))

- Replace synchronous readFileSync with async readFile in tool handlers
  ([`e17d3d9`](https://github.com/n24q02m/better-notion-mcp/commit/e17d3d9318a9c810528666032992127f5f36e734))

- Strengthen base64 validation with canonical roundtrip check
  ([`da1a7c2`](https://github.com/n24q02m/better-notion-mcp/commit/da1a7c26ebaeb1172db3023e50c78c6fb4825d4a))

- Strip null values from block type data in pages.duplicate
  ([`47cbcfe`](https://github.com/n24q02m/better-notion-mcp/commit/47cbcfe40265a7edb0cd0d988f9b17e2aa0bdca9))

- Validate JSON arrays in convertToNotionProperties and content converter
  ([`304944d`](https://github.com/n24q02m/better-notion-mcp/commit/304944d997afeda51f1023c56631782eeba5b802))

- **deps**: Update docker/login-action digest
  ([`be52ce2`](https://github.com/n24q02m/better-notion-mcp/commit/be52ce2af13d4ca633471f29dc00e5761248553a))

- **deps**: Update esbuild to ^0.28.0
  ([`20de9c1`](https://github.com/n24q02m/better-notion-mcp/commit/20de9c129037fd99b9b3a5e78825ae3131b10fb1))

- **deps**: Update mcp-relay-core to 1.2.0 and esbuild to 0.27.5
  ([`f39a9b0`](https://github.com/n24q02m/better-notion-mcp/commit/f39a9b08a11bab5138b62aaf11330ac50ce9e3a3))

- **deps**: Update qodo-ai/pr-agent action digest
  ([`bf1d3aa`](https://github.com/n24q02m/better-notion-mcp/commit/bf1d3aa49b2e211533383f2268664951059c29eb))

### Features

- Fix external reported bugs (#360, #282, #196, #197)
  ([`f605e93`](https://github.com/n24q02m/better-notion-mcp/commit/f605e933fbce05c24d3270385f3761a9e54473f7))


## v2.22.1 (2026-03-31)

### Bug Fixes

- **deps**: Update non-major dependencies
  ([#313](https://github.com/n24q02m/better-notion-mcp/pull/313),
  [`f959123`](https://github.com/n24q02m/better-notion-mcp/commit/f959123964a9a22a9fefce33fc359dcfde0773ee))

### Chores

- Migrate biome config schema to 2.4.9
  ([#318](https://github.com/n24q02m/better-notion-mcp/pull/318),
  [`fc7d4aa`](https://github.com/n24q02m/better-notion-mcp/commit/fc7d4aaa99264b5d53727e409a7df2633f729921))

### Continuous Integration

- Fix Qodo vertex_ai config and VERTEXAI_LOCATION
  ([`50d5dd2`](https://github.com/n24q02m/better-notion-mcp/commit/50d5dd250409df4511f4fbc0e850c224a6c9374e))

- **cd**: Add plugin marketplace sync on stable release
  ([`4721e14`](https://github.com/n24q02m/better-notion-mcp/commit/4721e14edbb671d7016c5dea0d0ee93449da2693))

### Performance Improvements

- ⚡ Bolt: Optimize parseRichText to prevent O(N^2) lookaheads
  ([#315](https://github.com/n24q02m/better-notion-mcp/pull/315),
  [`bc3290a`](https://github.com/n24q02m/better-notion-mcp/commit/bc3290a85c992db96c60c4bb18480ed4e43c51c7))

### Testing

- Improve coverage to 96.31% statements
  ([#319](https://github.com/n24q02m/better-notion-mcp/pull/319),
  [`c8268df`](https://github.com/n24q02m/better-notion-mcp/commit/c8268df6412298a3614f0064544ee31c1aab6658))


## v2.22.0 (2026-03-28)

### Bug Fixes

- Bump @n24q02m/mcp-relay-core from ^0.1.0 to ^1.0.8
  ([`1e16dc3`](https://github.com/n24q02m/better-notion-mcp/commit/1e16dc334fce4b26dea720f08c5fed5a3c6dcda2))

- Credential resolution order -- relay only when no local credentials
  ([`aa24bbb`](https://github.com/n24q02m/better-notion-mcp/commit/aa24bbbed840d2d48d4482d92683a8a761c0b1eb))

- Pin Docker base images to SHA digests
  ([`120982e`](https://github.com/n24q02m/better-notion-mcp/commit/120982e8d675f9f10e48dfc1b5b0160368de7716))

- Pin pre-commit hooks to commit SHA
  ([`3742ebb`](https://github.com/n24q02m/better-notion-mcp/commit/3742ebb070b72ba15a753d2d3269aff9f3df80fb))

- Revert mcpServers to HTTP mode (OAuth, zero-config)
  ([`757a54d`](https://github.com/n24q02m/better-notion-mcp/commit/757a54dea78fb9d067f5d41f62ece4b582e92244))

- Send complete message to relay page after config saved
  ([`9d00cc2`](https://github.com/n24q02m/better-notion-mcp/commit/9d00cc213cf8022e9d1f570e010f3f13500ea920))

- Use inline fetch for relay complete message
  ([`9d4f2b6`](https://github.com/n24q02m/better-notion-mcp/commit/9d4f2b61782d7e3f3a541f46e246c1e8b920cc21))

- 🛡️ Sentinel: Medium Fix expected validation failure in error serialization
  ([#294](https://github.com/n24q02m/better-notion-mcp/pull/294),
  [`244c958`](https://github.com/n24q02m/better-notion-mcp/commit/244c9581616418989ad74bdd5ccd87e718950d0c))

- **cd**: Remove empty env blocks from OIDC migration
  ([`fae0500`](https://github.com/n24q02m/better-notion-mcp/commit/fae0500b4d96ffa7a3ddbdd04842881a53ac9ccc))

- **cd**: Replace GH_PAT with GitHub App installation token
  ([`8977566`](https://github.com/n24q02m/better-notion-mcp/commit/897756698056bd0eace4fc79ba5af00d263fdcb7))

- **cd**: Use npm OIDC provenance instead of NPM_TOKEN
  ([`21eb8bf`](https://github.com/n24q02m/better-notion-mcp/commit/21eb8bfe2cb1ff710db7c4084bf01454f70d6f12))

- **ci**: Consolidate SMTP_USERNAME and NOTIFY_EMAIL into one secret
  ([`1d6237e`](https://github.com/n24q02m/better-notion-mcp/commit/1d6237ede68a93540e77c55975839a702ca838af))

- **ci**: Consolidate SMTP_USERNAME+PASSWORD into SMTP_CREDENTIAL
  ([`e903ae0`](https://github.com/n24q02m/better-notion-mcp/commit/e903ae0494eda2575f08d3480f64bedd529ad559))

- **ci**: Remove CODECOV_TOKEN, use tokenless upload
  ([`2f1a50d`](https://github.com/n24q02m/better-notion-mcp/commit/2f1a50ddd446afb1465e1876ec4f6bfc8199033d))

- **ci**: Use Vertex AI WIF instead of GEMINI_API_KEY for code review
  ([`7bf27a4`](https://github.com/n24q02m/better-notion-mcp/commit/7bf27a45470637f5d785ed1eb17b7418849391fd))

- **deps**: Update non-major dependencies
  ([#286](https://github.com/n24q02m/better-notion-mcp/pull/286),
  [`c7eaa6a`](https://github.com/n24q02m/better-notion-mcp/commit/c7eaa6a613d4ca67443f908dfd8c14f8dfcb9c0f))

### Chores

- **deps**: Lock file maintenance ([#311](https://github.com/n24q02m/better-notion-mcp/pull/311),
  [`1feb157`](https://github.com/n24q02m/better-notion-mcp/commit/1feb15747f7a7afcf26021035c8d88316bb69019))

- **deps**: Lock file maintenance ([#306](https://github.com/n24q02m/better-notion-mcp/pull/306),
  [`07725d9`](https://github.com/n24q02m/better-notion-mcp/commit/07725d9d51a923119ce927c5df1d0adc335ec873))

- **deps**: Update actions/create-github-app-token action to v3
  ([#308](https://github.com/n24q02m/better-notion-mcp/pull/308),
  [`a17f4de`](https://github.com/n24q02m/better-notion-mcp/commit/a17f4de0ee3ba06ddb72dd6503c69d5490179787))

- **deps**: Update codecov/codecov-action action to v6
  ([#304](https://github.com/n24q02m/better-notion-mcp/pull/304),
  [`c1644a7`](https://github.com/n24q02m/better-notion-mcp/commit/c1644a74551b3abaec42123cc42c72c58c7cf08f))

- **deps**: Update google-github-actions/auth action to v3
  ([#309](https://github.com/n24q02m/better-notion-mcp/pull/309),
  [`8ced7a8`](https://github.com/n24q02m/better-notion-mcp/commit/8ced7a8f2dcf80004794c510a832db8bbcfa34a6))

### Code Style

- Fix Biome formatting in plugin/extension JSON files
  ([`9a39b17`](https://github.com/n24q02m/better-notion-mcp/commit/9a39b17b7ea57621fad85b8e748efe86832c5243))

### Features

- Relay-first startup — always show relay URL
  ([`f475031`](https://github.com/n24q02m/better-notion-mcp/commit/f475031fec6ea59059bbaac94b576f8585e51e28))


## v2.21.0 (2026-03-26)

### Chores

- Add server.json to PSR version_variables, sync version
  ([`3bd3f9a`](https://github.com/n24q02m/better-notion-mcp/commit/3bd3f9abe5221911098646d5424df324262c85cc))

- Clean up plugin manifest, fix mcpServers mode
  ([`06bc4e3`](https://github.com/n24q02m/better-notion-mcp/commit/06bc4e3b3d24fad6714f8ff6c50a120bd6705d09))

### Documentation

- Fix marketplace references, improve Gemini CLI extension config
  ([`98d1128`](https://github.com/n24q02m/better-notion-mcp/commit/98d1128fd37a09e141869a33de78fb6f3ef89928))

- Standardize README structure
  ([`17d78a7`](https://github.com/n24q02m/better-notion-mcp/commit/17d78a7542ebe41727ecd86cd125d14708929930))


## v2.21.0-beta.1 (2026-03-25)

### Bug Fixes

- Add mcp-name line to README
  ([`f0a7ea8`](https://github.com/n24q02m/better-notion-mcp/commit/f0a7ea880a3e3d6829f8f0ae55794ec0932d2252))

- Align gemini-extension.json mcpServers key with plugin.json
  ([`40a69b5`](https://github.com/n24q02m/better-notion-mcp/commit/40a69b5a65c19c2d696da5af6544254e6fff0f13))

- Auto-sync plugin.json version via PSR
  ([`353a1a4`](https://github.com/n24q02m/better-notion-mcp/commit/353a1a430fe9e45d0a643c86ccb2c4ec77980e10))

- Correct plugin install commands per official docs
  ([`b93b21c`](https://github.com/n24q02m/better-notion-mcp/commit/b93b21c103a795af51a9dc01ea27764f4ba73b5d))

- Format gemini-extension.json for biome
  ([`aa249b8`](https://github.com/n24q02m/better-notion-mcp/commit/aa249b8a0779c02560d067e025b653aa0ad159f9))

- Pin third-party GitHub Actions to SHA hashes
  ([`f82d60b`](https://github.com/n24q02m/better-notion-mcp/commit/f82d60b09aa86fc0a8ab4fa68aeac58412d19e82))

- Remove empty env vars from plugin configs to prevent empty-string bugs
  ([`c655248`](https://github.com/n24q02m/better-notion-mcp/commit/c65524897a8c5c7c588ab8b38bd5ed2cd301120a))

- Remove env from README examples, fix semantic-release badge
  ([`f2b955f`](https://github.com/n24q02m/better-notion-mcp/commit/f2b955f5d1628b4d1f5a20ca70992489d2209be8))

- Remove env vars from plugin.json to prevent overwriting user config
  ([`e6e60a4`](https://github.com/n24q02m/better-notion-mcp/commit/e6e60a41fd3a04accc1315910812d09b3eae290b))

- Remove pr-title-check job from CI
  ([`4545ae7`](https://github.com/n24q02m/better-notion-mcp/commit/4545ae7180fc6408d4e7ec625b93b5c734b07842))

- Resolve biome lint errors
  ([`8a35944`](https://github.com/n24q02m/better-notion-mcp/commit/8a359443fd2b67c06894dd7738d0ca0af84aaac7))

- Revert semantic-release badge to python-semantic-release
  ([`ff14687`](https://github.com/n24q02m/better-notion-mcp/commit/ff146875cba2d50e04d06b58eff46ea795f73aa5))

- Switch mcp-relay-core from file dep to published npm package
  ([#301](https://github.com/n24q02m/better-notion-mcp/pull/301),
  [`d87dbc1`](https://github.com/n24q02m/better-notion-mcp/commit/d87dbc1f04575c2fecd0c7e017417c564c69a334))

- Sync plugin.json version and add skills/hooks references
  ([`6a3c1c3`](https://github.com/n24q02m/better-notion-mcp/commit/6a3c1c38e628f1fd7dd2ff37271ec1475d69689f))

- Unify Plugin install section with marketplace + individual options
  ([`5197cd4`](https://github.com/n24q02m/better-notion-mcp/commit/5197cd4e7ae4cd3c56416fe2ae7ec7fdc916ace3))

### Documentation

- Add relay files to CLAUDE.md file structure
  ([`3ac22fe`](https://github.com/n24q02m/better-notion-mcp/commit/3ac22fe79ccade656d2554a5d769c942948e2fd0))

- Add zero-config relay setup section to README
  ([`d429818`](https://github.com/n24q02m/better-notion-mcp/commit/d42981890e83fcf8534268dc4e81bdd9fa271c3d))

### Features

- Add Gemini CLI extension config with PSR version sync
  ([`04213c6`](https://github.com/n24q02m/better-notion-mcp/commit/04213c67c1ed678e1aec18de77ddecbfeba7e42d))

- Add NOTION_TOKEN env var and bunx mode to plugin config
  ([`ca4d4cd`](https://github.com/n24q02m/better-notion-mcp/commit/ca4d4cddbe2c5bb55663b14254cb61ff25b6ed05))

- Add zero-env-config relay setup via mcp-relay-core
  ([#301](https://github.com/n24q02m/better-notion-mcp/pull/301),
  [`d87dbc1`](https://github.com/n24q02m/better-notion-mcp/commit/d87dbc1f04575c2fecd0c7e017417c564c69a334))

- Multi-mode plugin config (stdio + docker + http)
  ([`cff3bbe`](https://github.com/n24q02m/better-notion-mcp/commit/cff3bbe03c6269b45c1b2db7d110a827ee5a9409))

- Reorder HTTP as primary mode, add pnpx and yarn dlx modes
  ([`e70d19e`](https://github.com/n24q02m/better-notion-mcp/commit/e70d19e4122e20103686d00af24bf8918ba9aefd))

- Standardize README with MCP Resources, Security, collapsible clients
  ([`3545e0a`](https://github.com/n24q02m/better-notion-mcp/commit/3545e0ac86ada35d6cba70ed4abf3f4487d24d0c))

- Zero-env-config relay setup for stdio mode
  ([#301](https://github.com/n24q02m/better-notion-mcp/pull/301),
  [`d87dbc1`](https://github.com/n24q02m/better-notion-mcp/commit/d87dbc1f04575c2fecd0c7e017417c564c69a334))


## v2.20.0 (2026-03-24)

### Bug Fixes

- Add gitleaks secret detection to pre-commit hooks
  ([`0c788ba`](https://github.com/n24q02m/better-notion-mcp/commit/0c788ba74af7ac2c667745e9ff98908bb4dc2d72))

- Exclude live tests from default vitest run
  ([`ccd9273`](https://github.com/n24q02m/better-notion-mcp/commit/ccd92733188a028d0cb1decdcbc2162afa4c9252))

- Fix Notion API response format handling in full tests
  ([`56d2347`](https://github.com/n24q02m/better-notion-mcp/commit/56d23474c306ad6444bb687f8d2e009cfd709a96))

- Improve full test resilience for Notion API responses
  ([`1bdd97b`](https://github.com/n24q02m/better-notion-mcp/commit/1bdd97ba5b2984df51788945b590efc260c75fa3))

- Resolve lint errors in full test files
  ([`09bac15`](https://github.com/n24q02m/better-notion-mcp/commit/09bac15ea3ff86fece8ba4868380a9e832987770))


## v2.20.0-beta.2 (2026-03-23)

### Features

- Add full/real Notion API live tests with HTTP transport verification
  ([`fd52efa`](https://github.com/n24q02m/better-notion-mcp/commit/fd52efac71c9bf77dab608f516f7612f7b9d1ff6))


## v2.20.0-beta.1 (2026-03-23)

### Bug Fixes

- Correct plugin packaging paths and marketplace schema
  ([`4f62f5f`](https://github.com/n24q02m/better-notion-mcp/commit/4f62f5fef4854cffe0dd8cb90b62b54b9aa6fa7a))

- Format README JSON blocks for biome compliance
  ([`730e186`](https://github.com/n24q02m/better-notion-mcp/commit/730e186e32dd3157836cbe3e57805e927a302e0d))

- Improve tool descriptions and corrective errors for LLM call pass rate
  ([`2d0350a`](https://github.com/n24q02m/better-notion-mcp/commit/2d0350a5df09d21881c6b67a270c4905fda299ff))

- Standardize README structure with plugin-first Quick Start
  ([`85da489`](https://github.com/n24q02m/better-notion-mcp/commit/85da48973b0b25314e30989ec944e3792fb15830))

- Start server without NOTION_TOKEN, show setup hints instead of crashing
  ([`3b7ee28`](https://github.com/n24q02m/better-notion-mcp/commit/3b7ee2818181d99ec572eb9e5943e5f05296c08f))

- Sync plugin.json and server.json to v2.19.2
  ([`3fdc960`](https://github.com/n24q02m/better-notion-mcp/commit/3fdc960b7fa8d71179da971816af97e4cbfd0b40))

- **deps**: Update non-major dependencies
  ([#279](https://github.com/n24q02m/better-notion-mcp/pull/279),
  [`83fbbb5`](https://github.com/n24q02m/better-notion-mcp/commit/83fbbb55b0daa04f3fc1fdeed78013bb46c86e38))

### Chores

- Add .code-review-graph/ to .gitignore
  ([`bfa563b`](https://github.com/n24q02m/better-notion-mcp/commit/bfa563bb3229e37fe8c752c23a8e3b24b69395c4))

- **deps**: Lock file maintenance ([#280](https://github.com/n24q02m/better-notion-mcp/pull/280),
  [`2b45e08`](https://github.com/n24q02m/better-notion-mcp/commit/2b45e082ded62e11c8c40e4a92b1dd168fb7eef0))

### Code Style

- Auto-format registry.ts
  ([`bad18d8`](https://github.com/n24q02m/better-notion-mcp/commit/bad18d84e4bd04fdd0aa083554dee2b1103d14d5))

### Documentation

- Standardize README sections and sync Also by table
  ([`8cfeeef`](https://github.com/n24q02m/better-notion-mcp/commit/8cfeeef1d05821f4ebc0fadaf2330764f369e60b))

### Features

- Add plugin packaging (skills, hooks, plugin manifest)
  ([`783cf36`](https://github.com/n24q02m/better-notion-mcp/commit/783cf364a208f6cf671cd656b5e219f10208cec5))

- Improve tool descriptions for better LLM pass rate
  ([`e59bae8`](https://github.com/n24q02m/better-notion-mcp/commit/e59bae89eae50321aad5df050b7e0365f4b8de48))

- Switch plugin to HTTP remote mode (OAuth, zero-config)
  ([`873db91`](https://github.com/n24q02m/better-notion-mcp/commit/873db91b39eb0e5bfa069388d11080e161ab2443))

### Performance Improvements

- ⚡ Bolt: Parallelize recursive API calls in tree traversal
  ([#285](https://github.com/n24q02m/better-notion-mcp/pull/285),
  [`4382fc7`](https://github.com/n24q02m/better-notion-mcp/commit/4382fc75bdefb55dda6e60945fef841a9586c988))

### Refactoring

- Redesign skills/hooks per approved spec
  ([`8696e2f`](https://github.com/n24q02m/better-notion-mcp/commit/8696e2f539401184ce3b62cbf30a259e30fb31be))

### Testing

- Add live MCP protocol tests
  ([`429b7af`](https://github.com/n24q02m/better-notion-mcp/commit/429b7af7c567eca7155e9db2e2a88f2f4b383f8c))


## v2.19.2 (2026-03-20)

### Bug Fixes

- Update AGENTS.md file structure, fix SECURITY.md
  ([`d09cfa1`](https://github.com/n24q02m/better-notion-mcp/commit/d09cfa1c817e84b7a94045696f7e49797c68bcab))

- Update PRIVACY.md and remove .jules artifact
  ([#278](https://github.com/n24q02m/better-notion-mcp/pull/278),
  [`904eea5`](https://github.com/n24q02m/better-notion-mcp/commit/904eea5b573ab809432fc892838c4da1734d2ab8))

- 🛡️ Sentinel: [Low] Disable x-powered-by header
  ([#264](https://github.com/n24q02m/better-notion-mcp/pull/264),
  [`bc51950`](https://github.com/n24q02m/better-notion-mcp/commit/bc5195015722b0256849fd92348300a2c1f930ef))

- 🛡️ Sentinel: [Low] Strip sensitive fields from error.details
  ([#276](https://github.com/n24q02m/better-notion-mcp/pull/276),
  [`9927873`](https://github.com/n24q02m/better-notion-mcp/commit/9927873aa6758f69ef9df128d2a9e434020da3a7))

### Chores

- **deps**: Lock file maintenance ([#256](https://github.com/n24q02m/better-notion-mcp/pull/256),
  [`363d966`](https://github.com/n24q02m/better-notion-mcp/commit/363d966908273ebe9038f9cbe58f42ffd2016e4c))

- **deps**: Update codecov/codecov-action digest to 1af5884
  ([#259](https://github.com/n24q02m/better-notion-mcp/pull/259),
  [`8f514fe`](https://github.com/n24q02m/better-notion-mcp/commit/8f514fe78fa43efc83bcd66de05a5f536a04d812))

- **deps**: Update dawidd6/action-send-mail action to v16
  ([#261](https://github.com/n24q02m/better-notion-mcp/pull/261),
  [`6820e90`](https://github.com/n24q02m/better-notion-mcp/commit/6820e905414815ed7c5c3b7cfbb61c51fc5dd90e))

### Performance Improvements

- Optimize markdown multiline prefix generation
  ([#257](https://github.com/n24q02m/better-notion-mcp/pull/257),
  [`653ef13`](https://github.com/n24q02m/better-notion-mcp/commit/653ef1372bf143d52e1bb42078c81cddfa3bb450))


## v2.19.1 (2026-03-17)

### Bug Fixes

- **security**: Set trust proxy to 2 instead of true
  ([`cec747b`](https://github.com/n24q02m/better-notion-mcp/commit/cec747b542006bf4d0dbf350d0ca6e7a7670328e))


## v2.19.0 (2026-03-17)

### Bug Fixes

- Add status property type conversion in convertToNotionProperties
  ([#251](https://github.com/n24q02m/better-notion-mcp/pull/251),
  [`c7fba95`](https://github.com/n24q02m/better-notion-mcp/commit/c7fba95c2941647c78bb5841e6d7d740e0db087e))

- Clear validation error when pages[] items missing properties wrapper
  ([`3fa2022`](https://github.com/n24q02m/better-notion-mcp/commit/3fa2022b1fa172d041b3546341b963c8cdbc4921))

- Escape HTML in OAuth test callback to prevent reflected XSS
  ([`52456be`](https://github.com/n24q02m/better-notion-mcp/commit/52456be8e95ca3ee33cce9baacf34a427a97a9bb))

- Move pages[] validation before batch, add index, guard update_page
  ([`ec2bf8d`](https://github.com/n24q02m/better-notion-mcp/commit/ec2bf8d0a77109fae858e7303e5e8d6be53e9993))

- Remove unused batchItems function ([#237](https://github.com/n24q02m/better-notion-mcp/pull/237),
  [`5748a99`](https://github.com/n24q02m/better-notion-mcp/commit/5748a998e70b2afb67f4079f44fac4157ac7326a))

- Render nested children in blocksToMarkdown
  ([`85d739b`](https://github.com/n24q02m/better-notion-mcp/commit/85d739be4b6de0eadf7373c52d0f632524e44128))

- Replace console.log with console.info in http transport
  ([#233](https://github.com/n24q02m/better-notion-mcp/pull/233),
  [`44f63fa`](https://github.com/n24q02m/better-notion-mcp/commit/44f63fa6fe8dd53e32106c29962a5ab988dd0e8a))

- Strip explicit sensitive fields in enhanceError
  ([#243](https://github.com/n24q02m/better-notion-mcp/pull/243),
  [`8719e19`](https://github.com/n24q02m/better-notion-mcp/commit/8719e19a55146f7c24b8871c1ed7e6f79b8e50a5))

- Use NotionMCPError for token refresh failure
  ([#232](https://github.com/n24q02m/better-notion-mcp/pull/232),
  [`426aa50`](https://github.com/n24q02m/better-notion-mcp/commit/426aa50351e7476dddd02efdc6bf8e7dc62f87ac))

- **ci**: Use pull_request_target for jobs requiring secrets
  ([`05020b8`](https://github.com/n24q02m/better-notion-mcp/commit/05020b8380a4fe482013123d520a328a58825102))

- **deps**: Update non-major dependencies
  ([#227](https://github.com/n24q02m/better-notion-mcp/pull/227),
  [`2ff05bd`](https://github.com/n24q02m/better-notion-mcp/commit/2ff05bd87c48d73c5a65d47ac635521c078362e2))

- **security**: Prevent protocol obfuscation bypass in isSafeUrl
  ([#230](https://github.com/n24q02m/better-notion-mcp/pull/230),
  [`1c01c6f`](https://github.com/n24q02m/better-notion-mcp/commit/1c01c6f49746546052def15fff46fb521f2b852a))

### Chores

- Add glama.json for Glama directory listing
  ([`4a45e63`](https://github.com/n24q02m/better-notion-mcp/commit/4a45e63c91d5cafb7d0c932a669fddd86f583e1a))

- Remove unused splitText function from richtext.ts
  ([#241](https://github.com/n24q02m/better-notion-mcp/pull/241),
  [`1f5b8de`](https://github.com/n24q02m/better-notion-mcp/commit/1f5b8deb666047911ff06d12d771bb5f87d4574e))

- Standardize repo files across MCP server portfolio
  ([`f7fd74c`](https://github.com/n24q02m/better-notion-mcp/commit/f7fd74c04447dfc23b2ab98a7837eb374f356a4c))

- **deps**: Update dawidd6/action-send-mail action to v15
  ([#254](https://github.com/n24q02m/better-notion-mcp/pull/254),
  [`9afbaf0`](https://github.com/n24q02m/better-notion-mcp/commit/9afbaf04e905fdcdf08da466e1cd3fc3ee5fd934))

- **deps**: Update oven-sh/setup-bun digest to 0c5077e
  ([#253](https://github.com/n24q02m/better-notion-mcp/pull/253),
  [`95efaba`](https://github.com/n24q02m/better-notion-mcp/commit/95efabab62cdca1e4b67911dc48fb941197332de))

- **deps**: Update step-security/harden-runner digest to fa2e9d6
  ([#255](https://github.com/n24q02m/better-notion-mcp/pull/255),
  [`7617045`](https://github.com/n24q02m/better-notion-mcp/commit/7617045990cd22f63b61036184359fc60fcf1490))

### Documentation

- Add better-telegram-mcp to Also by section
  ([`4ff6f57`](https://github.com/n24q02m/better-notion-mcp/commit/4ff6f57c31163be2bc61cd44163387cd5ace6d19))

- Add image/file reading guidance for LLM consumers
  ([`c9ab321`](https://github.com/n24q02m/better-notion-mcp/commit/c9ab3215d5f55a34b9604be09e967717e48e65c3))

### Features

- Add Glama.ai badge to README
  ([`4ab470d`](https://github.com/n24q02m/better-notion-mcp/commit/4ab470d862bedf92d782f0a4944b73a05de99fee))

### Refactoring

- Extract MarkdownParser class from markdownToBlocks function
  ([#249](https://github.com/n24q02m/better-notion-mcp/pull/249),
  [`79426a5`](https://github.com/n24q02m/better-notion-mcp/commit/79426a576028cfd620e8c654e922fff83ef74e3a))

### Testing

- **properties**: Add edge case tests for status property conversion
  ([#251](https://github.com/n24q02m/better-notion-mcp/pull/251),
  [`c7fba95`](https://github.com/n24q02m/better-notion-mcp/commit/c7fba95c2941647c78bb5841e6d7d740e0db087e))


## v2.18.0 (2026-03-12)


## v2.18.0-beta.2 (2026-03-12)

### Bug Fixes

- Correct workspace search filter format in test scripts
  ([`d659bad`](https://github.com/n24q02m/better-notion-mcp/commit/d659bad7d82a864366d89bae9f6fe1834ce8eb43))


## v2.18.0-beta.1 (2026-03-12)

### Bug Fixes

- Pin runtime versions with allowedVersions, revert Python to 3.13
  ([`df4bae1`](https://github.com/n24q02m/better-notion-mcp/commit/df4bae162fc106a6a122ea1ca8317f2f501b9737))

- Revert Python to 3.13, disable mise runtime updates in Renovate, fix duplicate page sanitization
  ([`aa467ed`](https://github.com/n24q02m/better-notion-mcp/commit/aa467ed5449d9f46b9552deb296ba9effc3b1f4f))

- Update mockResult to satisfy QueryDatabaseResponse type in registry tests
  ([#213](https://github.com/n24q02m/better-notion-mcp/pull/213),
  [`433a890`](https://github.com/n24q02m/better-notion-mcp/commit/433a89083a30301df2a5a805b8ddce994906e021))

- **auth**: Prevent timing attack in PKCE validation
  ([#226](https://github.com/n24q02m/better-notion-mcp/pull/226),
  [`b397a85`](https://github.com/n24q02m/better-notion-mcp/commit/b397a85c68f8b8360f335997d5dd8477b5a3e800))

- **deps**: Update non-major dependencies
  ([#206](https://github.com/n24q02m/better-notion-mcp/pull/206),
  [`91a152f`](https://github.com/n24q02m/better-notion-mcp/commit/91a152f25a302a48e3dc0bded5aef16a40995d69))

### Chores

- **deps**: Lock file maintenance ([#224](https://github.com/n24q02m/better-notion-mcp/pull/224),
  [`ee9e772`](https://github.com/n24q02m/better-notion-mcp/commit/ee9e772616be3ffdfc0c30e6a60d37d510db64a8))

- **deps**: Update actions/dependency-review-action digest to 3c4e3dc
  ([#205](https://github.com/n24q02m/better-notion-mcp/pull/205),
  [`1cbac7f`](https://github.com/n24q02m/better-notion-mcp/commit/1cbac7f5d52715c9e49e44ee8d89026435c6e195))

- **deps**: Update actions/download-artifact digest to 3e5f45b
  ([#222](https://github.com/n24q02m/better-notion-mcp/pull/222),
  [`c6e3d98`](https://github.com/n24q02m/better-notion-mcp/commit/c6e3d98361fa474c068f8c0fcc97be9caca4bb88))

- **deps**: Update dawidd6/action-send-mail action to v13
  ([#223](https://github.com/n24q02m/better-notion-mcp/pull/223),
  [`4b13d46`](https://github.com/n24q02m/better-notion-mcp/commit/4b13d46bd2abfc6a5b2e18b51cd30bcad83ffc47))

### Features

- Expand live MCP test with comprehensive API coverage
  ([`528cd79`](https://github.com/n24q02m/better-notion-mcp/commit/528cd790ffdc608b140f1271af95c4da1669b340))

- Fix workspace docs filter value, add OAuth test script
  ([`a55e7b2`](https://github.com/n24q02m/better-notion-mcp/commit/a55e7b2d938448226804456b129484cc044c8bea))

- Optimize block deletion concurrency and batch processing
  ([#220](https://github.com/n24q02m/better-notion-mcp/pull/220),
  [`6cd82ff`](https://github.com/n24q02m/better-notion-mcp/commit/6cd82ff62c3b0c3e2c4aecbafef1ababbed5d521))

### Performance Improvements

- Optimize query database data source schema retrieval
  ([#217](https://github.com/n24q02m/better-notion-mcp/pull/217),
  [`496ddbb`](https://github.com/n24q02m/better-notion-mcp/commit/496ddbb1a67a64dd2d4985affd8a43cc2275a23f))

- Optimize user extraction in from_workspace
  ([#215](https://github.com/n24q02m/better-notion-mcp/pull/215),
  [`9f02cde`](https://github.com/n24q02m/better-notion-mcp/commit/9f02cded73a9aac3bd5d426b9607246b06c5d0b1))

### Refactoring

- Extract inline helper to reduce complexity in parseRichText
  ([#221](https://github.com/n24q02m/better-notion-mcp/pull/221),
  [`f79b3b5`](https://github.com/n24q02m/better-notion-mcp/commit/f79b3b5776be9b7ef21d85797233914559f56e1a))

- Extract inline parsing to reduce cyclomatic complexity in markdownToBlocks
  ([#219](https://github.com/n24q02m/better-notion-mcp/pull/219),
  [`55a9ea0`](https://github.com/n24q02m/better-notion-mcp/commit/55a9ea07358ef95bfcadd44f18713aba42b8166f))

- Remove console.error from handleNotionError
  ([#212](https://github.com/n24q02m/better-notion-mcp/pull/212),
  [`32ea316`](https://github.com/n24q02m/better-notion-mcp/commit/32ea316466b1059bf355912a67a5716182d68558))

### Testing

- Add missing error path test for documentation retrieval
  ([#216](https://github.com/n24q02m/better-notion-mcp/pull/216),
  [`0dfb8ca`](https://github.com/n24q02m/better-notion-mcp/commit/0dfb8caabb88803e50e311d6b8e545af80e28702))

- Add tests for extractPageProperties
  ([#218](https://github.com/n24q02m/better-notion-mcp/pull/218),
  [`084d5cd`](https://github.com/n24q02m/better-notion-mcp/commit/084d5cdaf5ce0efbb42b27f464c393dd10d28572))

- Add tests for security URL validation
  ([#209](https://github.com/n24q02m/better-notion-mcp/pull/209),
  [`771a880`](https://github.com/n24q02m/better-notion-mcp/commit/771a8808c9f7dc777e38af890a1062dd3c6e8eeb))


## v2.17.0 (2026-03-10)

### Bug Fixes

- [perf] optimize text extraction from rich text arrays
  ([#204](https://github.com/n24q02m/better-notion-mcp/pull/204),
  [`9955367`](https://github.com/n24q02m/better-notion-mcp/commit/9955367a75a66f672aae0bcf39e84d599bd8657e))

- Add .jules/ and JULES.md to gitignore
  ([`5f13ecd`](https://github.com/n24q02m/better-notion-mcp/commit/5f13ecde7ec41e4bcecb7826f7e64e1ba015e336))

- Block unsafe redirect URI protocols to prevent XSS\n\n- Add protocol check in OAuth callback
  handler to prevent Open Redirects and XSS vulnerabilities via `javascript:`, `data:`, `vbscript:`,
  and `file:` protocols.\n- Add unit test to verify that unsafe redirect URIs are properly
  rejected.\n- Document the learning in `.jules/sentinel.md` as per guidelines.
  ([#203](https://github.com/n24q02m/better-notion-mcp/pull/203),
  [`470af68`](https://github.com/n24q02m/better-notion-mcp/commit/470af68a4a79cf0cec7b4d65701e35a57051f278))

- Format .infisical.json and renovate.json for Biome compliance
  ([`6695742`](https://github.com/n24q02m/better-notion-mcp/commit/6695742b8b88f7464e9393ce2ad42baafdb3a1f1))

- Optimize text extraction from rich text arrays
  ([#204](https://github.com/n24q02m/better-notion-mcp/pull/204),
  [`9955367`](https://github.com/n24q02m/better-notion-mcp/commit/9955367a75a66f672aae0bcf39e84d599bd8657e))

- Remove commit-message-check job
  ([`7797f9f`](https://github.com/n24q02m/better-notion-mcp/commit/7797f9f9f3e99e3799a6a3721f0871f16e87c063))

- Replace map/filter chains with single-pass loops
  ([`51a65c9`](https://github.com/n24q02m/better-notion-mcp/commit/51a65c95aa67b5237c03a0f50a8692152590117c))

- Standardize CI with PR title check, email notify, and templates
  ([`10778e2`](https://github.com/n24q02m/better-notion-mcp/commit/10778e2b330874f80a30c9154f8209319bca108c))

- Sync CI/CD configs and standardize templates
  ([`034dff2`](https://github.com/n24q02m/better-notion-mcp/commit/034dff27a147ca14ca981ef0050311e3f6d7bb9e))

- **ci**: Pin PSR v10, Python 3.13, Node 24, Java 21 in Renovate
  ([`01ad73e`](https://github.com/n24q02m/better-notion-mcp/commit/01ad73e86d6a7baa0e3944a523ff19fd61146b83))

### Chores

- **deps**: Lock file maintenance ([#193](https://github.com/n24q02m/better-notion-mcp/pull/193),
  [`ec2a3ab`](https://github.com/n24q02m/better-notion-mcp/commit/ec2a3ab117e6dcd3643a95004f2e46d491205a9f))

### Code Style

- Fix biome formatting for long assertion line
  ([`2d8c797`](https://github.com/n24q02m/better-notion-mcp/commit/2d8c79738a6371539d09db6c4293676d8d8b8862))

### Continuous Integration

- Improve PR checks and Qodo filtering
  ([#202](https://github.com/n24q02m/better-notion-mcp/pull/202),
  [`01e1803`](https://github.com/n24q02m/better-notion-mcp/commit/01e18037b35c66a78642e0411dcdf512683bf62a))

### Features

- Optimize string accumulation in rich text processing
  ([#204](https://github.com/n24q02m/better-notion-mcp/pull/204),
  [`9955367`](https://github.com/n24q02m/better-notion-mcp/commit/9955367a75a66f672aae0bcf39e84d599bd8657e))

### Performance Improvements

- Optimize text extraction from rich text arrays
  ([#204](https://github.com/n24q02m/better-notion-mcp/pull/204),
  [`9955367`](https://github.com/n24q02m/better-notion-mcp/commit/9955367a75a66f672aae0bcf39e84d599bd8657e))

### Testing

- Increase coverage to 95%+ lines
  ([`6fe11d9`](https://github.com/n24q02m/better-notion-mcp/commit/6fe11d9a3da5167dd15292b1a9f20e03ffd6166e))


## v2.16.0 (2026-03-08)

### Bug Fixes

- Handle inline summary and nested toggles in markdown parser
  ([#194](https://github.com/n24q02m/better-notion-mcp/pull/194),
  [`88e6be2`](https://github.com/n24q02m/better-notion-mcp/commit/88e6be2bb90ed79c81c999e2f315ac7e3c1d2f99))

- **ci**: Fix Qodo PR review for external contributors
  ([`fca5a36`](https://github.com/n24q02m/better-notion-mcp/commit/fca5a3650fb4c3550b3cb54631d669eed11279e7))

- **comments**: Improve error messages for Notion API limitations
  ([`f147c0d`](https://github.com/n24q02m/better-notion-mcp/commit/f147c0d4f420c9b335055dec5b1c4a6a03c692da))

- **security**: Add rate limiting to MCP endpoints
  ([`47dbfe4`](https://github.com/n24q02m/better-notion-mcp/commit/47dbfe4a298ebd0875902e2e258d21abbbc2c890))

### Chores

- Fix biome 2.4.6 schema version and formatting
  ([#194](https://github.com/n24q02m/better-notion-mcp/pull/194),
  [`88e6be2`](https://github.com/n24q02m/better-notion-mcp/commit/88e6be2bb90ed79c81c999e2f315ac7e3c1d2f99))

### Features

- Add icon format detection and cover shorthand support
  ([#195](https://github.com/n24q02m/better-notion-mcp/pull/195),
  [`491f9fe`](https://github.com/n24q02m/better-notion-mcp/commit/491f9fe0c4336c8ee74b16f4330137e1df19a1d2))


## v2.15.3-beta.1 (2026-03-08)

### Bug Fixes

- Add null safety for Notion API response handling
  ([`a50acd9`](https://github.com/n24q02m/better-notion-mcp/commit/a50acd91b8f1c9cd599297331e329f63ff184529))

### Continuous Integration

- Remove Cloud Run deploy from CD pipeline
  ([`b2068ae`](https://github.com/n24q02m/better-notion-mcp/commit/b2068ae2fde66c9581d4ed531c0be724caeaf1c5))


## v2.15.2 (2026-03-08)

### Bug Fixes

- **auth**: Stop logging raw error body from Notion token endpoint
  ([`17a9681`](https://github.com/n24q02m/better-notion-mcp/commit/17a96818620e65dde4c9ba92b62d32e1ddcb6bf0))


## v2.15.2-beta.1 (2026-03-08)

### Bug Fixes

- **auth**: Harden multi-user security with PKCE, session binding, and strict IP check
  ([`e549e6a`](https://github.com/n24q02m/better-notion-mcp/commit/e549e6a54537628357b34fabf5413ef2983864a6))

### Code Style

- Format test file with biome
  ([`51f6073`](https://github.com/n24q02m/better-notion-mcp/commit/51f607386d3987378156f283f4686b471772d9e1))


## v2.15.1 (2026-03-08)

### Bug Fixes

- **auth**: Replace grace period fallback with one-shot pending bind
  ([`1f274b7`](https://github.com/n24q02m/better-notion-mcp/commit/1f274b7418ebfd4caf17bca095fb2dae3d9be78d))


## v2.15.0 (2026-03-08)


## v2.15.0-beta.4 (2026-03-08)

### Bug Fixes

- **auth**: Store Notion tokens server-side with token binding and grace period
  ([`8bfc678`](https://github.com/n24q02m/better-notion-mcp/commit/8bfc678b73954e568a49033342cb831a7bef291c))

- **cd**: Use Cloud Run URL for healthcheck instead of custom domain
  ([`5fb8436`](https://github.com/n24q02m/better-notion-mcp/commit/5fb8436424581391d0e39e80aa86089a983b7ae1))


## v2.15.0-beta.3 (2026-03-08)

### Bug Fixes

- Add JSON body parser for MCP POST endpoint
  ([`32e170a`](https://github.com/n24q02m/better-notion-mcp/commit/32e170a4cef9f14317cdb86e15b2ebfcb6260d82))


## v2.15.0-beta.2 (2026-03-07)

### Bug Fixes

- **cd**: Update deploy-cloudrun action SHA
  ([`3dff1f7`](https://github.com/n24q02m/better-notion-mcp/commit/3dff1f73613cf99377599d98d7e871bfa0f0f39e))


## v2.15.0-beta.1 (2026-03-07)

### Bug Fixes

- Add privacy policy for Notion OAuth public integration
  ([`da922a2`](https://github.com/n24q02m/better-notion-mcp/commit/da922a2149a33a3d4e894282f6b8418625bc5b8f))

### Features

- Add OAuth 2.1 remote mode with Notion callback relay
  ([`bf854df`](https://github.com/n24q02m/better-notion-mcp/commit/bf854df23143734cb95f6633de8c6b0ef1b660ac))

### Refactoring

- Extract server factory and stdio transport (Phase 1)
  ([`887f1f4`](https://github.com/n24q02m/better-notion-mcp/commit/887f1f4b26231d3a2e5ff5112d2fdbd9bcbd3e15))


## v2.14.0 (2026-03-07)


## v2.14.0-beta.1 (2026-03-07)

### Features

- Smart ID resolution and improved error recovery (Phase 0.5)
  ([`490bca4`](https://github.com/n24q02m/better-notion-mcp/commit/490bca49ce6f139e9a939c7b28cc828a1fbc75fc))


## v2.13.1 (2026-03-07)

### Bug Fixes

- Correct callout emoji encoding and add recursive children fetch
  ([`d17abbe`](https://github.com/n24q02m/better-notion-mcp/commit/d17abbe29ddeb511b6d450136e785b41f5db8390))


## v2.13.0 (2026-03-07)


## v2.13.0-beta.1 (2026-03-07)

### Bug Fixes

- Align repo with skill audit findings
  ([`56dfc27`](https://github.com/n24q02m/better-notion-mcp/commit/56dfc277fcca363d887a910973f0038e84f8efd4))

- Correct Qodo PR Agent ignore_pr_authors config
  ([`75c0e98`](https://github.com/n24q02m/better-notion-mcp/commit/75c0e985e7335bf6e83870ed43720c9569f7dbdf))

- Delete docs directory
  ([`18dc683`](https://github.com/n24q02m/better-notion-mcp/commit/18dc683e22106c7536dc99eddea6e8981a265ffa))

- Remove text property from mention elements for Notion API compatibility
  ([#187](https://github.com/n24q02m/better-notion-mcp/pull/187),
  [`46488db`](https://github.com/n24q02m/better-notion-mcp/commit/46488db9d60aa0de038906b0f1b39aabbeb11c45))

- **markdown**: Parse rich text formatting in table cells
  ([#189](https://github.com/n24q02m/better-notion-mcp/pull/189),
  [`0b3587a`](https://github.com/n24q02m/better-notion-mcp/commit/0b3587a9b04defe6005fdeaf123fc2d1889b72d8))

- **markdown**: Table cells don't parse rich text formatting
  ([#189](https://github.com/n24q02m/better-notion-mcp/pull/189),
  [`0b3587a`](https://github.com/n24q02m/better-notion-mcp/commit/0b3587a9b04defe6005fdeaf123fc2d1889b72d8))

- **properties**: Handle relation type in convertToNotionProperties
  ([#190](https://github.com/n24q02m/better-notion-mcp/pull/190),
  [`a51340f`](https://github.com/n24q02m/better-notion-mcp/commit/a51340fa11c038a8ced189ddf870f6c441bb7d16))

### Chores

- **deps**: Update docker/build-push-action action to v7
  ([#184](https://github.com/n24q02m/better-notion-mcp/pull/184),
  [`5889832`](https://github.com/n24q02m/better-notion-mcp/commit/5889832a5b86fb49d43db93591e68b01248a2660))

- **deps**: Update non-major dependencies
  ([#183](https://github.com/n24q02m/better-notion-mcp/pull/183),
  [`f0a6210`](https://github.com/n24q02m/better-notion-mcp/commit/f0a62106086ec784ddc8dd9d253d4c9e7e6518d7))

- **deps**: Update step-security/harden-runner digest to 58077d3
  ([#182](https://github.com/n24q02m/better-notion-mcp/pull/182),
  [`b9a0f88`](https://github.com/n24q02m/better-notion-mcp/commit/b9a0f88c8b3201e3afb0e94529e38890a21badee))

### Documentation

- Add page mention syntax to Rich Text Formatting section
  ([#187](https://github.com/n24q02m/better-notion-mcp/pull/187),
  [`46488db`](https://github.com/n24q02m/better-notion-mcp/commit/46488db9d60aa0de038906b0f1b39aabbeb11c45))

- Document column width_ratio syntax in blocks help
  ([#188](https://github.com/n24q02m/better-notion-mcp/pull/188),
  [`d055732`](https://github.com/n24q02m/better-notion-mcp/commit/d055732732b033fd4e1363280b8c8cce00805d37))

- Use `bun run test` instead of `bun test` in contributor docs
  ([#190](https://github.com/n24q02m/better-notion-mcp/pull/190),
  [`a51340f`](https://github.com/n24q02m/better-notion-mcp/commit/a51340fa11c038a8ced189ddf870f6c441bb7d16))

- Use `bun run test` instead of `bun test` in contributor docs
  ([#189](https://github.com/n24q02m/better-notion-mcp/pull/189),
  [`0b3587a`](https://github.com/n24q02m/better-notion-mcp/commit/0b3587a9b04defe6005fdeaf123fc2d1889b72d8))

- Use `bun run test` instead of `bun test` in contributor docs
  ([#186](https://github.com/n24q02m/better-notion-mcp/pull/186),
  [`3065ebd`](https://github.com/n24q02m/better-notion-mcp/commit/3065ebd7f9b176e7fe3aed8582d882509a6a374c))

### Features

- Add column width_ratio support and fix empty column handling
  ([#188](https://github.com/n24q02m/better-notion-mcp/pull/188),
  [`d055732`](https://github.com/n24q02m/better-notion-mcp/commit/d055732732b033fd4e1363280b8c8cce00805d37))

- Add page mention syntax @[Title](id)
  ([#187](https://github.com/n24q02m/better-notion-mcp/pull/187),
  [`46488db`](https://github.com/n24q02m/better-notion-mcp/commit/46488db9d60aa0de038906b0f1b39aabbeb11c45))

- Column width_ratio support and layout test coverage
  ([#188](https://github.com/n24q02m/better-notion-mcp/pull/188),
  [`d055732`](https://github.com/n24q02m/better-notion-mcp/commit/d055732732b033fd4e1363280b8c8cce00805d37))

- Page mention syntax @[Title](id) (#1)
  ([#187](https://github.com/n24q02m/better-notion-mcp/pull/187),
  [`46488db`](https://github.com/n24q02m/better-notion-mcp/commit/46488db9d60aa0de038906b0f1b39aabbeb11c45))

### Testing

- Add column layout and width_ratio tests
  ([#188](https://github.com/n24q02m/better-notion-mcp/pull/188),
  [`d055732`](https://github.com/n24q02m/better-notion-mcp/commit/d055732732b033fd4e1363280b8c8cce00805d37))

- Add failing tests for page mention syntax
  ([#187](https://github.com/n24q02m/better-notion-mcp/pull/187),
  [`46488db`](https://github.com/n24q02m/better-notion-mcp/commit/46488db9d60aa0de038906b0f1b39aabbeb11c45))

- **markdown**: Add table cell rich text formatting tests
  ([#189](https://github.com/n24q02m/better-notion-mcp/pull/189),
  [`0b3587a`](https://github.com/n24q02m/better-notion-mcp/commit/0b3587a9b04defe6005fdeaf123fc2d1889b72d8))

- **properties**: Add failing tests for relation property conversion
  ([#190](https://github.com/n24q02m/better-notion-mcp/pull/190),
  [`a51340f`](https://github.com/n24q02m/better-notion-mcp/commit/a51340fa11c038a8ced189ddf870f6c441bb7d16))


## v2.12.7 (2026-03-06)

### Bug Fixes

- Add Docker LABEL and re-add OCI package for MCP Registry
  ([`4f91701`](https://github.com/n24q02m/better-notion-mcp/commit/4f917017b61dd45f67459af05c197427f5c4f04c))


## v2.12.6 (2026-03-06)

### Bug Fixes

- Remove OCI package from server.json until Docker LABEL annotation added
  ([`8b931fd`](https://github.com/n24q02m/better-notion-mcp/commit/8b931fd0a3af329129be4e7796662037ebc6c787))


## v2.12.5 (2026-03-06)

### Bug Fixes

- Keep OCI identifier as latest in MCP Registry publish
  ([`8a70399`](https://github.com/n24q02m/better-notion-mcp/commit/8a703996ad40a0ecfdba21203460d4f68b719693))

### Continuous Integration

- Skip Qodo AI review for bot-created PRs
  ([`bde0e54`](https://github.com/n24q02m/better-notion-mcp/commit/bde0e54c6a173e690eada5157ff90f5b791298ce))


## v2.12.4 (2026-03-06)

### Bug Fixes

- Handle OCI package version in MCP Registry publish
  ([`180ce28`](https://github.com/n24q02m/better-notion-mcp/commit/180ce28362ceb73bf7aeee14e21200137851cbbc))


## v2.12.3 (2026-03-06)

### Bug Fixes

- Update server.json version dynamically in MCP Registry publish job
  ([`6e7d0b2`](https://github.com/n24q02m/better-notion-mcp/commit/6e7d0b207f1001016bada4100b72135efa03dc0b))


## v2.12.2 (2026-03-06)

### Bug Fixes

- Add mcpName field for MCP Registry ownership validation
  ([`ee2e5a7`](https://github.com/n24q02m/better-notion-mcp/commit/ee2e5a7b6d0d1ab9651cc69b7c47b4ffbaa61ca1))


## v2.12.1 (2026-03-06)

### Bug Fixes

- Shorten server.json description to comply with MCP Registry 100-char limit
  ([`2ae0220`](https://github.com/n24q02m/better-notion-mcp/commit/2ae02209f01f8af6fea8f9d1420bece94cb825e6))

### Documentation

- Add compatible-with badges and cross-links to sibling MCP servers
  ([`e23917b`](https://github.com/n24q02m/better-notion-mcp/commit/e23917b443317a2ad0393d2d3d2d20a473e38aa6))

- Add MCP client keywords to package.json for npm discoverability
  ([`4fdeeb9`](https://github.com/n24q02m/better-notion-mcp/commit/4fdeeb9f3226115f426aed28b08b2f93819d1538))

- Add server.json and MCP Registry publish step to CD workflow
  ([`479d220`](https://github.com/n24q02m/better-notion-mcp/commit/479d2205c76a99b5787d786d2fd0432f8cafe2b1))

- Update compatible-with badges - add Antigravity, Gemini CLI, Codex, OpenCode
  ([`24824d5`](https://github.com/n24q02m/better-notion-mcp/commit/24824d5b1c735e1d87c2710244450cf26dafbfb6))


## v2.12.0 (2026-03-06)

### Bug Fixes

- Update Codecov badge in README.md
  ([`3c7873a`](https://github.com/n24q02m/better-notion-mcp/commit/3c7873a361c19c36ef8332bc2d2e68cb5f76948f))

### Chores

- **deps**: Update dependency @biomejs/biome to ^2.4.6
  ([#179](https://github.com/n24q02m/better-notion-mcp/pull/179),
  [`43bde59`](https://github.com/n24q02m/better-notion-mcp/commit/43bde59f5af1a04565495770916866cbc9e8fe20))

### Code Style

- Fix biome formatting in live test script
  ([`6840ac1`](https://github.com/n24q02m/better-notion-mcp/commit/6840ac19efe5b5da093ee3e21316901e96ccec44))

### Features

- Enhance Phase 5 live test with per-action validation
  ([`74d3bd3`](https://github.com/n24q02m/better-notion-mcp/commit/74d3bd3e8485623282e04d91a723dbd6ab4b612f))

### Testing

- Add Phase 5 live MCP protocol test
  ([`7ce2e00`](https://github.com/n24q02m/better-notion-mcp/commit/7ce2e00ada4a3722552a8291fb045e815b689c5b))


## v2.11.0 (2026-03-03)

### Bug Fixes

- Delete .vscode directory
  ([`f9190e4`](https://github.com/n24q02m/better-notion-mcp/commit/f9190e4ee3043e65387e8f27dab7457571ec94aa))

- Lint and format errors from biome 2.4.5
  ([`8c900b5`](https://github.com/n24q02m/better-notion-mcp/commit/8c900b551f93b6cb24180773fa3943af869e0a55))

- **deps**: Lock file maintenance (PR #145)
  ([`265057a`](https://github.com/n24q02m/better-notion-mcp/commit/265057ab1dd68ae86263aec17f7e529360657fa3))

- **deps**: Pin dependencies (PR #141)
  ([`d1c725c`](https://github.com/n24q02m/better-notion-mcp/commit/d1c725c0f6ffe12e4765a3dde78ea45dcc7c4ded))

- **deps**: Update actions/checkout action to v6 (PR #166)
  ([`566ec89`](https://github.com/n24q02m/better-notion-mcp/commit/566ec89b360749ba7db229108a5f53a3c8192b66))

- **deps**: Update bun.lock
  ([`ba6d394`](https://github.com/n24q02m/better-notion-mcp/commit/ba6d3941723ac4d5d35cec33f4f60ea97fa01a66))

- **deps**: Update github artifact actions (PR #143)
  ([`3a2a6e4`](https://github.com/n24q02m/better-notion-mcp/commit/3a2a6e4b955ace01aa690cbd230f62c32c908477))

- **deps**: Update non-major dependencies (PR #142)
  ([`833fff6`](https://github.com/n24q02m/better-notion-mcp/commit/833fff65b0b0b5e30871ce239136730583302190))

- **perf**: Hoist regular expressions in markdown parsing
  ([#171](https://github.com/n24q02m/better-notion-mcp/pull/171),
  [`e9ca999`](https://github.com/n24q02m/better-notion-mcp/commit/e9ca9991413ab516d04914bb211d16e9e7be97b5))

- **perf**: Optimize database property extraction
  ([#150](https://github.com/n24q02m/better-notion-mcp/pull/150),
  [`ba4b655`](https://github.com/n24q02m/better-notion-mcp/commit/ba4b655f9dbdac5790d9e3964dc2ccd0d4ba5fe8))

- **perf**: Optimize duplicatePage with parallel fetching
  ([#156](https://github.com/n24q02m/better-notion-mcp/pull/156),
  [`81ef18b`](https://github.com/n24q02m/better-notion-mcp/commit/81ef18bf00d80b39b7625f821c862424112e9dc3))

- **perf**: Optimize getPageProperty relation extraction
  ([#152](https://github.com/n24q02m/better-notion-mcp/pull/152),
  [`7bd6ed9`](https://github.com/n24q02m/better-notion-mcp/commit/7bd6ed918eb8b2e101fe8f91185707a36b602dd6))

- **perf**: Optimize Notion property extraction loop overhead
  ([#170](https://github.com/n24q02m/better-notion-mcp/pull/170),
  [`945de49`](https://github.com/n24q02m/better-notion-mcp/commit/945de49d5fe3df868815277b8a1e18a6962d0c88))

- **perf**: Optimize page content replacement with streaming deletion
  ([#161](https://github.com/n24q02m/better-notion-mcp/pull/161),
  [`bcadfe8`](https://github.com/n24q02m/better-notion-mcp/commit/bcadfe83d5fad8056bbe8ba6af9c23380ba1fb47))

- **perf**: Optimize rich text helper functions
  ([#146](https://github.com/n24q02m/better-notion-mcp/pull/146),
  [`b8b5202`](https://github.com/n24q02m/better-notion-mcp/commit/b8b5202dc94c256be528cd558d3f180c67d55241))

- **richtext**: Truncate edge case for small lengths
  ([#155](https://github.com/n24q02m/better-notion-mcp/pull/155),
  [`ee9a4fb`](https://github.com/n24q02m/better-notion-mcp/commit/ee9a4fb863f4dd8c46c321e35d272be877fc0385))

- **security**: Apply safe url check to markdown links
  ([`7a241a8`](https://github.com/n24q02m/better-notion-mcp/commit/7a241a8648d0a7cae3178bc74226ce4cab01c314))

- **types**: Add strong typing to databases tool response
  ([#157](https://github.com/n24q02m/better-notion-mcp/pull/157),
  [`944ba57`](https://github.com/n24q02m/better-notion-mcp/commit/944ba5733529e34277e78987cb07c7045d91ad7d))

- **types**: Refactor pages tool to use strict return types
  ([#159](https://github.com/n24q02m/better-notion-mcp/pull/159),
  [`cb9780f`](https://github.com/n24q02m/better-notion-mcp/commit/cb9780ff9456c7167eacf3280cf0906d712e6f21))

- **windows**: Replace bunx with bun x for cross-platform compatibility
  ([`61d6b96`](https://github.com/n24q02m/better-notion-mcp/commit/61d6b96d377a7b6aaa32302c7e900d37fc85ded4))

### Features

- **security**: Validate external URLs to prevent XSS attacks
  ([#169](https://github.com/n24q02m/better-notion-mcp/pull/169),
  [`bf73482`](https://github.com/n24q02m/better-notion-mcp/commit/bf73482b245d4148407e27a8da96df6dbdabf047))

### Testing

- Add tests for contentConvert tool ([#148](https://github.com/n24q02m/better-notion-mcp/pull/148),
  [`f672807`](https://github.com/n24q02m/better-notion-mcp/commit/f672807e635643310d9592ecb42da103f6facfc1))

- Add tests for initServer startup logic
  ([#158](https://github.com/n24q02m/better-notion-mcp/pull/158),
  [`4350afe`](https://github.com/n24q02m/better-notion-mcp/commit/4350afe6be8b2073c9b8120e9fb72973ca75094b))

- Improve testing for mixed-type arrays in properties helper
  ([#149](https://github.com/n24q02m/better-notion-mcp/pull/149),
  [`b6fc9ad`](https://github.com/n24q02m/better-notion-mcp/commit/b6fc9adef902a3993c907b2bcf8b3301db6e06e0))

- Prevent block update with mismatched content type
  ([#154](https://github.com/n24q02m/better-notion-mcp/pull/154),
  [`a9060fe`](https://github.com/n24q02m/better-notion-mcp/commit/a9060fea780f64af584144cdecb0424dad1130eb))


## v2.10.1 (2026-02-28)

### Bug Fixes

- **docker**: Remove unsupported --production flag from bun install
  ([`4ce090e`](https://github.com/n24q02m/better-notion-mcp/commit/4ce090ec16ecb74be67f359f1b02f0f5339149d8))


## v2.10.0 (2026-02-28)

### Bug Fixes

- Update README badges with Codecov, tech stack, and engineering standards
  ([`3783415`](https://github.com/n24q02m/better-notion-mcp/commit/37834155da6d6c0572f194e37dd9df039fe1cb68))

- Update rollup to 4.59.0 to fix path traversal vulnerability (CVE)
  ([`3c831f5`](https://github.com/n24q02m/better-notion-mcp/commit/3c831f5601678b2094710499e270d364ab519cb1))

- **ci**: Fix syntax errors and correctly configure Qodo + Gemini 3 Flash
  ([`bdaf2ee`](https://github.com/n24q02m/better-notion-mcp/commit/bdaf2ee34428bb19d6faa79e07bf5ff73d895c96))

- **ci**: Merge Qodo PR-agent config into main branch
  ([`7046d8f`](https://github.com/n24q02m/better-notion-mcp/commit/7046d8f8921631b20e3cbb07461a90a2aa5682d0))

- **ci**: Move pr-agent config to .pr_agent.toml
  ([`9e4bde8`](https://github.com/n24q02m/better-notion-mcp/commit/9e4bde8c72f3197abeaabbd8d5e865607d8a1cc1))

- **ci**: Update to supported Gemini 3 and 2.5 flash models
  ([`2f503c3`](https://github.com/n24q02m/better-notion-mcp/commit/2f503c32642b3ef92302cc4de71e88e5a61dc4ac))

- **ci**: Use bun run test for vitest and remove mise exec from pre-commit hooks
  ([`c088387`](https://github.com/n24q02m/better-notion-mcp/commit/c0883870e25ad4406d82b382108a9f426180e7ff))

### Chores

- Migrate to 2025-2026 tech stack (bun/biome)
  ([`fa48361`](https://github.com/n24q02m/better-notion-mcp/commit/fa48361c51ce130004e246c9d8fc2d15834fe567))

### Features

- **ci**: Migrate to Qodo Merge AI Review (Gemini 3 Flash)
  ([`c20dd76`](https://github.com/n24q02m/better-notion-mcp/commit/c20dd76b848e6b94b34995f83edf6474581f3a9e))


## v2.9.0 (2026-02-26)

### Bug Fixes

- Consolidate security, performance, and code quality improvements
  ([`bd825ed`](https://github.com/n24q02m/better-notion-mcp/commit/bd825ed825c07eb76a60936da45c65b19797ee6b))

- Standardize repo structure with enforce-commit hook
  ([`616b94b`](https://github.com/n24q02m/better-notion-mcp/commit/616b94b1529625d35db118c5a260c9a4348a6b95))

- **deps**: Update @modelcontextprotocol/sdk to fix hono timing vulnerability
  ([`fee2a1e`](https://github.com/n24q02m/better-notion-mcp/commit/fee2a1e93fccc9caf99beaf2c3983d743e2cf27c))

- **file-uploads**: Auto-retrieve content_type from upload session in send action
  ([`36a02c1`](https://github.com/n24q02m/better-notion-mcp/commit/36a02c1adb25a8c14c3753e93b70229b214349a5))

- **security**: Add allowlist validation for help tool_name to prevent path traversal (registry.ts)
  ([`bd825ed`](https://github.com/n24q02m/better-notion-mcp/commit/bd825ed825c07eb76a60936da45c65b19797ee6b))

### Chores

- Add Gemini Code Assist style guide
  ([`8e3c461`](https://github.com/n24q02m/better-notion-mcp/commit/8e3c461da14d27dbc844fcf4592c8db849d1f8f3))

- Change Renovate schedule to daily 5am
  ([`9101e65`](https://github.com/n24q02m/better-notion-mcp/commit/9101e65ba98c8a41f56a0666dc7baf00e03435bf))

- Remove CodeRabbit config, migrating to Gemini Code Assist
  ([`a3d5588`](https://github.com/n24q02m/better-notion-mcp/commit/a3d558822204504646832b01b669c7f7dc3e3183))

- **config**: Migrate config renovate.json
  ([#139](https://github.com/n24q02m/better-notion-mcp/pull/139),
  [`14e7591`](https://github.com/n24q02m/better-notion-mcp/commit/14e7591adcf588b1a7655009bbb742240a39086f))

### Features

- Add Codecov coverage upload and CodeRabbit config
  ([`fbb88df`](https://github.com/n24q02m/better-notion-mcp/commit/fbb88df41d15356257784303ef9467b4cd25883d))

- **ci**: Add Renovate config for automated dependency updates
  ([`a333d05`](https://github.com/n24q02m/better-notion-mcp/commit/a333d05cd5593f1e17ada9b5eef81cece237afcf))

- **ci**: Add StepSecurity Harden-Runner to all workflow jobs (audit mode)
  ([`e97e648`](https://github.com/n24q02m/better-notion-mcp/commit/e97e648b2a90045980e4c3498a46f039c58def7e))

### Testing

- Add unit tests for users and workspace tools
  ([`8be28fa`](https://github.com/n24q02m/better-notion-mcp/commit/8be28fad8d3b014dcf70679a952794081779b334))


## v2.8.0 (2026-02-25)

### Bug Fixes

- Add CI status badge to README
  ([`57847aa`](https://github.com/n24q02m/better-notion-mcp/commit/57847aaaa0ed08bd59019dabd573221e082c8f55))

- Remove limitations section from README
  ([`96c116c`](https://github.com/n24q02m/better-notion-mcp/commit/96c116cb4093758a2415f331781cf06eb4ad7bd4))

### Features

- Add data encapsulation against indirect prompt injection (XPIA)
  ([`c229386`](https://github.com/n24q02m/better-notion-mcp/commit/c22938617c72182df83726dc530538d340222df8))


## v2.7.0 (2026-02-20)

### Bug Fixes

- **deps**: Upgrade ajv to 8.18.0 for ReDoS security patch
  ([#114](https://github.com/n24q02m/better-notion-mcp/pull/114),
  [`d3b551a`](https://github.com/n24q02m/better-notion-mcp/commit/d3b551aa33775facf59eb538a2c24a45bddc541a))

- **deps**: Upgrade ajv to 8.18.0 for ReDoS security patch
  ([#76](https://github.com/n24q02m/better-notion-mcp/pull/76),
  [`027f71c`](https://github.com/n24q02m/better-notion-mcp/commit/027f71ce0808a3e7b4828d1bfff31ab0dde65a70))

### Chores

- **deps**: Bump qs from 6.14.1 to 6.14.2
  ([`f3213a3`](https://github.com/n24q02m/better-notion-mcp/commit/f3213a39ecd247d0dec8520d9f56079546e5eb1c))

### Documentation

- Add AGENTS.md for AI coding agents
  ([`86342a2`](https://github.com/n24q02m/better-notion-mcp/commit/86342a2189db9ca0b4a41ec09b038e023b8f0af1))

- Add required annotations to quick start config
  ([`aa5508f`](https://github.com/n24q02m/better-notion-mcp/commit/aa5508f9c447e71c463b99cb876cb8d262620bc1))

- Sync tool docs with code - add missing params and fix deprecated annotations
  ([`3fd8bda`](https://github.com/n24q02m/better-notion-mcp/commit/3fd8bdabeccfab7091c6a29d7db7ff583bbacc67))

### Features

- Add file_uploads tool, fix live MCP bugs, enhance API coverage
  ([#114](https://github.com/n24q02m/better-notion-mcp/pull/114),
  [`d3b551a`](https://github.com/n24q02m/better-notion-mcp/commit/d3b551aa33775facf59eb538a2c24a45bddc541a))

- Add file_uploads tool, fix live MCP bugs, remove webhooks
  ([#114](https://github.com/n24q02m/better-notion-mcp/pull/114),
  [`d3b551a`](https://github.com/n24q02m/better-notion-mcp/commit/d3b551aa33775facf59eb538a2c24a45bddc541a))

- **file-uploads**: Add file_uploads composite tool (create, send, complete, retrieve, list)
  ([#114](https://github.com/n24q02m/better-notion-mcp/pull/114),
  [`d3b551a`](https://github.com/n24q02m/better-notion-mcp/commit/d3b551aa33775facf59eb538a2c24a45bddc541a))


## v2.6.3 (2026-02-18)

### Bug Fixes

- Fix workspace filter enum, remove dead code, dynamic version
  ([`da14ca9`](https://github.com/n24q02m/better-notion-mcp/commit/da14ca91737ebe23598caedfbe8aeceb78aaa080))


## v2.6.2 (2026-02-18)

### Bug Fixes

- Improve users and databases documentation
  ([`51984c2`](https://github.com/n24q02m/better-notion-mcp/commit/51984c2857356e8ceb49253045035f62ccfe5b72))

- Sanitize parent in pages.duplicate and fix docs
  ([`af9499a`](https://github.com/n24q02m/better-notion-mcp/commit/af9499ab1bb7991946a5ad6b3847210a8096e2ea))

### Documentation

- Add --name flag to Docker run example
  ([`fc03674`](https://github.com/n24q02m/better-notion-mcp/commit/fc0367490c768c9c185b57799024b89a0b598af5))

- Add MCP resources URIs to token optimization section
  ([`f9a90ff`](https://github.com/n24q02m/better-notion-mcp/commit/f9a90ff7882beaa4149eeb7ce14eb1d776250795))

- Restructure Quick Start with 4 config options
  ([`5c9a926`](https://github.com/n24q02m/better-notion-mcp/commit/5c9a926702675bf21b6f2029a78145c271ab9ad5))

- Update docker-compose with notion token env var
  ([`867726c`](https://github.com/n24q02m/better-notion-mcp/commit/867726ca12edf14aa979a95a694e32a8b5c1d5b3))


## v2.6.1 (2026-02-17)

### Bug Fixes

- Schema-aware property conversion and better error details
  ([`cf81f35`](https://github.com/n24q02m/better-notion-mcp/commit/cf81f35badf078b2db13be53f553cf689ade98d7))


## v2.6.0 (2026-02-17)


## v2.6.0-beta.1 (2026-02-17)

### Chores

- Add UV_LINK_MODE to mise.toml, update release docs to PSR
  ([`be96e97`](https://github.com/n24q02m/better-notion-mcp/commit/be96e974abfd3defcbdbda394a39a7d8aece329e))

### Features

- **tools**: Add MCP tool annotations to all 8 tools
  ([`8c6514d`](https://github.com/n24q02m/better-notion-mcp/commit/8c6514d38293756955103577aced471fa91e074b))


## v2.5.6 (2026-02-14)

### Bug Fixes

- **cd**: Add config_file for PSR + checkout for DockerHub description
  ([`b6dbc45`](https://github.com/n24q02m/better-notion-mcp/commit/b6dbc45446481adf5628998442b8c8b67f9ccbbf))


## v2.5.5 (2026-02-14)

### Bug Fixes

- **cd**: Remove build_command from PSR config (not available in PSR container)
  ([`450248a`](https://github.com/n24q02m/better-notion-mcp/commit/450248a1ec5e84987743572c69ed31cdcde9be69))


## v2.5.4 (2026-02-14)

### Chores

- Migrate from release-please to python-semantic-release v10
  ([`0d17367`](https://github.com/n24q02m/better-notion-mcp/commit/0d173672aa859ce4a0a065d7129a8e00c6e76593))


## v2.5.4-beta.1 (2026-02-14)

### Bug Fixes

- Remove unnecessary corepack from runtime, upgrade artifact actions v4 to v6/v7
  ([`b737476`](https://github.com/n24q02m/better-notion-mcp/commit/b737476f85d177a69b3fa430cd4558653d5fe921))

- **cd**: Make scripts executable and clean working tree before promote merge
  ([`99e0656`](https://github.com/n24q02m/better-notion-mcp/commit/99e065687dc63590b855f8380b4f6e38e7582d06))

- **ci**: Exclude release-please manifests from Biome formatter
  ([`9715039`](https://github.com/n24q02m/better-notion-mcp/commit/97150391ba5a6d3369a403d363dc0ab288bf770d))

### Chores

- Re-trigger release-please
  ([`93f796c`](https://github.com/n24q02m/better-notion-mcp/commit/93f796c3a6dac224d2d7ab2f57ba5bb252747a4f))

- Re-trigger release-please [skip ci]
  ([`3564506`](https://github.com/n24q02m/better-notion-mcp/commit/3564506fd37acfca0d2d4ca8c7f53ce486d8b4f1))

- Sync beta manifest from stable [skip ci]
  ([`dc355dc`](https://github.com/n24q02m/better-notion-mcp/commit/dc355dc613f802dde13238c3d068a037ce4f9ae7))

- **dev**: Release 2.5.4-beta ([#59](https://github.com/n24q02m/better-notion-mcp/pull/59),
  [`d7a5b72`](https://github.com/n24q02m/better-notion-mcp/commit/d7a5b729e2c3e353984f7fd099c5ddceba7dc758))

- **dev**: Release 2.5.4-beta.1 ([#60](https://github.com/n24q02m/better-notion-mcp/pull/60),
  [`51d3c95`](https://github.com/n24q02m/better-notion-mcp/commit/51d3c95b3a2a614e01eadebcdb7c28d2307892d3))

### Code Style

- Format release-please manifest files for Biome
  ([`516627c`](https://github.com/n24q02m/better-notion-mcp/commit/516627cb82f8a0e78ebdb93a37090ae22b718e88))


## v2.5.3 (2026-02-13)

### Bug Fixes

- **cd**: Auto-resolve merge conflicts in promote workflow
  ([`5f0f832`](https://github.com/n24q02m/better-notion-mcp/commit/5f0f83218c355f11943903b0e23d781761d37eff))

### Chores

- Add automated cleanup for stale release-please PRs
  ([`3c308a6`](https://github.com/n24q02m/better-notion-mcp/commit/3c308a6ae869d25f80058053148b3f2c4848bd5d))

- Sync beta manifest from stable [skip ci]
  ([`74be81e`](https://github.com/n24q02m/better-notion-mcp/commit/74be81e9100c0c21974c9e5e0888cf0f152d5448))

- **main**: Release 2.5.3 ([#57](https://github.com/n24q02m/better-notion-mcp/pull/57),
  [`43f0607`](https://github.com/n24q02m/better-notion-mcp/commit/43f0607b3de979ba72e1b0712c118f3cc294c788))

### Documentation

- Add CODEOWNERS
  ([`8cd87ee`](https://github.com/n24q02m/better-notion-mcp/commit/8cd87eec07589ee643e34a1561dca6270ae14368))


## v2.5.2 (2026-02-12)

### Bug Fixes

- **cd**: Add git config identity for sync-dev step
  ([`ca05438`](https://github.com/n24q02m/better-notion-mcp/commit/ca05438809130b182bc5e59182cd3056575de8c5))

### Chores

- Implement dual manifest strategy for release pipeline
  ([`e735474`](https://github.com/n24q02m/better-notion-mcp/commit/e7354745350bcddeef301d37ac6d5a90392253b3))

- **main**: Release 2.5.2 ([#51](https://github.com/n24q02m/better-notion-mcp/pull/51),
  [`1f323dd`](https://github.com/n24q02m/better-notion-mcp/commit/1f323dd2eee6a240da2eeb841e17097d26296eaa))


## v2.5.1 (2026-02-10)

### Bug Fixes

- Format manifest file for biome
  ([`d230282`](https://github.com/n24q02m/better-notion-mcp/commit/d230282eea9b9b5f14163793e2b531953b42b909))

### Chores

- **main**: Release 2.5.1 ([#47](https://github.com/n24q02m/better-notion-mcp/pull/47),
  [`1ca1402`](https://github.com/n24q02m/better-notion-mcp/commit/1ca1402d588844202801955d3ab01c320436a12b))


## v2.5.0 (2026-02-09)

### Bug Fixes

- **release**: Add prerelease false to stable config
  ([#44](https://github.com/n24q02m/better-notion-mcp/pull/44),
  [`a4b7d96`](https://github.com/n24q02m/better-notion-mcp/commit/a4b7d96e5fc74bb38dd192046b34427ba19ff7e1))

- **release**: Reset manifest to stable version
  ([`60f67a1`](https://github.com/n24q02m/better-notion-mcp/commit/60f67a100aaa16e9560c7d374aa57096a844a77c))

### Chores

- **dev**: Release 2.4.1-beta ([#44](https://github.com/n24q02m/better-notion-mcp/pull/44),
  [`a4b7d96`](https://github.com/n24q02m/better-notion-mcp/commit/a4b7d96e5fc74bb38dd192046b34427ba19ff7e1))

- **main**: Release 2.5.0 ([#46](https://github.com/n24q02m/better-notion-mcp/pull/46),
  [`97ad59d`](https://github.com/n24q02m/better-notion-mcp/commit/97ad59d8da79abbeb50f141c57ed22252055112a))

### Features

- Promote dev to main (v2.4.1-beta) ([#44](https://github.com/n24q02m/better-notion-mcp/pull/44),
  [`a4b7d96`](https://github.com/n24q02m/better-notion-mcp/commit/a4b7d96e5fc74bb38dd192046b34427ba19ff7e1))


## v2.4.0 (2026-02-09)

### Bug Fixes

- Configure Python 3.13 via mise and .python-version files
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- Configure Python 3.13 via mise and .python-version files
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- Remove duplicate import processBatches from batch.ts
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- Remove duplicate import processBatches from batch.ts
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- Use GITHUB_TOKEN instead of GH_PAT for GitHub Container Registry authentication and CI/CD status
  checks. ([#31](https://github.com/n24q02m/better-notion-mcp/pull/31),
  [`76a845e`](https://github.com/n24q02m/better-notion-mcp/commit/76a845eba4b39616fbf882c1f243c5cf451b09e7))

- **cd**: Use GH_PAT for semantic-release to bypass branch protection
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **cd**: Use GH_PAT for semantic-release to bypass branch protection
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **cd**: Use hardcoded username for docker outputs to fix syntax error
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **cd**: Use hardcoded username for docker outputs to fix syntax error
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **ci**: Remove unsupported dependency-review action
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **ci**: Remove unsupported dependency-review action
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **security**: Sanitize error details to prevent information leakage
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **security**: Sanitize error details to prevent information leakage
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

### Chores

- Cleanup dead code and test artifacts ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- Cleanup dead code and test artifacts ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- Fix manifest and version to last stable (2.3.12)
  ([`45277a7`](https://github.com/n24q02m/better-notion-mcp/commit/45277a7115b5a7b12932f6d1d4b95b8f6e0e7d9b))

- Promote dev to main (v2.3.7-beta.9) ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- Trigger CD after ruleset bypass ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- Trigger CD after ruleset bypass ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- Trigger CD workflow ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- Trigger CD workflow ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **deps**: Bump @modelcontextprotocol/sdk
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **deps**: Bump @modelcontextprotocol/sdk
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **deps**: Bump lodash in the npm_and_yarn group across 1 directory
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **deps**: Bump lodash in the npm_and_yarn group across 1 directory
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **deps**: Bump lodash-es in the npm_and_yarn group across 1 directory
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **deps**: Bump lodash-es in the npm_and_yarn group across 1 directory
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **deps**: Bump qs in the npm_and_yarn group across 1 directory
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **deps**: Bump qs in the npm_and_yarn group across 1 directory
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **main**: Release 2.4.0 ([#38](https://github.com/n24q02m/better-notion-mcp/pull/38),
  [`9756230`](https://github.com/n24q02m/better-notion-mcp/commit/97562306a93da75c3e6bcdd7b8a16d0e5ce48550))

- **release**: 2.3.10 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.10 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.3.11 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.11 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.3.12 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.12 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.3.13-beta.1 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.13-beta.1 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.3.13-beta.2 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.13-beta.2 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.3.7 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.7 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.3.7-beta.8 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.7-beta.8 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.3.8 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.8 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.3.9 [skip ci] ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **release**: 2.3.9 [skip ci] ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **release**: 2.4.0-beta.1 [skip ci] ([#31](https://github.com/n24q02m/better-notion-mcp/pull/31),
  [`76a845e`](https://github.com/n24q02m/better-notion-mcp/commit/76a845eba4b39616fbf882c1f243c5cf451b09e7))

- **release**: 2.4.0-beta.2 [skip ci] ([#31](https://github.com/n24q02m/better-notion-mcp/pull/31),
  [`76a845e`](https://github.com/n24q02m/better-notion-mcp/commit/76a845eba4b39616fbf882c1f243c5cf451b09e7))

### Continuous Integration

- **cd**: Add sync step before creating promote PR
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **cd**: Add sync step before creating promote PR
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- **cd**: Improve release workflow ([#31](https://github.com/n24q02m/better-notion-mcp/pull/31),
  [`76a845e`](https://github.com/n24q02m/better-notion-mcp/commit/76a845eba4b39616fbf882c1f243c5cf451b09e7))

- **cd**: Trigger release on PR merge ([#31](https://github.com/n24q02m/better-notion-mcp/pull/31),
  [`76a845e`](https://github.com/n24q02m/better-notion-mcp/commit/76a845eba4b39616fbf882c1f243c5cf451b09e7))

- **cd**: Use feat: prefix for promote PR to trigger release
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

### Features

- Promote dev to main (v2.3.14-beta.1) ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- Promote dev to main (v2.4.0-beta.2) ([#31](https://github.com/n24q02m/better-notion-mcp/pull/31),
  [`76a845e`](https://github.com/n24q02m/better-notion-mcp/commit/76a845eba4b39616fbf882c1f243c5cf451b09e7))

- Promote dev to main - migrate to release-please
  ([`9bd8b39`](https://github.com/n24q02m/better-notion-mcp/commit/9bd8b39c462714db39b51fa1bf72923a3d697924))

- **perf**: Use processBatches for concurrent block deletion in updatePage
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **perf**: Use processBatches for concurrent block deletion in updatePage
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

### Performance Improvements

- Optimize page archival and fix CI ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- Optimize page archival and fix CI ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

- Optimize page archival with concurrent updates
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- Optimize page archival with concurrent updates
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))

### Refactoring

- **cd**: Promote-to-stable creates PR instead of direct merge
  ([#23](https://github.com/n24q02m/better-notion-mcp/pull/23),
  [`9292290`](https://github.com/n24q02m/better-notion-mcp/commit/9292290726fd47e0ec0a6180edda41aecb80de4b))

- **cd**: Promote-to-stable creates PR instead of direct merge
  ([#17](https://github.com/n24q02m/better-notion-mcp/pull/17),
  [`c5abe6a`](https://github.com/n24q02m/better-notion-mcp/commit/c5abe6a420171501ec232c44589dd4aac1816456))


## v2.3.12 (2026-01-12)

### Chores

- **release**: 2.3.12 [skip ci]
  ([`feb49f2`](https://github.com/n24q02m/better-notion-mcp/commit/feb49f2b1d452603b28c8f7a01feffb817492263))


## v2.3.7-beta.7 (2026-01-12)

### Bug Fixes

- Update Node.js version to 24 in various files and documentation
  ([`d1770f7`](https://github.com/n24q02m/better-notion-mcp/commit/d1770f753a908afdcb97bfe0c5305941ee29ca3a))

### Chores

- **release**: 2.3.7-beta.7 [skip ci]
  ([`c29678c`](https://github.com/n24q02m/better-notion-mcp/commit/c29678cca9000db80db335f63a8c75126de3d1a8))

### Documentation

- Update README to reflect 8 composite tools, simplify comparison, and enhance clarity.
  ([`74f47d4`](https://github.com/n24q02m/better-notion-mcp/commit/74f47d463d555c34a67736ca7479d988dc508062))


## v2.3.7-beta.6 (2026-01-05)

### Chores

- **release**: 2.3.7-beta.6 [skip ci]
  ([`4eefd55`](https://github.com/n24q02m/better-notion-mcp/commit/4eefd5511ca2709e4fe1fc3a4d2d7b786ca52f40))


## v2.3.11 (2026-01-05)

### Bug Fixes

- Add cd.yml to auto-resolve files for promote
  ([`d7ae193`](https://github.com/n24q02m/better-notion-mcp/commit/d7ae1938020533dd22f127198a92c11260088a22))

### Chores

- **release**: 2.3.11 [skip ci]
  ([`82e2c9d`](https://github.com/n24q02m/better-notion-mcp/commit/82e2c9dc954e44c08dd5b22da5ebd1c19aa974bf))


## v2.3.7-beta.5 (2026-01-05)

### Bug Fixes

- Verify ci/cd workflow changes
  ([`6802e00`](https://github.com/n24q02m/better-notion-mcp/commit/6802e00c56b9da132f90ccc23cb6739e69b2617b))

### Chores

- **release**: 2.3.7-beta.5 [skip ci]
  ([`43da2e0`](https://github.com/n24q02m/better-notion-mcp/commit/43da2e081e14328b2fb55c32ca166eb85c0a8840))

### Continuous Integration

- Unify CI/CD workflows - clean up and simplify- cd.yml: Use outputs version, simplify manifest
  creation, remove duplicates
  ([`0fd1486`](https://github.com/n24q02m/better-notion-mcp/commit/0fd1486ac677087dc9cccf0076781d08910ce453))


## v2.3.10 (2026-01-04)

### Bug Fixes

- **cd**: Use hardcoded username for docker outputs to fix syntax error
  ([`5d96da5`](https://github.com/n24q02m/better-notion-mcp/commit/5d96da5b2abf509784a4977304a137531208d8c9))

### Chores

- **release**: 2.3.10 [skip ci]
  ([`2fc0393`](https://github.com/n24q02m/better-notion-mcp/commit/2fc039396e8c533ad91e7a3cde9bbb940d95cb65))


## v2.3.9 (2026-01-04)

### Chores

- **release**: 2.3.9 [skip ci]
  ([`3a6d938`](https://github.com/n24q02m/better-notion-mcp/commit/3a6d93873c42c3bceda8f6a7f85088a408b24e8f))

### Continuous Integration

- Trigger CI rebuild
  ([`6ab7461`](https://github.com/n24q02m/better-notion-mcp/commit/6ab74611596a6fe770593a5cd4e1837c5bd88ac0))


## v2.3.7-beta.4 (2026-01-04)

### Bug Fixes

- **cd**: Use semantic-release/exec for biome format before git commit
  ([`e771dff`](https://github.com/n24q02m/better-notion-mcp/commit/e771dfffc23214b381f4fe471a11aa1058b7206e))

### Chores

- **release**: 2.3.7-beta.4 [skip ci]
  ([`d7d2e03`](https://github.com/n24q02m/better-notion-mcp/commit/d7d2e03a4f18e0dca05140ff738293900fe83919))


## v2.3.7-beta.3 (2026-01-04)

### Bug Fixes

- **ci**: Fix package.json formatting on dev
  ([`417bbe2`](https://github.com/n24q02m/better-notion-mcp/commit/417bbe2e75ecfae043f5ca1bc458349973cc10af))

### Chores

- **release**: 2.3.7-beta.3 [skip ci]
  ([`f8eec23`](https://github.com/n24q02m/better-notion-mcp/commit/f8eec23add1f7f0ed580a0da8a0ac768d5d9341b))


## v2.3.7-beta.2 (2026-01-04)

### Chores

- **release**: 2.3.7-beta.2 [skip ci]
  ([`d132c12`](https://github.com/n24q02m/better-notion-mcp/commit/d132c125b77f40642c5d1e02b2ff2f61833793a7))


## v2.3.8 (2026-01-04)

### Bug Fixes

- **cd**: Add auto-format step after semantic-release to prevent CI failures
  ([`288dfaf`](https://github.com/n24q02m/better-notion-mcp/commit/288dfaf1387b879f08130d5d7e625b51ea04fe59))

### Chores

- **release**: 2.3.8 [skip ci]
  ([`e4f276c`](https://github.com/n24q02m/better-notion-mcp/commit/e4f276c115815ac8fcfe80d239154a263357349a))


## v2.3.7-beta.1 (2026-01-04)

### Chores

- **release**: 2.3.7-beta.1 [skip ci]
  ([`9d58aee`](https://github.com/n24q02m/better-notion-mcp/commit/9d58aee9d6bd231eae5c9b9a35717fa602b528aa))


## v2.3.7 (2026-01-04)

### Bug Fixes

- **ci**: Fix package.json formatting on main
  ([`b6f9833`](https://github.com/n24q02m/better-notion-mcp/commit/b6f9833c1ea7206b898739ca874bcc3a1da6a3ad))

### Chores

- **release**: 2.3.7 [skip ci]
  ([`4e275f4`](https://github.com/n24q02m/better-notion-mcp/commit/4e275f4497d7c287c26108bf062d1f2fa8c45587))


## v2.3.6 (2026-01-04)

### Chores

- **release**: 2.3.6 [skip ci]
  ([`1323448`](https://github.com/n24q02m/better-notion-mcp/commit/13234489d87ca29bcdd1e13f983df7ffcb5f102f))


## v2.3.6-beta.1 (2026-01-04)

### Chores

- **release**: 2.3.6-beta.1 [skip ci]
  ([`c9adeec`](https://github.com/n24q02m/better-notion-mcp/commit/c9adeec93e191b30218b0b6c2491fa6c18c92ff0))


## v2.3.5 (2026-01-04)

### Bug Fixes

- **cd**: Prevent repo.git pollution in digests dir
  ([`694f03c`](https://github.com/n24q02m/better-notion-mcp/commit/694f03ca1593549c3fe0f42f4f5846de4875d65f))

### Chores

- **cd**: Cleanup debug logging
  ([`7bdb70a`](https://github.com/n24q02m/better-notion-mcp/commit/7bdb70a89600bc6c3fdd1e2ba91bee24bbc4b6ed))

- **release**: 2.3.5 [skip ci]
  ([`8ee4840`](https://github.com/n24q02m/better-notion-mcp/commit/8ee4840194faf141a0871862f4c9b68973b15b66))


## v2.3.4 (2026-01-04)

### Chores

- **release**: 2.3.4 [skip ci]
  ([`1cf5c48`](https://github.com/n24q02m/better-notion-mcp/commit/1cf5c48147738e30dff55de29a5cd07020992dcf))


## v2.3.3 (2026-01-04)

### Bug Fixes

- **cd**: Use dynamic docker username and validate digests
  ([`63e3d68`](https://github.com/n24q02m/better-notion-mcp/commit/63e3d68e6a2bd7f76eb7ee3743ae2b35e2ab6d2b))

### Chores

- **release**: 2.3.3 [skip ci]
  ([`6281871`](https://github.com/n24q02m/better-notion-mcp/commit/6281871ba42e50da03c844f0d3941a3cc4c6c091))


## v2.3.2 (2026-01-04)

### Bug Fixes

- **cd**: Add validation and debug for docker manifest creation
  ([`a82da71`](https://github.com/n24q02m/better-notion-mcp/commit/a82da718a54f323b3e24091232f7190cd8601227))

- **cd**: Enable debug for docker manifest creation
  ([`672cba6`](https://github.com/n24q02m/better-notion-mcp/commit/672cba6eeca33f15a0f7cf04e43463d7641212a2))

### Chores

- **release**: 2.3.2 [skip ci]
  ([`eda0631`](https://github.com/n24q02m/better-notion-mcp/commit/eda063134097a4bba0a3af350324d0e8219f8c68))


## v2.3.1 (2026-01-04)

### Chores

- **release**: 2.3.1 [skip ci]
  ([`9f64991`](https://github.com/n24q02m/better-notion-mcp/commit/9f64991d6cd63cf783a00a0f350cc8831c4a8505))


## v2.3.1-beta.1 (2026-01-04)

### Bug Fixes

- **cd**: Refactor docker manifest creation
  ([`02e3ba5`](https://github.com/n24q02m/better-notion-mcp/commit/02e3ba5b9e862961adb5a3688c451dac255a8c70))

### Chores

- **release**: 2.3.1-beta.1 [skip ci]
  ([`3c3f007`](https://github.com/n24q02m/better-notion-mcp/commit/3c3f0075f17917fc25d01f85c1f51428b3e8e7ac))

### Code Style

- Fix biome format issues on main
  ([`5753087`](https://github.com/n24q02m/better-notion-mcp/commit/5753087c0bf59c2b89f1ac11b9b04723aa163d8b))


## v2.3.0 (2026-01-04)

### Bug Fixes

- **cd**: Add auto-delete conflicting tags step
  ([`3f7f7f9`](https://github.com/n24q02m/better-notion-mcp/commit/3f7f7f9e443856b66d1536ee59188926a8e7cb88))

- **cd**: Add GH_PAT to release checkout for tag deletion
  ([`1b53fa0`](https://github.com/n24q02m/better-notion-mcp/commit/1b53fa0adbf624486a3a2cc50e4f110fce828b8a))

- **release**: Re-enable npm publish for full workflow verification
  ([`65044ea`](https://github.com/n24q02m/better-notion-mcp/commit/65044ea2fc0db4341eae88521816cf9355f82a91))

### Chores

- **release**: 2.1.0-beta.6 [skip ci]
  ([`b033ac0`](https://github.com/n24q02m/better-notion-mcp/commit/b033ac0df4963f08db4313a3b88e936b58592387))

- **release**: 2.3.0 [skip ci]
  ([`5fd95da`](https://github.com/n24q02m/better-notion-mcp/commit/5fd95da9d5f7ee1f9d3abb1b12ee8488b300b764))

- **release**: Re-enable npm publish after v2.2.0
  ([`4c9b182`](https://github.com/n24q02m/better-notion-mcp/commit/4c9b1826a4fa0a1ee69bc6dd7d6d66d0f771efa7))

### Code Style

- Fix biome format issues
  ([`c1d9873`](https://github.com/n24q02m/better-notion-mcp/commit/c1d9873914a14455febc1184e0715f8315aba977))

### Features

- **release**: Disable npm publish to create new stable version
  ([`375c244`](https://github.com/n24q02m/better-notion-mcp/commit/375c244f716600d7b9ad33bd056bc3f19dbea549))


## v2.2.0 (2026-01-04)

### Bug Fixes

- **release**: Temporarily disable npm publish to resolve version conflict
  ([`497b3e0`](https://github.com/n24q02m/better-notion-mcp/commit/497b3e0ec0264b5b52a91e63db1b64edaf362db1))

- **release**: Trigger v2.1.0-beta.8 release
  ([`17a6b7e`](https://github.com/n24q02m/better-notion-mcp/commit/17a6b7edee754e5ba86c2487bf301aca9091981a))

### Chores

- **release**: 2.1.0-beta.6 [skip ci]
  ([`cf61da7`](https://github.com/n24q02m/better-notion-mcp/commit/cf61da7677d18340708232d9ac90e752ee26819b))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`1e76b74`](https://github.com/n24q02m/better-notion-mcp/commit/1e76b74d1b3dea498355d3c452d1ef157620b8f2))

- **release**: 2.2.0 [skip ci]
  ([`171141b`](https://github.com/n24q02m/better-notion-mcp/commit/171141bd0cbcd886ef70b43df834d3fa6ef372a2))


## v2.1.0-beta.7 (2026-01-04)

### Bug Fixes

- Add --clear flag to uv venv command in mise setup
  ([`0d0e09a`](https://github.com/n24q02m/better-notion-mcp/commit/0d0e09ac19acfc4caffca7b01f5fafd06a1b274a))

- Remove development instruction echoes from mise post-install script.
  ([`b111228`](https://github.com/n24q02m/better-notion-mcp/commit/b11122871feb0597457de21938788f0624400a89))

- **cd**: Auto-resolve merge conflicts in semantic-release managed files
  ([`8a7ed7c`](https://github.com/n24q02m/better-notion-mcp/commit/8a7ed7cc5b6deb31033eedd8475ef723bcff88ff))

- **cd**: Improve merge conflict auto-resolution in promote workflow
  ([`8e74def`](https://github.com/n24q02m/better-notion-mcp/commit/8e74defda1966c91526c7b7d9433c9ec2f389569))

- **cd**: Resolve release workflow failure and retry
  ([`be9f5cb`](https://github.com/n24q02m/better-notion-mcp/commit/be9f5cb523a1d167976e5f0a79dba172aac14312))

- **cd**: Use GH_PAT to enable workflow trigger on main
  ([`9b93f52`](https://github.com/n24q02m/better-notion-mcp/commit/9b93f524a314eaddc70e396fa4d7e25597902f15))

- **npm**: Republish after workflow failure
  ([`451a9c0`](https://github.com/n24q02m/better-notion-mcp/commit/451a9c0e5c8710b9dfede93844991bf426f91da9))

- **setup**: Don't fail when venv is locked but unusable
  ([`4b83502`](https://github.com/n24q02m/better-notion-mcp/commit/4b835022a52ac312408e16f9682d6cae0ffb3d35))

### Chores

- Bump version to 2.1.0-beta.7
  ([`49fde21`](https://github.com/n24q02m/better-notion-mcp/commit/49fde213efb41776fe77c290f66fb79c755bbd04))

- Manually bump version to 2.1.0-beta.7
  ([`d36a83e`](https://github.com/n24q02m/better-notion-mcp/commit/d36a83e11d08786fe5c28a7083edf43f5eb24da2))

- Standardize mise setup and pre-commit config
  ([`1cdc108`](https://github.com/n24q02m/better-notion-mcp/commit/1cdc108538b7892c9c0c8e6e18be6100c36b9172))

- Standardize mise setup and pre-commit config
  ([`d0b6c0f`](https://github.com/n24q02m/better-notion-mcp/commit/d0b6c0ffcb1f00649f5119756c48f4a5d74b7656))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`c5e7fb3`](https://github.com/n24q02m/better-notion-mcp/commit/c5e7fb3679b2e1dac22ee5daa78d60a5df1d8a53))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`1edfa93`](https://github.com/n24q02m/better-notion-mcp/commit/1edfa9303e4757016a6bbc17b82d24d4c23de8cd))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`cc923c1`](https://github.com/n24q02m/better-notion-mcp/commit/cc923c144675a2fd7041c238019a4a5392838166))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`c8795e6`](https://github.com/n24q02m/better-notion-mcp/commit/c8795e683f0e91d42da61f7ee176158cdb40615c))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`9af55f5`](https://github.com/n24q02m/better-notion-mcp/commit/9af55f502aee3f38bf6adcf5da580cb035f5e488))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`d7402f1`](https://github.com/n24q02m/better-notion-mcp/commit/d7402f1d48e4625ddaa5187d9a226b6b0ea71c9b))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`8143188`](https://github.com/n24q02m/better-notion-mcp/commit/8143188005b4efe78f7ff8950c889ee1107007f3))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`46bc987`](https://github.com/n24q02m/better-notion-mcp/commit/46bc987ed129387b54b5910534ce560362bffe24))

- **release**: 2.1.0-beta.6 [skip ci]
  ([`18aba81`](https://github.com/n24q02m/better-notion-mcp/commit/18aba81c99663096436f216d44d2faacada67faa))

### Code Style

- Fix package.json keywords format for biome
  ([`672eb69`](https://github.com/n24q02m/better-notion-mcp/commit/672eb69da856c574f2c35f526a54f2748b98c275))

### Features

- **cd**: Add shared scripts for promote workflow
  ([`a36b4c9`](https://github.com/n24q02m/better-notion-mcp/commit/a36b4c9feac8f7a2450bae4d5151860eb7b122c1))


## v2.1.0-beta.5 (2025-12-31)

### Bug Fixes

- Migrate pre-commit setup to use uv for environment and package management.
  ([`c98ebe0`](https://github.com/n24q02m/better-notion-mcp/commit/c98ebe09732ed2742d0e4d819c6efb8f6e71b985))

### Chores

- **release**: 2.1.0-beta.5 [skip ci]
  ([`8b92e34`](https://github.com/n24q02m/better-notion-mcp/commit/8b92e349a75d4abd23671b9cf7dd721b52a10969))


## v2.1.0-beta.4 (2025-12-31)

### Bug Fixes

- Format keywords and files arrays in package.json
  ([`fc221a6`](https://github.com/n24q02m/better-notion-mcp/commit/fc221a629244ad11925cf0c49ab01f9c2cbe7bfd))

### Chores

- **release**: 2.1.0-beta.4 [skip ci]
  ([`0135f42`](https://github.com/n24q02m/better-notion-mcp/commit/0135f42d9acd6aa5ab66fbb18d8b3a5956f8bda3))


## v2.1.0-beta.3 (2025-12-31)

### Chores

- **release**: 2.1.0-beta.3 [skip ci]
  ([`5b54900`](https://github.com/n24q02m/better-notion-mcp/commit/5b549003d69d5449807f01bbe20a5877b976c07b))

### Performance Improvements

- Use native ARM64 runner for multi-arch Docker build
  ([`49b440a`](https://github.com/n24q02m/better-notion-mcp/commit/49b440a8a76f88206e9c59aab12b83fb514e9a38))


## v2.1.0 (2025-12-31)

### Chores

- **release**: 2.1.0 [skip ci]
  ([`c44ab92`](https://github.com/n24q02m/better-notion-mcp/commit/c44ab92360bcdf708de253bcefdc8f2d1c8e03c7))


## v2.1.0-beta.2 (2025-12-30)

### Chores

- **release**: 2.1.0-beta.2 [skip ci]
  ([`b9153c5`](https://github.com/n24q02m/better-notion-mcp/commit/b9153c5cde926b7176878a0ab49ef064a7c2a428))


## v2.1.0-beta.1 (2025-12-30)

### Bug Fixes

- Remove redundant line in setup tasks and clean up keywords formatting
  ([`f176b09`](https://github.com/n24q02m/better-notion-mcp/commit/f176b09432b46c4f7a3262ffcb2cfeb3ca6f916c))

### Chores

- **release**: 2.1.0-beta.1 [skip ci]
  ([`f2331d7`](https://github.com/n24q02m/better-notion-mcp/commit/f2331d7885dd7082375368f0c7d54ce8d216b159))

### Features

- Add CI and CD workflows for automated deployment and testing
  ([`57ed3ac`](https://github.com/n24q02m/better-notion-mcp/commit/57ed3ac8a4dea8482249aee7c5b56fb232f09b02))


## v2.0.1 (2025-12-29)

### Bug Fixes

- Correct DOCS_DIR path for bundled CLI
  ([`17e2800`](https://github.com/n24q02m/better-notion-mcp/commit/17e2800e8533273a20bef87d687d3ada2c3f49a9))

### Chores

- **release**: 2.0.1 [skip ci]
  ([`75869d4`](https://github.com/n24q02m/better-notion-mcp/commit/75869d41636bb62b997005e4e37bfe0b3e56d67c))


## v2.0.0 (2025-12-26)

### Chores

- **release**: 2.0.0 [skip ci]
  ([`ee2b420`](https://github.com/n24q02m/better-notion-mcp/commit/ee2b420d826451dfcb0d3da0630c05c11db2b9af))

### Features

- Implement tiered descriptions for token optimization
  ([`ae16cc9`](https://github.com/n24q02m/better-notion-mcp/commit/ae16cc9107c086af1a15a88e87ed181670e5629d))

### Breaking Changes

- Tool descriptions are now compressed by default. Use 'help' tool or MCP resources to access full
  documentation.


## v1.1.0 (2025-12-26)

### Chores

- **release**: 1.1.0 [skip ci]
  ([`558d8cc`](https://github.com/n24q02m/better-notion-mcp/commit/558d8cc7318cb74a4a25edd1ac0da792d99b7502))

### Features

- Streamline project setup by introducing a `mise run setup` task and updating documentation
  ([`4aa3166`](https://github.com/n24q02m/better-notion-mcp/commit/4aa31660bd2896330c86a6b81e8d21e38c65dc8b))


## v1.0.19 (2025-12-11)

### Bug Fixes

- Update installation instructions in README and streamline package.json formatting
  ([`ba8575a`](https://github.com/n24q02m/better-notion-mcp/commit/ba8575a38806690d761b7c1f7090441b285c84f0))

### Chores

- **release**: 1.0.19 [skip ci]
  ([`7090e60`](https://github.com/n24q02m/better-notion-mcp/commit/7090e60708ac3674aa9a51d60d4ad58fabbed33e))


## v1.0.18 (2025-12-10)

### Bug Fixes

- Streamline pre-commit hook entries and update README instructions
  ([`2c57733`](https://github.com/n24q02m/better-notion-mcp/commit/2c577339ab849a5c8e8f5db73edd29a6672cc9e7))

### Chores

- **release**: 1.0.18 [skip ci]
  ([`f41d386`](https://github.com/n24q02m/better-notion-mcp/commit/f41d3867526b1dc0ef644a27c713d3e076ec2fe9))


## v1.0.17 (2025-12-10)

### Bug Fixes

- Update Mise configuration and installation instructions in README
  ([`7af1d2b`](https://github.com/n24q02m/better-notion-mcp/commit/7af1d2b7443af7549dcac914c173026f28080d7e))

### Chores

- **release**: 1.0.17 [skip ci]
  ([`4ab5793`](https://github.com/n24q02m/better-notion-mcp/commit/4ab5793d84ea06880c9d4a5b7be946b5e526c91c))

### Continuous Integration

- Add platforms configuration for QEMU setup in release workflow
  ([`2f43b27`](https://github.com/n24q02m/better-notion-mcp/commit/2f43b27c003ea9ca7e1383ededab0a4d98ba65e6))


## v1.0.16 (2025-12-10)

### Bug Fixes

- Add publishConfig for public access
  ([`b704cda`](https://github.com/n24q02m/better-notion-mcp/commit/b704cda20f6b441c56d2bf9dc2162bf56fabef4e))

- Add release script
  ([`3a1da3b`](https://github.com/n24q02m/better-notion-mcp/commit/3a1da3bbe266ba0493a84504bf5cc816ae4deabc))

- Remove redundant npm auth setup step in release workflow
  ([`42752bd`](https://github.com/n24q02m/better-notion-mcp/commit/42752bddef6b15ba9db38f76c3aa76d0578cfb62))

- Streamline JSON formatting in biome.json and package.json for consistency
  ([`3ea9266`](https://github.com/n24q02m/better-notion-mcp/commit/3ea926644c7b3bccb8abe60a4c1b255ce0c96eb3))

### Chores

- Add pre-commit installation step to README and ensure pre-commit tool version is set in .mise.toml
  ([`22f1fea`](https://github.com/n24q02m/better-notion-mcp/commit/22f1fea223c33cd6d183a6876251024bd4731674))

- **release**: 1.0.16 [skip ci]
  ([`aa39f05`](https://github.com/n24q02m/better-notion-mcp/commit/aa39f05bb0a154758ea8342b6125bb699cc8d916))

### Continuous Integration

- Active action
  ([`aaed0ab`](https://github.com/n24q02m/better-notion-mcp/commit/aaed0ab68ce56cb620c70449d57e72ed1f926ca7))

- Add npm authentication step and update release configuration
  ([`eaf64e8`](https://github.com/n24q02m/better-notion-mcp/commit/eaf64e8baf137d8d60475131ac21a0a69fdf44bf))

- Allow auto merge pr
  ([`f1c119a`](https://github.com/n24q02m/better-notion-mcp/commit/f1c119acd2879d0f87528838fe5dde64cf3c30bf))

- Migrate from semantic-release to release-please and add npm and Docker publishing workflows.
  ([`08007d7`](https://github.com/n24q02m/better-notion-mcp/commit/08007d7d63e41542488074ced73468affa10aa3e))

### Documentation

- Remove reference to test files in project structure
  ([`1fcfa93`](https://github.com/n24q02m/better-notion-mcp/commit/1fcfa931902759ccb01a6573946a2e15712d25d8))

### Refactoring

- Change please release to sematic release
  ([`2035b9d`](https://github.com/n24q02m/better-notion-mcp/commit/2035b9de114e0d8bbb7412feb624ca50755e88f6))

- Update imports to use 'type' for type-only imports and improve code consistency
  ([`a77443a`](https://github.com/n24q02m/better-notion-mcp/commit/a77443ac7735d3e6870f0c052aac887dda5bd5e5))


## v1.0.15 (2025-12-09)

### Bug Fixes

- Update pnpm-lock.yaml to sync with package.json
  ([`e536ce4`](https://github.com/n24q02m/better-notion-mcp/commit/e536ce454730c22ea1412114ccc0f559b3213066))

### Chores

- Remove commitlint configuration and replace with pre-commit hooks setup
  ([`919b8ae`](https://github.com/n24q02m/better-notion-mcp/commit/919b8ae622c3730114e0d0c0e99d1c3554082a3e))

- Remove mise and changeset tooling for simplified development setup.
  ([`ed1b021`](https://github.com/n24q02m/better-notion-mcp/commit/ed1b021f7d0a3d64139feaa40b914d02151cd07e))

- **release**: 1.0.15 [skip ci]
  ([`e7aafc1`](https://github.com/n24q02m/better-notion-mcp/commit/e7aafc15c7bd60f442be9bb362d63f52bbe7ce56))


## v1.0.14 (2025-12-06)

### Bug Fixes

- Remove unused folder path from workspace configuration
  ([`9a1a6c9`](https://github.com/n24q02m/better-notion-mcp/commit/9a1a6c910d3f6658614b93e93d2b5171d29510b9))

### Chores

- Update README to remove unsupported types note
  ([`93caf04`](https://github.com/n24q02m/better-notion-mcp/commit/93caf04247fc1c978b8c826d0a28e9e042d154c1))

- **release**: 1.0.14 [skip ci]
  ([`4599aef`](https://github.com/n24q02m/better-notion-mcp/commit/4599aef73e7913e448dbd47fe0d2ae533335970b))


## v1.0.13 (2025-12-06)

### Bug Fixes

- Update limitations in README and make query optional in workspace function
  ([`a552ead`](https://github.com/n24q02m/better-notion-mcp/commit/a552ead28c8efd9c94afc0cb2377d0008cc778e2))

### Chores

- **release**: 1.0.13 [skip ci]
  ([`db66e97`](https://github.com/n24q02m/better-notion-mcp/commit/db66e972b9d8a6ae345043dff008fb8833f8982c))


## v1.0.12 (2025-12-06)

### Bug Fixes

- Rename 'notion' to 'better-notion' in README
  ([`c952370`](https://github.com/n24q02m/better-notion-mcp/commit/c9523704b6120d5270d2db3c066adc49edfe2907))

### Chores

- **release**: 1.0.12 [skip ci]
  ([`932866f`](https://github.com/n24q02m/better-notion-mcp/commit/932866fd90642216951c964597765fde9dc5dc10))


## v1.0.11 (2025-12-06)

### Bug Fixes

- Use GITHUB_TOKEN for GHCR authentication
  ([`e67ae17`](https://github.com/n24q02m/better-notion-mcp/commit/e67ae1708e74db1a12b8b48a32cccc1289a0ceff))

### Chores

- **release**: 1.0.11 [skip ci]
  ([`d4efbeb`](https://github.com/n24q02m/better-notion-mcp/commit/d4efbeb764982fd5f2d200e72fd3c1d38b8b172c))


## v1.0.10 (2025-12-06)

### Chores

- **release**: 1.0.10 [skip ci]
  ([`3fd8ef0`](https://github.com/n24q02m/better-notion-mcp/commit/3fd8ef000c5c2c7a62c1e27c02de56d1daa38a6d))


## v1.0.0 (2025-12-06)

### Bug Fixes

- Trigger release 1.0.10
  ([`820f0a9`](https://github.com/n24q02m/better-notion-mcp/commit/820f0a90e5883255383c499f89f655742eb40af2))

### Chores

- **release**: 1.0.0 [skip ci]
  ([`d292830`](https://github.com/n24q02m/better-notion-mcp/commit/d292830ae990215f8e09fda0b6d3837cc8ec54fe))


## v1.0.9 (2025-12-06)

- Initial Release
