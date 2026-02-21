'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TIMEZONES = [
  { id: 'utc', label: 'UTC', offset: 0, city: 'London' },
  { id: 'est', label: 'EST', offset: -5, city: 'New York' },
  { id: 'pst', label: 'PST', offset: -8, city: 'Los Angeles' },
  { id: 'jst', label: 'JST', offset: 9, city: 'Tokyo' },
]

// Transaction at Mar 31, 11:30 PM UTC
const TRANSACTION_UTC_HOUR = 23.5 // 11:30 PM

function getLocalTime(utcHour: number, offset: number): { hour: number; day: 'Mar 31' | 'Apr 1' } {
  let localHour = utcHour + offset
  let day: 'Mar 31' | 'Apr 1' = 'Mar 31'

  if (localHour >= 24) {
    localHour -= 24
    day = 'Apr 1'
  } else if (localHour < 0) {
    localHour += 24
    // Still Mar 31 since we're going back
  }

  return { hour: localHour, day }
}

function formatTime(hour: number): string {
  const h = Math.floor(hour)
  const m = (hour % 1) * 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayHour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function TimezoneDemo() {
  const [currentTimezone, setCurrentTimezone] = useState(TIMEZONES[0])
  const [pendingTimezone, setPendingTimezone] = useState<typeof TIMEZONES[0] | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleTimezoneChange = (tzId: string) => {
    const newTz = TIMEZONES.find(t => t.id === tzId)
    if (newTz && newTz.id !== currentTimezone.id) {
      setPendingTimezone(newTz)
      setShowModal(true)
    }
  }

  const confirmChange = () => {
    if (pendingTimezone) {
      setCurrentTimezone(pendingTimezone)
    }
    setShowModal(false)
    setPendingTimezone(null)
  }

  const cancelChange = () => {
    setShowModal(false)
    setPendingTimezone(null)
  }

  // Calculate impact data
  const currentPeriod = getLocalTime(TRANSACTION_UTC_HOUR, currentTimezone.offset)
  const pendingPeriod = pendingTimezone ? getLocalTime(TRANSACTION_UTC_HOUR, pendingTimezone.offset) : null
  const periodWillChange = pendingPeriod && currentPeriod.day !== pendingPeriod.day

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900">Timezone & Period Boundaries</h4>
        <p className="text-sm text-slate-500">See how timezone affects which period a transaction falls into</p>
      </div>

      {/* Timezone Selector */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Organization Timezone:</span>
        <select
          value={currentTimezone.id}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900"
        >
          {TIMEZONES.map(tz => (
            <option key={tz.id} value={tz.id}>{tz.label} ({tz.city})</option>
          ))}
        </select>
      </div>

      {/* Timeline Visualization */}
      <div className="mb-6 rounded-lg bg-slate-50 p-4">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
          Transaction: Mar 31, 11:30 PM UTC
        </div>

        <div className="space-y-4">
          {TIMEZONES.map(tz => {
            const local = getLocalTime(TRANSACTION_UTC_HOUR, tz.offset)
            const isInApril = local.day === 'Apr 1'
            const isCurrentTz = tz.id === currentTimezone.id

            return (
              <div
                key={tz.id}
                className={`rounded-lg p-3 transition-all ${
                  isCurrentTz ? 'bg-white shadow-sm ring-2 ring-orange-500' : 'bg-white/50'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-sm font-medium ${isCurrentTz ? 'text-orange-600' : 'text-slate-600'}`}>
                    {tz.label} ({tz.city})
                  </span>
                  <span className="text-xs text-slate-400">
                    UTC {tz.offset >= 0 ? '+' : ''}{tz.offset}
                  </span>
                </div>

                {/* Timeline bar */}
                <div className="relative h-8">
                  {/* March section */}
                  <div className="absolute left-0 top-0 h-full w-1/2 rounded-l bg-slate-200">
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 pb-1 text-[10px] text-slate-400">
                      March
                    </span>
                  </div>
                  {/* April section */}
                  <div className="absolute right-0 top-0 h-full w-1/2 rounded-r bg-blue-100">
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 pb-1 text-[10px] text-slate-400">
                      April
                    </span>
                  </div>
                  {/* Midnight marker */}
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-400">
                    <span className="absolute top-full left-1/2 -translate-x-1/2 pt-1 text-[10px] text-slate-400">
                      midnight
                    </span>
                  </div>

                  {/* Transaction marker */}
                  <motion.div
                    className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 ${
                      isInApril ? 'left-[75%]' : 'left-[25%]'
                    }`}
                    initial={false}
                    animate={{ left: isInApril ? '75%' : '25%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <div className={`h-3 w-3 rounded-full ${isCurrentTz ? 'bg-orange-500' : 'bg-slate-400'}`} />
                    <span className={`text-xs font-medium ${isCurrentTz ? 'text-orange-600' : 'text-slate-500'}`}>
                      {formatTime(local.hour)}
                    </span>
                  </motion.div>
                </div>

                {/* Period badge */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Falls in:</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    isInApril
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {local.day === 'Apr 1' ? 'April 2024' : 'March 2024'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-xs text-slate-400">
        Click the dropdown to see the timezone change warning
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showModal && pendingTimezone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={cancelChange}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Timezone Change Impact</h3>
                  <p className="text-sm text-slate-500">
                    Changing from {currentTimezone.label} → {pendingTimezone.label}
                  </p>
                </div>
              </div>

              {/* Impact details */}
              <div className="mb-6 space-y-3 rounded-lg bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Transactions near boundaries</span>
                  <span className="font-medium text-slate-900">23</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Journal entries affected</span>
                  <span className="font-medium text-slate-900">8</span>
                </div>

                {periodWillChange && (
                  <>
                    <div className="border-t border-slate-200 pt-3">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                        Balance Changes
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">March 2024</span>
                        <span className="font-medium text-red-600">-$4,230</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">April 2024</span>
                        <span className="font-medium text-green-600">+$4,230</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m5-8a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Closed periods will need to be reopened</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={cancelChange}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChange}
                  className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                >
                  Confirm Change
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
