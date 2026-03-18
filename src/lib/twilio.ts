// ─── Twilio SMS (optional) ────────────────────────────────────────────────────
// Only loaded when TWILIO_ACCOUNT_SID is set in environment.

interface SMSParams {
  to: string
  body: string
}

export async function sendSMS({ to, body }: SMSParams): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_FROM_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('[twilio] SMS skipped — TWILIO env vars not set')
    return
  }

  // Dynamic import to avoid bundling Twilio when not in use
  const twilio = await import('twilio')
  const client = twilio.default(accountSid, authToken)

  await client.messages.create({
    body,
    from: fromNumber,
    to,
  })
}

export function appointmentReminderSMS(firstName: string, calendlyUrl: string): string {
  return (
    `Hi ${firstName}! This is Janelle Glanville, your Ashley HomeStore furniture advisor. ` +
    `Just a reminder about your upcoming consultation — I'm looking forward to meeting you! ` +
    `View your appointment: ${calendlyUrl}`
  )
}
