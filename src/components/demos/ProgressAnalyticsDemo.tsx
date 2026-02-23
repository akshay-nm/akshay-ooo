'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DailyUpdate {
  day: string
  planned: number
  actual: number
  note: string
}

const DAILY_UPDATES: DailyUpdate[] = [
  { day: 'Mon', planned: 12, actual: 12, note: 'Foundation pour completed on schedule' },
  { day: 'Tue', planned: 25, actual: 22, note: 'Rebar delivery delayed by 3 hours' },
  { day: 'Wed', planned: 38, actual: 30, note: 'Rain halted work for half day' },
  { day: 'Thu', planned: 50, actual: 42, note: 'Extra crew deployed to catch up' },
  { day: 'Fri', planned: 62, actual: 58, note: 'Formwork setup ahead of estimate' },
  { day: 'Sat', planned: 70, actual: 68, note: 'Weekend crew — near target' },
]

const BAR_HEIGHT = 100

export function ProgressAnalyticsDemo() {
  const [revealedCount, setRevealedCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showVariance, setShowVariance] = useState(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setRevealedCount(0)
    setShowVariance(false)

    for (let i = 1; i <= DAILY_UPDATES.length; i++) {
      await delay(600)
      setRevealedCount(i)
    }

    await delay(600)
    setShowVariance(true)

    await delay(2000)
    setIsRunning(false)
  }

  const currentUpdate = revealedCount > 0 ? DAILY_UPDATES[revealedCount - 1] : null
  const variance = currentUpdate ? currentUpdate.actual - currentUpdate.planned : 0

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Progress Analytics</h3>
        {showVariance && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-xs font-medium px-2 py-1 rounded ${
              variance >= 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {variance >= 0 ? 'On Track' : `${Math.abs(variance)}% Behind`}
          </motion.span>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 mb-6">
        {/* Chart */}
        <div className="flex items-end gap-3 mb-4" style={{ height: BAR_HEIGHT + 20 }}>
          {DAILY_UPDATES.map((update, index) => {
            const isRevealed = index < revealedCount
            const plannedHeight = (update.planned / 100) * BAR_HEIGHT
            const actualHeight = (update.actual / 100) * BAR_HEIGHT
            const isBehind = update.actual < update.planned

            return (
              <div key={update.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: BAR_HEIGHT }}>
                  {/* Planned bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isRevealed ? plannedHeight : 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-3 bg-slate-200 rounded-t"
                  />
                  {/* Actual bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isRevealed ? actualHeight : 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className={`w-3 rounded-t ${
                      showVariance && isBehind ? 'bg-amber-400' : 'bg-blue-400'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{update.day}</span>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-slate-200 rounded" />
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded" />
            <span>Actual</span>
          </div>
          {showVariance && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-400 rounded" />
              <span>Behind</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Daily update feed */}
      <AnimatePresence>
        {currentUpdate && (
          <motion.div
            key={revealedCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 bg-white rounded-lg border border-slate-200"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-700">
                Daily Update — {currentUpdate.day}
              </span>
              <span className="text-[10px] text-slate-400">
                {currentUpdate.actual}% complete
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUpdate.note}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {revealedCount === 0 && 'Click to simulate daily progress updates flowing in'}
        {revealedCount > 0 && revealedCount < DAILY_UPDATES.length && `Day ${revealedCount} of ${DAILY_UPDATES.length} — updates feed into analytics in real-time`}
        {revealedCount === DAILY_UPDATES.length && !showVariance && 'All updates received, computing variance analysis...'}
        {showVariance && 'Planned vs actual comparison reveals delays and enables corrective action'}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Receiving updates...' : 'Simulate Daily Updates'}
      </button>
    </div>
  )
}
