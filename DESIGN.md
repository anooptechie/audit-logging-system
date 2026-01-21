# Audit & Activity Logging Service
## Phase 0: Design Contract

## Table of Contents

- [Purpose](#purpose)
- [Scope & Boundaries](#scope--boundaries)
- [Core Principles](#core-principles)
- [Audit Event Definition](#audit-event-definition)
- [Data Models](#data-models)
  - [Actor Model (Who)](#actor-model-who)
  - [Action Model (What)](#action-model-what)
  - [Resource Model (On What)](#resource-model-on-what)
  - [Change Representation (What Changed)](#change-representation-what-changed)
  - [Context Model (How)](#context-model-how)
  - [Time Rules (When)](#time-rules-when)
- [Contracts & Guarantees](#contracts--guarantees)
- [Exit Criteria](#exit-criteria)

---

## Purpose

The Audit & Activity Logging Service exists to record factual events that occur across backend systems.

### ✅ It Answers

- **Who** did **what**, **when**, and in **what context**

### ❌ It Does Not

- Enforce business rules
- Decide authorization
- Interpret intent
- Validate domain correctness

> **This service is observational, not judgmental.**

---

## Scope & Boundaries

### In Scope

- ✅ Recording immutable audit events
- ✅ Providing read access for investigation and tracing
- ✅ Supporting multiple producer systems

### Out of Scope

- ❌ Business logic
- ❌ Workflow enforcement
- ❌ Analytics and reporting
- ❌ Alerting
- ❌ Dashboards or UI

---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Append-only** | Events are never updated or deleted |
| **Business-agnostic** | No domain-specific logic |
| **Non-blocking** | Audit failures must not impact business flows |
| **Asynchronous-friendly** | Supports async producers |
| **Traceable** | Supports cross-service correlation |
| **Trust-oriented** | Optimized for integrity and investigation |

---

## Audit Event Definition

An audit event represents a **single, immutable fact** that occurred in the system.

### Every audit event must clearly describe:

- 👤 **Who** performed the action
- 🎯 **What** action occurred
- 📦 **What resource** was affected (if any)
- ⏰ **When** it happened
- 🔗 **In what execution context**
- 🔄 **What changed** (if applicable)

> ⚠️ **If an event cannot answer these questions, it is considered incomplete.**

---

## Data Models

### Actor Model (Who)

Actors represent the originator of an action.

#### Supported Actor Types

```
┌─────────────────────────────────────┐
│ Actor Types                         │
├─────────────────────────────────────┤
│ • User   → Human-initiated          │
│ • System → Internal service         │
│ • Job    → Background/async process │
└─────────────────────────────────────┘
```

#### Rules

- ✓ Actor identity must be explicit
- ✓ Actor intent is never inferred
- ✓ Actor data is minimal and non-business-specific

---

### Action Model (What)

Actions describe **what happened**, not **why**.

#### Characteristics

- **Enum-based** for consistency
- **Verb-oriented** for clarity
- **Descriptive of an event**, not an outcome

#### Examples

- Creation events
- Update events
- Execution events
- Failure events
- Access events

---

### Resource Model (On What)

Resources describe what was affected by the action.

#### A resource may be:

- **Present** (e.g., an entity updated)
- **Absent** (e.g., failed login attempt)

#### Rules

- ✓ Resource absence is still a valid event
- ✓ Resource identity is descriptive, not enforced

---

### Change Representation (What Changed)

Changes capture **state transitions**, not full state.

#### Rules

- 📝 Store only **before → after** differences
- 🚫 Ignore unchanged and non-business fields
- ⚡ Changes are optional (not all events mutate state)
- 🔧 Diff generation occurs **outside** the audit service

---

### Context Model (How)

Context captures execution metadata, not business meaning.

#### Context May Include

- Request-level correlation identifiers
- Job-level correlation identifiers
- Network metadata (IP, user agent)

#### Purpose

- Enable tracing across services
- Reconstruct execution flows

---

### Time Rules (When)

```
┌──────────────────────────────────────────┐
│ Timestamp Guidelines                     │
├──────────────────────────────────────────┤
│ • All timestamps are in UTC              │
│ • Audit service is source of truth       │
│ • Client timestamps are NOT trusted      │
│ • Consistency over local accuracy        │
└──────────────────────────────────────────┘
```

---

## Contracts & Guarantees

### Immutability Contract

Once an audit event is written:

- ✅ It is **never modified**
- ✅ It is **never deleted**

#### Corrections are handled by:

1. Writing a new audit event
2. Optionally referencing the original event

> **History is additive, never rewritten.**

---

### Service Guarantees

#### ✅ The Audit Service Guarantees:

- Events are recorded as immutable facts
- Event structure is consistent and versioned
- Failures do not block business systems

#### ❌ The Audit Service Does NOT Guarantee:

- Real-time delivery
- Complete losslessness under extreme failure
- Business correctness

---

## Exit Criteria

**Phase 0 is complete when:**

- [ ] The audit event contract is frozen
- [ ] Mandatory vs optional fields are clear
- [ ] Service responsibilities are unambiguous
- [ ] Non-goals are explicitly documented

> ⚠️ **No implementation begins before this document is agreed upon.**

---

## Foundation Statement

**This document is the foundation.**  
**All future phases must conform to it.**

---

