import { Resend } from 'resend'
import type { EmailSequencePayload, StyleProfile } from '@/types'
import { STYLE_PROFILES } from '@/lib/style-profiles'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM ?? 'Janelle Glanville <janelle@furnitureadvisory.co>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://furnitureadvisory.co'
const CALENDLY_URL = process.env.CALENDLY_EVENT_URL ?? 'https://calendly.com/janelleglanville'
const HIHELLO_URL = 'https://hihello.com/p/1a56532e-99b8-4e8e-8652-168c24c577c8'

// ─── Brand styles (inline for email clients) ─────────────────────────────────

const S = {
  gold: '#B8975A',
  goldLight: '#D4B483',
  charcoal: '#1C1C1A',
  warmWhite: '#FDFAF7',
  warmGray: '#8A8479',
  cream: '#F7F3EE',
  ashleyOrange: '#F48120',
}

// ─── Base email wrapper ────────────────────────────────────────────────────────

function emailWrapper(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Janelle Glanville · Furniture Advisor</title>
</head>
<body style="margin:0;padding:0;background-color:${S.cream};font-family:'Montserrat',Helvetica,Arial,sans-serif;">
  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:${S.cream};">${preheader}</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:${S.cream};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background-color:${S.warmWhite};border-radius:2px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:${S.charcoal};padding:32px 48px;text-align:center;border-bottom:3px solid ${S.gold};">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:${S.gold};margin-bottom:8px;">FURNITURE ADVISORY</p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.warmWhite};letter-spacing:0.05em;">Janelle Glanville</h1>
              <p style="margin:6px 0 0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${S.warmGray};">Trusted Furniture Advisor · Ashley HomeStore</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${S.charcoal};padding:32px 48px;text-align:center;">
              <p style="margin:0 0 16px;font-size:13px;color:${S.warmGray};">Janelle Glanville · Ashley HomeStore</p>
              <p style="margin:0 0 16px;font-size:12px;color:${S.warmGray};">Serving Union &amp; Essex County, NJ</p>
              <div style="margin-bottom:16px;">
                <a href="${SITE_URL}" style="color:${S.gold};font-size:12px;text-decoration:none;letter-spacing:0.05em;margin:0 12px;">Website</a>
                <a href="${CALENDLY_URL}" style="color:${S.gold};font-size:12px;text-decoration:none;letter-spacing:0.05em;margin:0 12px;">Book a Visit</a>
                <a href="${HIHELLO_URL}" style="color:${S.gold};font-size:12px;text-decoration:none;letter-spacing:0.05em;margin:0 12px;">My Card</a>
              </div>
              <p style="margin:0;font-size:11px;color:#4A4A48;">
                You received this because you connected with Janelle at FurnitureAdvisory.co.<br/>
                <a href="${SITE_URL}/unsubscribe" style="color:${S.warmGray};text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Gold CTA button ──────────────────────────────────────────────────────────

function ctaButton(text: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td style="background-color:${S.gold};border-radius:2px;">
        <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:${S.warmWhite};text-decoration:none;">${text}</a>
      </td>
    </tr>
  </table>`
}

// ─── Gold divider ─────────────────────────────────────────────────────────────

const divider = `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:32px 0;">
  <tr><td style="border-top:1px solid ${S.goldLight};"></td></tr>
</table>`

// ─── Furniture card (for email 1) ─────────────────────────────────────────────

function furnitureCard(item: { name: string; collection: string; description: string; priceRange: string; shopUrl: string }): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:16px 0;border:1px solid #E8E3DC;border-radius:2px;">
    <tr>
      <td style="padding:20px 24px;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${S.gold};">${item.collection}</p>
        <h3 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:400;color:${S.charcoal};">${item.name}</h3>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:${S.warmGray};">${item.description}</p>
        <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:${S.charcoal};">${item.priceRange}</p>
        <a href="${item.shopUrl}" style="font-size:12px;color:${S.gold};text-decoration:none;letter-spacing:0.1em;border-bottom:1px solid ${S.goldLight};">View Collection →</a>
      </td>
    </tr>
  </table>`
}

// ─── Email 1: Style Profile Results (Immediate) ───────────────────────────────

export async function sendEmail1StyleResults(payload: EmailSequencePayload) {
  const profile = STYLE_PROFILES[payload.styleProfile]
  const recs = profile.recommendations
    .map((r) => furnitureCard(r))
    .join('\n')

  const html = emailWrapper(
    `<h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:400;color:${S.charcoal};">Hello, ${payload.firstName}.</h2>
    <p style="margin:0 0 24px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:${S.gold};">Your Style Profile Is Ready</p>

    <div style="background-color:${S.charcoal};border-left:4px solid ${S.gold};padding:24px 28px;margin:0 0 32px;border-radius:0 2px 2px 0;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${S.gold};">Your Design Personality</p>
      <h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.warmWhite};">${profile.label}</h2>
      <p style="margin:0;font-size:14px;font-style:italic;color:${S.goldLight};">${profile.tagline}</p>
    </div>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">${profile.description}</p>

    ${divider}

    <p style="margin:0 0 20px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:${S.gold};">Curated For Your Style</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:${S.warmGray};">I've hand-selected three pieces from Ashley HomeStore's current collection that align perfectly with your ${profile.label} profile. These are pieces I'd personally walk you through in the showroom.</p>

    ${recs}

    ${divider}

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">I'd love to show you these pieces in person and help you build a room that truly reflects your style. My calendar is open — let's find a time that works for you.</p>

    ${ctaButton('Schedule Your Consultation', CALENDLY_URL)}

    <p style="margin:0;font-size:14px;line-height:1.7;color:${S.warmGray};">With warmth,<br/><span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${S.charcoal};">Janelle</span></p>`,
    `Your ${profile.label} profile is ready — plus 3 curated picks just for you.`
  )

  return resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: `Your Style Profile Is In, ${payload.firstName} — ${profile.label}`,
    html,
  })
}

