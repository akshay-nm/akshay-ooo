'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type State = 'idle' | 'sense' | 'transmit' | 'collision' | 'backoff' | 'success'

interface StateNode {
  id: State
  label: string
  description: string
  color: string
  bgColor: string
  borderColor: string
}

const STATES: StateNode[] = [
  {
    id: 'idle',
    label: 'Idle',
    description: 'Waiting for data to send',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
  },
  {
    id: 'sense',
    label: 'Carrier Sense',
    description: 'Is the wire busy?',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  {
    id: 'transmit',
    label: 'Transmitting',
    description: 'Sending frame, monitoring for collision',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
  },
  {
    id: 'collision',
    label: 'Collision!',
    description: 'Detected interference, sending jam signal',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
  },
  {
    id: 'backoff',
    label: 'Backoff',
    description: 'Waiting random time before retry',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
  },
  {
    id: 'success',
    label: 'Success',
    description: 'Frame transmitted successfully',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
  },
]

const TRANSITIONS: { from: State; to: State; label: string; condition: string }[] = [
  { from: 'idle', to: 'sense', label: 'data ready', condition: 'Have data to send' },
  { from: 'sense', to: 'sense', label: 'busy', condition: 'Wire is busy, keep waiting' },
  { from: 'sense', to: 'transmit', label: 'idle', condition: 'Wire is idle, start sending' },
  { from: 'transmit', to: 'collision', label: 'collision', condition: 'Detected collision' },
  { from: 'transmit', to: 'success', label: 'done', condition: 'Frame sent completely' },
  { from: 'collision', to: 'backoff', label: 'jam sent', condition: 'Jam signal complete' },
  { from: 'backoff', to: 'sense', label: 'timeout', condition: 'Random wait complete' },
  { from: 'success', to: 'idle', label: 'reset', condition: 'Ready for next frame' },
]

// Simulation sequence
const SIMULATION: { state: State; duration: number }[] = [
  { state: 'idle', duration: 1000 },
  { state: 'sense', duration: 800 },
  { state: 'transmit', duration: 1200 },
  { state: 'collision', duration: 600 },
  { state: 'backoff', duration: 1000 },
  { state: 'sense', duration: 600 },
  { state: 'transmit', duration: 1500 },
  { state: 'success', duration: 800 },
  { state: 'idle', duration: 1000 },
]

export function CSMAStateMachine() {
  const [currentState, setCurrentState] = useState<State>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const activeState = STATES.find(s => s.id === currentState)!

  useEffect(() => {
    if (!isRunning) return

    const step = SIMULATION[stepIndex]
    setCurrentState(step.state)

    const timer = setTimeout(() => {
      if (stepIndex < SIMULATION.length - 1) {
        setStepIndex(stepIndex + 1)
      } else {
        setIsRunning(false)
        setStepIndex(0)
      }
    }, step.duration)

    return () => clearTimeout(timer)
  }, [isRunning, stepIndex])

  const runSimulation = () => {
    setStepIndex(0)
    setCurrentState('idle')
    setIsRunning(true)
  }

  const reset = () => {
    setIsRunning(false)
    setStepIndex(0)
    setCurrentState('idle')
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">CSMA/CD State Machine</div>
          <div className="text-xs text-slate-500">Click &quot;Run&quot; to see a transmission with collision</div>
        </div>
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={runSimulation}
              className="px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Run Simulation
            </button>
          ) : (
            <button
              onClick={reset}
              className="px-3 py-1.5 text-xs font-medium bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* State Diagram */}
      <div className="relative">
        {/* States Grid */}
        <div className="grid grid-cols-3 gap-3">
          {STATES.map((state) => {
            const isActive = state.id === currentState
            return (
              <motion.div
                key={state.id}
                className={`relative rounded-lg border-2 p-3 transition-all ${
                  isActive
                    ? `${state.borderColor} ${state.bgColor} ring-2 ring-offset-1 ring-slate-900`
                    : 'border-slate-200 bg-slate-50'
                }`}
                animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <div className={`text-sm font-semibold ${isActive ? state.color : 'text-slate-400'}`}>
                  {state.label}
                </div>
                <div className={`text-xs mt-1 ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                  {state.description}
                </div>
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Current State Detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentState}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className={`mt-4 p-3 rounded-lg ${activeState.bgColor} border ${activeState.borderColor}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-sm font-semibold ${activeState.color}`}>
                Current: {activeState.label}
              </span>
              <span className="text-xs text-slate-500 ml-2">
                {activeState.description}
              </span>
            </div>
            {isRunning && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Running...
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Transition Rules */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-500 mb-2">Transitions from {activeState.label}:</div>
        <div className="flex flex-wrap gap-2">
          {TRANSITIONS.filter(t => t.from === currentState).map((t, i) => (
            <div key={i} className="text-xs bg-slate-100 rounded px-2 py-1">
              <span className="text-slate-500">on</span>{' '}
              <span className="font-mono text-slate-700">{t.label}</span>{' '}
              <span className="text-slate-500">→</span>{' '}
              <span className="font-medium text-slate-700">{STATES.find(s => s.id === t.to)?.label}</span>
            </div>
          ))}
          {TRANSITIONS.filter(t => t.from === currentState).length === 0 && (
            <span className="text-xs text-slate-400">End state</span>
          )}
        </div>
      </div>
    </div>
  )
}
