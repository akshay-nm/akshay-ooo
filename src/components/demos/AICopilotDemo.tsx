'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Step =
  | 'idle'
  | 'form-empty'
  | 'typing-activity'
  | 'suggest-qty'
  | 'accept-qty'
  | 'suggest-notes'
  | 'accept-notes'
  | 'submitted'
  | 'insight-load'
  | 'insight-show'

const STEP_DESCRIPTIONS: Record<Step, string> = {
  idle: 'Click to see the AI copilot assist with data entry and insights',
  'form-empty': 'Site engineer starts a daily progress update...',
  'typing-activity': 'Selects activity: Foundation Pour — Pillar A',
  'suggest-qty': 'Copilot suggests cement quantity based on last 5 days of similar pours',
  'accept-qty': 'Engineer accepts the suggestion — 120 bags',
  'suggest-notes': 'Copilot drafts a progress note from site context',
  'accept-notes': 'Engineer accepts with a minor edit',
  submitted: 'Update submitted — copilot saved ~3 minutes of data entry',
  'insight-load': 'Engineer asks copilot for a project summary...',
  'insight-show': 'Copilot surfaces trends and flags from project data',
}

const STEP_ORDER: Step[] = [
  'idle', 'form-empty', 'typing-activity', 'suggest-qty', 'accept-qty',
  'suggest-notes', 'accept-notes', 'submitted', 'insight-load', 'insight-show',
]

export function AICopilotDemo() {
  const [step, setStep] = useState<Step>('idle')
  const [isRunning, setIsRunning] = useState(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  const stepIndex = STEP_ORDER.indexOf(step)
  const isActive = (s: Step) => STEP_ORDER.indexOf(s) <= stepIndex

  const runAnimation = async () => {
    setIsRunning(true)
    setStep('idle')

    await delay(400)
    setStep('form-empty')
    await delay(800)
    setStep('typing-activity')
    await delay(800)
    setStep('suggest-qty')
    await delay(1200)
    setStep('accept-qty')
    await delay(600)
    setStep('suggest-notes')
    await delay(1200)
    setStep('accept-notes')
    await delay(600)
    setStep('submitted')
    await delay(1000)
    setStep('insight-load')
    await delay(1000)
    setStep('insight-show')

    await delay(2000)
    setIsRunning(false)
  }

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">AI Copilot</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          step === 'insight-show' ? 'bg-green-100 text-green-700' :
          isActive('insight-load') ? 'bg-purple-100 text-purple-700' :
          step !== 'idle' ? 'bg-blue-100 text-blue-700' :
          'bg-slate-200 text-slate-500'
        }`}>
          {step === 'idle' ? 'Ready' : isActive('insight-load') ? 'Insights' : isActive('submitted') ? 'Submitted' : 'Data Entry'}
        </span>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6">
        {/* Data Entry Phase */}
        <AnimatePresence>
          {isActive('form-empty') && !isActive('insight-load') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-3">Daily Progress Update</div>

              {/* Activity field */}
              <FormField
                label="Activity"
                value={isActive('typing-activity') ? 'Foundation Pour — Pillar A' : ''}
                filled={isActive('typing-activity')}
              />

              {/* Quantity field with suggestion */}
              <div>
                <FormField
                  label="Cement Used (bags)"
                  value={isActive('accept-qty') ? '120' : ''}
                  filled={isActive('accept-qty')}
                />
                <AnimatePresence>
                  {step === 'suggest-qty' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-1 flex items-center gap-2"
                    >
                      <CopilotBadge />
                      <span className="text-xs text-purple-700">
                        Suggesting <strong>120 bags</strong> — avg of last 5 foundation pours
                      </span>
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="text-[10px] text-purple-400"
                      >
                        Accept?
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notes field with suggestion */}
              <div>
                <FormField
                  label="Progress Notes"
                  value={isActive('accept-notes') ? 'Foundation pour completed for Pillar A. Cement consumption within estimate. Curing to begin tomorrow.' : ''}
                  filled={isActive('accept-notes')}
                  multiline
                />
                <AnimatePresence>
                  {step === 'suggest-notes' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-1 flex items-start gap-2"
                    >
                      <CopilotBadge />
                      <span className="text-xs text-purple-700">
                        Drafting note from activity context and schedule...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submitted state */}
              <AnimatePresence>
                {isActive('submitted') && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 bg-green-50 border border-green-200 rounded-lg text-center"
                  >
                    <span className="text-xs font-medium text-green-700">
                      Update submitted for review
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insights Phase */}
        <AnimatePresence>
          {isActive('insight-load') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-3">Project Insights</div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500">Ask copilot:</span>
                <span className="text-xs font-medium text-slate-700">&quot;How is the bridge project tracking?&quot;</span>
              </div>

              <AnimatePresence>
                {step === 'insight-load' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3"
                  >
                    <CopilotBadge />
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="text-xs text-purple-500"
                    >
                      Analyzing project data...
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {step === 'insight-show' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <InsightCard
                      type="summary"
                      title="Overall Progress"
                      text="Bridge NH48 is at 58% completion. Pillar A is ahead of schedule, Pillar B is 3 days behind due to rebar delivery delays."
                    />
                    <InsightCard
                      type="trend"
                      title="Cement Consumption Trend"
                      text="Avg daily usage is 115 bags — 8% below estimate. Current stock will last 12 more days at this rate."
                    />
                    <InsightCard
                      type="flag"
                      title="Attention Needed"
                      text="Pillar B has had 3 rejected updates this week. Review workflow may be bottlenecked at Stage 1."
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {step === 'idle' && (
          <div className="text-center text-sm text-slate-300 py-8">
            Two modes: data entry assist + project insights
          </div>
        )}
      </div>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {STEP_DESCRIPTIONS[step]}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Running...' : 'Run AI Copilot Demo'}
      </button>
    </div>
  )
}

function FormField({
  label,
  value,
  filled,
  multiline,
}: {
  label: string
  value: string
  filled: boolean
  multiline?: boolean
}) {
  return (
    <div>
      <div className="text-[10px] font-medium text-slate-500 mb-1">{label}</div>
      <motion.div
        animate={{
          borderColor: filled ? '#3b82f6' : '#e2e8f0',
          backgroundColor: filled ? '#eff6ff' : '#ffffff',
        }}
        className={`px-3 py-2 rounded-lg border text-xs text-slate-700 ${
          multiline ? 'min-h-[60px]' : 'h-8'
        } flex items-start`}
      >
        {value ? (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {value}
          </motion.span>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </motion.div>
    </div>
  )
}

function CopilotBadge() {
  return (
    <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">
      AI
    </span>
  )
}

function InsightCard({ type, title, text }: { type: 'summary' | 'trend' | 'flag'; title: string; text: string }) {
  const styles = {
    summary: { border: 'border-blue-200', bg: 'bg-blue-50', icon: '📊', titleColor: 'text-blue-800' },
    trend: { border: 'border-emerald-200', bg: 'bg-emerald-50', icon: '📈', titleColor: 'text-emerald-800' },
    flag: { border: 'border-amber-200', bg: 'bg-amber-50', icon: '⚠️', titleColor: 'text-amber-800' },
  }
  const s = styles[type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-3 rounded-lg border ${s.border} ${s.bg}`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs">{s.icon}</span>
        <span className={`text-xs font-medium ${s.titleColor}`}>{title}</span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{text}</p>
    </motion.div>
  )
}
