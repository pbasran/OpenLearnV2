# OpenLearn v2 — realistic CT scanner & linear accelerator (WebXR)

## [▶ Launch the viewer](https://pbasran.github.io/OpenLearnV2/)

[![Launch viewer](https://img.shields.io/badge/Launch-OpenLearn%20v2%20viewer-1f6f78?style=for-the-badge)](https://pbasran.github.io/OpenLearnV2/)

Direct links: [**Linear accelerator**](https://pbasran.github.io/OpenLearnV2/) · [**CT scanner**](https://pbasran.github.io/OpenLearnV2/?mode=ct)

<img src="docs/OpenLearnV2_QR.png" alt="QR code to the OpenLearn v2 viewer" width="220">

Scan with a phone camera. For augmented reality use Chrome on an ARCore-capable Android phone and tap **AR**. On iPhone/iPad the QR code opens the normal 3D view (iOS Safari has no WebXR AR).

A separate, from-scratch rebuild of the OpenLearn CT and linac teaching models. **It does not modify or replace the deployed, IRB-approved v1 apps** (`RealtimeUrbanismLab/OpenLearn`, `VirtualLinac`). Host it at its own URL; any study use needs its own review.

* 3D engine: three.js r161 (PBR materials, image-based lighting, soft shadows). No A-Frame / 8th Wall dependency.
* AR: open standard **WebXR** (hit-test placement). Works in Chrome/Edge on ARCore Android phones and Quest browser. **iOS Safari has no WebXR AR** — the same page still runs as a normal 3D viewer there.
* No analytics, no network calls after load, nothing recorded or sent. Workflow results exist only in the page.

## Run / build

```bash
npm install
npm run dev        # http://localhost:5200
npm run build      # static site in dist/ (relative paths; can be hosted in any sub-folder, e.g. GitHub Pages)
```

`npm run optimize` re-creates `public/assets/` from the original GLB files (weld → simplify → meshopt; 32–37 MB → ≈6 MB). It expects the OpenLearn repo checked out next to this folder; the optimised assets are already included.

## What is new compared with v1

| | v1 | v2 |
|---|---|---|
| Visuals | flat-shaded GLBs | PBR paint / metal / glass / carbon, hospital-vault environment lighting, shadows, room with door, window, console |
| Linac mechanics | free rotation | IEC-61217 axes with real relative speeds, travel limits, **collision interlocks** (head / arm / kV arms / MV imager vs. couch, phantom, floor), door interlock |
| Linac look | — | ring-style gantry face (no dial), glossy head with no box round the collimator so the jaws and MLC leaves are visible, treatment console in a control room outside the bunker (viewing window; live status screens) |
| Linac field | — | 60-pair MLC (0.5 / 1.0 cm leaves), 4 tungsten jaws with divergent faces, shaped **light field** that rotates with collimator & gantry, room lasers drawn on the phantom |
| Linac physics | — | educational dose model: PDD, output factor, off-axis profile (flattened / FFF), SSD from real geometry, isodose slice in the phantom |
| Linac workflow | — | time-out → laser set-up (2 mm) → image guidance (kV AP + lateral with couch shift; MV portal image of the field) → beam parameters (R&V) → beam-on with interlocks |
| CT mechanics | — | rotating tube / detector, gantry tilt ±30°, table in / height with bore-clearance limits, external laser alignment, tube-heat limit, door & x-ray lamp interlocks |
| CT imaging | — | analytic phantom → sinogram with photon noise → **filtered back-projection**; kVp, mAs, pitch, slice thickness, kernel and FOV change the image the way they do on a scanner; scout (topogram), range planning, CTDIvol / DLP, W/L, ROI tool |
| CT table | — | flat indexed carbon-fibre couch top (numbered index positions, cm ruler) with its own Parts learning item; positioning lasers can be switched on/off |
| CT workflow | — | time-out → laser positioning → scout → range & protocol → acquire (helical or axial) → review / measure → finish |

## Layout

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
* AR scale presets: 1:16, 1:8, 1:4 and life-size. The room is hidden in AR and a shadow-catcher floor is added.
* Not included yet: VR (headset) mode with in-headset controls; real DICOM data; multi-user/instructor features.
* 3D models © their original authors (OpenLearn repository). Check the original repository's licence before redistributing the assets.
