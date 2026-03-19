import { NextRequest, NextResponse } from 'next/server'
import { getLeadStats, getAllLeads } from '@/lib/airtable'

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password')
  return password === process.env.ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [stats, leads] = await Promise.all([getLeadStats(), getAllLeads(200)])
    return NextResponse.json({ stats, leads })
  } catch (error) {
    console.error('[admin/stats] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
