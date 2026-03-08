'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type HandshakeStep = 'idle' | 'syn' | 'syn-ack' | 'ack' | 'established'

interface PacketInfo {
  flags: string
  seq?: number
  ack?: number
  description: string
}

const STEP_INFO: Record<HandshakeStep, PacketInfo | null> = {
  idle: null,
  syn: { flags: 'SYN', seq: 100, description: 'Client initiates connection' },
  'syn-ack': { flags: 'SYN, ACK', seq: 300, ack: 101, description: 'Server acknowledges and sends its own SYN' },
  ack: { flags: 'ACK', seq: 101, ack: 301, description: 'Client acknowledges server\'s SYN' },
  established: null,
}

export function HandshakeDemo() {
  const [step, setStep] = useState<HandshakeStep>('idle')
  const [isAnimating, setIsAnimating] = useState(false)
  const [packetPosition, setPacketPosition] = useState(0) // 0 = client, 1 = server

  const reset = useCallback(() => {
    setStep('idle')
    setIsAnimating(false)
    setPacketPosition(0)
  }, [])

  const startHandshake = useCallback(() => {
    if (isAnimating) return
    reset()
    setIsAnimating(true)
    setStep('syn')
    setPacketPosition(0)
  }, [isAnimating, reset])

  useEffect(() => {
    if (!isAnimating || step === 'idle') return

    const timers: NodeJS.Timeout[] = []

    if (step === 'syn') {
      // Animate packet to server
      timers.push(setTimeout(() => setPacketPosition(1), 100))
      timers.push(setTimeout(() => {
        setStep('syn-ack')
        setPacketPosition(1)
      }, 800))
    } else if (step === 'syn-ack') {
      // Animate packet to client
      timers.push(setTimeout(() => setPacketPosition(0), 100))
      timers.push(setTimeout(() => {
        setStep('ack')
        setPacketPosition(0)
      }, 800))
    } else if (step === 'ack') {
      // Animate packet to server
      timers.push(setTimeout(() => setPacketPosition(1), 100))
      timers.push(setTimeout(() => {
        setStep('established')
        setIsAnimating(false)
      }, 800))
    }

    return () => timers.forEach(clearTimeout)
  }, [step, isAnimating])

  const getClientState = () => {
    switch (step) {
      case 'idle': return 'CLOSED'
      case 'syn': return 'SYN_SENT'
      case 'syn-ack': return 'SYN_SENT'
      case 'ack': return 'ESTABLISHED'
      case 'established': return 'ESTABLISHED'
    }
  }

  const getServerState = () => {
    switch (step) {
      case 'idle': return 'LISTEN'
      case 'syn': return 'LISTEN'
      case 'syn-ack': return 'SYN_RCVD'
      case 'ack': return 'SYN_RCVD'
      case 'established': return 'ESTABLISHED'
    }
  }

  const currentPacket = STEP_INFO[step]

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-slate-900">TCP Three-Way Handshake</h4>
        <button
          onClick={step === 'idle' ? startHandshake : reset}
          className={`px-4 py-2 text-xs rounded-lg transition-colors ${
            isAnimating
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : step === 'established'
              ? 'bg-slate-500 text-white hover:bg-slate-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={isAnimating}
        >
          {step === 'idle' ? 'Start Handshake' : step === 'established' ? 'Reset' : 'Running...'}
        </button>
      </div>

      {/* Client and Server visualization */}
      <div className="relative mb-8">
        <div className="flex justify-between items-start">
          {/* Client */}
          <div className="text-center w-32">
            <div className="w-20 h-20 mx-auto rounded-xl bg-blue-100 border-2 border-blue-300 flex items-center justify-center mb-2">
              <span className="text-3xl">💻</span>
            </div>
            <div className="text-sm font-semibold text-slate-700">Client</div>
            <div className={`text-xs font-mono px-2 py-1 rounded mt-1 ${
              getClientState() === 'ESTABLISHED'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {getClientState()}
            </div>
          </div>

          {/* Connection line */}
          <div className="flex-1 relative mx-8 mt-10">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2" />

            {/* Animated packet */}
            <AnimatePresence>
              {currentPacket && (
                <motion.div
                  key={step}
                  initial={{ x: packetPosition === 0 ? '0%' : '100%', opacity: 0, y: '-50%' }}
                  animate={{
                    x: step === 'syn' || step === 'ack' ? 'calc(100% - 60px)' : '0%',
                    opacity: 1,
                    y: '-50%'
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute top-1/2 left-0"
                >
                  <div className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap shadow-lg ${
                    step === 'syn' ? 'bg-blue-500 text-white' :
                    step === 'syn-ack' ? 'bg-purple-500 text-white' :
                    'bg-emerald-500 text-white'
                  }`}>
                    <div className="font-bold">{currentPacket.flags}</div>
                    {currentPacket.seq !== undefined && (
                      <div className="text-[10px] opacity-80">Seq={currentPacket.seq}</div>
                    )}
                    {currentPacket.ack !== undefined && (
                      <div className="text-[10px] opacity-80">Ack={currentPacket.ack}</div>
                    )}
                  </div>
                  {/* Arrow indicator */}
                  <div className={`absolute top-1/2 -translate-y-1/2 text-lg ${
                    step === 'syn-ack' ? '-left-6' : '-right-6'
                  }`}>
                    {step === 'syn-ack' ? '←' : '→'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Established indicator */}
            {step === 'established' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
              >
                Connected!
              </motion.div>
            )}
          </div>

          {/* Server */}
          <div className="text-center w-32">
            <div className="w-20 h-20 mx-auto rounded-xl bg-purple-100 border-2 border-purple-300 flex items-center justify-center mb-2">
              <span className="text-3xl">🖥️</span>
            </div>
            <div className="text-sm font-semibold text-slate-700">Server</div>
            <div className={`text-xs font-mono px-2 py-1 rounded mt-1 ${
              getServerState() === 'ESTABLISHED'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {getServerState()}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <div className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
          step === 'syn' ? 'border-blue-300 bg-blue-50' :
          ['syn-ack', 'ack', 'established'].includes(step) ? 'border-emerald-200 bg-emerald-50' :
          'border-slate-200 bg-slate-50'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            ['syn-ack', 'ack', 'established'].includes(step) ? 'bg-emerald-200 text-emerald-700' :
            step === 'syn' ? 'bg-blue-200 text-blue-700' :
            'bg-slate-200 text-slate-500'
          }`}>1</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-700">SYN</div>
            <div className="text-xs text-slate-500">Client → Server: "I want to connect" (Seq=100)</div>
          </div>
          <div className="font-mono text-xs text-blue-600">→ SYN</div>
        </div>

        <div className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
          step === 'syn-ack' ? 'border-purple-300 bg-purple-50' :
          ['ack', 'established'].includes(step) ? 'border-emerald-200 bg-emerald-50' :
          'border-slate-200 bg-slate-50'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            ['ack', 'established'].includes(step) ? 'bg-emerald-200 text-emerald-700' :
            step === 'syn-ack' ? 'bg-purple-200 text-purple-700' :
            'bg-slate-200 text-slate-500'
          }`}>2</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-700">SYN-ACK</div>
            <div className="text-xs text-slate-500">Server → Client: "OK, I also want to connect" (Seq=300, Ack=101)</div>
          </div>
          <div className="font-mono text-xs text-purple-600">← SYN+ACK</div>
        </div>

        <div className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
          step === 'ack' ? 'border-emerald-300 bg-emerald-50' :
          step === 'established' ? 'border-emerald-200 bg-emerald-50' :
          'border-slate-200 bg-slate-50'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 'established' ? 'bg-emerald-200 text-emerald-700' :
            step === 'ack' ? 'bg-emerald-200 text-emerald-700' :
            'bg-slate-200 text-slate-500'
          }`}>3</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-700">ACK</div>
            <div className="text-xs text-slate-500">Client → Server: "Got it, let's go" (Ack=301)</div>
          </div>
          <div className="font-mono text-xs text-emerald-600">→ ACK</div>
        </div>
      </div>

      {/* Current step description */}
      {currentPacket && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800"
        >
          <strong>Step {step === 'syn' ? '1' : step === 'syn-ack' ? '2' : '3'}:</strong> {currentPacket.description}
        </motion.div>
      )}

      {step === 'established' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800"
        >
          <strong>Connection established!</strong> Both sides have synchronized sequence numbers and can now exchange data.
        </motion.div>
      )}

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Why three messages?</strong> Each side needs to send a SYN and receive an ACK.
        The middle message (SYN-ACK) combines the server&apos;s SYN with its ACK of the client&apos;s SYN.
      </div>
    </div>
  )
}
