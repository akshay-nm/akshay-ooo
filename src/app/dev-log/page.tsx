'use client'

import React from 'react'
import { motion } from 'framer-motion'

type Entry = {
  date: string
  title: string
  content: React.ReactNode
  tags: string[]
}

const entries: Entry[] = [
  {
    date: '2026-03-08',
    title: 'AI Chat Resolution System — Before vs After',
    content: (
      <>
        <p className="mb-4">
          Shipped a major overhaul of the chat resolution system. Started with a basic single-pass LLM classifier
          and ~30 atomic intent schemas. Ended up rebuilding most of the pipeline.
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Before</h3>
          <ul className="space-y-1 text-sm text-slate-500">
            <li>Single-pass LLM classifier (classify + extract in one call)</li>
            <li>Sequential MCP tool execution, no custom logic</li>
            <li>No disambiguation for <code className="bg-slate-100 px-1 rounded text-xs">db_lookup</code> slots — multi-option results were a dead end</li>
            <li>No way for user to correct mid-flow values</li>
            <li>No precondition validation before execution</li>
            <li>State always cleared after execution, success or failure</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">After</h3>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-700">1. Two-Pass Classifier</div>
              <p className="text-sm text-slate-500 mt-1">
                Pass 1 classifies intent + confidence. Pass 2 extracts values using the correct field names
                from the schema, with description hints. LLM no longer invents field names or confuses slot
                semantics — extraction accuracy is significantly better.
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">2. db_lookup Disambiguation</div>
              <p className="text-sm text-slate-500 mt-1">
                Pending options persisted across turns. Step 4.5 matches user replies via exact name,
                numeric pick (&quot;2&quot;), or partial string. Previously &quot;Which template did you mean?
                1. Foundation 2. Superstructure&quot; was a dead end — now the user says &quot;1&quot; and it resolves.
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">3. Handler / Precondition System</div>
              <p className="text-sm text-slate-500 mt-1">
                <code className="bg-slate-100 px-1 rounded text-xs">ExecutionStep.handler</code> — custom async function runs instead of MCP call.{' '}
                <code className="bg-slate-100 px-1 rounded text-xs">PreconditionError</code> aborts with a user-facing message.
                Orchestrator preserves state so user can fix and retry. Domain rules enforced before writes —{' '}
                <code className="bg-slate-100 px-1 rounded text-xs">set_leaf_activity_duration</code> validates leaf status + durationMode
                across all assets in one pass, surfaces all violations at once.
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">4. New Intents</div>
              <div className="mt-2 rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-1.5 text-left font-semibold text-slate-700">Intent</th>
                      <th className="px-3 py-1.5 text-left font-semibold text-slate-700">What it does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-3 py-1.5 font-mono text-slate-600">add_multiple_activity_definitions</td>
                      <td className="px-3 py-1.5 text-slate-500">Batch-add from &quot;Excavation 5d, PCC 3d, Curing 2d&quot;</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-mono text-slate-600">set_leaf_activity_duration</td>
                      <td className="px-3 py-1.5 text-slate-500">Set duration on leaf instances with precondition checks</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-mono text-slate-600">bulk_create_assets</td>
                      <td className="px-3 py-1.5 text-slate-500">Redesigned — startNumber/endNumber instead of ambiguous string</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">5. New MCP Tool</div>
              <p className="text-sm text-slate-500 mt-1">
                <code className="bg-slate-100 px-1 rounded text-xs">update_activity_instance</code> — fills the gap where definitions had
                full CRUD but instances had no update tool. Updates duration, durationMode, displayName, quantity via saveEntity.
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">6. Classifier Disambiguation Rules</div>
              <p className="text-sm text-slate-500 mt-1">
                Asset vs asset type examples (prevents misclassification). Single vs multi-activity detection.
                Duration-related message examples. Prerequisite suggestions when db_lookup returns empty.
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">7. Orchestrator Hardening</div>
              <p className="text-sm text-slate-500 mt-1">
                <code className="bg-slate-100 px-1 rounded text-xs">resolveIntent</code> receives {'{ message }'} for disambiguation.
                State preserved on precondition failure.
                SSE events: <code className="bg-slate-100 px-1 rounded text-xs">resolution_progress</code> +{' '}
                <code className="bg-slate-100 px-1 rounded text-xs">resolution_complete</code> with next-step suggestions.
                FE renders suggestion chips per intent.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm text-emerald-800">
            <strong>72 tests across 8 suites — all passing.</strong> Covers two-pass behavior, disambiguation,
            multi-turn resume, state serialization round-trips, and execution plans.
          </p>
        </div>
      </>
    ),
    tags: ['ai', 'architecture'],
  },
  {
    date: '2026-03-08',
    title: 'TCP sequence numbers click',
    content:
      'Built an interactive demo for TCP sequence numbers today. The key insight: sequence numbers aren\'t just counters — they\'re byte offsets. When a receiver sends ACK 1001, it means "I have everything up to byte 1000, send me 1001 next." Duplicate ACKs (3 of them) trigger fast retransmit without waiting for the full timeout.',
    tags: ['networking', 'tcp'],
  },
  {
    date: '2026-03-07',
    title: 'Framer Motion stagger pattern',
    content:
      'Found a clean pattern for staggering child animations in Framer Motion. Instead of manually calculating delays, use `transition={{ delay: index * 0.05 }}` on mapped items. Feels much more natural than CSS animation-delay. Also learned that `whileInView` with `viewport={{ once: true }}` prevents re-triggering on scroll.',
    tags: ['react', 'animation'],
  },
  {
    date: '2026-03-05',
    title: 'Tailwind v4 @theme directive',
    content:
      'Migrated from Tailwind v3 to v4. The new `@import "tailwindcss"` replaces the old directives. Custom colors now go in `@theme` blocks in CSS instead of tailwind.config. Typography plugin still works the same way — just `@plugin "@tailwindcss/typography"` in your CSS.',
    tags: ['tailwind', 'css'],
  },
]

