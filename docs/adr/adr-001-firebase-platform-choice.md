# ADR-001: Choose Firebase as the primary application platform

**Status:** Accepted  
**Date:** 2025-12-01  
**Owner:** Benjamin Wöster

## Context

HivePics is a lightweight event photo challenge application where:
- Event hosts create photo challenges for guests
- Guests join via QR codes and anonymously upload photos
- Storage is temporary and limited by event purchase level
- Mobile-first browsing and uploads are essential
- No app installation should be required

Primary product priorities:
1) Extremely simple guest onboarding with **no required personal accounts**
2) Secure storage and privacy for private events (e.g. weddings)
3) Cost and scalability appropriate for a solo-developed SaaS

HivePics must also support:
- **Anonymous guest identity** via nickname within a friend group context
- **Abuse prevention** and moderation of uploaded content
- **Automatic cleanup** of stored images (data retention rules)

Given the solo-founder situation and need for fast development cycles:
> minimizing DevOps and platform complexity is critical for success.

## Decision

We will build HivePics on **Firebase**, using:
- Firebase Authentication (anonymous + nickname identity)
- Firestore for structured data
- Firebase Storage for image uploads and access rules
- Firebase Hosting for web app distribution
- Firebase Security Rules for access control and data privacy
- Optional Cloud Functions for automation (cleanup, event activation, payments)

Firebase will serve as our primary backend, infrastructure, and operational platform.

## Alternatives Considered

### Option A — AWS Serverless (S3, Cognito, DynamoDB, Lambda)
- Pros: Highly flexible, scalable
- Cons: Significantly higher operational complexity, longer setup time, cost control harder

### Option B — Supabase + Cloudflare (Postgres + R2)
- Pros: SQL database, modern developer experience, low egress costs
- Cons: Less polished anonymous auth, less mature ecosystem for high photo throughput

### Option C — Custom Backend (Node/Go/Rust) + Object Storage
- Pros: Maximal control
- Cons: Requires building and maintaining auth, scaling, security — too slow for MVP

### Option D — Firebase (Chosen)
- Pros: Integrated auth + storage + hosting + rules
- Pros: Excellent scalability with minimal operations
- Pros: Fastest time-to-market for the MVP
- Cons: Vendor lock-in, risk of high storage/network costs at scale

## Reasoning

Anonymous identity with nicknames is a **core UX requirement**, because:
- Guests should participate instantly
- Personal data handling should be minimized (GDPR advantage)
- Event participants typically know each other and can self-recognize

Firebase Authentication handles this **securely by default**, reducing engineering effort.

Firebase is therefore the **most pragmatic** solution for:
- Accelerated delivery
- Strong guest privacy defaults
- Minimal maintenance
- Built-in scalability for event spikes

This decision will be revisited when scale or cost pressure justify reevaluation.

## Consequences

### Positive
- Very fast product delivery
- Zero backend infrastructure to maintain
- Anonymous identity and access security handled out-of-the-box
- Scaling and traffic bursts require no custom engineering

### Negative / Risks
- Platform lock-in to Google Cloud
- Storage + bandwidth bills may grow with usage
- Limited control over underlying storage behavior
- **Abuse handling is a product requirement** (illegal/obscene uploads risk)

### Mitigations
- Strong access rules limiting who can upload to which event
- Content moderation UI for event hosts planned
- Automated cleanup + retention enforcement via Cloud Functions
- Monitor storage and usage per event tier

---

## Status and Revisit Conditions

This decision is **accepted** for the MVP release and will be reviewed when:
- events regularly exceed scaling limits
- content moderation requires additional backend services
- cost structure becomes suboptimal

