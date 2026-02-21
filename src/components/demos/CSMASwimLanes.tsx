'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { interval, Subject, BehaviorSubject, takeUntil, scan, map, tap, startWith } from 'rxjs'

// ============================================================================
// Types
// ============================================================================

type DeviceState = 'idle' | 'sensing' | 'transmitting' | 'collision' | 'jamming' | 'backoff'

interface Device {
  id: number
  state: DeviceState
  pendingRecipients: number[]
  currentRecipient: number | null
  backoffRemaining: number
  messagesDelivered: number
}

interface SimulationState {
  devices: Device[]
  wireState: 'idle' | 'busy' | 'collision'
  tick: number
  collisionCount: number
  totalDelivered: number
  log: string[]
  isComplete: boolean
}

// ============================================================================
// Constants
// ============================================================================

const DEVICE_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
]

const STATE_LABELS: Record<DeviceState, string> = {
  'idle': 'Idle',
  'sensing': 'Sensing...',
  'transmitting': 'Transmitting',
  'collision': 'COLLISION!',
  'jamming': 'Jamming',
  'backoff': 'Backoff',
}

const STATE_COLORS: Record<DeviceState, string> = {
  'idle': 'bg-slate-100 text-slate-500',
  'sensing': 'bg-blue-100 text-blue-700',
  'transmitting': 'bg-orange-200 text-orange-800',
  'collision': 'bg-red-200 text-red-700',
  'jamming': 'bg-red-300 text-red-800',
  'backoff': 'bg-purple-100 text-purple-700',
}

const TICK_INTERVAL_MS = 800

// ============================================================================
// Pure simulation logic
// ============================================================================

function createInitialDevices(): Device[] {
  return Array.from({ length: 8 }, (_, i) => {
    const id = i + 1
    const otherDevices = Array.from({ length: 8 }, (_, j) => j + 1).filter(d => d !== id)
    return {
      id,
      state: 'idle' as DeviceState,
      pendingRecipients: otherDevices,
      currentRecipient: null,
      backoffRemaining: 0,
      messagesDelivered: 0,
    }
  })
}

function createInitialState(): SimulationState {
  return {
    devices: createInitialDevices(),
    wireState: 'idle',
    tick: 0,
    collisionCount: 0,
    totalDelivered: 0,
    log: [],
    isComplete: false,
  }
}

/**
 * Pure function that advances the simulation by one tick.
 * Two-phase approach:
 * 1. Determine what each device WANTS to do
 * 2. Apply actions, detecting collisions
 */
