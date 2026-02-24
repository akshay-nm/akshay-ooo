'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 0 | 1 | 2 | 3 | 4 | 5

interface StepInfo {
  label: string
  description: string
}

const STEPS: Record<Step, StepInfo> = {
  0: { label: 'Idle', description: 'Click to track a material allocation' },
  1: { label: 'Received', description: 'Cement (500 bags) received at central warehouse' },
  2: { label: 'Allocated', description: '200 bags allocated to Pillar A site from warehouse' },
  3: { label: 'Consumed', description: '150 bags consumed for Foundation Pour activity' },
  4: { label: 'Remaining', description: '50 bags remain at site, 300 in warehouse — fully reconciled' },
  5: { label: 'Tracked', description: 'Every movement is linked to a specific activity' },
}

interface InventoryNode {
  label: string
  sublabel: string
  quantity: number | null
}

export function InventoryTrackingDemo() {
  const [step, setStep] = useState<Step>(0)
  const [isRunning, setIsRunning] = useState(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setStep(0)

    await delay(500)
    setStep(1)
    await delay(1000)
    setStep(2)
    await delay(1000)
    setStep(3)
    await delay(1000)
    setStep(4)
    await delay(1200)
    setStep(5)

    await delay(1500)
    setIsRunning(false)
  }

  const warehouseQty = step === 0 ? null : step === 1 ? 500 : step >= 2 ? 300 : 500
  const siteQty = step < 2 ? null : step === 2 ? 200 : step >= 3 ? 50 : 200
  const activityQty = step < 3 ? null : 150

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Inventory Flow</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          step === 5 ? 'bg-green-100 text-green-700' :
          step > 0 ? 'bg-blue-100 text-blue-700' :
          'bg-slate-200 text-slate-500'
        }`}>
          {STEPS[step].label}
        </span>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 overflow-x-auto">
        <div className="flex items-center justify-between gap-2 min-w-[420px]">
          {/* Warehouse */}
          <InventoryBox
            label="Warehouse"
            sublabel="Central Store"
            quantity={warehouseQty}
            active={step >= 1}
            highlight={step === 1}
            material="Cement"
          />

          {/* Arrow: Warehouse -> Site */}
          <FlowArrow active={step >= 2} label="Allocate 200" />

          {/* Site */}
          <InventoryBox
            label="Pillar A Site"
            sublabel="On-site Store"
            quantity={siteQty}
            active={step >= 2}
            highlight={step === 2}
            material="Cement"
          />

          {/* Arrow: Site -> Activity */}
          <FlowArrow active={step >= 3} label="Consume 150" />

          {/* Activity */}
          <InventoryBox
            label="Foundation Pour"
            sublabel="Activity"
            quantity={activityQty}
            active={step >= 3}
            highlight={step === 3}
            material="Cement"
            isActivity
          />
        </div>

        {/* Reconciliation summary */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-4 border-t border-slate-100"
            >
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-700">300</div>
                  <div className="text-[10px] text-slate-500">In Warehouse</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">50</div>
                  <div className="text-[10px] text-blue-500">At Site</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-700">150</div>
                  <div className="text-[10px] text-green-500">Consumed</div>
                </div>
              </div>
              <div className="mt-2 text-center text-[10px] text-slate-400">
                300 + 50 + 150 = 500 bags accounted for
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {STEPS[step].description}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Tracking...' : 'Track Material Flow'}
      </button>
    </div>
  )
}

function InventoryBox({
  label,
  sublabel,
  quantity,
  active,
  highlight,
  material,
  isActivity,
}: {
  label: string
  sublabel: string
  quantity: number | null
  active: boolean
  highlight: boolean
  material: string
  isActivity?: boolean
}) {
  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.3,
        scale: highlight ? 1.05 : 1,
        borderColor: highlight ? '#3b82f6' : active ? '#e2e8f0' : '#f1f5f9',
      }}
      className={`flex-1 p-3 rounded-lg border-2 text-center ${
        isActivity ? 'bg-green-50' : 'bg-white'
      }`}
    >
      <div className="text-xs font-medium text-slate-700 mb-0.5">{label}</div>
      <div className="text-[10px] text-slate-400 mb-2">{sublabel}</div>
      <AnimatePresence>
        {quantity !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-lg font-bold text-slate-800">{quantity}</div>
            <div className="text-[10px] text-slate-400">{material} bags</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FlowArrow({ active, label }: { active: boolean; label: string }) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.2 }}
      className="flex flex-col items-center gap-1 shrink-0 px-1"
    >
      <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap">{active ? label : ''}</span>
      <svg className="w-6 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </motion.div>
  )
}
