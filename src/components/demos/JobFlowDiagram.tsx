'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 0 | 1 | 2 | 3 | 4 | 5

interface StepInfo {
  label: string
  description: string
}

const STEPS: Record<Step, StepInfo> = {
  0: { label: 'Idle', description: 'Waiting for cron trigger...' },
  1: { label: 'Triggered', description: 'Cron fires, task manager marks job as STARTED in DB' },
  2: { label: 'Chunking', description: 'Task manager queries data and splits into chunks' },
  3: { label: 'Processing', description: 'Child tasks process chunks in parallel' },
  4: { label: 'Aggregating', description: 'All children complete, aggregating results' },
  5: { label: 'Complete', description: 'Read models saved, job marked as COMPLETE' },
}

export function JobFlowDiagram() {
  const [step, setStep] = useState<Step>(0)
  const [isRunning, setIsRunning] = useState(false)
  const [childProgress, setChildProgress] = useState([0, 0, 0])

  const runAnimation = async () => {
    setIsRunning(true)
    setStep(0)
    setChildProgress([0, 0, 0])

    // Step 1: Cron trigger
    await delay(500)
    setStep(1)

    // Step 2: Chunking
    await delay(1000)
    setStep(2)

    // Step 3: Parallel processing
    await delay(800)
    setStep(3)

    // Animate child progress
    const speeds = [60, 45, 80] // Different speeds for each child
    const intervals = speeds.map((speed, i) =>
      setInterval(() => {
        setChildProgress((prev) => {
          const newProgress = [...prev]
          if (newProgress[i] < 100) {
            newProgress[i] = Math.min(100, newProgress[i] + Math.random() * 15)
          }
          return newProgress
        })
      }, speed * 10)
    )

    // Wait for all to complete
    await delay(2500)
    intervals.forEach(clearInterval)
    setChildProgress([100, 100, 100])

    // Step 4: Aggregating
    await delay(500)
    setStep(4)

    // Step 5: Complete
    await delay(1000)
    setStep(5)

    await delay(1500)
    setIsRunning(false)
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Background Job Flow</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          step === 5 ? 'bg-green-100 text-green-700' :
          step > 0 ? 'bg-blue-100 text-blue-700' :
          'bg-slate-200 text-slate-500'
        }`}>
          {STEPS[step].label}
        </span>
      </div>

      {/* Flow Diagram */}
      <div className="relative bg-white rounded-xl p-6 mb-6 overflow-hidden">
        <div className="flex flex-col gap-4">

          {/* Row 1: Cron -> Task Manager */}
          <div className="flex items-center gap-3">
            <FlowNode
              active={step >= 1}
              label="Cron"
              icon="⏰"
              pulse={step === 1}
            />
            <FlowArrow active={step >= 1} />
            <FlowNode
              active={step >= 1}
              label="Task Manager"
              icon="📋"
              pulse={step === 1 || step === 2}
              wide
            />
            <FlowArrow active={step >= 1} />
            <FlowNode
              active={step >= 1}
              label="DB"
              icon="🗄️"
              status={step >= 1 ? (step >= 5 ? 'COMPLETE' : 'STARTED') : undefined}
            />
          </div>

          {/* Row 2: Chunk splitting indicator */}
          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-center"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Splitting into chunks</span>
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: step === 2 ? Infinity : 0, duration: 0.5 }}
                  >
                    ...
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Row 3: Child Tasks */}
          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-center gap-4"
              >
                {[0, 1, 2].map((i) => (
                  <ChildTask
                    key={i}
                    index={i}
                    progress={childProgress[i]}
                    active={step >= 3}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Row 4: Aggregation */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3"
              >
                <FlowArrow active vertical />
                <FlowNode
                  active
                  label="Aggregate"
                  icon="🔄"
                  pulse={step === 4}
                />
                <FlowArrow active />
                <FlowNode
                  active
                  label="Read Models"
                  icon="📊"
                  status={step >= 5 ? 'SAVED' : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status */}
      <div className="text-sm text-slate-600 mb-4 h-6">
        {STEPS[step].description}
      </div>

      {/* Run Button */}
      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Running...' : 'Run Job Flow'}
      </button>
    </div>
  )
}

function FlowNode({
  active,
  label,
  icon,
  pulse,
  wide,
  status
}: {
  active: boolean
  label: string
  icon: string
  pulse?: boolean
  wide?: boolean
  status?: string
}) {
  return (
    <motion.div
      animate={{
        scale: pulse ? [1, 1.05, 1] : 1,
        borderColor: active ? '#3b82f6' : '#e2e8f0',
      }}
      transition={{ repeat: pulse ? Infinity : 0, duration: 0.8 }}
      className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 bg-white ${
        wide ? 'min-w-[100px]' : 'min-w-[70px]'
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs font-medium text-slate-700">{label}</span>
      {status && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
            status === 'COMPLETE' || status === 'SAVED'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {status}
        </motion.span>
      )}
    </motion.div>
  )
}

function FlowArrow({ active, vertical }: { active: boolean; vertical?: boolean }) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.3 }}
      className={`flex items-center justify-center ${vertical ? 'rotate-90 my-2' : ''}`}
    >
      <svg className="w-6 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </motion.div>
  )
}

function ChildTask({ index, progress, active }: { index: number; progress: number; active: boolean }) {
  const isComplete = progress >= 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex flex-col items-center p-3 rounded-lg border-2 min-w-[80px] ${
        isComplete ? 'border-green-300 bg-green-50' : 'border-blue-200 bg-blue-50'
      }`}
    >
      <span className="text-lg mb-1">{isComplete ? '✅' : '⚙️'}</span>
      <span className="text-xs font-medium text-slate-700 mb-2">Chunk {index + 1}</span>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <span className="text-[10px] text-slate-500 mt-1">{Math.round(progress)}%</span>
    </motion.div>
  )
}
