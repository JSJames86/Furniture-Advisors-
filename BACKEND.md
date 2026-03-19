# FurnitureAdvisory.co — Backend Documentation

> **Stack:** Next.js 14 (App Router) · Airtable · Resend · Twilio · Vercel

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in all values (see Environment Variables section)

# 3. Set up Airtable (see schema guide)
npx ts-node scripts/setup-airtable.ts

# 4. Run development server
npm run dev
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, metadata)
│   ├── page.tsx                      # Root → redirects to furnitureadvisory.co
│   ├── globals.css                   # Tailwind base + brand utilities
│   ├── not-found.tsx                 # 404 page
│   │
│   ├── results/
│   │   └── [profileSlug]/
│   │       └── page.tsx              # Dynamic style profile results page
│   │
│   ├── admin/
│   │   └── page.tsx                  # Password-protected admin dashboard
│   │
│   └── api/
│       ├── submit-quiz/route.ts      # POST — save quiz, trigger email sequence
│       ├── book-appointment/route.ts # POST — book appointment, confirm email + SMS
│       ├── calendly-webhook/route.ts # POST — Calendly event.invitee.created webhook
│       └── admin/
│           ├── stats/route.ts        # GET — dashboard stats + leads
│           └── export/route.ts       # GET — CSV export of all leads
│
├── lib/
│   ├── airtable.ts                   # Airtable CRUD operations
│   ├── style-profiles.ts             # Profile data + derivation logic
│   ├── twilio.ts                     # Optional SMS via Twilio
│   └── email/
│       └── resend.ts                 # 7-email sequence + appointment confirmation
│
└── types/
    └── index.ts                      # TypeScript interfaces
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AIRTABLE_API_KEY` | ✅ | Airtable Personal Access Token |
| `AIRTABLE_BASE_ID` | ✅ | Airtable Base ID (`appXXXXXXX`) |
| `RESEND_API_KEY` | ✅ | Resend API key (`re_XXXXX`) |
| `EMAIL_FROM` | ✅ | From address: `Janelle Glanville <janelle@furnitureadvisory.co>` |
| `ADMIN_PASSWORD` | ✅ | Password for `/admin` dashboard |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://furnitureadvisory.co` |
| `CALENDLY_EVENT_URL` | ✅ | Your Calendly event link |
| `TWILIO_ACCOUNT_SID` | optional | Twilio Account SID (SMS) |
| `TWILIO_AUTH_TOKEN` | optional | Twilio Auth Token |
| `TWILIO_FROM_NUMBER` | optional | Your Twilio phone number |

---

## API Reference

### `POST /api/submit-quiz`

Accepts quiz answers, saves lead to Airtable, triggers Email 1 immediately.

**Request body:**
```json
{
  "firstName": "Maria",
  "lastName": "Torres",
  "email": "maria@example.com",
  "phone": "+1-908-555-0100",
  "roomType": "Living Room",
  "roomLength": 14,
  "roomWidth": 16,
  "styleProfile": "modern-luxe",
  "budgetRange": "$2,500 – $5,000",
  "timeline": "1–3 months",
  "financingInterest": true,
  "householdType": ["pets"],
  "leadSource": "Quiz"
}
```

**Response:**
```json
{
  "success": true,
  "recordId": "recXXXXXXXXXX",
  "styleProfile": {
    "slug": "modern-luxe",
    "label": "Modern Luxe",
    "tagline": "Refined simplicity meets elevated living.",
    "description": "...",
    "resultsUrl": "/results/modern-luxe"
  }
}
```

---

### `POST /api/book-appointment`

Books appointment, upserts Airtable record, sends confirmation email + optional SMS.

**Request body:**
```json
{
  "firstName": "Maria",
  "lastName": "Torres",
  "email": "maria@example.com",
  "phone": "+1-908-555-0100",
  "styleProfile": "modern-luxe",
  "budgetRange": "$2,500 – $5,000",
  "roomType": "Living Room",
  "notes": "Interested in the sectional collection"
}
```

---

### `POST /api/calendly-webhook`

Handles Calendly `event.invitee.created` webhook automatically.

