'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Period {
  id: string
  name: string
  status: 'closed' | 'open' | 'closing'
  openingBalance: number
  journalEntries: number
  closingBalance: number | null
  isComputing: boolean
}

const INITIAL_PERIODS: Period[] = [
  {
    id: 'jan',
    name: 'January',
    status: 'closed',
    openingBalance: 0,
    journalEntries: 89,
    closingBalance: 45230,
    isComputing: false,
  },
  {
    id: 'feb',
    name: 'February',
    status: 'closed',
    openingBalance: 45230,
    journalEntries: 67,
    closingBalance: 52890,
    isComputing: false,
  },
  {
    id: 'mar',
    name: 'March',
    status: 'open',
    openingBalance: 52890,
    journalEntries: 74,
    closingBalance: null,
    isComputing: false,
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function BalanceCarryoverDemo() {
  const [periods, setPeriods] = useState<Period[]>(INITIAL_PERIODS)
  const [computingPeriod, setComputingPeriod] = useState<string | null>(null)
  const [computeStep, setComputeStep] = useState(0)

  const closePeriod = (periodId: string) => {
    if (computingPeriod) return

    setComputingPeriod(periodId)
    setComputeStep(1)
    setPeriods(prev => prev.map(p =>
      p.id === periodId ? { ...p, status: 'closing', isComputing: true } : p
    ))
  }

  useEffect(() => {
    if (!computingPeriod) return

    const timers: NodeJS.Timeout[] = []

    // Step 1: Show "Processing journal entries"
    // Step 2: Show "Computing balances"
    // Step 3: Show "Finalizing"
    // Step 4: Done - update balances and carry forward

    if (computeStep === 1) {
      timers.push(setTimeout(() => setComputeStep(2), 800))
    } else if (computeStep === 2) {
      timers.push(setTimeout(() => setComputeStep(3), 1000))
    } else if (computeStep === 3) {
      timers.push(setTimeout(() => {
        // Calculate closing balance and update next period's opening
        const periodIndex = periods.findIndex(p => p.id === computingPeriod)
        const period = periods[periodIndex]
        const newClosingBalance = period.openingBalance + (period.journalEntries * 115) // Simulated calculation

        setPeriods(prev => {
          const updated = [...prev]
          updated[periodIndex] = {
            ...updated[periodIndex],
            status: 'closed',
            closingBalance: newClosingBalance,
            isComputing: false,
          }
          // Carry forward to next period if exists
          if (periodIndex + 1 < updated.length) {
            updated[periodIndex + 1] = {
              ...updated[periodIndex + 1],
              openingBalance: newClosingBalance,
            }
          }
          return updated
        })

        setComputeStep(4)
        setTimeout(() => {
          setComputingPeriod(null)
          setComputeStep(0)
        }, 1500)
      }, 800))
    }

    return () => timers.forEach(clearTimeout)
  }, [computeStep, computingPeriod, periods])

  const reset = () => {
    setPeriods(INITIAL_PERIODS)
    setComputingPeriod(null)
    setComputeStep(0)
  }

  const allClosed = periods.every(p => p.status === 'closed')

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">Balance Pre-computation</h4>
          <p className="text-sm text-slate-500">Closing balances carry forward to next period</p>
        </div>
        {allClosed && (
          <button
            onClick={reset}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            Reset
          </button>
        )}
      </div>

      {/* Period Cards */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {periods.map((period, index) => (
            <div key={period.id} className="relative flex items-center">
              {/* Period Card */}
              <motion.div
                className={`w-48 shrink-0 rounded-lg border p-4 ${
                  period.status === 'closing'
                    ? 'border-orange-300 bg-orange-50'
                    : period.status === 'closed'
                    ? 'border-green-200 bg-green-50'
                    : 'border-slate-200 bg-white'
                }`}
                animate={period.isComputing ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5, repeat: period.isComputing ? Infinity : 0 }}
              >
                {/* Period Header */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium text-slate-900">{period.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    period.status === 'closed'
                      ? 'bg-green-100 text-green-700'
                      : period.status === 'closing'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {period.status === 'closing' ? 'Closing...' : period.status}
                  </span>
                </div>

                {/* Balances */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Opening</span>
                    <motion.span
                      key={period.openingBalance}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-medium text-slate-700"
                    >
                      {formatCurrency(period.openingBalance)}
                    </motion.span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>+ {period.journalEntries} entries</span>
                  </div>

                  <div className="border-t border-slate-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Closing</span>
                      {period.closingBalance !== null ? (
                        <motion.span
                          key={period.closingBalance}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="font-semibold text-green-600"
                        >
                          {formatCurrency(period.closingBalance)}
                        </motion.span>
                      ) : period.isComputing ? (
                        <span className="text-orange-500">Computing...</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                {period.status === 'open' && !computingPeriod && (
                  <button
                    onClick={() => closePeriod(period.id)}
                    className="mt-3 w-full rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                  >
                    Close Period
                  </button>
                )}

                {/* Computing Steps */}
                <AnimatePresence>
                  {period.id === computingPeriod && computeStep > 0 && computeStep < 4 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-1 text-xs">
                        <div className={`flex items-center gap-2 ${computeStep >= 1 ? 'text-orange-600' : 'text-slate-400'}`}>
                          {computeStep === 1 ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                          ) : computeStep > 1 ? (
                            <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                          <span>Processing journal entries</span>
                        </div>
                        <div className={`flex items-center gap-2 ${computeStep >= 2 ? 'text-orange-600' : 'text-slate-400'}`}>
                          {computeStep === 2 ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                          ) : computeStep > 2 ? (
                            <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-slate-300" />
                          )}
                          <span>Computing balances</span>
                        </div>
                        <div className={`flex items-center gap-2 ${computeStep >= 3 ? 'text-orange-600' : 'text-slate-400'}`}>
                          {computeStep === 3 ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                          ) : computeStep > 3 ? (
                            <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-slate-300" />
                          )}
                          <span>Carrying forward</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Carryover Arrow */}
              {index < periods.length - 1 && (
                <div className="relative mx-2 flex items-center">
                  <motion.div
                    className={`h-0.5 w-8 ${
                      periods[index].status === 'closed' ? 'bg-green-400' : 'bg-slate-200'
                    }`}
                    initial={false}
                    animate={{
                      backgroundColor: computeStep === 4 && periods[index].id === computingPeriod
                        ? ['#fb923c', '#4ade80']
                        : undefined
                    }}
                  />
                  <motion.div
                    className={`h-0 w-0 border-y-4 border-l-4 border-y-transparent ${
                      periods[index].status === 'closed' ? 'border-l-green-400' : 'border-l-slate-200'
                    }`}
                    initial={false}
                    animate={{
                      borderLeftColor: computeStep === 4 && periods[index].id === computingPeriod
                        ? ['#fb923c', '#4ade80']
                        : undefined
                    }}
                  />
                  {/* Carryover animation */}
                  <AnimatePresence>
                    {computeStep === 4 && periods[index].id === computingPeriod && (
                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 30, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 0.8 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2"
                      >
                        <div className="rounded bg-green-500 px-1 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          $
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span>Balance carried forward</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-orange-400" />
          <span>Computing</span>
        </div>
      </div>
    </div>
  )
}
