# Hive Pics Firebase Schema

## Overview

This document describes the Firestore data model for Hive Pics. It separates host-managed data, guest uploads, event configurations, purchases, and public access. Rules are designed to protect quotas, monetization, and user privacy.

---

## Collections and Structure

### users/{userId}

**Description:** A registered host account.

| Field                       | Type              | Description                                        |
|-----------------------------|-------------------|----------------------------------------------------|
| `profile.name`              | string            | Display name of the host                           |
| `profile.email`             | string            | Host's email address                               |
| `system.subscriptionStatus` | string            | `'none'`, `'active'`, `'expired'` (set by backend) |
| `system.currentPlan`        | string or null    | Stripe plan identifier                             |
| `system.stripeCustomerId`   | string            | Internal reference (backend only)                  |
| `system.createdAt`          | timestamp         | Account creation timestamp                         |

---

### users/{userId}/events/{eventId}

**Description:** An event created and managed by a host.

| Field                      | Type           | Description                                               |
|----------------------------|----------------|-----------------------------------------------------------|
| `title`                    | string         | Name of the event (shown to guests)                       |
| `coverImageUrl`            | string         | Hero image shown on guest event landing                   |
| `description`              | string         | Foreword or welcome text (shown to guests)                |
| `startTime`                | timestamp      | Calendar start time                                       |
| `location`                 | string         | Physical or virtual location                              |
| `isTestMode`               | boolean        | If true, limited test environment                         |
| `status`                   | string         | `draft`, `test`, `active`, `archived`                     |
| `quota.maxGuests`          | number         | Guest limit (defined by package)                          |
| `quota.maxUploads`         | number         | Upload limit for this event                               |
| `quota.retentionDays`      | number         | Time after which photos are deleted and event is archived |
| `settings.downloadAllowed` | boolean        | Allow guests to download/uploaded images?                 |
| `purchase.packageId`       | string or null | References a `/packages/{packageId}` document             |
| `createdAt`                | timestamp      | Creation date                                             |
| `updatedAt`                | timestamp      | Update date                                               |

**Public Access for Guests:**

Guests can read:
- `title`
- `coverImageUrl`
- `description`
- `startTime`
- `location`
- `settings.downloadAllowed`

---

### events/{eventId}/uploads/{uploadId}

**Description:** Images submitted by guests.

| Field         | Type      | Description                       |
|---------------|-----------|-----------------------------------|
| `guestId`     | string    | ID of the uploading guest         |
| `imageUrl`    | string    | Cloud storage path or CDN URL     |
| `challengeId` | string    | Optional reference to a challenge |
| `timestamp`   | timestamp | When the photo was uploaded       |
| `approved`    | boolean   | If manual moderation is enabled   |

**Rules:**
- Guests can `create` and `read`
- Hosts have full access

**Notes:**

See https://extensions.dev/extensions/firebase/storage-resize-images

---

### events/{eventId}/guests/{guestId}

**Description:** Guest session metadata

| Field      | Type      | Description                  |
|------------|-----------|------------------------------|
| `nickname` | string    | Optional guest name or alias |
| `joinedAt` | timestamp | Guest join time              |

---

### packages/{packageId}
- `name: string` // e.g. "Starter", "Premium", "Test"
- `price: number`
- `currency: string`
- `maxGuests: number`
- `maxUploads: number`
- `photoRetentionDays: number`
- `isSubscription: boolean`
- `billingPeriod: 'monthly' | 'yearly' | null`
- `availableToUsers: boolean`

---

### users/{userId}/purchases/{purchaseId}

**Description:** Purchases linked to Stripe

| Field                 | Type      | Description                                  |
|-----------------------|-----------|----------------------------------------------|
| `packageId`           | string    | References `/packages/{packageId}`           |
| `eventId`             | string    | References `users/{userId}/events/{eventId}` |
| `stripePaymentId`     | string    | Stripe payment intent or checkout session    |
| `activatedAt`         | timestamp | When the event was upgraded                  |
| `quota.guests`        | number    | Guests allowed by this plan                  |
| `quota.uploads`       | number    | Uploads allowed                              |
| `quota.retentionDays` | number    | How long files are stored                    |

**Note:** See https://extensions.dev/extensions/invertase/firestore-stripe-payments

---

## Notes

- Event quotas should only be enforced server-side (Cloud Functions).
- All monetization logic is secured from client tampering.
- Guests never see backend or quota fields.
- Test mode limits: 2 guests, 10 uploads (enforced in code).

## Firestore Rules
See [`firestore.rules`](../firestore.rules)
