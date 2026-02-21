'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type PeriodStatus = 'open' | 'closing' | 'closed'

interface Period {
  id: string
  name: string
  year: number
  status: PeriodStatus
}

type CloseStep =
  | 'idle'
  | 'fetching'
  | 'classifying'
  | 'creating-entries'
  | 'updating-balances'
  | 'syncing-gl'
  | 'done'

const TIMEZONES = [
  { value: 'America/New_York', label: 'EST (New York)', offset: '-05:00' },
  { value: 'America/Los_Angeles', label: 'PST (Los Angeles)', offset: '-08:00' },
  { value: 'Europe/London', label: 'GMT (London)', offset: '+00:00' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)', offset: '+09:00' },
]

const STEP_CONFIG: Record<CloseStep, { label: string; detail: string; duration: number }> = {
  idle: { label: '', detail: '', duration: 0 },
  fetching: { label: 'Fetching transactions', detail: '142 transactions in period', duration: 800 },
  classifying: { label: 'Running classification rules', detail: '89 matched rulesets', duration: 1000 },
  'creating-entries': { label: 'Creating journal entries', detail: 'DR: $45,230 / CR: $45,230', duration: 900 },
  'updating-balances': { label: 'Updating ledger balances', detail: '12 accounts updated', duration: 700 },
  'syncing-gl': { label: 'Syncing to QuickBooks', detail: '89 entries synced', duration: 800 },
  done: { label: 'Period closed', detail: '', duration: 0 },
}

const STEPS_ORDER: CloseStep[] = ['fetching', 'classifying', 'creating-entries', 'updating-balances', 'syncing-gl', 'done']

export function AccountingPeriodDemo() {
  const [timezone, setTimezone] = useState(TIMEZONES[0])
  const [periods, setPeriods] = useState<Period[]>([
    { id: 'jan', name: 'January', year: 2024, status: 'closed' },
    { id: 'feb', name: 'February', year: 2024, status: 'closed' },
    { id: 'mar', name: 'March', year: 2024, status: 'open' },
    { id: 'apr', name: 'April', year: 2024, status: 'open' },
  ])
  const [closingPeriod, setClosingPeriod] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<CloseStep>('idle')
  const [completedSteps, setCompletedSteps] = useState<CloseStep[]>([])

  const closePeriod = (periodId: string) => {
    if (closingPeriod) return

    setClosingPeriod(periodId)
    setPeriods(p => p.map(period =>
      period.id === periodId ? { ...period, status: 'closing' } : period
    ))
    setCompletedSteps([])
    setCurrentStep('fetching')
  }

  useEffect(() => {
    if (currentStep === 'idle' || currentStep === 'done') return

    const stepConfig = STEP_CONFIG[currentStep]
    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep])

      const currentIndex = STEPS_ORDER.indexOf(currentStep)
      const nextStep = STEPS_ORDER[currentIndex + 1]

      if (nextStep) {
        setCurrentStep(nextStep)

        if (nextStep === 'done') {
          setPeriods(p => p.map(period =>
            period.id === closingPeriod ? { ...period, status: 'closed' } : period
          ))
          setTimeout(() => {
            setClosingPeriod(null)
            setCurrentStep('idle')
          }, 1500)
        }
      }
    }, stepConfig.duration)

    return () => clearTimeout(timer)
  }, [currentStep, closingPeriod])

  const reset = () => {
    setPeriods([
      { id: 'jan', name: 'January', year: 2024, status: 'closed' },
      { id: 'feb', name: 'February', year: 2024, status: 'closed' },
      { id: 'mar', name: 'March', year: 2024, status: 'open' },
      { id: 'apr', name: 'April', year: 2024, status: 'open' },
    ])
    setClosingPeriod(null)
    setCurrentStep('idle')
    setCompletedSteps([])
  }

  const allClosed = periods.every(p => p.status === 'closed')

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">Accounting Periods</h4>
          <p className="text-sm text-slate-500">Period close workflow with timezone-aware cutoffs</p>
        </div>
        {allClosed && (
          <button
            onClick={reset}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            Reset Demo
          </button>
        )}
      </div>

      {/* Timezone Selector */}
      <div className="mb-6 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Organization Timezone:</span>
            <select
              value={timezone.value}
              onChange={(e) => setTimezone(TIMEZONES.find(t => t.value === e.target.value) || TIMEZONES[0])}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900"
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-slate-500">
            Period cutoff: <span className="font-medium text-slate-700">11:59 PM {timezone.label.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Period List */}
      <div className="space-y-3">
        {periods.map((period) => (
          <div
            key={period.id}
            className={`rounded-lg border transition-all ${
              period.status === 'closing'
                ? 'border-orange-200 bg-orange-50'
                : period.status === 'closed'
                ? 'border-slate-200 bg-slate-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-900">
                  {period.name} {period.year}
                </span>
                <StatusBadge status={period.status} />
              </div>

              {period.status === 'open' && !closingPeriod && (
                <button
                  onClick={() => closePeriod(period.id)}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                >
                  Close Period
                </button>
              )}
            </div>

            {/* Close Progress */}
            <AnimatePresence>
              {period.id === closingPeriod && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-orange-200"
                >
                  <div className="p-4">
                    <div className="space-y-3">
                      {STEPS_ORDER.filter(s => s !== 'done').map((step, index) => {
                        const isCompleted = completedSteps.includes(step)
                        const isCurrent = currentStep === step
                        const config = STEP_CONFIG[step]

                        return (
                          <div key={step} className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center">
                              {isCompleted ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500"
                                >
                                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.div>
                              ) : isCurrent ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-slate-200" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm font-medium ${isCurrent ? 'text-orange-600' : isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                                {config.label}
                              </div>
                              {(isCurrent || isCompleted) && config.detail && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-xs text-slate-500"
                                >
                                  {config.detail}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {currentStep === 'done' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700"
                      >
                        Period closed successfully
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-4 text-xs text-slate-400">
        Transactions at period boundaries are assigned based on organization timezone
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: PeriodStatus }) {
  if (status === 'closed') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Closed
      </span>
    )
  }

  if (status === 'closing') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
        <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
        Closing...
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
      <div className="h-2 w-2 rounded-full bg-blue-500" />
      Open
    </span>
  )
}
