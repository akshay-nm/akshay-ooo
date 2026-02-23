'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AuditEvent {
  timestamp: string
  user: string
  action: string
  target: string
  detail: string
  type: 'create' | 'update' | 'approve' | 'reject' | 'correct'
}

const AUDIT_EVENTS: AuditEvent[] = [
  {
    timestamp: '09:15 AM',
    user: 'Ramesh (Site Engineer)',
    action: 'Submitted',
    target: 'Progress Update #247',
    detail: 'Foundation Pour — 150 bags cement consumed',
    type: 'create',
  },
  {
    timestamp: '10:02 AM',
    user: 'Suresh (Jr. Engineer)',
    action: 'Rejected',
    target: 'Progress Update #247',
    detail: 'Cement qty should be 120, not 150',
    type: 'reject',
  },
  {
    timestamp: '10:30 AM',
    user: 'Ramesh (Site Engineer)',
    action: 'Corrected',
    target: 'Progress Update #247',
    detail: 'Updated cement qty from 150 to 120',
    type: 'correct',
  },
  {
    timestamp: '10:32 AM',
    user: 'Ramesh (Site Engineer)',
    action: 'Resubmitted',
    target: 'Progress Update #247',
    detail: 'Corrected version sent for review',
    type: 'update',
  },
  {
    timestamp: '11:15 AM',
    user: 'Suresh (Jr. Engineer)',
    action: 'Approved',
    target: 'Progress Update #247',
    detail: 'Stage 1 approval — forwarded to Senior Engineer',
    type: 'approve',
  },
  {
    timestamp: '02:45 PM',
    user: 'Mahesh (Sr. Engineer)',
    action: 'Approved',
    target: 'Progress Update #247',
    detail: 'Final approval — inventory and progress records updated',
    type: 'approve',
  },
  {
    timestamp: '02:45 PM',
    user: 'System',
    action: 'Updated',
    target: 'Inventory — Pillar A',
    detail: 'Cement stock reduced by 120 bags (auto)',
    type: 'update',
  },
  {
    timestamp: '02:45 PM',
    user: 'System',
    action: 'Updated',
    target: 'Progress — Foundation Pour',
    detail: 'Completion moved from 45% to 62% (auto)',
    type: 'update',
  },
]

const TYPE_STYLES = {
  create: { dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  update: { dot: 'bg-slate-500', badge: 'bg-slate-100 text-slate-700' },
  approve: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
  reject: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
  correct: { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
}

export function AuditTrailDemo() {
  const [revealedCount, setRevealedCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setRevealedCount(0)

    for (let i = 1; i <= AUDIT_EVENTS.length; i++) {
      await delay(600)
      setRevealedCount(i)
    }

    await delay(1500)
    setIsRunning(false)
  }

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Audit Trail</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          revealedCount === AUDIT_EVENTS.length ? 'bg-green-100 text-green-700' :
          revealedCount > 0 ? 'bg-blue-100 text-blue-700' :
          'bg-slate-200 text-slate-500'
        }`}>
          {revealedCount === 0 ? 'Ready' : `${revealedCount} / ${AUDIT_EVENTS.length} events`}
        </span>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 max-h-[360px] overflow-y-auto">
        <AnimatePresence>
          {AUDIT_EVENTS.slice(0, revealedCount).map((event, index) => {
            const style = TYPE_STYLES[event.type]
            const isLatest = index === revealedCount - 1

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-3 mb-3 last:mb-0"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center pt-1.5">
                  <motion.div
                    animate={{ scale: isLatest ? [1, 1.3, 1] : 1 }}
                    transition={{ repeat: isLatest ? 2 : 0, duration: 0.4 }}
                    className={`w-2.5 h-2.5 rounded-full ${style.dot}`}
                  />
                  {index < revealedCount - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-3 ${index < revealedCount - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${style.badge}`}>
                      {event.action}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-700">{event.user}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    <span className="font-medium">{event.target}</span> — {event.detail}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {revealedCount === 0 && (
          <div className="text-center text-sm text-slate-300 py-8">
            No events yet
          </div>
        )}
      </div>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {revealedCount === 0 && 'Click to replay an audit trail for a progress update'}
        {revealedCount > 0 && revealedCount < AUDIT_EVENTS.length && `Recording event ${revealedCount} of ${AUDIT_EVENTS.length}...`}
        {revealedCount === AUDIT_EVENTS.length && 'Complete trail — every action tracked with who, what, and when'}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Recording...' : 'Replay Audit Trail'}
      </button>
    </div>
  )
}
