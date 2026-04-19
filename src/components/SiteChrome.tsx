'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './Navigation'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/terminal')) {
    return <>{children}</>
  }
  return (
    <>
      <Navigation />
      <main className="pt-20">{children}</main>
    </>
  )
}
