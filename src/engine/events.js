// Workflow event bus for FUTURE research use (procedural-competence measurement).
//
// DISABLED BY DEFAULT. While disabled, emit() returns immediately: nothing is
// stored, nothing is timed, nothing leaves the page. Even when enabled this module
//   - keeps events in memory only (lost on reload; no localStorage / cookies),
//   - makes no network request and contains no network code,
//   - records no identifier of any kind (no name, ID, IP, device or user agent).
// Enabling it for a human-subjects study requires an approved protocol / IRB review
// and a deliberate, separately reviewed sink. See docs/research-logging.md.
//
// Event shape: {t, type, data}   t = ms since enable(); type from EVENT_TYPES.
export const EVENT_TYPES = [
  'session.start', 'session.end',
  'setup.complete',        // a workflow setup phase finished
  'param.set',             // parameter selection {name, value}
  'ct.step',               // CT acquisition step {step}
  'linac.step',            // linac setup step {step}
  'imaging.step',          // imaging workflow step (kV / MV / CBCT) {step}
  'interlock',             // interlock or collision {kind, detail}
  'troubleshoot.decision', // learner decision while troubleshooting {choice}
  'task.complete',         // {task, durationMs}
  'error',                 // learner error {code}
  'correction'             // corrective action {code}
];

let on = false, t0 = 0;
const buf = [], sinks = [];

export const events = {
  get enabled() { return on; },
  enable() { on = true; t0 = performance.now(); buf.length = 0; },
  disable() { on = false; buf.length = 0; },
  addSink(fn) { sinks.push(fn); },          // sinks are opt-in and must be supplied by the host page
  emit(type, data) {
    if (!on) return;
    const e = {t: Math.round(performance.now() - t0), type, data: data || {}};
    buf.push(e);
    sinks.forEach((f) => { try { f(e); } catch (_) { /* a sink must never break the simulation */ } });
  },
  snapshot() { return buf.slice(); }        // copy of the in-memory log
};
