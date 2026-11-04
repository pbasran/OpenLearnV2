# OpenLearn V2 — interactive CT and linear-accelerator simulation for medical-physics education

## [▶ Launch the viewer](https://pbasran.github.io/OpenLearnV2/)

[![Launch viewer](https://img.shields.io/badge/Launch-OpenLearn%20v2%20viewer-1f6f78?style=for-the-badge)](https://pbasran.github.io/OpenLearnV2/)

Direct links: [**Linear accelerator**](https://pbasran.github.io/OpenLearnV2/) · [**CT scanner**](https://pbasran.github.io/OpenLearnV2/?mode=ct)

<img src="docs/OpenLearnV2_QR.png" alt="QR code to the OpenLearn v2 viewer" width="220">

Scan with a phone camera. For augmented reality use Chrome on an ARCore-capable Android phone and tap **AR**. On iPhone/iPad the QR code opens the normal 3D view (iOS Safari has no WebXR AR); for AR on iPad use the **[life-size iPad AR page](https://pbasran.github.io/OpenLearnV2/ar/)** (Apple AR Quick Look, no install).


**OpenLearn V2 is an open-source, browser-based simulation of CT scanner and linear-accelerator operation** for medical-physics education. It is not just a 3-D or AR viewer: learners operate the equipment, follow clinical workflows and see the physics respond.

* **Realistic equipment geometry and motion** — real axis conventions, speeds and travel limits.
* **Operational workflows** — CT scouting, protocol and acquisition; linac time-out, set-up, image guidance and beam delivery.
* **Imaging physics** — filtered back-projection CT, kV / MV / CBCT imaging.
* **Simplified radiation-physics models** — educational dose and noise behaviour, not clinical calculation.
* **Safety and interlocks** — collision, door, kV/x-ray and tube-heat interlocks.
* **No specialised hardware** — runs in any modern browser; optional WebXR AR on supported phones.

## Relationship to V1 and research use

* V2 is a **separate, from-scratch rebuild**. It does **not** modify or replace the deployed, IRB-approved V1 study applications (`RealtimeUrbanismLab/OpenLearn`, `VirtualLinac`).
* V2 must not be substituted for the V1 intervention in any approved study.
* **Any research use of V2 with human participants requires appropriate protocol / IRB review** (or an amendment that explicitly covers V2). Optional research logging is only a dormant, disabled-by-default hook; see `docs/research-logging.md`.

## Privacy

Verified in the source and the production build:

* After the page and its bundled assets load from the host, the simulation runs **locally in your browser**.
* **No analytics, no user tracking, no cookies or browser storage.**
* **No external API calls during simulation** (no `fetch`, XHR, WebSocket, beacons, CDN fonts or remote scripts).
* **Nothing the learner does is transmitted or recorded**; workflow results exist only in the open page.

Caveat: the *host* (e.g. GitHub Pages) can see ordinary web-server request logs when the page is loaded, as with any website. AR hit-testing uses the browser's own WebXR implementation, which is outside this app's control.

## Run / build

```bash
npm install
npm run dev        # http://localhost:5200
npm run build      # static site in dist/ (relative paths; can be hosted in any sub-folder, e.g. GitHub Pages)
```

`npm run optimize` re-creates `public/assets/` from the original GLB files (weld → simplify → meshopt; 32–37 MB → ≈6 MB). It expects the OpenLearn repo checked out next to this folder; the optimised assets are already included.

## What is in V2 compared with V1

| | V1 | V2 |
|---|---|---|
| Visuals | flat-shaded GLBs | PBR paint / metal / glass / carbon, hospital-vault lighting, shadows, room with door and a control-room console |
| Linac mechanics | free rotation | **IEC 61217** conventions (0–360° gantry and collimator, signed jaw coordinates, couch rotation/longitudinal), real relative speeds, travel limits, **collision interlocks**, door interlock |
| Linac head | — | 60-pair MLC (0.5 / 1.0 cm leaves; 40 × 40 cm preset), four divergent tungsten jaws with **symmetric or asymmetric** control, shaped light field, thin ring showing the real head envelope (collision risk) |
| Gantry display | — | upright ring display of beam, gantry and collimator angles, beam on/off, MU and each jaw position |
| Linac imaging | — | kV AP/lateral, MV portal image, and a **CBCT sequence** (arms extend, door auto-closes, kV beam with photons, 200° arc) |
| Linac physics | — | educational dose model: PDD, output factor, off-axis profile, flattened / **FFF as an energy option**, SSD from geometry, isodose slice |
| Linac workflow | — | time-out → laser set-up → image guidance → beam parameters (R&V) → beam-on with interlocks |
| CT mechanics | — | rotating tube / detector, gantry tilt ±30°, table in / height with clearance limits, laser alignment, tube-heat limit, door and x-ray lamp interlocks; DICOM patient coordinate conventions |
| CT imaging | — | analytic phantom → sinogram with photon noise → **filtered back-projection**; kVp, mAs, pitch, thickness, kernel and FOV act as on a scanner; scout, range planning, CTDIvol / DLP, W/L, ROI |
| CT workflow | — | time-out → laser positioning → scout → range & protocol → acquire → review / measure → finish |

## 🐾 Easter eggs
There is one hidden in each module. No spoilers, just hints:

* **Linac:** treatment rooms are dark and the beam is invisible, but not everything about it is. Turn the beam on with the gantry pointing straight down and the covers see-through, then look at the floor.
* **CT:** the bones are shy. Open the window as wide as it will go, and set the level as high as it will go, and see who is hiding in the image.



```
src/engine/   stage (renderer, lights, picking), materials, ui kit, plot, ar.js (WebXR)
src/linac/    linac.js (assembly, axes, collisions), head.js (jaws/MLC/light/beam), aperture.js, dose.js, couch.js, room.js, panel.js
src/ct/       ct.js (assembly, axes, scan sequencing), recon.js (phantom, sinogram, FBP, scout, dose), panel.js
public/assets optimised GLB models (from the original OpenLearn repository)
```

## Things to know

* **Educational physics, not clinical.** The dose engine and the CT recon are simplified models built to make the controls behave in the right direction (e.g. noise ∝ 1/√mAs, higher pitch → lower dose, sharper kernel → more noise, bone HU rises at low kVp). They must not be used for planning, QA acceptance or any patient decision. Effective dose uses a single chest conversion factor.
* **On-board imaging:** the kV source/detector arms (from the original model) and a procedurally modelled MV portal imager (EPID, 43 × 43 cm, SID 150 cm) both extend and retract, take part in collision checks, and are used in the workflow. Images are schematic (marker position / field outline), not simulated radiographs.
* **The linac is re-proportioned.** The original model puts the isocentre 0.63 m above the floor; v2 raises it to 1.30 m (as on commercial machines) so the head can sweep a full 360° without hitting the floor.
* CT: reconstruction runs in the browser (~0.2 s per slice at 192², cached); rotation time and table speed use real values, with a 1×/2×/5× time-scale control.
* **iPad AR (static, life-size)**: `public/ar/` holds USDZ models of the linac (gantry 0° and 90°) and CT (table in / out) at 1 unit = 1 m, opened through Safari's AR Quick Look. Regenerate with `npx vite --port 5199` then `node tools/export-usdz.mjs` (needs Playwright); poses are listed at the top of `tools/export-usdz.mjs`. These are fixed poses; interactive controls remain in the WebXR/3D viewer.
* AR scale presets: 1:16, 1:8, 1:4 and life-size. The room is hidden in AR and a shadow-catcher floor is added.
* Not included yet: VR (headset) mode with in-headset controls; real DICOM data; multi-user/instructor features.
* **Licensing:** source code and the bundled 3-D models are MIT (see `LICENSE` and `ASSET_LICENSES.md`). Third-party software licences are listed in `ASSET_LICENSES.md`.
