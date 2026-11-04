# Asset and third-party licences

Last reviewed: 2026-11-03.

## 1. OpenLearn V2 source code
`src/`, `tools/`, `index.html`, `public/ar/index.html`, `docs/`, build configuration: **MIT**, see `LICENSE`. Copyright (c) 2026 Parminder S. Basran, VAIDER Lab, Cornell University.

## 2. Original 3-D models (author-created; MIT)
* Files: `public/assets/ct/*.glb`, `public/assets/linac/*.glb` (optimised with `tools/optimize.mjs`: weld, simplify, meshopt compression), and the `public/ar/*.usdz` / `*.jpg` files generated from them.
* Origin: the CT and linac models first published in the original OpenLearn repository, including the kV imaging arms and MV/linac internals reused in V2.
* Authorship and licence: created by Parminder S. Basran (VAIDER Lab, Cornell University), who confirmed authorship on 2026-11-03 and releases them under the **MIT** licence, the same as the source code. See `LICENSE`. Copyright (c) 2026 Parminder S. Basran.

## 3. Third-party 3-D assets
None identified beyond item 2. No other downloaded meshes, textures or HDRIs are bundled; lighting uses a procedurally generated environment.

## 4. Procedurally generated assets (created for V2; MIT with the source)
MLC leaves and jaws, collimator head and envelope ring, couch (linac and CT), indexed CT couch top, room, door, console and CCTV view, kV source/detector rig and x-ray beam, gantry display (canvas texture), EPID/MV imager, lasers, phantom and analytic CT phantom, light field, and all materials. The CT and linac images are rendered in code.

## 5. Third-party software
Runtime (bundled into the site):
| Package | Version | Licence |
|---|---|---|
| three.js (incl. RoundedBoxGeometry and other `three/examples/jsm` modules used) | 0.161.0 | MIT |

Build and development only (not shipped): vite 5.4.21 (MIT); @gltf-transform/core, /extensions, /functions 4.5.1 (MIT); meshoptimizer 0.22.0 (MIT). Playwright (used by `tools/export-usdz.mjs`, not a declared dependency) is Apache-2.0. Transitive dependencies are listed in `package-lock.json`; run `npx license-checker` before a release to confirm.

## 6. Redistribution check
* Source code, procedural assets, original models and runtime libraries: redistributable under the licences above.
* Original 3-D models and the USDZ/JPG files derived from them: author-created, redistributable under MIT (section 2).
* Reference citations in `src/linac/data.js` are links only; no third-party text or figures are copied.
