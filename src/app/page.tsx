import { redirect } from 'next/navigation'

/**
 * Root Next.js route — redirects to the static marketing site.
 * The existing index.html lives at the repo root and is served by Vercel
 * as a static file from the public directory, or directly via the CDN.
 *
 * If you want this Next.js app to host the full site, move index.html
 * contents here as a proper React component.
 */
export default function Home() {
  redirect('https://furnitureadvisory.co')
}