// ─── Email 2: Personalized Room Vision (Day 3) ────────────────────────────────

export async function sendEmail2RoomVision(payload: EmailSequencePayload) {
  const profile = STYLE_PROFILES[payload.styleProfile]

  const html = emailWrapper(
    `<h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.charcoal};">Let's Talk About Your ${payload.roomType}</h2>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">${payload.firstName}, I've been thinking about your ${payload.roomType} since you took the quiz — and I have a vision I'd love to share with you.</p>

    <div style="background-color:${S.cream};border-radius:2px;padding:28px 32px;margin:0 0 28px;">
      <p style="margin:0 0 16px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:${S.gold};">The ${profile.label} ${payload.roomType}</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${S.charcoal};">Imagine walking into your ${payload.roomType} and feeling exactly the way ${profile.tagline.toLowerCase()} Here's what I'd build for you:</p>
      <ul style="margin:0;padding:0 0 0 20px;">
        ${profile.keywords.map((k) => `<li style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${S.warmGray};">${k.charAt(0).toUpperCase() + k.slice(1)} as a design element</li>`).join('')}
      </ul>
    </div>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">Within your ${payload.budgetRange} range, I can build you something really beautiful. I've done it dozens of times for clients right here in Union and Essex County — and every single one still sends me photos.</p>

    ${ctaButton('See Your Full Profile & Picks', `${SITE_URL}/results/${payload.styleProfile}`)}

    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:${S.warmGray};">Warmly,<br/><span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${S.charcoal};">Janelle</span></p>`,
    `I have a vision for your ${payload.roomType} — let me share it with you.`
  )

  return resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: `A Vision For Your ${payload.roomType}, ${payload.firstName}`,
    html,
  })
}

// ─── Email 3: Education — Fabric & Planning (Day 5) ──────────────────────────

export async function sendEmail3FabricEducation(payload: EmailSequencePayload) {
  const hasPets = payload.householdType.includes('pets')
  const hasKids = payload.householdType.includes('kids')

  const html = emailWrapper(
    `<h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.charcoal};">The Fabric Conversation Nobody Has With You</h2>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">Most salespeople skip this part. I don't. ${payload.firstName}, the single most important decision you'll make in furnishing your home isn't the style — it's the fabric.</p>

    <div style="margin:0 0 24px;">
      <h3 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:400;color:${S.charcoal};">What I Look For in Every Fabric</h3>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${[
          ['Double Rub Count', 'The industry measure of durability. For family rooms, I recommend 30,000+ double rubs. For formal spaces, 15,000 is fine.'],
          ['Fiber Content', 'Polyester-blend fabrics resist staining better than natural fibers. But natural fibers breathe and age more beautifully.'],
          ['Weave Tightness', 'A tight weave resists pilling and snags. Loose weaves look luxurious but require more care.'],
          ['Cleanability Code', 'W = Water clean. S = Solvent. WS = Both. X = Vacuum only. I never let clients leave without knowing their code.'],
        ].map(([title, desc]) => `<tr>
          <td style="padding:12px 0;border-bottom:1px solid #E8E3DC;vertical-align:top;width:35%;">
            <p style="margin:0;font-size:13px;font-weight:600;color:${S.charcoal};letter-spacing:0.05em;">${title}</p>
          </td>
          <td style="padding:12px 0 12px 20px;border-bottom:1px solid #E8E3DC;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:${S.warmGray};">${desc}</p>
          </td>
        </tr>`).join('')}
      </table>
    </div>

    ${(hasPets || hasKids) ? `<div style="background-color:#FFF8EE;border:1px solid ${S.goldLight};border-radius:2px;padding:24px 28px;margin:0 0 24px;">
      <p style="margin:0 0 12px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:${S.gold};">A Note For Your Household</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:${S.charcoal};">${hasPets && hasKids ? `With both pets and children in the home, I'll specifically look for performance fabrics with 100,000+ double rubs, CleanBlok technology, and moisture-resistant backing. Beautiful AND bulletproof.` : hasPets ? `With pets in the home, I'll steer you toward microfiber or performance weaves with a tight construction that resists claw snags, and solution-dyed fibers that clean up without leaving marks.` : `With children in the home, I'll focus on fabrics that clean easily without losing color — performance polyesters and treated natural blends that stay beautiful through years of real family living.`}</p>
    </div>` : ''}

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">When we meet in the showroom, I'll bring fabric samples and walk you through every option for your specific lifestyle. It usually takes about 20 minutes — and it changes everything.</p>

    ${ctaButton('Book Your Fabric Consultation', CALENDLY_URL)}

    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:${S.warmGray};">Warmly,<br/><span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${S.charcoal};">Janelle</span></p>`,
    `The fabric advice no one gives you — until now.`
  )

  return resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: `The Fabric Conversation, ${payload.firstName} (This One Matters)`,
    html,
  })
}

