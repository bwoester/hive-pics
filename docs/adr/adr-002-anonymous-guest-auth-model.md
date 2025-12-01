# ADR-002: Anonymous Guest Authentication Model

**Status:** Accepted  
**Date:** 2025-12-01  
**Owner:** Benjamin Wöster

## Context

HivePics targets private social events (e.g., weddings, parties).  
Primary UX requirement: **guests must be able to join in seconds**, without friction or setup.

Privacy goals:
- No personal accounts required for guests
- Minimal data stored → reduced GDPR exposure
- Nicknames are enough for recognition among friends

Abuse risk exists but is manageable within private social contexts.

## Decision

We adopt an **anonymous-first identity model**:
- Guest identities rely on **Firebase Anonymous Auth**
- Guests choose a **nickname** visible to others in the event gallery
- Guests may **optionally upgrade** to a registered account in the future (primarily for hosting)
- No enforced personal data collection for uploads in MVP

## Alternatives Considered

1) **Mandatory registration**
    - Strong accountability but high friction
    - GDPR burden significantly higher  
      → Rejected

2) **Anonymous-only without accountability**
    - Too high abuse & legal risk  
      → Rejected

3) **Anonymous-first with optional upgrade**
    - Best trade-off for MVP  
      → Chosen

## Consequences

### Positive
- Instant guest engagement
- Strong privacy posture
- Minimal operational and legal overhead
- Clear upgrade path to becoming a host

### Risks / Mitigations
- Low accountability for abusive users  
  → Mitigated via upload throttles, host moderation tools
- Repeat offenders can rejoin  
  → Consider event bans later

## Revisit Conditions
- Expansion to public or large open events
- Increased abuse volume or severity
- Regulatory requirements change
