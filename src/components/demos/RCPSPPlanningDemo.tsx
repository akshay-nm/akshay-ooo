'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Activity {
  id: string
  label: string
  structure: string
  start: number
  duration: number
  dependencies: string[]
  resources: string[]
  isCritical?: boolean
}

const ACTIVITIES: Activity[] = [
  { id: 'A1', label: 'Foundation A', structure: 'Pillar A', start: 0, duration: 3, dependencies: [], resources: ['Crane 1', 'Crew A'], isCritical: true },
  { id: 'A2', label: 'Rebar A', structure: 'Pillar A', start: 3, duration: 2, dependencies: ['A1'], resources: ['Crew A'], isCritical: true },
  { id: 'A3', label: 'Column A', structure: 'Pillar A', start: 5, duration: 4, dependencies: ['A2'], resources: ['Crane 1', 'Crew A'], isCritical: true },
  { id: 'B1', label: 'Foundation B', structure: 'Pillar B', start: 1, duration: 3, dependencies: [], resources: ['Crane 2', 'Crew B'] },
  { id: 'B2', label: 'Rebar B', structure: 'Pillar B', start: 4, duration: 2, dependencies: ['B1'], resources: ['Crew B'] },
  { id: 'D1', label: 'Formwork', structure: 'Deck Span', start: 5, duration: 2, dependencies: ['A2', 'B2'], resources: ['Crane 1', 'Crew C'] },
  { id: 'D2', label: 'Deck Pour', structure: 'Deck Span', start: 9, duration: 3, dependencies: ['A3', 'D1'], resources: ['Crane 1', 'Crane 2', 'Crew A', 'Crew C'], isCritical: true },
]

const TOTAL_DAYS = 12
const STRUCTURE_COLORS: Record<string, { bar: string; barCritical: string; text: string }> = {
  'Pillar A': { bar: 'bg-blue-300', barCritical: 'bg-blue-500', text: 'text-blue-700' },
  'Pillar B': { bar: 'bg-emerald-300', barCritical: 'bg-emerald-500', text: 'text-emerald-700' },
  'Deck Span': { bar: 'bg-orange-300', barCritical: 'bg-orange-500', text: 'text-orange-700' },
}

export function RCPSPPlanningDemo() {
  const [revealedCount, setRevealedCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showDependencies, setShowDependencies] = useState(false)
  const [highlightCritical, setHighlightCritical] = useState(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setRevealedCount(0)
    setShowDependencies(false)
    setHighlightCritical(false)

    for (let i = 1; i <= ACTIVITIES.length; i++) {
      await delay(400)
      setRevealedCount(i)
    }

    await delay(600)
    setShowDependencies(true)

    await delay(800)
    setHighlightCritical(true)

    await delay(1500)
    setIsRunning(false)
  }

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">RCPSP Schedule — CPM</h3>
        <div className="flex items-center gap-2">
          {highlightCritical && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-red-100 text-red-700"
            >
              Critical Path
            </motion.span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Day headers */}
          <div className="flex items-center mb-4">
            <div className="w-28 shrink-0" />
            <div className="flex-1 flex">
              {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
                <div key={i} className="flex-1 text-center text-[10px] text-slate-400 font-medium">
                  D{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Activity rows */}
          <div className="space-y-2">
            {ACTIVITIES.map((activity, index) => {
              const isRevealed = index < revealedCount
              const colors = STRUCTURE_COLORS[activity.structure]
              const isCriticalHighlighted = highlightCritical && activity.isCritical

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isRevealed ? 1 : 0.15 }}
                  className="flex items-center"
                >
                  <div className="w-28 shrink-0 pr-3">
                    <div className="text-xs font-medium text-slate-700 truncate">{activity.label}</div>
                    <div className={`text-[10px] ${colors.text}`}>{activity.structure}</div>
                  </div>
                  <div className="flex-1 relative h-7">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
                        <div key={i} className="flex-1 border-l border-slate-100" />
                      ))}
                    </div>

                    {/* Bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: isRevealed ? `${(activity.duration / TOTAL_DAYS) * 100}%` : 0,
                      }}
                      transition={{ duration: 0.4 }}
                      className={`absolute top-1 h-5 rounded ${
                        isCriticalHighlighted ? colors.barCritical : colors.bar
                      } ${isCriticalHighlighted ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}
                      style={{ left: `${(activity.start / TOTAL_DAYS) * 100}%` }}
                    >
                      <div className="flex items-center h-full px-2">
                        <span className="text-[10px] font-medium text-white truncate">
                          {activity.id}
                        </span>
                      </div>
                    </motion.div>

                    {/* Dependency arrows */}
                    {showDependencies && activity.dependencies.map((depId) => {
                      const dep = ACTIVITIES.find((a) => a.id === depId)
                      if (!dep) return null
                      const fromX = ((dep.start + dep.duration) / TOTAL_DAYS) * 100
                      const toX = (activity.start / TOTAL_DAYS) * 100

                      return (
                        <motion.div
                          key={`${depId}-${activity.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          className="absolute top-3 h-0.5 bg-slate-400"
                          style={{
                            left: `${fromX}%`,
                            width: `${toX - fromX}%`,
                          }}
                        >
                          <div className="absolute right-0 -top-1 text-slate-400 text-[8px]">
                            &#9654;
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Resource conflicts note */}
          {highlightCritical && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2"
            >
              <span className="text-[10px] text-slate-500">
                Crane 1 shared between Pillar A and Deck Span — scheduling resolves resource conflict
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {revealedCount === 0 && 'Click to build the project schedule'}
        {revealedCount > 0 && revealedCount < ACTIVITIES.length && `Scheduling activity ${revealedCount} of ${ACTIVITIES.length}...`}
        {revealedCount === ACTIVITIES.length && !showDependencies && 'All activities scheduled, resolving dependencies...'}
        {showDependencies && !highlightCritical && 'Dependencies mapped, identifying critical path...'}
        {highlightCritical && 'Critical path identified — any delay here delays the entire project'}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Scheduling...' : 'Build Schedule'}
      </button>
    </div>
  )
}
