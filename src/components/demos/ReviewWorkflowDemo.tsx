'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type FlowStep =
  | 'idle'
  | 'submit'
  | 'review-1'
  | 'reject-1'
  | 'correct'
  | 'resubmit'
  | 'review-1-pass'
  | 'review-2'
  | 'approved'

interface StepInfo {
  description: string
  status: string
}

const STEP_INFO: Record<FlowStep, StepInfo> = {
  idle: { description: 'Click to walk through a review workflow', status: 'Ready' },
  submit: { description: 'Site engineer submits daily progress update for Foundation Pour', status: 'Submitted' },
  'review-1': { description: 'Junior Engineer reviews — finds incorrect quantity reported', status: 'In Review' },
  'reject-1': { description: 'Update rejected with correction note: "Cement qty should be 150, not 250"', status: 'Rejected' },
  correct: { description: 'Site engineer corrects the entry based on feedback', status: 'Correcting' },
  resubmit: { description: 'Corrected update resubmitted for review', status: 'Resubmitted' },
  'review-1-pass': { description: 'Junior Engineer approves — forwards to next stage', status: 'Stage 1 Approved' },
  'review-2': { description: 'Senior Engineer reviews and gives final approval', status: 'Stage 2 Review' },
  approved: { description: 'Update approved — progress and inventory records updated', status: 'Approved' },
}

const FLOW_ORDER: FlowStep[] = [
  'idle', 'submit', 'review-1', 'reject-1', 'correct', 'resubmit', 'review-1-pass', 'review-2', 'approved',
]

export function ReviewWorkflowDemo() {
  const [step, setStep] = useState<FlowStep>('idle')
  const [isRunning, setIsRunning] = useState(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setStep('idle')

    await delay(400)
    setStep('submit')
    await delay(800)
    setStep('review-1')
    await delay(1000)
    setStep('reject-1')
    await delay(1200)
    setStep('correct')
    await delay(800)
    setStep('resubmit')
    await delay(600)
    setStep('review-1-pass')
    await delay(800)
    setStep('review-2')
    await delay(1000)
    setStep('approved')

    await delay(1500)
    setIsRunning(false)
  }

  const stepIndex = FLOW_ORDER.indexOf(step)

  const isActive = (s: FlowStep) => FLOW_ORDER.indexOf(s) <= stepIndex
  const isCurrent = (s: FlowStep) => s === step
  const isPast = (s: FlowStep) => FLOW_ORDER.indexOf(s) < stepIndex

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Review Workflow</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          step === 'approved' ? 'bg-green-100 text-green-700' :
          step === 'reject-1' ? 'bg-red-100 text-red-700' :
          step !== 'idle' ? 'bg-blue-100 text-blue-700' :
          'bg-slate-200 text-slate-500'
        }`}>
          {STEP_INFO[step].status}
        </span>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="min-w-[380px]">
        {/* Swimlane headers */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center text-[10px] font-medium text-slate-500 uppercase tracking-wider p-1.5 bg-slate-50 rounded">
            Site Engineer
          </div>
          <div className="text-center text-[10px] font-medium text-slate-500 uppercase tracking-wider p-1.5 bg-slate-50 rounded">
            Junior Engineer
          </div>
          <div className="text-center text-[10px] font-medium text-slate-500 uppercase tracking-wider p-1.5 bg-slate-50 rounded">
            Senior Engineer
          </div>
        </div>

        {/* Flow */}
        <div className="grid grid-cols-3 gap-3">
          {/* Site Engineer lane */}
          <div className="flex flex-col gap-2">
            <StepNode active={isActive('submit')} current={isCurrent('submit')} done={isPast('submit')} color="blue">
              Submit Update
            </StepNode>
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={isActive('reject-1')} current={isCurrent('reject-1')} done={isPast('reject-1')} color="red">
              Rejection Note
            </StepNode>
            <StepNode active={isActive('correct')} current={isCurrent('correct')} done={isPast('correct')} color="amber">
              Correct Entry
            </StepNode>
            <StepNode active={isActive('resubmit')} current={isCurrent('resubmit')} done={isPast('resubmit')} color="blue">
              Resubmit
            </StepNode>
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={false} current={false} done={false} empty />
          </div>

          {/* Junior Engineer lane */}
          <div className="flex flex-col gap-2">
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={isActive('review-1')} current={isCurrent('review-1')} done={isPast('review-1')} color="blue">
              Review
            </StepNode>
            <StepNode active={isActive('reject-1')} current={isCurrent('reject-1')} done={isPast('reject-1')} color="red">
              Reject
            </StepNode>
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={isActive('review-1-pass')} current={isCurrent('review-1-pass')} done={isPast('review-1-pass')} color="green">
              Approve
            </StepNode>
            <StepNode active={false} current={false} done={false} empty />
          </div>

          {/* Senior Engineer lane */}
          <div className="flex flex-col gap-2">
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={false} current={false} done={false} empty />
            <StepNode active={isActive('review-2')} current={isCurrent('review-2')} done={isPast('review-2')} color="blue">
              Final Review
            </StepNode>
          </div>
        </div>

        {/* Final approved bar */}
        <AnimatePresence>
          {isActive('approved') && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center"
            >
              <span className="text-xs font-medium text-green-700">
                Approved — Progress record and inventory updated
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {STEP_INFO[step].description}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Running...' : 'Run Review Workflow'}
      </button>
    </div>
  )
}

function StepNode({
  children,
  active,
  current,
  done,
  empty,
  color,
}: {
  children?: React.ReactNode
  active: boolean
  current: boolean
  done: boolean
  empty?: boolean
  color?: 'blue' | 'green' | 'red' | 'amber'
}) {
  if (empty) {
    return <div className="h-8" />
  }

  const colorStyles = {
    blue: { active: 'border-blue-300 bg-blue-50 text-blue-700', done: 'border-green-200 bg-green-50 text-green-700' },
    green: { active: 'border-green-300 bg-green-50 text-green-700', done: 'border-green-200 bg-green-50 text-green-700' },
    red: { active: 'border-red-300 bg-red-50 text-red-700', done: 'border-red-200 bg-red-50 text-red-500' },
    amber: { active: 'border-amber-300 bg-amber-50 text-amber-700', done: 'border-green-200 bg-green-50 text-green-700' },
  }

  const styles = color ? colorStyles[color] : colorStyles.blue

  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.2,
        scale: current ? 1.03 : 1,
      }}
      className={`h-8 flex items-center justify-center text-xs font-medium rounded border px-2 ${
        done ? styles.done : current ? styles.active : active ? styles.active : 'border-slate-100 bg-slate-50 text-slate-300'
      }`}
    >
      {children}
    </motion.div>
  )
}
