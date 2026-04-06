import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { bookAppointment } from '@/lib/airtable'
import { sendAppointmentConfirmation } from '@/lib/email/resend'
import { sendSMS, appointmentReminderSMS } from '@/lib/twilio'
import type { StyleProfile } from '@/types'

// ─── Validation schema ────────────────────────────────────────────────────────

const BookingSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  styleProfile: z.enum([
    'modern-luxe',
    'warm-traditional',
    'coastal-serene',
    'urban-glam',
    'rustic-refined',
  ]).optional(),
  budgetRange: z.string().min(1),
  roomType: z.string().min(1),
  notes: z.string().optional(),
  leadSource: z.string().optional(),
  // Optional Calendly webhook fields
  calendlyEventUri: z.string().url().optional(),
  calendlyInviteeUri: z.string().url().optional(),
})

// ─── POST /api/book-appointment ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = BookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const booking = parsed.data

    // Save to Airtable (upsert by email)
    const recordId = await bookAppointment(booking)

    // Send appointment confirmation email — wrapped so email failure doesn't break booking
    try {
      await sendAppointmentConfirmation({
        to: booking.email,
        firstName: booking.firstName,
        styleProfile: (booking.styleProfile ?? 'modern-luxe') as StyleProfile,
      })
    } catch (emailErr) {
      console.error('[book-appointment] Email failed (booking still saved):', emailErr)
    }

    // Optional: SMS reminder via Twilio — wrapped so SMS failure doesn't break booking
    if (booking.phone) {
      try {
        const calendlyUrl = process.env.CALENDLY_EVENT_URL ?? 'https://calendly.com/janelleglanville'
        await sendSMS({
          to: booking.phone,
          body: appointmentReminderSMS(booking.firstName, calendlyUrl),
        })
      } catch (smsErr) {
        console.error('[book-appointment] SMS failed (booking still saved):', smsErr)
      }
    }

    return NextResponse.json({
      success: true,
      recordId,
      message: `Appointment booked for ${booking.firstName}. Confirmation sent to ${booking.email}.`,
    })
  } catch (error) {
    console.error('[book-appointment] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}

// ─── POST /api/book-appointment/calendly-webhook ──────────────────────────────
// Separate sub-route handled in /api/calendly-webhook for Calendly event.invitee.created

export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/book-appointment' })
}