function simulateTick(state: SimulationState): SimulationState {
  if (state.isComplete) return state

  const newTick = state.tick + 1
  const newLog = [...state.log]
  let newCollisionCount = state.collisionCount
  let newTotalDelivered = state.totalDelivered

  // Clone devices
  let devices = state.devices.map(d => ({ ...d }))

  // =========================================================================
  // Phase 1: Process state transitions (except transmitting → collision check)
  // =========================================================================

  const wantsToTransmit: number[] = [] // Device IDs that want to transmit this tick

  devices = devices.map(device => {
    switch (device.state) {
      case 'idle':
        if (device.pendingRecipients.length > 0) {
          const nextRecipient = device.pendingRecipients[0]
          newLog.push(`📤 D${device.id} wants to send "Hello" to D${nextRecipient}`)
          return { ...device, state: 'sensing' as DeviceState, currentRecipient: nextRecipient }
        }
        return device

      case 'sensing': {
        // Check if wire is busy (someone is currently transmitting or jamming)
        const wireBusy = devices.some(d =>
          d.id !== device.id && (d.state === 'transmitting' || d.state === 'jamming')
        )
        if (wireBusy) {
          newLog.push(`⏳ D${device.id} wire busy, waiting...`)
          return device // Stay in sensing
        } else {
          // Wire appears free - we want to transmit
          wantsToTransmit.push(device.id)
          newLog.push(`📡 D${device.id} → D${device.currentRecipient}: "Hello!"`)
          return { ...device, state: 'transmitting' as DeviceState }
        }
      }

      case 'transmitting':
        // Will be handled in phase 2 (collision detection)
        return device

      case 'collision':
        newLog.push(`🚨 D${device.id} sending jam signal...`)
        return { ...device, state: 'jamming' as DeviceState }

      case 'jamming': {
        const backoff = 1 + Math.floor(Math.random() * 6)
        newLog.push(`⏱️ D${device.id} backing off for ${backoff} slots`)
        return { ...device, state: 'backoff' as DeviceState, backoffRemaining: backoff }
      }

      case 'backoff':
        if (device.backoffRemaining > 1) {
          return { ...device, backoffRemaining: device.backoffRemaining - 1 }
        } else {
          newLog.push(`🔄 D${device.id} retrying... sensing wire`)
          return { ...device, state: 'sensing' as DeviceState, backoffRemaining: 0 }
        }

      default:
        return device
    }
  })

  // =========================================================================
  // Phase 2: Check for collisions among transmitting devices
  // =========================================================================

  const transmittingDevices = devices.filter(d => d.state === 'transmitting')
  const isCollision = transmittingDevices.length > 1

  if (isCollision) {
    // Multiple devices transmitting = collision!
    devices = devices.map(device => {
      if (device.state === 'transmitting') {
        newLog.push(`💥 D${device.id} detected COLLISION!`)
        newCollisionCount++
        return { ...device, state: 'collision' as DeviceState }
      }
      return device
    })
  } else {
    // Single transmitter = success!
    devices = devices.map(device => {
      if (device.state === 'transmitting') {
        const newPending = device.pendingRecipients.filter(r => r !== device.currentRecipient)
        newLog.push(`✅ D${device.currentRecipient} received "Hello" from D${device.id}`)
        newTotalDelivered++
        return {
          ...device,
          state: 'idle' as DeviceState,
          pendingRecipients: newPending,
          currentRecipient: null,
          messagesDelivered: device.messagesDelivered + 1,
        }
      }
      return device
    })
  }

  // =========================================================================
  // Determine wire state
  // =========================================================================

  const finalTransmitting = devices.filter(d => d.state === 'transmitting').length
  const anyJamming = devices.some(d => d.state === 'jamming')
  const anyCollision = devices.some(d => d.state === 'collision')

  let wireState: 'idle' | 'busy' | 'collision' = 'idle'
  if (anyCollision || finalTransmitting > 1) {
    wireState = 'collision'
  } else if (finalTransmitting === 1 || anyJamming) {
    wireState = 'busy'
  }

  // =========================================================================
  // Check completion
  // =========================================================================

  const isComplete = devices.every(d => d.pendingRecipients.length === 0 && d.state === 'idle')
  if (isComplete && !state.isComplete) {
    newLog.push(`🎉 All 56 messages delivered in ${newTick} ticks!`)
  }

  return {
    devices,
    wireState,
    tick: newTick,
    collisionCount: newCollisionCount,
    totalDelivered: newTotalDelivered,
    log: newLog.slice(-50), // Keep last 50 log entries
    isComplete,
  }
}

// ============================================================================
// Component
// ============================================================================

