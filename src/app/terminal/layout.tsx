import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './terminal.css'

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'akshay.ooo / terminal',
  description: 'akshay — terminal portfolio',
}

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={`terminal-scope ${mono.variable}`}>{children}</div>
}
