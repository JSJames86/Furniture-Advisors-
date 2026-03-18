import Airtable from 'airtable'
import type { AirtableLead, QuizSubmission, AppointmentBooking } from '@/types'

// ─── Airtable client ──────────────────────────────────────────────────────────

function getBase() {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey || !baseId) {
    throw new Error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables')
  }

  const airtable = new Airtable({ apiKey })
  return airtable.base(baseId)
}

const LEADS_TABLE = 'Leads'

// ─── Create lead from quiz submission ─────────────────────────────────────────

export async function createLeadFromQuiz(submission: QuizSubmission): Promise<string> {
  const base = getBase()

  const fields: AirtableLead = {
    'First Name': submission.firstName,
    'Last Name': submission.lastName,
    Email: submission.email,
    ...(submission.phone && { Phone: submission.phone }),
    'Room Type': submission.roomType,
    ...(submission.roomLength && { 'Room Length': submission.roomLength }),
    ...(submission.roomWidth && { 'Room Width': submission.roomWidth }),
    'Style Profile': submission.styleProfile,
    'Budget Range': submission.budgetRange,
    Timeline: submission.timeline,
    'Financing Interest': submission.financingInterest,
    'Household Type': submission.householdType.join(', '),
    'Quiz Completed': true,
    'Appointment Booked': false,
    'Lead Source': submission.leadSource ?? 'Quiz',
    'Date Submitted': new Date().toISOString(),
    ...(submission.notes && { Notes: submission.notes }),
  }

  const record = await base(LEADS_TABLE).create(fields)
  return record.getId()
}

// ─── Mark lead as appointment booked ─────────────────────────────────────────

export async function bookAppointment(booking: AppointmentBooking): Promise<string> {
  const base = getBase()

  // Try to find existing lead by email
  const existing = await base(LEADS_TABLE)
    .select({
      filterByFormula: `{Email} = "${booking.email}"`,
      maxRecords: 1,
    })
    .firstPage()

  if (existing.length > 0) {
    // Update existing record
    const record = existing[0]
    await base(LEADS_TABLE).update(record.getId(), {
      'Appointment Booked': true,
      ...(booking.calendlyEventUri && { Notes: `Calendly event: ${booking.calendlyEventUri}` }),
    })
    return record.getId()
  }

  // Create new record
  const fields: AirtableLead = {
    'First Name': booking.firstName,
    'Last Name': booking.lastName,
    Email: booking.email,
    ...(booking.phone && { Phone: booking.phone }),
    'Room Type': booking.roomType,
    'Style Profile': booking.styleProfile,
    'Budget Range': booking.budgetRange,
    Timeline: 'Not specified',
    'Financing Interest': false,
    'Household Type': '',
    'Quiz Completed': false,
    'Appointment Booked': true,
    'Lead Source': 'Direct Booking',
    'Date Submitted': new Date().toISOString(),
    ...(booking.notes && { Notes: booking.notes }),
  }

  const record = await base(LEADS_TABLE).create(fields)
  return record.getId()
}

// ─── Admin: fetch today's leads ───────────────────────────────────────────────

export async function getTodaysLeads(): Promise<AirtableLead[]> {
  const base = getBase()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const records = await base(LEADS_TABLE)
    .select({
      filterByFormula: `IS_SAME({Date Submitted}, "${today}", 'day')`,
      sort: [{ field: 'Date Submitted', direction: 'desc' }],
    })
    .all()

  return records.map((r) => r.fields as unknown as AirtableLead)
}

// ─── Admin: fetch all leads with pagination ───────────────────────────────────

export async function getAllLeads(limit = 100): Promise<AirtableLead[]> {
  const base = getBase()

  const records = await base(LEADS_TABLE)
    .select({
      maxRecords: limit,
      sort: [{ field: 'Date Submitted', direction: 'desc' }],
    })
    .all()

  return records.map((r) => r.fields as unknown as AirtableLead)
}

// ─── Admin: stats ─────────────────────────────────────────────────────────────

export async function getLeadStats() {
  const base = getBase()

  const [allRecords, appointmentRecords] = await Promise.all([
    base(LEADS_TABLE).select({ fields: ['Quiz Completed', 'Appointment Booked', 'Date Submitted'] }).all(),
    base(LEADS_TABLE)
      .select({ filterByFormula: '{Appointment Booked} = TRUE()', fields: ['Email'] })
      .all(),
  ])

  const total = allRecords.length
  const quizCompleted = allRecords.filter((r) => r.fields['Quiz Completed']).length
  const appointmentsBooked = appointmentRecords.length

  const today = new Date().toISOString().split('T')[0]
  const todayLeads = allRecords.filter((r) => {
    const submitted = r.fields['Date Submitted'] as string | undefined
    return submitted?.startsWith(today)
  }).length

  return {
    total,
    quizCompleted,
    quizCompletionRate: total > 0 ? Math.round((quizCompleted / total) * 100) : 0,
    appointmentsBooked,
    appointmentRate: total > 0 ? Math.round((appointmentsBooked / total) * 100) : 0,
    todayLeads,
  }
}
