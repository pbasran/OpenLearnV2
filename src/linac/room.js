// Treatment-vault shell: floor with couch-swing markings, walls, ceiling lights, door + beam-on lamp, wall laser lines.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {M, tex} from '../engine/materials.js';

export function buildRoom({iso, floorY, ceilY, rotRadius = 1.75}) {
  const g = new THREE.Group(); g.name = 'room';
  const W = 6.6, D = 7.0;                      // x: along gantry axis, z: lateral
  const cx = iso.x + 0.9, cz = 0;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), M.floor());
  floor.rotation.x = -Math.PI / 2; floor.position.set(cx, floorY, cz); floor.receiveShadow = true; g.add(floor);

  // couch-rotation swing marking (yellow/black hatch ring) centred on the isocentre vertical axis
  const hatch = tex.hatch(); hatch.repeat.set(70, 1);
  const ring = new THREE.Mesh(new THREE.RingGeometry(rotRadius, rotRadius + 0.05, 128), new THREE.MeshStandardMaterial({map: hatch, roughness: 0.6}));
  ring.rotation.x = -Math.PI / 2; ring.position.set(iso.x, floorY + 0.002, 0); g.add(ring);

  const wallMat = M.wall();
  const wall = (w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; g.add(m); return m; };
  const H = ceilY - floorY, my = floorY + H / 2;
  wall(D, H, cx - W / 2, my, cz, Math.PI / 2);          // -x end wall (foot of couch)
  wall(D, H, cx + W / 2, my, cz, -Math.PI / 2);         // +x wall behind the stand
  wall(W, H, cx, my, cz - D / 2, 0);                    // -z wall
  const wallPos = wall(W, H, cx, my, cz + D / 2, Math.PI);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), M.ceiling()); ceil.rotation.x = Math.PI / 2; ceil.position.set(cx, ceilY, cz); g.add(ceil);

  // skirting + shielding-door on -x wall
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, 0.02), new THREE.MeshStandardMaterial({color: 0x7d8a8a, roughness: 0.6}));
  for (const [x, z, ry] of [[cx, cz - D / 2 + 0.01, 0], [cx, cz + D / 2 - 0.01, 0]]) { const s = skirt.clone(); s.position.set(x, floorY + 0.06, z); s.rotation.y = ry; g.add(s); }
  const door = new THREE.Mesh(new RoundedBoxGeometry(0.28, 2.15, 1.5, 2, 0.02), M.paintGrey());
  door.position.set(cx - W / 2 + 0.16, floorY + 1.08, -1.6); door.castShadow = door.receiveShadow = true; g.add(door);
  const trefoil = new THREE.Mesh(new THREE.CircleGeometry(0.16, 3), new THREE.MeshBasicMaterial({color: 0xf5c518}));
  trefoil.rotation.y = Math.PI / 2; trefoil.rotation.z = Math.PI / 2; trefoil.position.set(cx - W / 2 + 0.305, floorY + 1.55, -1.6); g.add(trefoil);
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.34), M.led(0x1a6a40));
  lamp.position.set(cx - W / 2 + 0.05, floorY + 2.35, -1.6); g.add(lamp);
  const lampLight = new THREE.PointLight(0xff3020, 0, 3, 2); lampLight.position.copy(lamp.position).add(new THREE.Vector3(0.3, 0, 0)); g.add(lampLight);

  // recessed ceiling light panels (emissive) so the room reads as lit
  const panelMat = new THREE.MeshBasicMaterial({color: new THREE.Color(1, 1, 0.97).multiplyScalar(1.4)});
  for (const x of [cx - 1.6, cx + 1.4]) for (const z of [-1.8, 1.8]) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), panelMat); p.rotation.x = Math.PI / 2; p.position.set(x, ceilY - 0.005, z); g.add(p);
  }

  // wall-mounted laser projectors + laser lines on walls (static, they are world-fixed)
  const redLine = new THREE.MeshBasicMaterial({color: 0xff2a1a, transparent: true, opacity: 0.95});
  const lines = new THREE.Group(); lines.name = 'wallLasers'; g.add(lines);
  const strip = (len, th) => new THREE.PlaneGeometry(len, th);
  const hz = new THREE.Mesh(strip(D - 0.1, 0.006), redLine); hz.rotation.y = Math.PI / 2; hz.position.set(cx - W / 2 + 0.003, iso.y, cz); lines.add(hz); // lateral horizontal on end wall
  const vz = new THREE.Mesh(strip(H, 0.006), redLine); vz.rotation.z = Math.PI / 2; vz.rotation.y = Math.PI / 2; vz.position.set(cx - W / 2 + 0.003, my, 0); lines.add(vz);
  for (const s of [-1, 1]) {
    const l = new THREE.Mesh(strip(W - 0.1, 0.006), redLine); l.position.set(cx, iso.y, s * (D / 2 - 0.003)); l.rotation.y = s > 0 ? Math.PI : 0; lines.add(l);
    const v = new THREE.Mesh(strip(H, 0.006), redLine); v.rotation.z = Math.PI / 2; v.position.set(iso.x, my, s * (D / 2 - 0.003)); v.rotation.y = s > 0 ? Math.PI : 0; lines.add(v);
    const box = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.12, 0.1, 2, 0.02), M.paintGrey()); box.position.set(iso.x, iso.y, s * (D / 2 - 0.05)); g.add(box); // projector heads
  }
  const sag = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.1, 0.16, 2, 0.02), M.paintGrey()); sag.position.set(cx - W / 2 + 0.06, iso.y + 0.9, 0); g.add(sag);
  const ceilProj = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.08, 0.12, 2, 0.02), M.paintGrey()); ceilProj.position.set(iso.x, ceilY - 0.04, 0); g.add(ceilProj);

  return {
    group: g, W, D, cx, cz, lampLight,
    setBeamOn(on) { lamp.material.color.set(on ? 0xff2a1a : 0x1a6a40); lamp.material.emissive.set(on ? 0xff2a1a : 0x1a6a40); lampLight.intensity = on ? 3 : 0; },
    setDoor(open) { door.position.z = open ? -0.4 : -1.6; },
    wallLasers: lines,
  };
}

/** Rounded cover shell helper with shared translucent material support. */
export function coverBox(w, h, d, r, mat, pos) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, r), mat);
  m.position.copy(pos); m.castShadow = m.receiveShadow = true; return m;
}