**Setup:** In Calendly → Integrations → Webhooks → add:
```
https://furnitureadvisory.co/api/calendly-webhook
```
Subscribe to: `invitee.created`

---

### `GET /api/admin/stats`

Returns stats + all leads. Requires `x-admin-password` header.

---

### `GET /api/admin/export`

Returns CSV of all leads. Requires `x-admin-password` header.

---

## Results Pages

Each style profile has a dedicated page:

| URL | Profile |
|---|---|
| `/results/modern-luxe` | Modern Luxe |
| `/results/warm-traditional` | Warm Traditional |
| `/results/coastal-serene` | Coastal Serene |
| `/results/urban-glam` | Urban Glam |
| `/results/rustic-refined` | Rustic Refined |

**Query parameters:**
- `?name=Maria` — personalizes the heading
- `?pets=1` — shows pet-specific lifestyle note
- `?kids=1` — shows kids-specific lifestyle note

**Example:** `/results/modern-luxe?name=Maria&pets=1`

---

## Email Sequence

All 7 emails are sent from `janelle@furnitureadvisory.co` via Resend.

| # | Trigger | Subject line pattern |
|---|---|---|
| 1 | Immediate (quiz submit) | `Your Style Profile Is In, {name} — {Profile}` |
| 2 | Day 3 | `A Vision For Your {Room}, {name}` |
| 3 | Day 5 | `The Fabric Conversation, {name} (This One Matters)` |
| 4 | Day 7 | `How to Make Your Furniture Last 10+ Years, {name}` |
| 5 | Day 10 | `Financing Your Dream Room, {name} — Let Me Explain Your Options` |
| 6 | Day 14 | `What My Clients Say About Working With Me, {name}` |
| 7 | Day 21 | `Still Here For You, {name} — Whenever You're Ready` |

> **Note:** Email 1 fires immediately. Emails 2–7 should be scheduled via a job queue.
> Recommended: [Inngest](https://inngest.com) or [Trigger.dev](https://trigger.dev).

---

## Admin Dashboard

Visit `/admin` and enter your `ADMIN_PASSWORD`.

**Features:**
- Live stats: total leads, today's leads, quiz completion rate, appointment rate
- Full leads table with search + filter by style profile / appointment status
- Auto-refreshes every 60 seconds
- Export all leads to CSV

---

## Airtable Schema

Run the setup guide:
```bash
npx ts-node scripts/setup-airtable.ts
```

**Table:** `Leads`

| Field | Type |
|---|---|
| First Name | Single line text |
| Last Name | Single line text |
| Email | Email |
| Phone | Phone number |
| Room Type | Single select |
| Room Length | Number |
| Room Width | Number |
| Style Profile | Single select |
| Budget Range | Single select |
| Timeline | Single select |
| Financing Interest | Checkbox |
| Household Type | Single line text |
| Quiz Completed | Checkbox |
| Appointment Booked | Checkbox |
| Lead Source | Single select |
| Date Submitted | Date & time |
| Notes | Long text |

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set environment variables
vercel env add AIRTABLE_API_KEY
vercel env add AIRTABLE_BASE_ID
vercel env add RESEND_API_KEY
vercel env add EMAIL_FROM
vercel env add ADMIN_PASSWORD
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add CALENDLY_EVENT_URL

# Deploy
vercel --prod
```

---

## Email Scheduling (Production)

Email 1 fires immediately. For emails 2–7, integrate a job queue:

**Option A — Inngest (recommended):**
```ts
import { inngest } from '@/lib/inngest'

// In submit-quiz route, after email 1:
await inngest.send({
  name: 'lead/quiz-submitted',
  data: { ...emailPayload, submittedAt: new Date().toISOString() },
})
```

**Option B — Vercel Cron:**
Create `/api/cron/send-sequence` and schedule via `vercel.json`:
```json
{
  "crons": [{ "path": "/api/cron/send-sequence", "schedule": "0 10 * * *" }]
}
```

---

*Built for Janelle Glanville · FurnitureAdvisory.co · Ashley HomeStore, Union & Essex County NJ*
