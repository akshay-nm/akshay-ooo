'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const WORKFLOW_STEPS = [
  {
    id: 'design',
    label: 'Design Discussion',
    effort: 60,
    description: 'Define boundaries, clarify constraints, shape the domain',
    color: 'bg-orange-500',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'context',
    label: 'Context Setup',
    effort: 25,
    description: 'Prepare precise specs for AI implementation',
    color: 'bg-amber-500',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'implement',
    label: 'AI Implementation',
    effort: 10,
    description: 'Claude Code generates code from constraints',
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'review',
    label: 'Review & Test',
    effort: 5,
    description: 'Verify against TDD specs, iterate if needed',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
]

export function WorkflowDemo() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % WORKFLOW_STEPS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Effort Distribution Bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Where the effort goes</span>
          <span className="text-xs text-slate-400">Auto-cycling</span>
        </div>
        <div className="flex h-10 overflow-hidden rounded-lg">
          {WORKFLOW_STEPS.map((step, index) => (
            <motion.button
              key={step.id}
              className={`${step.color} relative cursor-pointer transition-all ${
                activeIndex === index ? 'ring-2 ring-offset-1 ring-slate-900' : ''
              }`}
              style={{ width: `${step.effort}%` }}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.02 }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {step.effort}%
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Step Detail */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg border-2 ${WORKFLOW_STEPS[activeIndex].borderColor} ${WORKFLOW_STEPS[activeIndex].bgColor} p-4`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className={`text-lg font-semibold ${WORKFLOW_STEPS[activeIndex].textColor}`}>
              {WORKFLOW_STEPS[activeIndex].label}
            </div>
            <div className="mt-1 text-slate-600">
              {WORKFLOW_STEPS[activeIndex].description}
            </div>
          </div>
          <div className={`text-3xl font-bold ${WORKFLOW_STEPS[activeIndex].textColor}`}>
            {WORKFLOW_STEPS[activeIndex].effort}%
          </div>
        </div>
      </motion.div>

      {/* Step Indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {WORKFLOW_STEPS.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${
              activeIndex === index ? `w-6 ${step.color}` : 'w-2 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Key Insight */}
      <div className="mt-4 text-center text-sm text-slate-500">
        <strong className="text-slate-700">85%</strong> design & context · <strong className="text-slate-700">15%</strong> implementation
      </div>
    </div>
  )
}