// ─── Email 4: Performance Fabrics + Protection (Day 7) ───────────────────────

export async function sendEmail4PerformanceFabrics(payload: EmailSequencePayload) {
  const html = emailWrapper(
    `<h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.charcoal};">Your Furniture Should Last a Decade. Here's How.</h2>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">${payload.firstName}, I want your investment to look as beautiful in ten years as it does on day one. That means two things: the right fabric from the start, and a protection plan that actually works.</p>

    <h3 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:${S.charcoal};">Performance Fabric Brands I Trust</h3>

    ${[
      {
        name: 'Crypton®',
        desc: 'Built-in moisture barrier and antimicrobial treatment. The gold standard for family living. Wine, coffee, pet accidents — it beads right off.',
      },
      {
        name: 'Sunbrella®',
        desc: 'Originally made for outdoor use, now a staple in high-end interiors. Solution-dyed so color never fades. Cleans with soap and water.',
      },
      {
        name: "Ashley's EverClean™",
        desc: "Ashley HomeStore's proprietary performance treatment. Applied to select upholstery lines — I can tell you exactly which ones carry it.",
      },
    ].map(({ name, desc }) => `<div style="border-left:3px solid ${S.gold};padding:16px 20px;margin:0 0 16px;background-color:${S.cream};">
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:${S.charcoal};">${name}</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:${S.warmGray};">${desc}</p>
    </div>`).join('')}

    ${divider}

    <h3 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:${S.charcoal};">Ashley's Protection Plan — My Honest Take</h3>

    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:${S.warmGray};">I only recommend this to clients I'd give the same advice to as a friend. Ashley's furniture protection plan covers accidental stains, structural damage, and mechanisms. For most families, it pays for itself the first time you use it.</p>

    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:${S.warmGray};">Come in and let me walk you through the options. I'll tell you which pieces genuinely benefit from the plan and which ones don't.</p>

    ${ctaButton('Let\'s Talk Protection Plans', CALENDLY_URL)}

    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:${S.warmGray};">Warmly,<br/><span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${S.charcoal};">Janelle</span></p>`,
    'Make your furniture investment last — performance fabrics and protection plans explained.'
  )

  return resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: `How to Make Your Furniture Last 10+ Years, ${payload.firstName}`,
    html,
  })
}

