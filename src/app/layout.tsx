import '@/styles/tailwind.css'
import { Navigation } from '@/components/Navigation'

export const metadata = {
  title: 'Akshay Kumar - Full-Stack Engineer',
  description: 'Full-stack engineer specializing in accounting systems and financial infrastructure.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  )
}
