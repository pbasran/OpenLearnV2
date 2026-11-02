# Research logging architecture (not enabled)

OpenLearn V2 is a teaching tool. This document describes a **dormant** hook so that a future, separately approved research version could measure *procedural competence* (what a learner does, in what order, how fast) rather than only knowledge.

## Status
* `src/engine/events.js` is **disabled by default**. When disabled, `events.emit()` returns immediately: nothing is stored or timed.
* Nothing in V2 calls `events.enable()`. There is no UI for it, no URL flag and no network code.
* Even when enabled the module is **in-memory only** (lost on reload), has **no network path** and records **no identifiers** (no name, ID, IP, device or user agent).
* Any persistence or transmission would need a *sink* supplied by the host page via `events.addSink(fn)`, with its own data-management and consent design.

## Event types
`session.start/end`, `setup.complete`, `param.set`, `ct.step`, `linac.step`, `imaging.step`, `interlock`, `troubleshoot.decision`, `task.complete`, `error`, `correction`. Each event is `{t, type, data}` where `t` is ms since `enable()`.

Hooked today (as no-ops while disabled): linac collision/interlock (`interlock`) and the CBCT sequence (`imaging.step`). The remaining types are reserved; add `events.emit(...)` calls at the workflow steps in `src/linac/panel.js` and `src/ct/panel.js` when a protocol requires them.

## Research-use boundary
* V2 is a **separate platform** from the V1 applications used in the IRB-approved Einhorn/Alexandria study. This repository does not change V1 and V2 must not be substituted for the V1 intervention.
* Any use of V2 with human participants, and any enabling of logging, requires appropriate protocol / IRB review (or an amendment that explicitly covers V2).
* Do not enable logging by default or collect identifiable data without that approval.
