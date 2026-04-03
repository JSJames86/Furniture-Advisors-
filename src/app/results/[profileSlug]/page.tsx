import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { STYLE_PROFILES } from '@/lib/style-profiles'
import type { StyleProfile } from '@/types'

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return Object.keys(STYLE_PROFILES).map((slug) => ({ profileSlug: slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { profileSlug: string }
}): Promise<Metadata> {
  const profile = STYLE_PROFILES[params.profileSlug as StyleProfile]
  if (!profile) return { title: 'Style Results' }
  return {
    title: `${profile.label} · Your Style Profile · FurnitureAdvisory.co`,
    description: profile.description,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CALENDLY_URL =
  process.env.CALENDLY_EVENT_URL ?? 'https://calendly.com/janelleglanville'
const HIHELLO_URL = 'https://hihello.com/p/1a56532e-99b8-4e8e-8652-168c24c577c8'

export default function ResultsPage({
  params,
  searchParams,
}: {
  params: { profileSlug: string }
  searchParams: { name?: string; pets?: string; kids?: string }
}) {
  const profile = STYLE_PROFILES[params.profileSlug as StyleProfile]
  if (!profile) notFound()

  const firstName = searchParams.name ?? 'Friend'
  const hasPets = searchParams.pets === '1'
  const hasKids = searchParams.kids === '1'

  const lifestyleNote =
    hasPets && hasKids
      ? `${profile.lifestyleNoteWithKids} ${profile.lifestyleNoteWithPets}`
      : hasPets
      ? profile.lifestyleNoteWithPets
      : hasKids
      ? profile.lifestyleNoteWithKids
      : profile.lifestyleNote

  return (
    <main className="min-h-screen bg-warm-white">

      {/* ── Header ── */}
      <header className="bg-charcoal border-b-2 border-gold px-6 py-5 text-center">
        <p className="section-label mb-2">Furniture Advisory</p>
        <p className="font-display text-2xl text-warm-white tracking-wide">Janelle Glanville</p>
        <p className="text-xs tracking-widest uppercase text-warm-gray mt-1">
          Trusted Advisor · Ashley HomeStore · Union &amp; Essex County, NJ
        </p>
      </header>

      {/* ── Profile Hero ── */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="section-label mb-4">
          {firstName !== 'Friend' ? `${firstName}, ` : ''}Your Style Profile
        </p>
        <div className="gold-divider mx-auto" />
        <h1 className="display-heading text-5xl md:text-6xl mt-6 mb-4">{profile.label}</h1>
        <p className="font-display text-xl text-gold-light italic mb-8">{profile.tagline}</p>
        <p className="font-body text-base leading-relaxed text-warm-gray max-w-2xl mx-auto">
          {profile.description}
        </p>
      </section>

      {/* ── Lifestyle Note ── */}
      <section className="bg-charcoal py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label mb-6">A Personal Note</p>
          <p className="font-display text-xl text-warm-white leading-relaxed italic">
            "{lifestyleNote}"
          </p>
          <p className="font-display text-base text-gold mt-6">— Janelle Glanville</p>
        </div>
      </section>

      {/* ── Keywords ── */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="section-label mb-6">Your Style Words</p>
        <div className="flex flex-wrap justify-center gap-3">
          {profile.keywords.map((keyword) => (
            <span
              key={keyword}
              className="px-4 py-2 border border-gold text-gold text-xs tracking-widest uppercase"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>

      {/* ── Curated Recommendations ── */}
      <section className="bg-cream py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-4">Curated For You</p>
            <div className="gold-divider mx-auto" />
            <h2 className="display-heading text-3xl md:text-4xl mt-6">
              Three Pieces I'd Show You First
            </h2>
            <p className="text-warm-gray text-sm mt-4 max-w-xl mx-auto">
              Hand-selected from Ashley HomeStore's current collection to align with your{' '}
              {profile.label} profile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {profile.recommendations.map((item) => (
              <div
                key={item.name}
                className="bg-warm-white border border-[#E8E3DC] flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <p className="section-label mb-2">{item.collection}</p>
                  <h3 className="font-display text-xl text-charcoal mb-3">{item.name}</h3>
                  <p className="text-warm-gray text-sm leading-relaxed flex-1 mb-4">
                    {item.description}
                  </p>
                  <p className="text-charcoal text-sm font-semibold mb-4">{item.priceRange}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs text-warm-gray tracking-wide">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={item.shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold tracking-widest uppercase border-b border-gold-light pb-0.5 hover:text-gold-light transition-colors w-fit"
                  >
                    View Collection →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Book Appointment / Calendly embed ── */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="section-label mb-4">Next Step</p>
        <div className="gold-divider mx-auto" />
        <h2 className="display-heading text-3xl md:text-4xl mt-6 mb-4">
          Let's Build Your Room Together
        </h2>
        <p className="text-warm-gray text-sm leading-relaxed max-w-xl mx-auto mb-8">
          Schedule your free consultation — I'll bring fabric samples, room ideas, and my full
          attention. No pressure, just a real conversation about your home.
        </p>

        {/* Calendly inline embed */}
        <div
          className="calendly-inline-widget w-full overflow-hidden"
          data-url={`${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=B8975A`}
          style={{ minWidth: '320px', height: '700px' }}
        />
        <script
          type="text/javascript"
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        />
      </section>

      {/* ── HiHello Digital Card ── */}
      <section className="bg-charcoal py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label mb-6">Stay Connected</p>
          <h2 className="display-heading text-3xl text-warm-white mb-4">
            Save My Digital Card
          </h2>
          <p className="text-warm-gray text-sm leading-relaxed mb-8">
            Keep my contact details in your phone — so I'm easy to find when you're ready to
            furnish, refresh, or redecorate.
          </p>

          {/* HiHello card embed */}
          <div className="flex justify-center mb-8">
            <iframe
              src={HIHELLO_URL}
              title="Janelle Glanville – Digital Business Card"
              className="w-full max-w-sm rounded-sm border-0"
              style={{ height: '480px' }}
              loading="lazy"
            />
          </div>

          <a
            href={HIHELLO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            Save Janelle's Card
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-charcoal border-t border-[#333330] py-10 px-6 text-center">
        <p className="font-display text-lg text-warm-white mb-1">Janelle Glanville</p>
        <p className="text-xs text-warm-gray tracking-widest uppercase mb-4">
          Trusted Furniture Advisor · Ashley HomeStore
        </p>
        <p className="text-xs text-warm-gray">Serving Union &amp; Essex County, New Jersey</p>
        <div className="flex justify-center gap-6 mt-6">
          <a href="/" className="text-xs text-gold hover:text-gold-light tracking-widest uppercase transition-colors">
            Home
          </a>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:text-gold-light tracking-widest uppercase transition-colors">
            Book a Visit
          </a>
          <a href={HIHELLO_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:text-gold-light tracking-widest uppercase transition-colors">
            My Card
          </a>
        </div>
        <div className="flex justify-center gap-5 mt-6">
          <a href="https://www.instagram.com/furniture_advisors?igsh=dHZoa2lldGFldnlk&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-warm-gray hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.facebook.com/share/1Bu4SXeXFz/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-warm-gray hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@furniture.advisors?_r=1&_t=ZT-95DSwnq1aWb" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-warm-gray hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.54V6.77a4.85 4.85 0 01-1.07-.08z"/></svg>
          </a>
          <a href="mailto:jglanville@ashleyne.com" aria-label="Email" className="text-warm-gray hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </a>
        </div>
        <p className="text-xs text-[#4A4A48] mt-8">
          © {new Date().getFullYear()} FurnitureAdvisory.co · All rights reserved
        </p>
      </footer>

    </main>
  )
}
