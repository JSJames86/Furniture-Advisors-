'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AirtableLead } from '@/types'

interface Stats {
  total: number
  quizCompleted: number
  quizCompletionRate: number
  appointmentsBooked: number
  appointmentRate: number
  todayLeads: number
}

interface AdminData {
  stats: Stats
  leads: AirtableLead[]
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-warm-white border border-[#E8E3DC] p-6">
      <p className="text-xs tracking-widest uppercase text-warm-gray mb-2">{label}</p>
      <p className="font-display text-4xl text-charcoal">{value}</p>
      {sub && <p className="text-xs text-warm-gray mt-1">{sub}</p>}
    </div>
  )
}

// ─── Admin page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterProfile, setFilterProfile] = useState('')
  const [filterBooked, setFilterBooked] = useState('')

  const fetchData = useCallback(async (pw: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pw },
      })
      if (res.status === 401) {
        setAuthError('Incorrect password.')
        setAuthed(false)
        return
      }
      const json = await res.json()
      setData(json)
      setAuthed(true)
      setAuthError('')
    } catch {
      setAuthError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData(password)
  }

  const handleExport = async () => {
    const res = await fetch('/api/admin/export', {
      headers: { 'x-admin-password': password },
    })
    if (!res.ok) return alert('Export failed.')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredLeads = data?.leads.filter((lead) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      lead['First Name']?.toLowerCase().includes(q) ||
      lead['Last Name']?.toLowerCase().includes(q) ||
      lead['Email']?.toLowerCase().includes(q)
    const matchProfile = !filterProfile || lead['Style Profile'] === filterProfile
    const matchBooked =
      !filterBooked ||
      (filterBooked === 'yes' ? lead['Appointment Booked'] : !lead['Appointment Booked'])
    return matchSearch && matchProfile && matchBooked
  })

  // Auto-refresh every 60s when authenticated
  useEffect(() => {
    if (!authed || !password) return
    const id = setInterval(() => fetchData(password), 60_000)
    return () => clearInterval(id)
  }, [authed, password, fetchData])

  // ── Login screen ──
  if (!authed) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest uppercase text-gold mb-3">Furniture Advisory</p>
            <h1 className="font-display text-3xl text-charcoal">Admin Dashboard</h1>
            <p className="text-warm-gray text-sm mt-2">Janelle Glanville · FurnitureAdvisory.co</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8E3DC] bg-warm-white text-charcoal text-sm focus:outline-none focus:border-gold"
            />
            {authError && (
              <p className="text-red-500 text-xs">{authError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold disabled:opacity-50"
            >
              {loading ? 'Logging in…' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  // ── Dashboard ──
  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-charcoal border-b-2 border-gold px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-gold mb-1">Admin Dashboard</p>
          <h1 className="font-display text-2xl text-warm-white">Janelle Glanville</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleExport} className="btn-outline-gold text-xs border-gold text-gold hover:bg-gold hover:text-warm-white transition-all duration-200 px-5 py-2">
            Export CSV
          </button>
          <button
            onClick={() => { setAuthed(false); setData(null) }}
            className="text-xs text-warm-gray tracking-widest uppercase hover:text-gold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Stats */}
        {data && (
          <section className="mb-10">
            <p className="text-xs tracking-widest uppercase text-warm-gray mb-5">
              Overview · Auto-refreshes every 60s
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Total Leads" value={data.stats.total} />
              <StatCard label="Today" value={data.stats.todayLeads} />
              <StatCard
                label="Quiz Completions"
                value={data.stats.quizCompleted}
                sub={`${data.stats.quizCompletionRate}% rate`}
              />
              <StatCard
                label="Appointments"
                value={data.stats.appointmentsBooked}
                sub={`${data.stats.appointmentRate}% rate`}
              />
              <StatCard
                label="Completion Rate"
                value={`${data.stats.quizCompletionRate}%`}
              />
              <StatCard
                label="Booking Rate"
                value={`${data.stats.appointmentRate}%`}
              />
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-[#E8E3DC] bg-warm-white text-sm text-charcoal focus:outline-none focus:border-gold w-64"
          />
          <select
            value={filterProfile}
            onChange={(e) => setFilterProfile(e.target.value)}
            className="px-4 py-2 border border-[#E8E3DC] bg-warm-white text-sm text-charcoal focus:outline-none focus:border-gold"
          >
            <option value="">All Profiles</option>
            <option value="modern-luxe">Modern Luxe</option>
            <option value="warm-traditional">Warm Traditional</option>
            <option value="coastal-serene">Coastal Serene</option>
            <option value="urban-glam">Urban Glam</option>
            <option value="rustic-refined">Rustic Refined</option>
          </select>
          <select
            value={filterBooked}
            onChange={(e) => setFilterBooked(e.target.value)}
            className="px-4 py-2 border border-[#E8E3DC] bg-warm-white text-sm text-charcoal focus:outline-none focus:border-gold"
          >
            <option value="">All Appointments</option>
            <option value="yes">Booked</option>
            <option value="no">Not Booked</option>
          </select>
          {filteredLeads && (
            <span className="text-xs text-warm-gray ml-auto">
              {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
            </span>
          )}
        </section>

        {/* Leads table */}
        {loading && (
          <div className="text-center py-16 text-warm-gray text-sm">Loading…</div>
        )}
        {!loading && filteredLeads && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gold">
                  {['Name', 'Email', 'Phone', 'Style Profile', 'Room', 'Budget', 'Timeline', 'Quiz', 'Booked', 'Date'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-3 text-xs tracking-widest uppercase text-warm-gray font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, i) => (
                  <tr
                    key={`${lead['Email']}-${i}`}
                    className="border-b border-[#E8E3DC] hover:bg-warm-white transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-charcoal whitespace-nowrap">
                      {lead['First Name']} {lead['Last Name']}
                    </td>
                    <td className="py-3 px-3 text-warm-gray">{lead['Email']}</td>
                    <td className="py-3 px-3 text-warm-gray whitespace-nowrap">
                      {lead['Phone'] ?? '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-1 text-xs bg-[#FAF5EC] text-gold border border-gold-light">
                        {lead['Style Profile']}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-warm-gray whitespace-nowrap">
                      {lead['Room Type']}
                    </td>
                    <td className="py-3 px-3 text-warm-gray whitespace-nowrap">
                      {lead['Budget Range']}
                    </td>
                    <td className="py-3 px-3 text-warm-gray whitespace-nowrap">
                      {lead['Timeline']}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {lead['Quiz Completed'] ? (
                        <span className="text-green-600 text-base">✓</span>
                      ) : (
                        <span className="text-[#E8E3DC]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {lead['Appointment Booked'] ? (
                        <span className="text-gold text-base font-semibold">✓</span>
                      ) : (
                        <span className="text-[#E8E3DC]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-warm-gray whitespace-nowrap">
                      {lead['Date Submitted']
                        ? new Date(lead['Date Submitted']).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-warm-gray text-sm">
                      No leads match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
