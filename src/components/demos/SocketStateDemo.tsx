'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type SocketState =
  | 'CLOSED'
  | 'LISTEN'
  | 'SYN_SENT'
  | 'SYN_RCVD'
  | 'ESTABLISHED'
  | 'FIN_WAIT_1'
  | 'FIN_WAIT_2'
  | 'CLOSE_WAIT'
  | 'CLOSING'
  | 'LAST_ACK'
  | 'TIME_WAIT'

interface StateInfo {
  description: string
  type: 'client' | 'server' | 'both'
  color: string
}

const STATE_INFO: Record<SocketState, StateInfo> = {
  CLOSED: { description: 'No connection exists', type: 'both', color: 'bg-slate-200 text-slate-700 border-slate-300' },
  LISTEN: { description: 'Server waiting for incoming connections', type: 'server', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  SYN_SENT: { description: 'Client sent SYN, waiting for SYN-ACK', type: 'client', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  SYN_RCVD: { description: 'Server received SYN, sent SYN-ACK, waiting for ACK', type: 'server', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  ESTABLISHED: { description: 'Connection open, data transfer in progress', type: 'both', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  FIN_WAIT_1: { description: 'Sent FIN, waiting for ACK', type: 'both', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  FIN_WAIT_2: { description: 'Received ACK for FIN, waiting for peer\'s FIN', type: 'both', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  CLOSE_WAIT: { description: 'Received FIN, waiting for application to close', type: 'both', color: 'bg-red-100 text-red-700 border-red-300' },
  CLOSING: { description: 'Both sides sent FIN simultaneously', type: 'both', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  LAST_ACK: { description: 'Sent FIN, waiting for final ACK', type: 'both', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  TIME_WAIT: { description: 'Waiting for old packets to expire (2×MSL)', type: 'both', color: 'bg-amber-100 text-amber-700 border-amber-300' },
}

interface Transition {
  from: SocketState
  to: SocketState
  trigger: string
  action: string
}

const TRANSITIONS: Transition[] = [
  // Connection establishment
  { from: 'CLOSED', to: 'LISTEN', trigger: 'Server calls listen()', action: 'Passive open' },
  { from: 'CLOSED', to: 'SYN_SENT', trigger: 'Client calls connect()', action: 'Send SYN' },
  { from: 'LISTEN', to: 'SYN_RCVD', trigger: 'Receive SYN', action: 'Send SYN-ACK' },
  { from: 'SYN_SENT', to: 'ESTABLISHED', trigger: 'Receive SYN-ACK', action: 'Send ACK' },
  { from: 'SYN_RCVD', to: 'ESTABLISHED', trigger: 'Receive ACK', action: 'Connection complete' },

  // Connection termination
  { from: 'ESTABLISHED', to: 'FIN_WAIT_1', trigger: 'App calls close()', action: 'Send FIN' },
  { from: 'ESTABLISHED', to: 'CLOSE_WAIT', trigger: 'Receive FIN', action: 'Send ACK' },
  { from: 'FIN_WAIT_1', to: 'FIN_WAIT_2', trigger: 'Receive ACK', action: '' },
  { from: 'FIN_WAIT_1', to: 'CLOSING', trigger: 'Receive FIN', action: 'Send ACK' },
  { from: 'FIN_WAIT_2', to: 'TIME_WAIT', trigger: 'Receive FIN', action: 'Send ACK' },
  { from: 'CLOSE_WAIT', to: 'LAST_ACK', trigger: 'App calls close()', action: 'Send FIN' },
  { from: 'CLOSING', to: 'TIME_WAIT', trigger: 'Receive ACK', action: '' },
  { from: 'LAST_ACK', to: 'CLOSED', trigger: 'Receive ACK', action: '' },
  { from: 'TIME_WAIT', to: 'CLOSED', trigger: '2×MSL timeout', action: '' },
]

type Scenario = 'connection' | 'close-client' | 'close-server'

export function SocketStateDemo() {
  const [selectedState, setSelectedState] = useState<SocketState | null>(null)
  const [scenario, setScenario] = useState<Scenario>('connection')
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const scenarioSteps: Record<Scenario, { client: SocketState; server: SocketState; label: string }[]> = {
    connection: [
      { client: 'CLOSED', server: 'LISTEN', label: 'Initial' },
      { client: 'SYN_SENT', server: 'LISTEN', label: 'Client: SYN →' },
      { client: 'SYN_SENT', server: 'SYN_RCVD', label: 'Server: ← SYN-ACK' },
      { client: 'ESTABLISHED', server: 'SYN_RCVD', label: 'Client: ACK →' },
      { client: 'ESTABLISHED', server: 'ESTABLISHED', label: 'Connected!' },
    ],
    'close-client': [
      { client: 'ESTABLISHED', server: 'ESTABLISHED', label: 'Connected' },
      { client: 'FIN_WAIT_1', server: 'ESTABLISHED', label: 'Client: FIN →' },
      { client: 'FIN_WAIT_2', server: 'CLOSE_WAIT', label: 'Server: ← ACK' },
      { client: 'FIN_WAIT_2', server: 'LAST_ACK', label: 'Server: ← FIN' },
      { client: 'TIME_WAIT', server: 'LAST_ACK', label: 'Client: ACK →' },
      { client: 'TIME_WAIT', server: 'CLOSED', label: 'Server closed' },
      { client: 'CLOSED', server: 'CLOSED', label: 'Both closed' },
    ],
    'close-server': [
      { client: 'ESTABLISHED', server: 'ESTABLISHED', label: 'Connected' },
      { client: 'ESTABLISHED', server: 'FIN_WAIT_1', label: 'Server: FIN →' },
      { client: 'CLOSE_WAIT', server: 'FIN_WAIT_2', label: 'Client: ← ACK' },
      { client: 'LAST_ACK', server: 'FIN_WAIT_2', label: 'Client: ← FIN' },
      { client: 'LAST_ACK', server: 'TIME_WAIT', label: 'Server: ACK →' },
      { client: 'CLOSED', server: 'TIME_WAIT', label: 'Client closed' },
      { client: 'CLOSED', server: 'CLOSED', label: 'Both closed' },
    ],
  }

  const currentSteps = scenarioSteps[scenario]
  const currentStep = currentSteps[animationStep]

  const runAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setAnimationStep(0)

    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < currentSteps.length) {
        setAnimationStep(step)
      } else {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 1000)
  }

  const resetAnimation = () => {
    setAnimationStep(0)
    setIsAnimating(false)
  }

  const stateInfo = selectedState ? STATE_INFO[selectedState] : null

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-slate-900">TCP Socket States</h4>
        <div className="flex gap-2">
          <select
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value as Scenario)
              resetAnimation()
            }}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5"
          >
            <option value="connection">Connection Setup</option>
            <option value="close-client">Close (Client initiates)</option>
            <option value="close-server">Close (Server initiates)</option>
          </select>
          <button
            onClick={isAnimating ? resetAnimation : runAnimation}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              isAnimating
                ? 'bg-slate-500 text-white hover:bg-slate-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isAnimating ? 'Reset' : 'Animate'}
          </button>
        </div>
      </div>

      {/* Current states visualization */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Client */}
        <div className="text-center">
          <div className="text-sm font-semibold text-slate-600 mb-2">Client</div>
          <motion.div
            key={currentStep.client}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-4 py-3 rounded-lg border-2 font-mono text-sm font-bold ${STATE_INFO[currentStep.client].color}`}
          >
            {currentStep.client}
          </motion.div>
        </div>

        {/* Server */}
        <div className="text-center">
          <div className="text-sm font-semibold text-slate-600 mb-2">Server</div>
          <motion.div
            key={currentStep.server}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-4 py-3 rounded-lg border-2 font-mono text-sm font-bold ${STATE_INFO[currentStep.server].color}`}
          >
            {currentStep.server}
          </motion.div>
        </div>
      </div>

      {/* Step label */}
      <div className="text-center mb-6">
        <motion.div
          key={animationStep}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block px-4 py-2 rounded-full bg-slate-100 text-sm font-medium text-slate-700"
        >
          {currentStep.label}
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <div className="flex gap-1">
          {currentSteps.map((step, i) => (
            <button
              key={i}
              onClick={() => {
                setAnimationStep(i)
                setIsAnimating(false)
              }}
              className={`flex-1 h-2 rounded-full transition-all ${
                i === animationStep
                  ? 'bg-blue-500'
                  : i < animationStep
                  ? 'bg-emerald-400'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-slate-400">
          <span>Step 1</span>
          <span>Step {currentSteps.length}</span>
        </div>
      </div>

      {/* State reference */}
      <div className="mb-4">
        <div className="text-xs text-slate-500 mb-2">All TCP states (click to learn more):</div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STATE_INFO) as SocketState[]).map(state => (
            <button
              key={state}
              onClick={() => setSelectedState(selectedState === state ? null : state)}
              className={`px-2 py-1 text-[10px] font-mono rounded border transition-all ${
                STATE_INFO[state].color
              } ${selectedState === state ? 'ring-2 ring-blue-400' : ''}`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Selected state info */}
      {stateInfo && selectedState && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border border-blue-200 bg-blue-50 mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono font-bold text-blue-800">{selectedState}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${
              stateInfo.type === 'client'
                ? 'bg-blue-200 text-blue-700'
                : stateInfo.type === 'server'
                ? 'bg-purple-200 text-purple-700'
                : 'bg-slate-200 text-slate-700'
            }`}>
              {stateInfo.type === 'both' ? 'Client or Server' : stateInfo.type}
            </span>
          </div>
          <p className="text-sm text-blue-700">{stateInfo.description}</p>

          {/* Transitions from this state */}
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-blue-600 mb-1">Transitions from this state:</div>
            <div className="space-y-1">
              {TRANSITIONS.filter(t => t.from === selectedState).map((t, i) => (
                <div key={i} className="text-xs text-blue-700">
                  → <span className="font-mono font-semibold">{t.to}</span>
                  <span className="text-blue-500"> ({t.trigger})</span>
                </div>
              ))}
              {TRANSITIONS.filter(t => t.from === selectedState).length === 0 && (
                <div className="text-xs text-blue-500 italic">None (terminal state or special)</div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Key insight */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Debug tip:</strong> Use <code className="bg-slate-100 px-1 rounded">netstat -an</code> or{' '}
        <code className="bg-slate-100 px-1 rounded">ss -s</code> to see socket states.
        Many CLOSE_WAIT = app not closing sockets. Many TIME_WAIT = high connection churn.
      </div>
    </div>
  )
}
