import { NextRequest, NextResponse } from 'next/server'
import { bookAppointment } from '@/lib/airtable'
import { sendAppointmentConfirmation } from '@/lib/email/resend'
import { sendSMS, appointmentReminderSMS } from '@/lib/twilio'

/**
 * Calendly webhook: event.invitee.created
 * Configure this URL in your Calendly webhook settings:
 *   https://furnitureadvisory.co/api/calendly-webhook
 *
 * Docs: https://developer.calendly.com/api-docs/ZG9jOjM0Njc2NQ-webhook-signatures
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, payload } = body

    if (event !== 'invitee.created') {
      return NextResponse.json({ received: true, skipped: true })
    }

    const invitee = payload?.invitee
    const tracking = payload?.tracking

    if (!invitee?.email || !invitee?.name) {
      return NextResponse.json({ received: true, skipped: true, reason: 'Missing invitee data' })
    }

    const nameParts = (invitee.name as string).trim().split(/\s+/)
    const firstName = nameParts[0] ?? 'Friend'
    const lastName = nameParts.slice(1).join(' ') || ''

    // Determine style profile from UTM or questions_and_answers
    const answers: Array<{ question: string; answer: string }> =
      payload?.questions_and_answers ?? []

    const styleAnswer = answers.find((a) =>
      /style|profile|personality/i.test(a.question)
    )?.answer

    const styleProfile =
      styleAnswer
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z-]/g, '') ?? 'warm-traditional'

    const validProfiles = [
      'modern-luxe',
      'warm-traditional',
      'coastal-serene',
      'urban-glam',
      'rustic-refined',
    ] as const

    type ValidProfile = (typeof validProfiles)[number]
    const resolvedProfile: ValidProfile = validProfiles.includes(styleProfile as ValidProfile)
      ? (styleProfile as ValidProfile)
      : 'warm-traditional'

    const budgetAnswer = answers.find((a) => /budget/i.test(a.question))?.answer ?? 'Not specified'
    const roomAnswer = answers.find((a) => /room/i.test(a.question))?.answer ?? 'Living Room'
    const phone = invitee.phone_number ?? undefined

    // Upsert in Airtable
    await bookAppointment({
      firstName,
      lastName,
      email: invitee.email as string,
      phone,
      styleProfile: resolvedProfile,
      budgetRange: budgetAnswer,
      roomType: roomAnswer,
      notes: `Calendly invitee URI: ${payload?.invitee?.uri ?? ''}`,
      calendlyEventUri: payload?.event?.uri,
      calendlyInviteeUri: invitee.uri,
    })

    // Send confirmation email
    await sendAppointmentConfirmation({
      to: invitee.email as string,
      firstName,
      styleProfile: resolvedProfile,
    })

    // Optional SMS
    if (phone) {
      const calendlyUrl = process.env.CALENDLY_EVENT_URL ?? 'https://calendly.com/janelleglanville'
      await sendSMS({
        to: phone as string,
        body: appointmentReminderSMS(firstName, calendlyUrl),
      })
    }

    return NextResponse.json({ received: true, processed: true })
  } catch (error) {
    console.error('[calendly-webhook] Error:', error)
    // Return 200 so Calendly doesn't retry repeatedly
    return NextResponse.json({ received: true, error: 'Processing failed' })
  }
}