// ─── Email 5: Financing Options (Day 10) ─────────────────────────────────────

export async function sendEmail5Financing(payload: EmailSequencePayload) {
  const html = emailWrapper(
    `<h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.charcoal};">You Don't Have to Wait to Have the Home You Want</h2>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">${payload.firstName}, one of the questions I get asked most is: "Can I afford this?" And the honest answer is — more often than people think, yes.</p>

    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:${S.charcoal};">Ashley HomeStore has financing options I'm proud to walk clients through:</p>

    ${[
      {
        title: '12 Months No Interest',
        desc: 'Finance your purchase at no interest for a full year when you pay the balance in full. Ideal for planned purchases where you want to spread payments.',
      },
      {
        title: '36 Month Low APR',
        desc: 'Extended financing for larger room packages. Turn a complete living room or bedroom into manageable monthly payments.',
      },
      {
        title: 'Lease-to-Own Options',
        desc: 'Flexible ownership path for those who prefer not to apply for credit. Get your furniture now, own it over time.',
      },
    ].map(({ title, desc }) => `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 16px;border:1px solid #E8E3DC;border-radius:2px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:${S.charcoal};">${title}</p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:${S.warmGray};">${desc}</p>
        </td>
      </tr>
    </table>`).join('')}

    <p style="margin:28px 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">I'll walk you through all the options in person with absolutely no pressure. My job is to help you find the right furniture at the right terms — not to push you into anything.</p>

    ${ctaButton('Discuss Financing Options', CALENDLY_URL)}

    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:${S.warmGray};">Warmly,<br/><span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${S.charcoal};">Janelle</span></p>`,
    'Ashley HomeStore financing options — make your room happen now.'
  )

  return resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: `Financing Your Dream Room, ${payload.firstName} — Let Me Explain Your Options`,
    html,
  })
}

// ─── Email 6: Social Proof + Testimonials (Day 14) ───────────────────────────

export async function sendEmail6Testimonials(payload: EmailSequencePayload) {
  const testimonials = [
    {
      quote:
        'Janelle completely transformed my living room. She listened to exactly what I wanted and stayed within my budget. I couldn't be happier.',
      name: 'Maria T.',
      location: 'Union, NJ',
    },
    {
      quote:
        'I was nervous about the whole process but Janelle made it easy and even fun. The bedroom set she picked out is absolutely gorgeous.',
      name: 'David K.',
      location: 'Maplewood, NJ',
    },
    {
      quote:
        'Professional, knowledgeable, and genuinely caring. She remembered every detail I mentioned and built a room I\'m still in love with two years later.',
      name: 'Angela R.',
      location: 'Summit, NJ',
    },
  ]

  const html = emailWrapper(
    `<h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.charcoal};">What My Clients Say (In Their Own Words)</h2>

    <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:${S.charcoal};">${payload.firstName}, I could tell you all day long that I'll take care of you — but I'd rather let the people I've worked with speak for me.</p>

    ${testimonials.map(({ quote, name, location }) => `<div style="background-color:${S.cream};border-radius:2px;padding:28px 32px;margin:0 0 16px;position:relative;">
      <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;line-height:1.7;color:${S.charcoal};">"${quote}"</p>
      <p style="margin:0;font-size:13px;color:${S.gold};letter-spacing:0.1em;">— ${name} · <span style="color:${S.warmGray};">${location}</span></p>
    </div>`).join('')}

    ${divider}

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">Every one of those clients came in not knowing exactly what they wanted. They left with a home they love. You deserve the same experience.</p>

    ${ctaButton('Book Your Consultation', CALENDLY_URL)}

    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:${S.warmGray};">Warmly,<br/><span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${S.charcoal};">Janelle</span></p>`,
    'Real stories from clients in Union & Essex County who transformed their homes with Janelle.'
  )

  return resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: `What My Clients Say About Working With Me, ${payload.firstName}`,
    html,
  })
}

// ─── Email 7: Final Open Invitation (Day 21) ─────────────────────────────────

