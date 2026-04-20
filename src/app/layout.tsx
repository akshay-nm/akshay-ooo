import type { Metadata, Viewport } from 'next'
import { SiteChrome } from '@/components/SiteChrome'
import './globals.css'

export const metadata: Metadata = {
  title: 'Akshay Kumar - Full-Stack Engineer',
  description: 'Full-stack engineer specializing in accounting systems and financial infrastructure.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white antialiased">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
