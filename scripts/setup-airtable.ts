/**
 * Airtable Base Setup Script
 * ──────────────────────────
 * Run once to document the required Airtable schema.
 * Airtable's API does not support creating fields programmatically,
 * so this script prints the schema you need to create manually
 * in the Airtable UI (https://airtable.com).
 *
 * Usage: npx ts-node scripts/setup-airtable.ts
 */

const SCHEMA = {
  baseName: 'FurnitureAdvisory — Leads',
  tableName: 'Leads',
  fields: [
    // ── Contact ──────────────────────────────────────────────────────────────
    { name: 'First Name',    type: 'Single line text',  required: true  },
    { name: 'Last Name',     type: 'Single line text',  required: true  },
    { name: 'Email',         type: 'Email',             required: true  },
    { name: 'Phone',         type: 'Phone number',      required: false },

    // ── Room Details ─────────────────────────────────────────────────────────
    {
      name: 'Room Type',
      type: 'Single select',
      options: ['Living Room', 'Bedroom', 'Dining Room', 'Home Office', 'Entryway', 'Other'],
      required: true,
    },
    { name: 'Room Length', type: 'Number (decimal)', required: false },
    { name: 'Room Width',  type: 'Number (decimal)', required: false },

    // ── Style Profile ─────────────────────────────────────────────────────────
    {
      name: 'Style Profile',
      type: 'Single select',
      options: [
        'modern-luxe',
        'warm-traditional',
        'coastal-serene',
        'urban-glam',
        'rustic-refined',
      ],
      required: true,
    },

    // ── Budget & Timeline ─────────────────────────────────────────────────────
    {
      name: 'Budget Range',
      type: 'Single select',
      options: [
        'Under $1,000',
        '$1,000 – $2,500',
        '$2,500 – $5,000',
        '$5,000 – $10,000',
        '$10,000+',
        'Not sure yet',
      ],
      required: true,
    },
    {
      name: 'Timeline',
      type: 'Single select',
      options: [
        'Within 30 days',
        '1–3 months',
        '3–6 months',
        '6–12 months',
        'Just browsing',
      ],
      required: true,
    },
    { name: 'Financing Interest', type: 'Checkbox', required: false },

    // ── Household ─────────────────────────────────────────────────────────────
    {
      name: 'Household Type',
      type: 'Single line text',
      note: 'Comma-separated: pets, kids, neither',
      required: false,
    },

    // ── Lead Status ───────────────────────────────────────────────────────────
    { name: 'Quiz Completed',    type: 'Checkbox',          required: false },
    { name: 'Appointment Booked', type: 'Checkbox',         required: false },

    // ── Meta ──────────────────────────────────────────────────────────────────
    {
      name: 'Lead Source',
      type: 'Single select',
      options: ['Quiz', 'Direct Booking', 'Calendly', 'Referral', 'Walk-in', 'Other'],
      required: false,
    },
    { name: 'Date Submitted', type: 'Date & time (ISO 8601)', required: false },
    { name: 'Notes',          type: 'Long text',              required: false },
  ],
}

console.log('\n╔══════════════════════════════════════════════════════╗')
console.log('║   FurnitureAdvisory — Airtable Schema Setup Guide   ║')
console.log('╚══════════════════════════════════════════════════════╝\n')
console.log(`Base name:  ${SCHEMA.baseName}`)
console.log(`Table name: ${SCHEMA.tableName}`)
console.log('\nCreate the following fields in Airtable:\n')

SCHEMA.fields.forEach((field, i) => {
  const marker = field.required ? '★' : '○'
  console.log(`${String(i + 1).padStart(2, ' ')}. ${marker} ${field.name.padEnd(22)} [${field.type}]`)
  if ('options' in field && field.options) {
    console.log(`       Options: ${field.options.join(' | ')}`)
  }
  if ('note' in field && field.note) {
    console.log(`       Note: ${field.note}`)
  }
})

console.log('\n★ = Required field   ○ = Optional field\n')
console.log('After creating the base, copy your:')
console.log('  → Personal Access Token → AIRTABLE_API_KEY in .env.local')
console.log('  → Base ID (from URL)    → AIRTABLE_BASE_ID in .env.local')
console.log('\nBase ID format: appXXXXXXXXXXXXXX (from airtable.com/appXXXX/...)\n')

export {}
