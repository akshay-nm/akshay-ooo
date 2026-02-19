'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Step =
  | 'idle'
  | 'details'
  | 'setup-send'
  | 'setup-save'
  | 'classify-start'
  | 'classify-run'
  | 'classify-done'
  | 'report'
  | 'plans'
  | 'checkout-redirect'
  | 'checkout-active'
  | 'payment-process'
  | 'webhook-send'
  | 'webhook-receive'
  | 'db-update'
  | 'poll-1'
  | 'poll-2'
  | 'poll-success'
  | 'success'
  | 'dashboard'

const STEP_DESCRIPTIONS: Record<Step, string> = {
  idle: 'Click to begin onboarding flow',
  details: 'User fills in account details...',
  'setup-send': 'Sending setup data to backend...',
  'setup-save': 'Backend saves org, entities, ledger accounts, API keys...',
  'classify-start': 'Backend starts transaction classification...',
  'classify-run': 'Running basic rules on imported transactions...',
  'classify-done': 'Classification complete, sending results...',
  report: 'Frontend displays accounting report card',
  plans: 'User reviews and selects payment plan',
  'checkout-redirect': 'Redirecting to Stripe checkout...',
  'checkout-active': 'User enters payment details on Stripe...',
  'payment-process': 'Stripe processes payment...',
  'webhook-send': 'Stripe sends payment webhook...',
  'webhook-receive': 'Backend receives webhook...',
  'db-update': 'Backend updates payment status in database',
  'poll-1': 'Frontend polling for payment status...',
  'poll-2': 'Still polling...',
  'poll-success': 'Poll returns success!',
  success: 'Payment confirmed!',
  dashboard: 'Redirecting to dashboard...',
}