export function CSMASwimLanes() {
  const [state, setState] = useState<SimulationState>(createInitialState)
  const [isRunning, setIsRunning] = useState(false)

  const stopSubject = useRef<Subject<void> | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [state.log])

  const startSimulation = useCallback(() => {
    // Reset state
    setState(createInitialState())
    setIsRunning(true)

    // Create stop signal
    stopSubject.current = new Subject<void>()

    // Create the simulation stream
    interval(TICK_INTERVAL_MS).pipe(
      takeUntil(stopSubject.current),
      scan((acc) => simulateTick(acc), createInitialState()),
      tap(newState => {
        setState(newState)
        if (newState.isComplete) {
          stopSubject.current?.next()
          setIsRunning(false)
        }
      }),
    ).subscribe()
  }, [])

  const reset = useCallback(() => {
    stopSubject.current?.next()
    stopSubject.current?.complete()
    setState(createInitialState())
    setIsRunning(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSubject.current?.next()
      stopSubject.current?.complete()
    }
  }, [])

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-slate-900">8 Devices on a Hub</h4>
          <p className="text-sm text-slate-500">Each device sends &quot;Hello&quot; to all others (56 messages)</p>
        </div>
        <div className="flex items-center gap-4">
          {(isRunning || state.totalDelivered > 0) && (
            <div className="flex gap-3 text-xs">
              <span className="text-red-600">Collisions: {state.collisionCount}</span>
              <span className="text-green-600">Delivered: {state.totalDelivered}/56</span>
            </div>
          )}
          {!isRunning ? (
            <button
              onClick={startSimulation}
              className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {state.totalDelivered > 0 ? 'Run Again' : 'Run Simulation'}
            </button>
          ) : (
            <button
              onClick={reset}
              className="px-4 py-2 text-sm font-medium bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Hub Visualization */}
      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-colors ${
            state.wireState === 'collision'
              ? 'bg-red-100 border-red-400 text-red-700 animate-pulse'
              : state.wireState === 'busy'
              ? 'bg-amber-100 border-amber-400 text-amber-700'
              : 'bg-slate-100 border-slate-300 text-slate-600'
          }`}>
            HUB
            {state.wireState === 'collision' && <span className="ml-2">⚡</span>}
          </div>
        </div>

        {/* Shared medium indicator */}
        <div className={`h-3 rounded-full transition-colors duration-200 ${
          state.wireState === 'collision' ? 'bg-red-400' :
          state.wireState === 'busy' ? 'bg-amber-400' :
          'bg-slate-200'
        }`} />
        <div className="text-center text-xs text-slate-500 mt-1 font-medium">
          {state.wireState === 'idle' ? '— Wire Idle —' :
           state.wireState === 'collision' ? '⚡ COLLISION - Signals Interfering! ⚡' :
           '— Wire Busy —'}
        </div>
      </div>

      {/* Swim Lanes - 2 columns for 8 devices */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
        {state.devices.map((device) => (
          <div key={device.id} className="flex items-center gap-2">
            {/* Device indicator */}
            <div className={`w-3 h-3 rounded-full shrink-0 ${DEVICE_COLORS[device.id - 1]}`} />

            {/* Device number */}
            <div className="w-6 text-xs font-bold text-slate-600 shrink-0">
              D{device.id}
            </div>

            {/* State Lane */}
            <motion.div
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium ${STATE_COLORS[device.state]} transition-colors`}
              animate={device.state === 'collision' || device.state === 'jamming' ? { x: [0, -2, 2, -2, 2, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{STATE_LABELS[device.state]}</span>
                  {device.currentRecipient && device.state !== 'idle' && (
                    <span className="text-[10px] opacity-70">→ D{device.currentRecipient}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {device.state === 'backoff' && (
                    <span className="opacity-60 font-mono text-[10px]">
                      {device.backoffRemaining}
                    </span>
                  )}
                  {device.state === 'transmitting' && (
                    <motion.span
                      className="text-[10px]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                    >
                      📡
                    </motion.span>
                  )}
                  <span className="text-[10px] opacity-50">
                    {device.messagesDelivered}/7
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Event Log */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">Event Log</span>
          <span className="text-xs text-slate-400">Tick {state.tick}</span>
        </div>
        <div
          ref={logRef}
          className="bg-slate-50 rounded-lg p-3 h-36 overflow-y-auto font-mono text-[11px] leading-relaxed"
        >
          {state.log.length === 0 ? (
            <span className="text-slate-400">Click &quot;Run Simulation&quot; to start...</span>
          ) : (
            state.log.map((entry, i) => (
              <div key={i} className="text-slate-600 py-0.5">
                {entry}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] mb-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-slate-200" />
            <span className="text-slate-500">Idle</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-blue-200" />
            <span className="text-slate-500">Sensing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-orange-200" />
            <span className="text-slate-500">Transmitting</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-red-200" />
            <span className="text-slate-500">Collision</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-purple-200" />
            <span className="text-slate-500">Backoff</span>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          All 8 devices start simultaneously, each trying to greet every other device.
          Watch how collisions force random backoffs, eventually letting everyone speak.
        </p>
      </div>
    </div>
  )
}
