# Asset and third-party licences

Last reviewed: 2026-11-02. Items marked **UNVERIFIED** have not been confirmed and must be resolved before relying on them as redistributable.

## 1. OpenLearn V2 source code
`src/`, `tools/`, `index.html`, `public/ar/index.html`, `docs/`, build configuration: **MIT**, see `LICENSE`. Copyright (c) 2026 Parminder S. Basran, VAIDER Lab, Cornell University.

## 2. Original 3-D models (UNVERIFIED)
* Files: `public/assets/ct/*.glb`, `public/assets/linac/*.glb` (optimised with `tools/optimize.mjs`: weld, simplify, meshopt compression), and the `public/ar/*.usdz` / `*.jpg` files generated from them.
* Source: the CT and linac models of the original OpenLearn repository (`RealtimeUrbanismLab/OpenLearn`), including the kV imaging arms and MV/linac internals reused in V2.
* Authorship and licence: **UNVERIFIED.** The original repository's licence and the individual model authors have not been confirmed from this repository. The MIT licence in `LICENSE` does **not** apply to these files. Until a permissive or granted licence is confirmed in writing by the original authors, treat them as "all rights reserved by their original authors" and do not assume they may be redistributed or reused outside this repository.
* Action required: confirm licence/permission with the original authors, record it here (licence name, authors, URL, date), or replace the models with the procedural ones below.

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
* Source code, procedural assets and runtime libraries: redistributable under the licences above.
* **Original 3-D models and the USDZ/JPG files derived from them: not confirmed redistributable.**
* Reference citations in `src/linac/data.js` are links only; no third-party text or figures are copied.