export async function sendEmail7FinalInvitation(payload: EmailSequencePayload) {
  const profile = STYLE_PROFILES[payload.styleProfile]

  const html = emailWrapper(
    `<h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.charcoal};">The Door Is Always Open</h2>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">${payload.firstName},</p>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">Over the past few weeks I've shared your ${profile.label} profile, curated picks, fabric advice, protection plans, and financing options. I hope it's been genuinely useful.</p>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">Whether you're ready to furnish your room next week or just beginning to dream — I'm here whenever the timing is right for you. There's no expiration date on working together.</p>

    <div style="background-color:${S.charcoal};border-radius:2px;padding:32px 36px;margin:32px 0;text-align:center;">
      <p style="margin:0 0 12px;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:${S.gold};">When You're Ready</p>
      <p style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-style:italic;color:${S.warmWhite};">"A home should tell the story of who you are, and be a collection of what you love."</p>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
        <tr>
          <td style="background-color:${S.gold};border-radius:2px;">
            <a href="${CALENDLY_URL}" style="display:inline-block;padding:14px 32px;font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:${S.warmWhite};text-decoration:none;">Schedule a Visit</a>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">You can also save my digital card for when you need it:</p>

    <a href="${HIHELLO_URL}" style="display:inline-block;font-size:13px;color:${S.gold};text-decoration:none;letter-spacing:0.1em;border-bottom:1px solid ${S.goldLight};margin-bottom:32px;">Save Janelle's HiHello Card →</a>

    <p style="margin:0;font-size:14px;line-height:1.7;color:${S.warmGray};">With genuine warmth,<br/><span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${S.charcoal};">Janelle Glanville</span><br/><span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${S.warmGray};">Trusted Furniture Advisor · Ashley HomeStore</span></p>`,
    'You have an open invitation — connect with Janelle whenever the time is right for you.'
  )

  return resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: `Still Here For You, ${payload.firstName} — Whenever You're Ready`,
    html,
  })
}

// ─── Appointment confirmation email ───────────────────────────────────────────

export async function sendAppointmentConfirmation(params: {
  to: string
  firstName: string
  styleProfile: StyleProfile
}) {
  const profile = STYLE_PROFILES[params.styleProfile]

  const html = emailWrapper(
    `<h2 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${S.charcoal};">You're On My Calendar, ${params.firstName}</h2>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">I'm so looking forward to meeting you. Please check your email for the calendar invite with all the details.</p>

    <div style="background-color:${S.cream};border-radius:2px;padding:24px 28px;margin:0 0 28px;">
      <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:${S.gold};">Your Style Profile</p>
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:${S.charcoal};">${profile.label}</p>
      <p style="margin:8px 0 0;font-size:13px;font-style:italic;color:${S.warmGray};">${profile.tagline}</p>
    </div>

    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${S.charcoal};">Before our visit, save my digital card so you have my contact info at your fingertips:</p>

    ${ctaButton("Save Janelle's Card", HIHELLO_URL)}

    <p style="margin:0;font-size:14px;line-height:1.7;color:${S.warmGray};">See you soon,<br/><span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${S.charcoal};">Janelle</span></p>`,
    `You're on Janelle's calendar — appointment confirmed.`
  )

  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Appointment Confirmed, ${params.firstName} — See You Soon`,
    html,
  })
}

// ─── Schedule full 7-email sequence (fire-and-forget via edge cron or task) ───
// In production, use a job queue (Inngest / Trigger.dev / Vercel Cron).
// This helper sends the first email immediately and returns the schedule.

export async function triggerEmailSequence(payload: EmailSequencePayload) {
  // Email 1 — immediate
  await sendEmail1StyleResults(payload)

  // Remaining emails should be scheduled via your preferred job queue.
  // Return the schedule for the consumer to enqueue.
  return {
    immediate: 'email_1_sent',
    schedule: [
      { email: 2, delayDays: 3, fn: 'sendEmail2RoomVision' },
      { email: 3, delayDays: 5, fn: 'sendEmail3FabricEducation' },
      { email: 4, delayDays: 7, fn: 'sendEmail4PerformanceFabrics' },
      { email: 5, delayDays: 10, fn: 'sendEmail5Financing' },
      { email: 6, delayDays: 14, fn: 'sendEmail6Testimonials' },
      { email: 7, delayDays: 21, fn: 'sendEmail7FinalInvitation' },
    ],
  }
}
