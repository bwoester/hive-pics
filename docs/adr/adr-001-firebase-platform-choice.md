# ADR-001: Choose Firebase as the primary application platform

**Status:** Proposed  
**Date:** 2025-12-01  
**Owner:** Benjamin Wöster

## Context

HivePics is a lightweight event photo challenge application where:
- Event hosts create photo challenges for guests
- Guests join via QR codes and anonymously upload photos
- Storage is temporary and limited by event purchase level
- Mobile-first browsing and uploads are essential
- No app installation should be required

Key architectural challenges:
- Fast time-to-market with limited development capacity (solo developer)
- Handling authentication securely without friction for guests
- Managing file uploads (images) efficiently and at scale
- Ensuring privacy and temporary retention of uploaded data
- Cost control for storage and bandwidth
- Ability to evolve the product without rewriting the core

HivePics should also support:
- Low-latency interactions for uploads
- Scalable infrastructure without significant ops overhead
- Automatic handling of traffic spikes during events
- Integration of paid upgrades (event monetization)

## Decision

We will build HivePics on **Firebase** (Serverless Google Cloud platform), using:
- Firebase Authentication (anonymous + nickname)
- Firestore Database
- Firebase Storage for image uploads
- Firebase Hosting for frontend delivery
- Firebase Security Rules for access control
- Optional Cloud Functions for automation/backend logic

Firebase will be our primary backend and operational platform.

## Alternatives Considered

### Option A — AWS Serverless (S3, Cognito, DynamoDB, Lambda)
- Pros: Highly flexible, enterprise-grade, reliable
- Cons: Higher operational complexity, more setup required, cost risks harder to estimate without deep experience

### Option B — Supabase + Cloudflare (Postgres + R2)
- Pros: Open architecture, SQL database, modern DX, lower-bandwidth costs (R2)
- Cons: Authentication less polished for fully anonymous UX, less mature ecosystem, uncertainty in photo-storage throughput

### Option C — Custom Backend (Node/Go/Rust) + Object Storage
- Pros: Full control, tailored architecture, potentially lower long-term cost
- Cons: Requires building/maintaining auth, API, scaling, and security — significantly longer time-to-market

### Option D — Firebase (Chosen)
- Pros: Managed auth, storage, hosting, and scaling with minimal ops overhead
- Pros: Strong developer experience for a solo founder
- Pros: Seamless integration between components
- Cons: Vendor lock-in, cost scaling requires monitoring

## Reasoning

Firebase allows rapid delivery of production features **without** backend infrastructure management.  
For an early-stage product with high UX demands but limited resources, this is the most pragmatic and low-risk choice.

This decision will be revisited when:
- Event volumes exceed scaling limits
- Pricing model requires significant cost-optimizations
- Feature roadmap demands custom backend control

## Consequences

### Positive
- Very fast time-to-market
- Reduced DevOps and maintenance burden
- Authentication and storage secured by platform defaults
- Built-in scalability for peak usage during events
- Ability to focus development on UI and product features

### Negative / Risks
- Vendor lock-in to Google Cloud ecosystem
- Storage and egress costs may become significant at scale
- Limited control over some lower-level behaviors
- Harder to migrate data models later if choosing another platform

### Mitigations
- Abstract platform-dependent logic in service layers
- Monitor storage and bandwidth usage per event
- Consider dual-storage strategy or migration path if scale grows

---

## Open Questions

1. **Do we fully rely on anonymous auth + nickname**, or should hosts optionally require email-based identification for guests?
2. **Are Cloud Functions part of the MVP** or only planned for later automation (e.g. cleanup jobs, payment activation)?
3. Expected **peak scale** per event? (number of guests, uploads per guest) → influences cost/risk assessment
4. Is there a **retention rule** (delete after 30 days?) required for GDPR & storage cost optimization?

---

## Decision Outcome

This decision stands **until scale, cost, or product strategy** requires a new evaluation.

