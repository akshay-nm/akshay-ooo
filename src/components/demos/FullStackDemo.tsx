'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Stage =
  | 'idle'
  | 'dns-query'
  | 'dns-response'
  | 'tcp-syn'
  | 'tcp-synack'
  | 'tcp-ack'
  | 'http-request'
  | 'http-response'
  | 'complete'

interface LayerData {
  name: string
  color: string
  data: Record<string, string>
}

const LAYERS: Record<string, LayerData> = {
  application: {
    name: 'Application',
    color: 'bg-purple-100 border-purple-300',
    data: { protocol: 'HTTP/1.1', method: 'GET', path: '/index.html' },
  },
  transport: {
    name: 'Transport',
    color: 'bg-blue-100 border-blue-300',
    data: { protocol: 'TCP', srcPort: '54321', dstPort: '443', seq: '1000' },
  },
  network: {
    name: 'Network',
    color: 'bg-emerald-100 border-emerald-300',
    data: { protocol: 'IPv4', srcIP: '192.168.1.100', dstIP: '142.250.185.78', ttl: '64' },
  },
  datalink: {
    name: 'Data Link',
    color: 'bg-amber-100 border-amber-300',
    data: { protocol: 'Ethernet', srcMAC: 'AA:BB:CC:DD:EE:FF', dstMAC: '11:22:33:44:55:66' },
  },
}

const STAGE_INFO: Record<Stage, { title: string; description: string; layers: string[] }> = {
  idle: { title: 'Ready', description: 'Click Start to send an HTTP request', layers: [] },
  'dns-query': { title: 'DNS Query', description: 'Browser asks: "What is the IP of example.com?"', layers: ['application', 'transport', 'network', 'datalink'] },
  'dns-response': { title: 'DNS Response', description: 'DNS server responds with IP: 142.250.185.78', layers: ['application'] },
  'tcp-syn': { title: 'TCP SYN', description: 'Client initiates connection with SYN', layers: ['transport', 'network', 'datalink'] },
  'tcp-synack': { title: 'TCP SYN-ACK', description: 'Server acknowledges and sends its SYN', layers: ['transport'] },
  'tcp-ack': { title: 'TCP ACK', description: 'Client completes handshake', layers: ['transport'] },
  'http-request': { title: 'HTTP Request', description: 'GET /index.html HTTP/1.1', layers: ['application', 'transport', 'network', 'datalink'] },
  'http-response': { title: 'HTTP Response', description: '200 OK - HTML content returned', layers: ['application', 'transport', 'network', 'datalink'] },
  complete: { title: 'Complete!', description: 'Page loaded successfully', layers: [] },
}

