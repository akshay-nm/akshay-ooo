'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Segment {
  id: number
  seq: number
  size: number
  status: 'sending' | 'delivered' | 'lost' | 'retransmitting' | 'acked'
  position: number
}

type Scenario = 'normal' | 'reorder' | 'loss'

const SCENARIOS: Record<Scenario, { name: string; description: string }> = {
  normal: { name: 'Normal Flow', description: 'Packets arrive in order' },
  reorder: { name: 'Reordering', description: 'Packets arrive out of order' },
  loss: { name: 'Packet Loss', description: 'Packet 2 is lost, retransmitted' },
}

export function SequenceNumberDemo() {
  const [scenario, setScenario] = useState<Scenario>('normal')
  const [segments, setSegments] = useState<Segment[]>([])
  const [receiverBuffer, setReceiverBuffer] = useState<number[]>([])
  const [currentAck, setCurrentAck] = useState(1000)
  const [isRunning, setIsRunning] = useState(false)
  const [step, setStep] = useState(0)
  const [duplicateAcks, setDuplicateAcks] = useState(0)

  const reset = useCallback(() => {
    setSegments([])
    setReceiverBuffer([])
    setCurrentAck(1000)
    setIsRunning(false)
    setStep(0)
    setDuplicateAcks(0)
  }, [])

  const startSimulation = useCallback(() => {
    if (isRunning) return
    reset()
    setIsRunning(true)
  }, [isRunning, reset])

  useEffect(() => {
    if (!isRunning) return

    const segmentData = [
      { seq: 1000, size: 500 },
      { seq: 1500, size: 500 },
      { seq: 2000, size: 500 },
      { seq: 2500, size: 500 },
    ]

    const runNormalScenario = () => {
      const timers: NodeJS.Timeout[] = []

      // Send all segments
      segmentData.forEach((seg, i) => {
        timers.push(setTimeout(() => {
          setSegments(prev => [...prev, {
            id: i,
            seq: seg.seq,
            size: seg.size,
            status: 'sending',
            position: 0,
          }])
        }, i * 400))

        // Animate to receiver
        timers.push(setTimeout(() => {
          setSegments(prev => prev.map(s =>
            s.id === i ? { ...s, position: 1, status: 'delivered' } : s
          ))
          setReceiverBuffer(prev => [...prev, seg.seq].sort((a, b) => a - b))
          setCurrentAck(seg.seq + seg.size)
        }, i * 400 + 600))
      })

      // Complete
      timers.push(setTimeout(() => {
        setSegments(prev => prev.map(s => ({ ...s, status: 'acked' })))
        setIsRunning(false)
      }, segmentData.length * 400 + 1000))

      return () => timers.forEach(clearTimeout)
    }

    const runReorderScenario = () => {
      const timers: NodeJS.Timeout[] = []
      const arrivalOrder = [0, 2, 3, 1] // Packet 2 arrives before packet 1

      // Send all segments at once
      segmentData.forEach((seg, i) => {
        timers.push(setTimeout(() => {
          setSegments(prev => [...prev, {
            id: i,
            seq: seg.seq,
            size: seg.size,
            status: 'sending',
            position: 0,
          }])
        }, i * 200))
      })

      // Arrive in different order
      arrivalOrder.forEach((segIdx, arrivalIdx) => {
        const seg = segmentData[segIdx]
        timers.push(setTimeout(() => {
          setSegments(prev => prev.map(s =>
            s.id === segIdx ? { ...s, position: 1, status: 'delivered' } : s
          ))
          setReceiverBuffer(prev => [...prev, seg.seq].sort((a, b) => a - b))
          // ACK is cumulative - only advances when we have contiguous data
          setStep(arrivalIdx + 1)
        }, 800 + arrivalIdx * 500))
      })

      // Update ACKs based on contiguous data
      timers.push(setTimeout(() => setCurrentAck(1500), 1400)) // After first arrives
      timers.push(setTimeout(() => setCurrentAck(1500), 1900)) // Still 1500 - gap
      timers.push(setTimeout(() => setCurrentAck(1500), 2400)) // Still 1500 - gap
      timers.push(setTimeout(() => {
        setCurrentAck(3000) // Now all contiguous!
        setSegments(prev => prev.map(s => ({ ...s, status: 'acked' })))
        setIsRunning(false)
      }, 2900))

      return () => timers.forEach(clearTimeout)
    }

    const runLossScenario = () => {
      const timers: NodeJS.Timeout[] = []

      // Send first packet
      timers.push(setTimeout(() => {
        setSegments([{ id: 0, seq: 1000, size: 500, status: 'sending', position: 0 }])
      }, 0))
      timers.push(setTimeout(() => {
        setSegments(prev => prev.map(s => s.id === 0 ? { ...s, position: 1, status: 'delivered' } : s))
        setReceiverBuffer([1000])
        setCurrentAck(1500)
      }, 500))

      // Send second packet - LOST
      timers.push(setTimeout(() => {
        setSegments(prev => [...prev, { id: 1, seq: 1500, size: 500, status: 'sending', position: 0 }])
      }, 600))
      timers.push(setTimeout(() => {
        setSegments(prev => prev.map(s => s.id === 1 ? { ...s, position: 0.5, status: 'lost' } : s))
      }, 900))

      // Send third packet - arrives but can't advance ACK
      timers.push(setTimeout(() => {
        setSegments(prev => [...prev, { id: 2, seq: 2000, size: 500, status: 'sending', position: 0 }])
      }, 1000))
      timers.push(setTimeout(() => {
        setSegments(prev => prev.map(s => s.id === 2 ? { ...s, position: 1, status: 'delivered' } : s))
        setReceiverBuffer(prev => [...prev, 2000])
        setDuplicateAcks(1)
      }, 1500))

      // Send fourth packet - duplicate ACK
      timers.push(setTimeout(() => {
        setSegments(prev => [...prev, { id: 3, seq: 2500, size: 500, status: 'sending', position: 0 }])
      }, 1600))
      timers.push(setTimeout(() => {
        setSegments(prev => prev.map(s => s.id === 3 ? { ...s, position: 1, status: 'delivered' } : s))
        setReceiverBuffer(prev => [...prev, 2500])
        setDuplicateAcks(2)
      }, 2100))

      // Sender detects loss (3 dup ACKs), retransmits
      timers.push(setTimeout(() => {
        setDuplicateAcks(3)
      }, 2400))

      timers.push(setTimeout(() => {
        setSegments(prev => prev.map(s =>
          s.id === 1 ? { ...s, status: 'retransmitting', position: 0 } : s
        ))
      }, 2700))

      timers.push(setTimeout(() => {
        setSegments(prev => prev.map(s =>
          s.id === 1 ? { ...s, position: 1, status: 'delivered' } : s
        ))
        setReceiverBuffer(prev => [...prev, 1500].sort((a, b) => a - b))
        setCurrentAck(3000)
        setDuplicateAcks(0)
      }, 3200))

      timers.push(setTimeout(() => {
        setSegments(prev => prev.map(s => ({ ...s, status: 'acked' })))
        setIsRunning(false)
      }, 3600))

      return () => timers.forEach(clearTimeout)
    }

    if (scenario === 'normal') return runNormalScenario()
    if (scenario === 'reorder') return runReorderScenario()
    if (scenario === 'loss') return runLossScenario()
  }, [isRunning, scenario])

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">TCP Sequence Numbers</h4>
        <div className="flex gap-2">
          <select
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value as Scenario)
              reset()
            }}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5"
            disabled={isRunning}
          >
            {Object.entries(SCENARIOS).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <button
            onClick={isRunning ? reset : startSimulation}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              isRunning
                ? 'bg-slate-500 text-white hover:bg-slate-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isRunning ? 'Reset' : 'Run'}
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-500 mb-4 p-2 rounded bg-slate-50">
        {SCENARIOS[scenario].description}
      </div>

      {/* Sender and Receiver */}
      <div className="relative mb-6">
        <div className="flex justify-between items-start">
          {/* Sender */}
          <div className="w-28 text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-blue-100 border-2 border-blue-300 flex items-center justify-center mb-2">
              <span className="text-2xl">📤</span>
            </div>
            <div className="text-sm font-semibold text-slate-700">Sender</div>
          </div>

          {/* Network path */}
          <div className="flex-1 mx-4 relative h-24">
            {/* Base line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-200" />

            {/* Segments in flight */}
            <AnimatePresence>
              {segments.map(seg => (
                <motion.div
                  key={`${seg.id}-${seg.status}`}
                  initial={{ left: '0%', opacity: 0 }}
                  animate={{
                    left: `${seg.position * 85}%`,
                    opacity: seg.status === 'lost' ? 0 : 1,
                    scale: seg.status === 'lost' ? 0.5 : 1,
                    y: seg.status === 'lost' ? 20 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-4"
                >
                  <div className={`px-2 py-1 rounded text-[10px] font-mono shadow-sm border ${
                    seg.status === 'acked'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                      : seg.status === 'lost'
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : seg.status === 'retransmitting'
                      ? 'bg-amber-100 border-amber-300 text-amber-700'
                      : 'bg-blue-100 border-blue-300 text-blue-700'
                  }`}>
                    <div className="font-bold">Seq={seg.seq}</div>
                    <div className="text-[8px] opacity-70">{seg.size}B</div>
                  </div>
                  {seg.status === 'lost' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 text-red-500 text-sm"
                    >
                      ✕
                    </motion.div>
                  )}
                  {seg.status === 'retransmitting' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -bottom-4 left-0 right-0 text-center text-[8px] text-amber-600 font-semibold"
                    >
                      RETRANSMIT
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ACK indicator */}
            {currentAck > 1000 && (
              <motion.div
                key={currentAck}
                initial={{ right: '0%', opacity: 0 }}
                animate={{ right: '85%', opacity: 1 }}
                className="absolute top-12 text-[10px]"
              >
                <div className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono">
                  ACK={currentAck}
                </div>
                <div className="text-emerald-500 text-center">←</div>
              </motion.div>
            )}
          </div>

          {/* Receiver */}
          <div className="w-28 text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mb-2">
              <span className="text-2xl">📥</span>
            </div>
            <div className="text-sm font-semibold text-slate-700">Receiver</div>
          </div>
        </div>
      </div>

      {/* Receiver buffer visualization */}
      <div className="mb-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-slate-600">Receiver Buffer</div>
          <div className="text-xs text-slate-500">
            Next expected: <span className="font-mono font-bold text-emerald-600">{currentAck}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[1000, 1500, 2000, 2500].map(seq => {
            const received = receiverBuffer.includes(seq)
            const isContiguous = receiverBuffer.filter(s => s < seq).length === (seq - 1000) / 500

            return (
              <motion.div
                key={seq}
                animate={{
                  backgroundColor: received
                    ? isContiguous ? '#d1fae5' : '#fef3c7'
                    : '#f1f5f9',
                  borderColor: received
                    ? isContiguous ? '#6ee7b7' : '#fcd34d'
                    : '#e2e8f0',
                }}
                className="flex-1 py-2 rounded border-2 text-center"
              >
                <div className={`text-xs font-mono ${
                  received
                    ? isContiguous ? 'text-emerald-700' : 'text-amber-700'
                    : 'text-slate-400'
                }`}>
                  {seq}
                </div>
                <div className="text-[9px] text-slate-400">
                  {received ? (isContiguous ? '✓' : 'gap!') : '—'}
                </div>
              </motion.div>
            )
          })}
        </div>
        {scenario === 'reorder' && receiverBuffer.length > 0 && receiverBuffer.length < 4 && (
          <div className="mt-2 text-xs text-amber-600">
            Out-of-order data buffered, waiting for missing segments...
          </div>
        )}
      </div>

      {/* Duplicate ACK counter for loss scenario */}
      {scenario === 'loss' && duplicateAcks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg border ${
            duplicateAcks >= 3
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-700">
              Duplicate ACKs received: <span className={duplicateAcks >= 3 ? 'text-red-600' : 'text-amber-600'}>{duplicateAcks}</span>
            </div>
            {duplicateAcks >= 3 && (
              <div className="text-xs text-red-600 font-semibold">
                Fast Retransmit triggered!
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Receiver keeps ACKing {currentAck} because it&apos;s missing seq=1500
          </div>
        </motion.div>
      )}

      {/* Explanation */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="font-semibold text-blue-800 mb-1">Ordering</div>
          <div className="text-blue-600">
            Seq numbers let receiver reassemble data in correct order
          </div>
        </div>
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="font-semibold text-emerald-800 mb-1">Acknowledgment</div>
          <div className="text-emerald-600">
            ACK = next byte expected (cumulative)
          </div>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="font-semibold text-amber-800 mb-1">Loss Detection</div>
          <div className="text-amber-600">
            3 duplicate ACKs = packet lost, retransmit
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Key insight:</strong> Sequence numbers are byte positions, not packet counters.
        A 500-byte segment starting at seq=1000 means bytes 1000-1499. The next ACK should be 1500.
      </div>
    </div>
  )
}
