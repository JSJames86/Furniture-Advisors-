import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLeadFromQuiz } from '@/lib/airtable'
import { triggerEmailSequence } from '@/lib/email/resend'
import { getProfileData } from '@/lib/style-profiles'
import type { StyleProfile } from '@/types'

// ─── Validation schema ────────────────────────────────────────────────────────

const QuizSchema = z.object({
  // Contact
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),

  // Room
  roomType: z.string().min(1, 'Room type is required'),
  roomLength: z.number().positive().optional(),
  roomWidth: z.number().positive().optional(),

  // Style (must be one of the 5 profiles)
  styleProfile: z.enum([
    'modern-luxe',
    'warm-traditional',
    'coastal-serene',
    'urban-glam',
    'rustic-refined',
  ]),

  // Budget & timeline
  budgetRange: z.string().min(1, 'Budget range is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  financingInterest: z.boolean().default(false),

  // Household
  householdType: z.array(z.enum(['pets', 'kids', 'neither'])).default([]),

  // Optional
  leadSource: z.string().optional(),
  notes: z.string().optional(),
})

// ─── POST /api/submit-quiz ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = QuizSchema.safeParse(body)

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

    const submission = parsed.data

    // Save to Airtable — wrapped so DB failure doesn't block the user
    let recordId = ''
    try {
      recordId = await createLeadFromQuiz(submission)
    } catch (dbErr) {
      console.error('[submit-quiz] Airtable save failed:', dbErr)
    }

    // Trigger email sequence — wrapped so email failure doesn't block the user
    try {
      await triggerEmailSequence({
        to: submission.email,
        firstName: submission.firstName,
        styleProfile: submission.styleProfile as StyleProfile,
        budgetRange: submission.budgetRange,
        householdType: submission.householdType,
        roomType: submission.roomType,
      })
    } catch (emailErr) {
      console.error('[submit-quiz] Email sequence failed:', emailErr)
    }

    // Return the profile data so the frontend can redirect/display
    const profileData = getProfileData(submission.styleProfile as StyleProfile)

    return NextResponse.json({
      success: true,
      recordId,
      styleProfile: {
        slug: profileData.slug,
        label: profileData.label,
        tagline: profileData.tagline,
        description: profileData.description,
        resultsUrl: `/results/${profileData.slug}`,
      },
    })
  } catch (error) {
    console.error('[submit-quiz] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}

// ─── GET — health check ───────────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/submit-quiz' })
}
