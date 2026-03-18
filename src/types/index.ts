// ─── Style Profiles ───────────────────────────────────────────────────────────

export type StyleProfile =
  | 'modern-luxe'
  | 'warm-traditional'
  | 'coastal-serene'
  | 'urban-glam'
  | 'rustic-refined'

export const STYLE_PROFILE_LABELS: Record<StyleProfile, string> = {
  'modern-luxe': 'Modern Luxe',
  'warm-traditional': 'Warm Traditional',
  'coastal-serene': 'Coastal Serene',
  'urban-glam': 'Urban Glam',
  'rustic-refined': 'Rustic Refined',
}

// ─── Quiz Submission ──────────────────────────────────────────────────────────

export interface QuizSubmission {
  // Contact
  firstName: string
  lastName: string
  email: string
  phone?: string

  // Room details
  roomType: string
  roomLength?: number
  roomWidth?: number

  // Style
  styleProfile: StyleProfile

  // Budget & timeline
  budgetRange: string
  timeline: string
  financingInterest: boolean

  // Household
  householdType: string[] // ['pets', 'kids', 'neither']

  // Source
  leadSource?: string
  notes?: string
}

// ─── Appointment Booking ──────────────────────────────────────────────────────

export interface AppointmentBooking {
  firstName: string
  lastName: string
  email: string
  phone?: string
  styleProfile: StyleProfile
  budgetRange: string
  roomType: string
  notes?: string
  calendlyEventUri?: string
  calendlyInviteeUri?: string
}

// ─── Airtable Lead Record ─────────────────────────────────────────────────────

export interface AirtableLead {
  'First Name': string
  'Last Name': string
  Email: string
  Phone?: string
  'Room Type': string
  'Room Length'?: number
  'Room Width'?: number
  'Style Profile': string
  'Budget Range': string
  Timeline: string
  'Financing Interest': boolean
  'Household Type': string
  'Quiz Completed': boolean
  'Appointment Booked': boolean
  'Lead Source': string
  'Date Submitted': string
  Notes?: string
}

// ─── Email Sequence ────────────────────────────────────────────────────────────

export interface EmailSequencePayload {
  to: string
  firstName: string
  styleProfile: StyleProfile
  budgetRange: string
  householdType: string[]
  roomType: string
}

// ─── Furniture Recommendation ─────────────────────────────────────────────────

export interface FurnitureItem {
  name: string
  collection: string
  description: string
  priceRange: string
  imageUrl: string
  shopUrl: string
  tags: string[]
}

// ─── Style Profile Data ───────────────────────────────────────────────────────

export interface StyleProfileData {
  slug: StyleProfile
  label: string
  tagline: string
  description: string
  colorPalette: string[]
  keywords: string[]
  lifestyleNote: string
  lifestyleNoteWithPets: string
  lifestyleNoteWithKids: string
  recommendations: FurnitureItem[]
}