const NOTE_COLORS = [
  'bg-yellow-50 border-yellow-200/60',
  'bg-pink-50 border-pink-200/60',
  'bg-blue-50 border-blue-200/60',
  'bg-green-50 border-green-200/60',
]

// Deterministic pseudo-random rotation per entry (avoids hydration mismatch)
function seededRotation(index: number) {
  const x = Math.sin(index * 9301 + 4927) * 49297
  return ((x - Math.floor(x)) * 6 - 3) // range: -3 to 3 degrees
}

const TAG_COLORS: Record<string, string> = {
  ai: 'bg-yellow-100/80 text-yellow-700',
  architecture: 'bg-yellow-100/80 text-yellow-700',
  networking: 'bg-pink-100/80 text-pink-700',
  tcp: 'bg-pink-100/80 text-pink-700',
  react: 'bg-blue-100/80 text-blue-700',
  animation: 'bg-blue-100/80 text-blue-700',
  tailwind: 'bg-green-100/80 text-green-700',
  css: 'bg-green-100/80 text-green-700',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function DevLogPage() {
  return (
    <article className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Dev Log
          </h1>
          <p className="text-lg text-slate-500">
            Things I learned, patterns I found, bugs I squashed.
          </p>
        </motion.header>

        <div className="space-y-8">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.date + entry.title}
              initial={{ opacity: 0, y: 16, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: seededRotation(i) }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`rounded-sm border p-6 shadow-sm hover:shadow-md transition-shadow ${NOTE_COLORS[i % NOTE_COLORS.length]}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <time className="text-xs font-medium text-slate-400 tabular-nums">
                  {formatDate(entry.date)}
                </time>
                <div className="flex gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${TAG_COLORS[tag] || 'bg-slate-100 text-slate-500'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {entry.title}
              </h2>
              {typeof entry.content === 'string' ? (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {entry.content}
                </p>
              ) : (
                <div className="text-sm text-slate-600 leading-relaxed">
                  {entry.content}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </article>
  )
}
