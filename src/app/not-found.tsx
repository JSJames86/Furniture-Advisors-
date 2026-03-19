import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-warm-white flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs tracking-widest uppercase text-gold mb-4">404</p>
        <h1 className="font-display text-5xl text-charcoal mb-4">Page Not Found</h1>
        <p className="text-warm-gray text-sm mb-8">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link href="/" className="btn-gold">
          Return Home
        </Link>
      </div>
    </main>
  )
}
