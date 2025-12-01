# ADR-003: Community Moderation Model

**Status:** Accepted  
**Date:** 2025-12-01  
**Owner:** Benjamin Wöster

## Context

HivePics uses anonymous guest identities (see ADR-002).  
This limits traceability of users and increases potential abuse.

But private events provide a strong social structure:
- Participants know each other personally
- Group norms discourage inappropriate behavior

Moderation must be effective **without adding friction**.

## Decision

We adopt a **community-driven moderation** approach:

- Guests can **flag** a photo as inappropriate
- Flagging a photo will **immediately hide it** from regular guests
- Flag includes an optional **comment for context**
- Hosts receive a **moderation view** showing flagged content
- Hosts decide whether to restore or permanently remove a photo
- Uploaders receive a **notification** that their content was flagged  
  (but **not** who flagged it)

Goal: encourage self-correction and reduce repeat abuse.

## Alternatives Considered

A) Host-only moderation  
→ Slower, high burden for hosts

B) ML-based automatic moderation  
→ Costs + complexity too high for MVP

C) Community moderation (chosen)  
→ Socially scalable + fast reaction

## Consequences

### Positive
- Minimal operational effort
- Fast removal of abusive content from visibility
- Encourages responsible participation
- Host retains final authority and control

### Risks / Mitigations
- False flagging as harassment  
  → Rate limiting, host authority
- Host may miss moderation actions  
  → Notification tools + dashboard
- Ongoing disputes possible  
  → Private flagging, no flagger identity revealed

## Revisit Conditions
- Abuse patterns increase beyond expectation
- Expansion beyond private events
- Need for stronger accountability policies
