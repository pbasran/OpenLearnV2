// Educational cutaway of the CT x-ray tube: electrons boil off the cathode filament, are accelerated by the tube voltage, strike the
// tungsten anode track at the focal spot, and photons leave in the fan beam. Rotor-local coordinates (origin on the rotation axis, +y = tube side).
import * as T from 'three';

export function createTubeAnim(rotor, {xs, rf, rd, ha}) {
  const g = new T.Group(); g.name = 'tube_anim'; g.visible = false; rotor.add(g);
  const cy = 0.705, R = 0.075;
  const glass = new T.Mesh(new T.CylinderGeometry(0.105, 0.105, 0.34, 40, 1, true).rotateZ(Math.PI / 2), new T.MeshBasicMaterial({color: 0x9fd8ff, transparent: true, opacity: 0.12, side: T.DoubleSide, depthTest: false, depthWrite: false, toneMapped: false}));
  glass.position.set(xs, cy, 0); glass.renderOrder = 18; g.add(glass);
  const mat = (c, o = 1) => new T.MeshBasicMaterial({color: c, transparent: o < 1, opacity: o, depthTest: false, toneMapped: false});
  const anode = new T.Mesh(new T.CylinderGeometry(R, R * 0.93, 0.016, 48).rotateZ(Math.PI / 2), mat(0xb9c2cc)); anode.position.set(xs + 0.004, cy - 0.0, 0); anode.renderOrder = 19; g.add(anode);
  const track = new T.Mesh(new T.TorusGeometry(R * 0.93, 0.004, 8, 64).rotateY(Math.PI / 2), mat(0xff8a3d)); track.position.set(xs - 0.004, cy, 0); track.renderOrder = 20; g.add(track);   // hot tungsten focal track
  const stem = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.16, 12).rotateZ(Math.PI / 2), mat(0x8e98a4)); stem.position.set(xs + 0.1, cy, 0); stem.renderOrder = 19; g.add(stem);
  const cathode = new T.Mesh(new T.BoxGeometry(0.03, 0.02, 0.05), mat(0x59d0ff)); const fx = xs - 0.115, fy = cy - R + 0.014;    // filament cup
  cathode.position.set(fx, fy, 0); cathode.renderOrder = 20; g.add(cathode);
  const focal = new T.Vector3(xs - 0.006, rf, 0);
  // electrons: filament -> focal spot (accelerating)
  const NE = 40, el = new T.InstancedMesh(new T.SphereGeometry(0.0042, 8, 6), mat(0x9fe8ff), NE); el.renderOrder = 22; el.frustumCulled = false; g.add(el);
  const NP = 150, ph = new T.InstancedMesh(new T.SphereGeometry(0.004, 6, 5), mat(0xffd35a, 0.95), NP); ph.renderOrder = 22; ph.frustumCulled = false; g.add(ph);
  const glow = new T.Mesh(new T.SphereGeometry(0.014, 14, 10), mat(0xfff2a8, 0.85)); glow.position.copy(focal); glow.renderOrder = 23; g.add(glow);
  const start = new T.Vector3(fx + 0.015, fy, 0);
  const seed = Array.from({length: NP}, () => ({ph: Math.random(), a: (Math.random() * 2 - 1) * ha, v: 0.55 + Math.random() * 0.45, w: (Math.random() - 0.5) * 0.02}));
  const m4 = new T.Matrix4(), v3 = new T.Vector3(), q = new T.Quaternion(), sc = new T.Vector3(1, 1, 1);
  let t = 0;
  function update(dt, active, emitPhotons) {
    g.visible = !!active; if (!active) return; t += dt;
    for (let i = 0; i < NE; i++) { const u = (t * 0.9 + i / NE) % 1, e = u * u; v3.lerpVectors(start, focal, e); v3.z = Math.sin(i * 12.9) * 0.004 * (1 - e); m4.compose(v3, q, sc); el.setMatrixAt(i, m4); }
    el.instanceMatrix.needsUpdate = true;
    const pulse = 0.7 + 0.3 * Math.sin(t * 18); glow.scale.setScalar(pulse * 1.1);
    ph.visible = !!emitPhotons;
    if (emitPhotons) { for (let i = 0; i < NP; i++) { const p = seed[i], life = (t * 0.7 * p.v + p.ph) % 1, d = life * rd * 0.95; v3.set(xs + p.w * 0.3, rf - d * Math.cos(p.a), d * Math.sin(p.a)); const f = (1 - life) * 0.9 + 0.1; sc.set(f, f, f); m4.compose(v3, q, sc); ph.setMatrixAt(i, m4); } sc.set(1, 1, 1); ph.instanceMatrix.needsUpdate = true; }
  }
  return {group: g, update};
}
