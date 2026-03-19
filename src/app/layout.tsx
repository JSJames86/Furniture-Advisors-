import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Janelle Glanville · Trusted Furniture Advisor · Ashley HomeStore',
  description:
    'Personalized furniture design experience for Union & Essex County, NJ. Take the style quiz and book a free consultation with Janelle Glanville.',
  keywords: [
    'furniture advisor',
    'Ashley HomeStore',
    'Union County NJ',
    'Essex County NJ',
    'interior design',
    'furniture consultation',
  ],
  openGraph: {
    title: 'Janelle Glanville · Furniture Advisor',
    description: 'Luxury furniture advisory service for Union & Essex County, NJ',
    url: 'https://furnitureadvisory.co',
    siteName: 'FurnitureAdvisory.co',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="bg-warm-white font-body text-charcoal antialiased">{children}</body>
    </html>
  )
}
