'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Step =
  | 'idle'
  | 'request-url'
  | 'generate-url'
  | 'return-url'
  | 'uploading'
  | 'upload-complete'
  | 's3-event'
  | 'handle-event'
  | 'update-db'
  | 'done'

const STEP_DESCRIPTIONS: Record<Step, string> = {
  idle: 'Click to simulate file upload flow',
  'request-url': 'Frontend requests presigned URL for file upload...',
  'generate-url': 'Backend generates presigned URL with expiry...',
  'return-url': 'Presigned URL returned to frontend',
  uploading: 'Frontend uploads file directly to S3...',
  'upload-complete': 'Upload complete, S3 has the file',
  's3-event': 'S3 emits ObjectCreated event...',
  'handle-event': 'Backend Lambda receives S3 event...',
  'update-db': 'Backend updates database with file reference',
  done: 'File attached and ready to use!',
}

export function S3UploadFlow() {
  const [step, setStep] = useState<Step>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setStep('idle')
    setUploadProgress(0)

    await delay(400)
    setStep('request-url')
    await delay(600)
    setStep('generate-url')
    await delay(800)
    setStep('return-url')
    await delay(500)
    setStep('uploading')

    // Animate upload progress
    for (let i = 0; i <= 100; i += 5) {
      setUploadProgress(i)
      await delay(40)
    }

    setStep('upload-complete')
    await delay(600)
    setStep('s3-event')
    await delay(500)
    setStep('handle-event')
    await delay(600)
    setStep('update-db')
    await delay(700)
    setStep('done')
    await delay(1200)

    setIsRunning(false)
  }

  const isActive = (checkStep: Step) => {
    const order: Step[] = [
      'idle',
      'request-url',
      'generate-url',
      'return-url',
      'uploading',
      'upload-complete',
      's3-event',
      'handle-event',
      'update-db',
      'done',
    ]
    return order.indexOf(step) >= order.indexOf(checkStep)
  }

  const isPast = (checkStep: Step) => {
    const order: Step[] = [
      'idle',
      'request-url',
      'generate-url',
      'return-url',
      'uploading',
      'upload-complete',
      's3-event',
      'handle-event',
      'update-db',
      'done',
    ]
    return order.indexOf(step) > order.indexOf(checkStep)
  }

  const isCurrent = (checkStep: Step) => step === checkStep

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">S3 Presigned URL Upload</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            step === 'done'
              ? 'bg-green-100 text-green-700'
              : step !== 'idle'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-200 text-slate-500'
          }`}
        >
          {step === 'idle' ? 'Ready' : step === 'done' ? 'Complete' : 'Uploading'}
        </span>
      </div>

      {/* Swimlane Diagram */}
      <div className="relative bg-white rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Lane Headers */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <LaneHeader icon="🖥️" label="Frontend" color="blue" />
            <LaneHeader icon="⚙️" label="Backend" color="slate" />
            <LaneHeader icon="☁️" label="S3" color="orange" />
          </div>

          {/* Flow Content */}
          <div className="grid grid-cols-3 gap-4">
            {/* Frontend Lane */}
            <div className="flex flex-col gap-2 border-r border-slate-100 pr-4">
              <LaneItem
                active={isActive('request-url')}
                current={isCurrent('request-url')}
                done={isPast('request-url')}
              >
                📎 Request URL
              </LaneItem>
              <Arrow active={isActive('request-url')} direction="right" />

              <LaneItem active={isActive('generate-url')} current={false} done={false} empty>
                <span className="text-slate-300">waiting...</span>
              </LaneItem>

              <Arrow active={isActive('return-url')} direction="left" />
              <LaneItem active={isActive('return-url')} current={isCurrent('return-url')} done={isPast('return-url')}>
                🔗 Got URL
              </LaneItem>
              <LaneItem active={isActive('uploading')} current={isCurrent('uploading')} done={isPast('uploading')}>
                📤 Upload
                {isCurrent('uploading') && (
                  <div className="w-12 h-1 bg-slate-200 rounded-full ml-1 overflow-hidden">
                    <motion.div className="h-full bg-blue-500" animate={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </LaneItem>
              <Arrow active={isActive('uploading')} direction="right" long />

              <LaneItem active={isActive('upload-complete')} current={false} done={false} empty>
                <span className="text-slate-300">done</span>
              </LaneItem>

              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
            </div>

            {/* Backend Lane */}
            <div className="flex flex-col gap-2 border-r border-slate-100 pr-4">
              <LaneItem active={false} current={false} done={false} empty />
              <Arrow active={isActive('generate-url')} direction="down" />

              <LaneItem
                active={isActive('generate-url')}
                current={isCurrent('generate-url')}
                done={isPast('generate-url')}
              >
                🔐 Generate
              </LaneItem>
              <Arrow active={isActive('return-url')} direction="down" />
              <LaneItem active={isActive('return-url')} current={isCurrent('return-url')} done={isPast('return-url')}>
                ↩️ Return URL
              </LaneItem>

              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />

              <LaneItem active={isActive('handle-event')} current={false} done={false} empty>
                <span className="text-slate-300">waiting...</span>
              </LaneItem>

              <Arrow active={isActive('handle-event')} direction="down" />
              <LaneItem
                active={isActive('handle-event')}
                current={isCurrent('handle-event')}
                done={isPast('handle-event')}
              >
                λ Handle event
              </LaneItem>
              <LaneItem active={isActive('update-db')} current={isCurrent('update-db')} done={isPast('update-db')}>
                🗄️ Update DB
              </LaneItem>
              <LaneItem active={isActive('done')} current={isCurrent('done')} done={false} highlight="green">
                ✅ Attached!
              </LaneItem>
            </div>

            {/* S3 Lane */}
            <div className="flex flex-col gap-2">
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />
              <LaneItem active={false} current={false} done={false} empty />

              <Arrow active={isActive('upload-complete')} direction="down" />
              <LaneItem
                active={isActive('upload-complete')}
                current={isCurrent('upload-complete')}
                done={isPast('upload-complete')}
                highlight="orange"
              >
                💾 Stored
              </LaneItem>
              <LaneItem active={isActive('s3-event')} current={isCurrent('s3-event')} done={isPast('s3-event')}>
                📣 Event
              </LaneItem>
              <Arrow active={isActive('s3-event')} direction="left" />
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
        {isRunning ? 'Uploading...' : 'Simulate File Upload'}
      </button>
    </div>
  )
}

function LaneHeader({ icon, label, color }: { icon: string; label: string; color: 'blue' | 'slate' | 'orange' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
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
  highlight?: 'green' | 'orange'
}) {
  if (empty) {
    return <div className="h-8 flex items-center justify-center text-xs">{children}</div>
  }

  const highlightColors = {
    green: 'border-green-300 bg-green-50',
    orange: 'border-orange-300 bg-orange-50',
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

function Arrow({ active, direction, long }: { active: boolean; direction: 'left' | 'right' | 'down'; long?: boolean }) {
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