export function StripeOnboardingFlow() {
  const [step, setStep] = useState<Step>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const [classifyProgress, setClassifyProgress] = useState(0)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setStep('idle')
    setClassifyProgress(0)

    await delay(400)
    setStep('details')
    await delay(1000)
    setStep('setup-send')
    await delay(500)
    setStep('setup-save')
    await delay(800)
    setStep('classify-start')
    await delay(400)
    setStep('classify-run')

    // Animate classification
    for (let i = 0; i <= 100; i += 10) {
      setClassifyProgress(i)
      await delay(100)
    }

    setStep('classify-done')
    await delay(500)
    setStep('report')
    await delay(1000)
    setStep('plans')
    await delay(1000)
    setStep('checkout-redirect')
    await delay(600)
    setStep('checkout-active')
    await delay(1200)
    setStep('payment-process')
    await delay(800)
    setStep('webhook-send')
    await delay(400)
    setStep('webhook-receive')
    await delay(400)
    setStep('db-update')
    await delay(500)
    setStep('poll-1')
    await delay(400)
    setStep('poll-2')
    await delay(400)
    setStep('poll-success')
    await delay(500)
    setStep('success')
    await delay(1000)
    setStep('dashboard')
    await delay(1200)

    setIsRunning(false)
  }

  // Helper to check if a step is active or past
  const isActive = (checkStep: Step) => {
    const order: Step[] = [
      'idle',
      'details',
      'setup-send',
      'setup-save',
      'classify-start',
      'classify-run',
      'classify-done',
      'report',
      'plans',
      'checkout-redirect',
      'checkout-active',
      'payment-process',
      'webhook-send',
      'webhook-receive',
      'db-update',
      'poll-1',
      'poll-2',
      'poll-success',
      'success',
      'dashboard',
    ]
    return order.indexOf(step) >= order.indexOf(checkStep)
  }

  const isPast = (checkStep: Step) => {
    const order: Step[] = [
      'idle',
      'details',
      'setup-send',
      'setup-save',
      'classify-start',
      'classify-run',
      'classify-done',
      'report',
      'plans',
      'checkout-redirect',
      'checkout-active',
      'payment-process',
      'webhook-send',
      'webhook-receive',
      'db-update',
      'poll-1',
      'poll-2',
      'poll-success',
      'success',
      'dashboard',
    ]
    return order.indexOf(step) > order.indexOf(checkStep)
  }

  const isCurrent = (checkStep: Step) => step === checkStep

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Stripe Onboarding Flow</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            step === 'dashboard'
              ? 'bg-green-100 text-green-700'
              : step !== 'idle'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-200 text-slate-500'
          }`}
        >
          {step === 'idle' ? 'Ready' : step === 'dashboard' ? 'Complete' : 'Running'}
        </span>
      </div>

      {/* Swimlane Diagram */}
      <div className="relative bg-white rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Lane Headers */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <LaneHeader icon="🖥️" label="Frontend" color="blue" />
            <LaneHeader icon="⚙️" label="Backend" color="slate" />
            <LaneHeader icon="💳" label="Stripe" color="purple" />
          </div>

          {/* Flow Content */}
          <div className="grid grid-cols-3 gap-4">
            {/* Frontend Lane */}
            <div className="flex flex-col gap-2 border-r border-slate-100 pr-4">
              <LaneItem active={isActive('details')} current={isCurrent('details')} done={isPast('details')}>
                📝 Fill details
              </LaneItem>
              <LaneItem active={isActive('setup-send')} current={isCurrent('setup-send')} done={isPast('setup-send')}>
                📤 Send setup
              </LaneItem>
              <Arrow active={isActive('setup-send')} direction="right" />

              <LaneItem active={isActive('classify-start')} current={false} done={false} empty>
                <span className="text-slate-300">waiting...</span>
              </LaneItem>

              <Arrow active={isActive('classify-done')} direction="left" />
              <LaneItem active={isActive('report')} current={isCurrent('report')} done={isPast('report')}>
                📊 Report card
              </LaneItem>
              <LaneItem active={isActive('plans')} current={isCurrent('plans')} done={isPast('plans')}>
                💰 Select plan
              </LaneItem>
              <LaneItem
                active={isActive('checkout-redirect')}
                current={isCurrent('checkout-redirect')}
                done={isPast('checkout-redirect')}
              >
                ↗️ Redirect
              </LaneItem>
              <Arrow active={isActive('checkout-redirect')} direction="right" long />

              <LaneItem active={isActive('checkout-active')} current={false} done={false} empty>
                <span className="text-slate-300">on Stripe...</span>
              </LaneItem>

              <Arrow active={isActive('payment-process')} direction="left" long />
              <LaneItem active={isActive('poll-1')} current={isCurrent('poll-1') || isCurrent('poll-2')} done={isPast('poll-2')}>
                🔄 Polling
                {(isCurrent('poll-1') || isCurrent('poll-2')) && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="ml-1"
                  >
                    ...
                  </motion.span>
                )}
              </LaneItem>
              <Arrow active={isActive('poll-success')} direction="left" />
              <LaneItem active={isActive('success')} current={isCurrent('success')} done={isPast('success')} highlight="green">
                ✅ Success!
              </LaneItem>
              <LaneItem active={isActive('dashboard')} current={isCurrent('dashboard')} done={false} highlight="orange">
                🏠 Dashboard
              </LaneItem>
            </div>

            {/* Backend Lane */}
            <div className="flex flex-col gap-2 border-r border-slate-100 pr-4">
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <Arrow active={isActive('setup-save')} direction="down" />

              <LaneItem active={isActive('setup-save')} current={isCurrent('setup-save')} done={isPast('setup-save')}>
                💾 Save config
              </LaneItem>
              <LaneItem
                active={isActive('classify-run')}
                current={isCurrent('classify-start') || isCurrent('classify-run')}
                done={isPast('classify-run')}
              >
                🔄 Classify
                {(isCurrent('classify-start') || isCurrent('classify-run')) && (
                  <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      animate={{ width: `${classifyProgress}%` }}
                    />
                  </div>
                )}
              </LaneItem>
              <Arrow active={isActive('classify-done')} direction="down" />
              <LaneItem active={isActive('classify-done')} current={isCurrent('classify-done')} done={isPast('classify-done')}>
                📤 Send results
              </LaneItem>

              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />

              <LaneItem active={false} current={false} done={false} empty>
                <span className="text-slate-300">waiting...</span>
              </LaneItem>

              <Arrow active={isActive('webhook-receive')} direction="down" />
              <LaneItem
                active={isActive('webhook-receive')}
                current={isCurrent('webhook-receive')}
                done={isPast('webhook-receive')}
              >
                📨 Webhook
              </LaneItem>
              <LaneItem active={isActive('db-update')} current={isCurrent('db-update')} done={isPast('db-update')}>
                🗄️ Update DB
              </LaneItem>
              <Arrow active={isActive('poll-success')} direction="down" />
              <LaneItem active={isActive('poll-success')} current={isCurrent('poll-success')} done={isPast('poll-success')}>
                ✓ Return OK
              </LaneItem>
              <LaneItem active={false} current={false} done={false} empty />
            </div>

            {/* Stripe Lane */}
            <div className="flex flex-col gap-2">
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />

              <Arrow active={isActive('checkout-active')} direction="down" />
              <LaneItem
                active={isActive('checkout-active')}
                current={isCurrent('checkout-active')}
                done={isPast('checkout-active')}
                highlight="purple"
              >
                💳 Checkout
              </LaneItem>
              <LaneItem
                active={isActive('payment-process')}
                current={isCurrent('payment-process')}
                done={isPast('payment-process')}
              >
                ⏳ Process
                {isCurrent('payment-process') && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="inline-block w-3 h-3 border border-purple-300 border-t-purple-600 rounded-full ml-1"
                  />
                )}
              </LaneItem>
              <LaneItem
                active={isActive('webhook-send')}
                current={isCurrent('webhook-send')}
                done={isPast('webhook-send')}
              >
                📤 Webhook
              </LaneItem>
              <Arrow active={isActive('webhook-send')} direction="left" />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-sm text-slate-600 mb-4 h-6">{STEP_DESCRIPTIONS[step]}</div>

      {/* Run Button */}
      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Running...' : 'Run Onboarding Flow'}
      </button>
    </div>
  )
}

function LaneHeader({ icon, label, color }: { icon: string; label: string; color: 'blue' | 'slate' | 'purple' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }

  return (
    <div className={`flex items-center justify-center gap-2 p-2 rounded-lg border ${colors[color]}`}>
      <span>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

function LaneItem({
  children,
  active,
  current,
  done,
  empty,
  highlight,
}: {
  children?: React.ReactNode
  active: boolean
  current: boolean
  done: boolean
  empty?: boolean
  highlight?: 'green' | 'orange' | 'purple'
}) {
  if (empty) {
    return <div className="h-8 flex items-center justify-center text-xs">{children}</div>
  }

  const highlightColors = {
    green: 'border-green-300 bg-green-50',
    orange: 'border-orange-300 bg-orange-50',
    purple: 'border-purple-300 bg-purple-50',
  }

  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.4,
        scale: current ? 1.02 : 1,
      }}
      className={`h-8 flex items-center justify-center text-xs font-medium rounded border px-2 ${
        highlight && active
          ? highlightColors[highlight]
          : done
            ? 'border-green-200 bg-green-50 text-green-700'
            : current
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : active
                ? 'border-slate-200 bg-white text-slate-700'
                : 'border-slate-100 bg-slate-50 text-slate-400'
      }`}
    >
      {children}
    </motion.div>
  )
}

function Arrow({
  active,
  direction,
  long,
}: {
  active: boolean
  direction: 'left' | 'right' | 'down'
  long?: boolean
}) {
  const arrows = {
    left: '←',
    right: '→',
    down: '↓',
  }

  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.2 }}
      className={`h-4 flex items-center justify-center text-slate-400 text-xs ${
        direction === 'right' ? 'translate-x-2' : direction === 'left' ? '-translate-x-2' : ''
      }`}
    >
      {long ? `${arrows[direction]}${arrows[direction]}` : arrows[direction]}
    </motion.div>
  )
}