export function FullStackDemo() {
  const [stage, setStage] = useState<Stage>('idle')
  const [isAnimating, setIsAnimating] = useState(false)
  const [packetDirection, setPacketDirection] = useState<'right' | 'left'>('right')
  const [packetPosition, setPacketPosition] = useState(0)

  const reset = useCallback(() => {
    setStage('idle')
    setIsAnimating(false)
    setPacketPosition(0)
    setPacketDirection('right')
  }, [])

  const runAnimation = useCallback(() => {
    if (isAnimating) return
    reset()
    setIsAnimating(true)
    setStage('dns-query')
  }, [isAnimating, reset])

  useEffect(() => {
    if (!isAnimating || stage === 'idle') return

    const stages: { stage: Stage; direction: 'right' | 'left'; delay: number }[] = [
      { stage: 'dns-query', direction: 'right', delay: 1500 },
      { stage: 'dns-response', direction: 'left', delay: 1000 },
      { stage: 'tcp-syn', direction: 'right', delay: 1200 },
      { stage: 'tcp-synack', direction: 'left', delay: 1000 },
      { stage: 'tcp-ack', direction: 'right', delay: 800 },
      { stage: 'http-request', direction: 'right', delay: 1500 },
      { stage: 'http-response', direction: 'left', delay: 1500 },
      { stage: 'complete', direction: 'right', delay: 0 },
    ]

    const currentIndex = stages.findIndex(s => s.stage === stage)
    if (currentIndex === -1 || currentIndex >= stages.length - 1) {
      setIsAnimating(false)
      return
    }

    const next = stages[currentIndex + 1]
    setPacketDirection(stages[currentIndex].direction)

    // Animate packet
    setPacketPosition(0)
    const animInterval = setInterval(() => {
      setPacketPosition(prev => Math.min(prev + 0.05, 1))
    }, 30)

    const timer = setTimeout(() => {
      clearInterval(animInterval)
      setStage(next.stage)
      setPacketDirection(next.direction)
      setPacketPosition(0)
    }, stages[currentIndex].delay)

    return () => {
      clearTimeout(timer)
      clearInterval(animInterval)
    }
  }, [stage, isAnimating])

  const currentInfo = STAGE_INFO[stage]

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-slate-900">Full Stack: HTTP Request Journey</h4>
        <button
          onClick={stage === 'idle' ? runAnimation : reset}
          className={`px-4 py-2 text-xs rounded-lg transition-colors ${
            isAnimating
              ? 'bg-slate-500 text-white hover:bg-slate-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {stage === 'idle' ? 'Start Request' : stage === 'complete' ? 'Reset' : 'Cancel'}
        </button>
      </div>

      {/* Main visualization */}
      <div className="relative mb-6">
        {/* Client and Server */}
        <div className="flex justify-between items-start">
          {/* Client stack */}
          <div className="w-40">
            <div className="text-center mb-3">
              <div className="w-16 h-16 mx-auto rounded-xl bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <div className="text-sm font-semibold text-slate-700 mt-1">Browser</div>
              <div className="text-[10px] text-slate-400 font-mono">192.168.1.100</div>
            </div>

            {/* Layer stack */}
            <div className="space-y-1">
              {['application', 'transport', 'network', 'datalink'].map((layer, i) => (
                <motion.div
                  key={layer}
                  animate={{
                    scale: currentInfo.layers.includes(layer) ? 1.02 : 1,
                    opacity: currentInfo.layers.includes(layer) ? 1 : 0.5,
                  }}
                  className={`px-2 py-1.5 rounded border text-[10px] font-semibold ${LAYERS[layer].color}`}
                >
                  L{4 - i}: {LAYERS[layer].name}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Network path */}
          <div className="flex-1 mx-8 relative">
            {/* Connection line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 rounded" />

            {/* Packet animation */}
            <AnimatePresence>
              {isAnimating && stage !== 'complete' && stage !== 'idle' && (
                <motion.div
                  key={stage}
                  initial={{ x: packetDirection === 'right' ? '0%' : '100%' }}
                  animate={{
                    x: packetDirection === 'right'
                      ? `${packetPosition * 100}%`
                      : `${(1 - packetPosition) * 100}%`
                  }}
                  className="absolute top-4 left-0 right-0"
                  style={{ left: 0 }}
                >
                  <div
                    className={`inline-block px-3 py-2 rounded-lg shadow-lg text-xs font-bold text-white ${
                      stage.startsWith('dns')
                        ? 'bg-amber-500'
                        : stage.startsWith('tcp')
                        ? 'bg-blue-500'
                        : 'bg-purple-500'
                    }`}
                    style={{
                      transform: `translateX(${packetDirection === 'right' ? packetPosition * 200 : (1 - packetPosition) * 200}px)`
                    }}
                  >
                    {stage.startsWith('dns') ? 'DNS' : stage.startsWith('tcp') ? 'TCP' : 'HTTP'}
                    <span className="ml-1">{packetDirection === 'right' ? '→' : '←'}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage info */}
            <div className="mt-20 text-center">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-block px-4 py-2 rounded-lg text-sm ${
                  stage === 'complete'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <div className="font-semibold">{currentInfo.title}</div>
                <div className="text-xs opacity-75">{currentInfo.description}</div>
              </motion.div>
            </div>
          </div>

          {/* Server stack */}
          <div className="w-40">
            <div className="text-center mb-3">
              <div className="w-16 h-16 mx-auto rounded-xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center">
                <span className="text-2xl">🖥️</span>
              </div>
              <div className="text-sm font-semibold text-slate-700 mt-1">Server</div>
              <div className="text-[10px] text-slate-400 font-mono">142.250.185.78</div>
            </div>

            {/* Layer stack */}
            <div className="space-y-1">
              {['application', 'transport', 'network', 'datalink'].map((layer, i) => (
                <motion.div
                  key={layer}
                  animate={{
                    scale: currentInfo.layers.includes(layer) && (
                      (packetDirection === 'right' && packetPosition > 0.8) ||
                      (packetDirection === 'left' && packetPosition < 0.2)
                    ) ? 1.02 : 1,
                    opacity: currentInfo.layers.includes(layer) ? 1 : 0.5,
                  }}
                  className={`px-2 py-1.5 rounded border text-[10px] font-semibold ${LAYERS[layer].color}`}
                >
                  L{4 - i}: {LAYERS[layer].name}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Encapsulation visualization */}
      {stage !== 'idle' && stage !== 'complete' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-4 rounded-lg bg-slate-50 border border-slate-200"
        >
          <div className="text-xs text-slate-500 mb-3">Current packet encapsulation:</div>
          <div className="flex justify-center">
            <div className="inline-flex flex-col items-center">
              {currentInfo.layers.slice().reverse().map((layer, i) => (
                <motion.div
                  key={layer}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`px-4 py-2 rounded border-2 text-xs font-semibold ${LAYERS[layer].color} ${
                    i === 0 ? '' : '-mt-1'
                  }`}
                  style={{
                    width: `${160 + i * 40}px`,
                    zIndex: currentInfo.layers.length - i,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span>{LAYERS[layer].name}</span>
                    <span className="text-[10px] opacity-60">
                      {layer === 'application' && 'GET /index.html'}
                      {layer === 'transport' && 'Port 443'}
                      {layer === 'network' && 'IP Header'}
                      {layer === 'datalink' && 'Ethernet'}
                    </span>
                  </div>
                </motion.div>
              ))}
              {/* Data payload */}
              {currentInfo.layers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-2 rounded border-2 border-slate-300 bg-white text-xs text-slate-600 -mt-1"
                  style={{ width: '120px', zIndex: 0 }}
                >
                  Data
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="flex gap-1 mb-4">
        {(['dns-query', 'dns-response', 'tcp-syn', 'tcp-synack', 'tcp-ack', 'http-request', 'http-response', 'complete'] as Stage[]).map((s, i) => {
          const stageOrder = ['idle', 'dns-query', 'dns-response', 'tcp-syn', 'tcp-synack', 'tcp-ack', 'http-request', 'http-response', 'complete']
          const currentOrder = stageOrder.indexOf(stage)
          const thisOrder = stageOrder.indexOf(s)

          return (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                thisOrder < currentOrder
                  ? 'bg-emerald-400'
                  : thisOrder === currentOrder
                  ? 'bg-blue-500'
                  : 'bg-slate-200'
              }`}
            />
          )
        })}
      </div>

      {/* Complete message */}
      {stage === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800"
        >
          <strong>Journey complete!</strong> The HTTP response traveled through all layers:
          Application → Transport → Network → Data Link, then reversed on the way back.
        </motion.div>
      )}

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>The full journey:</strong> DNS lookup → TCP handshake → HTTP request/response.
        Each step adds headers going down, removes them going up. Encapsulation in action.
      </div>
    </div>
  )
}
