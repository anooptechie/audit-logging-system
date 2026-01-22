# PROJECT CONTEXT

## Background

This project was built after completing backend projects involving:

- inventory/resource management
- background job processing
- authentication and authorization

While those projects focused on **business logic**, this service focuses on **cross-cutting infrastructure concerns** that apply across systems.

---

## Design Motivation

In real backend systems:

- audit logging is often added too late
- logs become inconsistent across services
- debugging relies on guesswork
- async failures are hard to trace

This project treats auditing as a **first-class backend system**, not an afterthought.

---

## Architectural Evolution

### Phase 1

Focused on correctness and clarity:

- immutable event modeling
- append-only storage
- investigative read APIs
- strict service boundaries

### Phase 2

Introduced system-level thinking:

- asynchronous ingestion via Redis (Upstash)
- decoupling audit writes from request lifecycle
- producer–consumer model
- failure isolation

## Phase 3 — Reliability & Hardening

Phase 3 was introduced to make the audit system safe under real-world asynchronous failures.

The focus was on correctness rather than feature expansion.

Key reliability guarantees added:

- **Idempotency**
  Duplicate message delivery is expected in async systems.
  A unique idempotency key ensures audit events are recorded exactly once.

- **Bounded Retries**
  Transient persistence failures are retried a limited number of times.
  This balances reliability with system stability.

- **Dead-Letter Queue**
  Events that fail after retries are moved to a DLQ instead of being dropped.
  This preserves audit history and enables later inspection or reprocessing.

This phase demonstrates system-level thinking around failure handling, data integrity, and operational safety.

Each phase was implemented deliberately without overengineering.

---

## Scope Decisions

The project intentionally avoids:

- dashboards or UI
- analytics and reporting
- complex orchestration
- premature optimization

The goal is to demonstrate **sound backend fundamentals**, not feature volume.

---

## How to Evaluate This Project

This project should be evaluated based on:

- clarity of responsibility
- correctness of data modeling
- async system understanding
- ability to evolve incrementally
- realism of design choices

Not based on:

- UI polish
- number of features
- complexity for its own sake

---

## Final Note

This service is designed to **grow with systems**, not impress with shortcuts.

It prioritizes:

- correctness over cleverness
- clarity over completeness
- fundamentals over frameworks
