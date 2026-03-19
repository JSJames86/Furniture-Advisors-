import { NextRequest, NextResponse } from 'next/server'
import { getAllLeads } from '@/lib/airtable'
import type { AirtableLead } from '@/types'

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password')
  return password === process.env.ADMIN_PASSWORD
}

function toCSV(leads: AirtableLead[]): string {
  if (leads.length === 0) return ''

  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Room Type',
    'Style Profile',
    'Budget Range',
    'Timeline',
    'Financing Interest',
    'Household Type',
    'Quiz Completed',
    'Appointment Booked',
    'Lead Source',
    'Date Submitted',
    'Notes',
  ]

  const rows = leads.map((lead) =>
    [
      lead['First Name'],
      lead['Last Name'],
      lead['Email'],
      lead['Phone'] ?? '',
      lead['Room Type'],
      lead['Style Profile'],
      lead['Budget Range'],
      lead['Timeline'],
      lead['Financing Interest'] ? 'Yes' : 'No',
      lead['Household Type'],
      lead['Quiz Completed'] ? 'Yes' : 'No',
      lead['Appointment Booked'] ? 'Yes' : 'No',
      lead['Lead Source'],
      lead['Date Submitted'],
      lead['Notes'] ?? '',
    ]
      .map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`)
      .join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const leads = await getAllLeads(1000)
    const csv = toCSV(leads)
    const date = new Date().toISOString().split('T')[0]

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="furniture-advisory-leads-${date}.csv"`,
      },
    })
  } catch (error) {
    console.error('[admin/export] Error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
