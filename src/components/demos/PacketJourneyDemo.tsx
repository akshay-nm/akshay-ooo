'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Hop {
  name: string
  ip: string
  mac: string
  type: 'host' | 'router' | 'destination'
}

interface PacketState {
  srcMac: string
  dstMac: string
  srcIp: string
  dstIp: string
  ttl: number
}

const NETWORK: Hop[] = [
  { name: 'Your Computer', ip: '192.168.1.100', mac: 'AA:AA:AA:11:11:11', type: 'host' },
  { name: 'Home Router', ip: '192.168.1.1', mac: 'BB:BB:BB:22:22:22', type: 'router' },
  { name: 'ISP Router', ip: '10.0.0.1', mac: 'CC:CC:CC:33:33:33', type: 'router' },
  { name: 'Google Server', ip: '8.8.8.8', mac: 'DD:DD:DD:44:44:44', type: 'destination' },
]

type CalculationType = 'subnet-check' | 'gateway-decision' | 'arp' | 'ttl-decrement' | 'mac-rewrite' | 'deliver'

interface Step {
  hopIndex: number
  title: string
  description: string
  packet: PacketState
  highlight: ('srcMac' | 'dstMac' | 'srcIp' | 'dstIp' | 'ttl')[]
  action: 'check' | 'arp' | 'forward' | 'deliver'
  calculation: CalculationType
  calcData?: Record<string, string | number>
}

const JOURNEY_STEPS: Step[] = [
  {
    hopIndex: 0,
    title: 'Check if destination is local',
    description: 'Is 8.8.8.8 on my subnet (192.168.1.0/24)?',
    packet: { srcMac: '??:??:??:??:??:??', dstMac: '??:??:??:??:??:??', srcIp: '192.168.1.100', dstIp: '8.8.8.8', ttl: 64 },
    highlight: ['srcIp', 'dstIp'],
    action: 'check',
    calculation: 'subnet-check',
  },
  {
    hopIndex: 0,
    title: 'Not local — use default gateway',
    description: '8.8.8.8 is NOT in 192.168.1.0/24. Route via gateway.',
    packet: { srcMac: '??:??:??:??:??:??', dstMac: '??:??:??:??:??:??', srcIp: '192.168.1.100', dstIp: '8.8.8.8', ttl: 64 },
    highlight: ['dstIp'],
    action: 'check',
    calculation: 'gateway-decision',
  },
  {
    hopIndex: 0,
    title: 'ARP for gateway MAC',
    description: 'Need MAC address of 192.168.1.1 to build frame.',
    packet: { srcMac: 'AA:AA:AA:11:11:11', dstMac: 'BB:BB:BB:22:22:22', srcIp: '192.168.1.100', dstIp: '8.8.8.8', ttl: 64 },
    highlight: ['srcMac', 'dstMac'],
    action: 'arp',
    calculation: 'arp',
    calcData: { targetIp: '192.168.1.1', targetMac: 'BB:BB:BB:22:22:22' },
  },
  {
    hopIndex: 0,
    title: 'Send frame to router',
    description: 'Ethernet frame ready. Forward to Home Router.',
    packet: { srcMac: 'AA:AA:AA:11:11:11', dstMac: 'BB:BB:BB:22:22:22', srcIp: '192.168.1.100', dstIp: '8.8.8.8', ttl: 64 },
    highlight: ['srcMac', 'dstMac'],
    action: 'forward',
    calculation: 'mac-rewrite',
    calcData: { from: 'Your Computer', to: 'Home Router', srcMac: 'AA:AA:AA:11:11:11', dstMac: 'BB:BB:BB:22:22:22' },
  },
  {
    hopIndex: 1,
    title: 'Router receives, decrements TTL',
    description: 'Strip frame, decrement TTL (64→63), check routing table.',
    packet: { srcMac: 'AA:AA:AA:11:11:11', dstMac: 'BB:BB:BB:22:22:22', srcIp: '192.168.1.100', dstIp: '8.8.8.8', ttl: 63 },
    highlight: ['ttl'],
    action: 'check',
    calculation: 'ttl-decrement',
    calcData: { oldTtl: 64, newTtl: 63 },
  },
  {
    hopIndex: 1,
    title: 'Router forwards to ISP',
    description: 'New frame with new MACs for next link.',
    packet: { srcMac: 'BB:BB:BB:22:22:22', dstMac: 'CC:CC:CC:33:33:33', srcIp: '192.168.1.100', dstIp: '8.8.8.8', ttl: 63 },
    highlight: ['srcMac', 'dstMac'],
    action: 'forward',
    calculation: 'mac-rewrite',
    calcData: { from: 'Home Router', to: 'ISP Router', srcMac: 'BB:BB:BB:22:22:22', dstMac: 'CC:CC:CC:33:33:33' },
  },
  {
    hopIndex: 2,
    title: 'ISP router processes',
    description: 'Decrement TTL (63→62), forward toward destination.',
    packet: { srcMac: 'CC:CC:CC:33:33:33', dstMac: 'DD:DD:DD:44:44:44', srcIp: '192.168.1.100', dstIp: '8.8.8.8', ttl: 62 },
    highlight: ['ttl', 'srcMac', 'dstMac'],
    action: 'forward',
    calculation: 'ttl-decrement',
    calcData: { oldTtl: 63, newTtl: 62, srcMac: 'CC:CC:CC:33:33:33', dstMac: 'DD:DD:DD:44:44:44' },
  },
  {
    hopIndex: 3,
    title: 'Destination reached!',
    description: 'Server sees its own IP. Packet delivered to app layer.',
    packet: { srcMac: 'CC:CC:CC:33:33:33', dstMac: 'DD:DD:DD:44:44:44', srcIp: '192.168.1.100', dstIp: '8.8.8.8', ttl: 62 },
    highlight: ['dstIp'],
    action: 'deliver',
    calculation: 'deliver',
  },
]

function ipToBinaryOctets(ip: string): string[] {
  return ip.split('.').map(octet => parseInt(octet).toString(2).padStart(8, '0'))
}

function SubnetCheckIllustration({ isLatest }: { isLatest: boolean }) {
  const [phase, setPhase] = useState<'processing' | 'result'>('processing')

  useEffect(() => {
    if (isLatest) {
      setPhase('processing')
      const timer = setTimeout(() => setPhase('result'), 1200)
      return () => clearTimeout(timer)
    }
  }, [isLatest])

  return (
    <div className="flex items-center justify-center gap-4 py-3">
      {/* Source IP */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-center"
      >
        <div className="text-[10px] text-slate-500 mb-1">Source</div>
        <div className="px-2 py-1 bg-emerald-100 rounded font-mono text-xs text-emerald-700">
          192.168.1.100
        </div>
      </motion.div>

      {/* AND operation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="text-[9px] text-slate-400">AND /24</div>
        <div className="text-slate-400">↓</div>
        <motion.div
          animate={{
            backgroundColor: phase === 'processing' ? '#fef3c7' : '#d1fae5',
          }}
          className="px-2 py-0.5 rounded font-mono text-[10px]"
        >
          {phase === 'processing' ? (
            <span className="text-amber-600">checking...</span>
          ) : (
            <span className="text-emerald-600">192.168.1.0</span>
          )}
        </motion.div>
      </motion.div>

      {/* Comparison */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: phase === 'result' ? 1 : 0.3,
          scale: 1
        }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            color: phase === 'result' ? '#ef4444' : '#94a3b8',
            scale: phase === 'result' ? [1, 1.3, 1] : 1
          }}
          className="text-xl font-bold"
        >
          ≠
        </motion.div>
        {phase === 'result' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[9px] text-red-500"
          >
            Different!
          </motion.div>
        )}
      </motion.div>

      {/* Destination IP */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col items-center"
      >
        <div className="text-[9px] text-slate-400">AND /24</div>
        <div className="text-slate-400">↓</div>
        <motion.div
          animate={{
            backgroundColor: phase === 'processing' ? '#fef3c7' : '#fef3c7',
          }}
          className="px-2 py-0.5 rounded font-mono text-[10px]"
        >
          {phase === 'processing' ? (
            <span className="text-amber-600">checking...</span>
          ) : (
            <span className="text-amber-600">8.8.8.0</span>
          )}
        </motion.div>
      </motion.div>

      {/* Destination */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-center"
      >
        <div className="text-[10px] text-slate-500 mb-1">Dest</div>
        <div className="px-2 py-1 bg-amber-100 rounded font-mono text-xs text-amber-700">
          8.8.8.8
        </div>
      </motion.div>
    </div>
  )
}

function GatewayDecisionIllustration({ isLatest }: { isLatest: boolean }) {
  const [phase, setPhase] = useState<'processing' | 'result'>('processing')
  const [checkingRow, setCheckingRow] = useState(0)

  useEffect(() => {
    if (isLatest) {
      setPhase('processing')
      setCheckingRow(0)

      // Animate through routing table
      const t1 = setTimeout(() => setCheckingRow(1), 400)
      const t2 = setTimeout(() => setCheckingRow(2), 800)
      const t3 = setTimeout(() => setPhase('result'), 1200)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [isLatest])

  const routes = [
    { network: '192.168.1.0/24', match: false },
    { network: '0.0.0.0/0', match: true, gateway: '192.168.1.1' },
  ]

  return (
    <div className="py-2 space-y-3">
      {/* Routing table lookup */}
      <div className="flex items-start gap-4">
        {/* Table */}
        <div className="flex-1 rounded border border-slate-200 overflow-hidden text-[10px]">
          <div className="bg-slate-100 px-2 py-1 font-semibold text-slate-600">
            Routing Table Lookup: 8.8.8.8
          </div>
          {routes.map((route, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor:
                  phase === 'result' && route.match
                    ? '#d1fae5'
                    : checkingRow === i && phase === 'processing'
                    ? '#fef3c7'
                    : '#ffffff',
              }}
              className="px-2 py-1.5 border-t border-slate-100 flex items-center justify-between"
            >
              <span className="font-mono">{route.network}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{
                  opacity: checkingRow >= i || phase === 'result' ? 1 : 0,
                }}
              >
                {route.match ? (
                  <span className="text-emerald-600 font-bold">✓ MATCH</span>
                ) : (
                  <span className="text-red-400">✗</span>
                )}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Result arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: phase === 'result' ? 1 : 0,
            x: phase === 'result' ? 0 : -10,
          }}
          className="flex items-center gap-2 pt-6"
        >
          <span className="text-emerald-500">→</span>
          <div className="text-center">
            <div className="text-xl">📡</div>
            <div className="text-[9px] text-emerald-600 font-mono font-bold">
              192.168.1.1
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ArpIllustration({ targetMac, isLatest }: { targetMac: string; isLatest: boolean }) {
  const [phase, setPhase] = useState<'broadcast' | 'waiting' | 'reply'>('broadcast')

  useEffect(() => {
    if (isLatest) {
      setPhase('broadcast')
      const t1 = setTimeout(() => setPhase('waiting'), 600)
      const t2 = setTimeout(() => setPhase('reply'), 1200)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isLatest])

  return (
    <div className="py-2 space-y-2">
      {/* Broadcast */}
      <div className="flex items-center gap-3">
        <div className="text-xl">💻</div>
        <div className="flex-1 relative h-8">
          {/* Broadcast waves */}
          <div className="absolute inset-0 flex items-center">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase !== 'reply' ? [0, 1.5, 2] : 2,
                  opacity: phase !== 'reply' ? [0.8, 0.4, 0] : 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  repeat: phase === 'broadcast' ? Infinity : 0,
                }}
                className="absolute left-4 w-6 h-6 rounded-full border-2 border-amber-400"
                style={{ left: 16 + i * 20 }}
              />
            ))}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: phase !== 'reply' ? '100%' : '100%' }}
              transition={{ duration: 0.5 }}
              className="absolute left-16 right-0 h-0.5 bg-amber-300"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: phase === 'broadcast' || phase === 'waiting' ? 1 : 0.3,
              x: 0
            }}
            className="absolute top-1/2 left-20 -translate-y-1/2 text-[10px] text-amber-600 bg-white px-1.5 py-0.5 rounded border border-amber-200"
          >
            Who has 192.168.1.1?
          </motion.div>
        </div>
        <motion.div
          animate={{ opacity: phase === 'waiting' ? [0.3, 0.6, 0.3] : 0.3 }}
          transition={{ duration: 0.5, repeat: phase === 'waiting' ? Infinity : 0 }}
          className="text-lg"
        >
          📡📡📡
        </motion.div>
      </div>

      {/* Reply */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'reply' ? 1 : 0 }}
        className="flex items-center gap-3"
      >
        <div className="text-xl">💻</div>
        <div className="flex-1 relative h-8">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase === 'reply' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ originX: 1 }}
            className="absolute inset-y-0 left-0 right-8 flex items-center"
          >
            <div className="w-full h-0.5 bg-emerald-400" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: phase === 'reply' ? 1 : 0,
              x: phase === 'reply' ? 0 : 20
            }}
            transition={{ delay: 0.2 }}
            className="absolute top-1/2 right-12 -translate-y-1/2 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
          >
            I&apos;m at {targetMac}!
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'reply' ? 1 : 0 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500"
          >
            ←
          </motion.span>
        </div>
        <motion.div
          animate={{
            scale: phase === 'reply' ? [1, 1.2, 1] : 1,
          }}
          className="text-xl"
        >
          📡
        </motion.div>
      </motion.div>
    </div>
  )
}

function TtlIllustration({ oldTtl, newTtl, isLatest }: { oldTtl: number; newTtl: number; isLatest: boolean }) {
  const [phase, setPhase] = useState<'processing' | 'result'>('processing')
  const [displayTtl, setDisplayTtl] = useState(oldTtl)

  useEffect(() => {
    if (isLatest) {
      setPhase('processing')
      setDisplayTtl(oldTtl)

      const t1 = setTimeout(() => {
        setDisplayTtl(newTtl)
        setPhase('result')
      }, 800)

      return () => clearTimeout(t1)
    }
  }, [isLatest, oldTtl, newTtl])

  const oldPercentage = (oldTtl / 64) * 100
  const newPercentage = (newTtl / 64) * 100

  return (
    <div className="py-2">
      <div className="flex items-center gap-4">
        {/* TTL gauge */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span>TTL remaining</span>
            <motion.span
              key={displayTtl}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono"
            >
              {displayTtl} hops left
            </motion.span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: `${oldPercentage}%` }}
              animate={{
                width: phase === 'result' ? `${newPercentage}%` : `${oldPercentage}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
            />
            {phase === 'processing' && (
              <motion.div
                initial={{ left: `${oldPercentage - 3}%`, opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.4, repeat: 2 }}
                className="absolute top-0 bottom-0 w-3 bg-amber-400 rounded-full"
                style={{ left: `${oldPercentage - 3}%` }}
              />
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.div
            animate={{
              scale: phase === 'processing' ? 1 : 0.9,
              opacity: phase === 'processing' ? 1 : 0.5,
            }}
            className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-mono text-lg text-slate-500 relative"
          >
            {oldTtl}
            {phase === 'result' && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="absolute inset-x-2 top-1/2 h-0.5 bg-red-400"
              />
            )}
          </motion.div>

          <motion.div
            animate={{ opacity: phase === 'result' ? 1 : 0.3 }}
            className="text-slate-400"
          >
            →
          </motion.div>

          <motion.div
            animate={{
              scale: phase === 'result' ? [1, 1.15, 1] : 1,
              borderColor: phase === 'result' ? '#34d399' : '#e2e8f0',
            }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 rounded-lg bg-emerald-50 border-2 flex items-center justify-center font-mono text-lg text-emerald-700 font-bold"
          >
            <motion.span
              key={displayTtl}
              initial={{ rotateX: -90 }}
              animate={{ rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {displayTtl}
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function MacRewriteIllustration({ from, to, srcMac, dstMac, isLatest }: { from: string; to: string; srcMac: string; dstMac: string; isLatest: boolean }) {
  const [phase, setPhase] = useState<'stripping' | 'rewriting' | 'done'>('stripping')

  useEffect(() => {
    if (isLatest) {
      setPhase('stripping')
      const t1 = setTimeout(() => setPhase('rewriting'), 600)
      const t2 = setTimeout(() => setPhase('done'), 1200)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isLatest])

  return (
    <div className="py-2 space-y-2">
      {/* Phase indicator */}
      <div className="flex items-center gap-2 text-[10px]">
        <motion.span
          animate={{
            color: phase === 'stripping' ? '#7c3aed' : '#94a3b8',
            fontWeight: phase === 'stripping' ? 600 : 400,
          }}
        >
          1. Strip old frame
        </motion.span>
        <span className="text-slate-300">→</span>
        <motion.span
          animate={{
            color: phase === 'rewriting' ? '#7c3aed' : '#94a3b8',
            fontWeight: phase === 'rewriting' ? 600 : 400,
          }}
        >
          2. Write new MACs
        </motion.span>
        <span className="text-slate-300">→</span>
        <motion.span
          animate={{
            color: phase === 'done' ? '#059669' : '#94a3b8',
            fontWeight: phase === 'done' ? 600 : 400,
          }}
        >
          3. Forward ✓
        </motion.span>
      </div>

      {/* Ethernet frame visualization */}
      <div className="flex items-stretch rounded-lg overflow-hidden border border-purple-200">
        {/* Dst MAC */}
        <motion.div
          animate={{
            backgroundColor: phase === 'stripping' ? '#fef3c7' : phase === 'rewriting' ? '#ede9fe' : '#f3e8ff',
            opacity: phase === 'stripping' ? [1, 0.5, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
          className="px-3 py-2 border-r border-purple-200"
        >
          <div className="text-[9px] text-purple-500 mb-0.5">Dst MAC</div>
          <motion.div
            key={phase === 'done' ? 'new' : 'old'}
            initial={{ opacity: 0, y: phase === 'done' ? 10 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[10px] text-purple-700 font-bold"
          >
            {phase === 'stripping' ? '??.??...' : dstMac.slice(0, 11)}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'done' ? 1 : 0 }}
            className="text-[8px] text-purple-500 mt-0.5"
          >
            → {to}
          </motion.div>
        </motion.div>

        {/* Src MAC */}
        <motion.div
          animate={{
            backgroundColor: phase === 'stripping' ? '#fef3c7' : phase === 'rewriting' ? '#ede9fe' : '#faf5ff',
            opacity: phase === 'stripping' ? [1, 0.5, 1] : 1,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="px-3 py-2 border-r border-purple-200"
        >
          <div className="text-[9px] text-purple-500 mb-0.5">Src MAC</div>
          <motion.div
            key={phase === 'done' ? 'new' : 'old'}
            initial={{ opacity: 0, y: phase === 'done' ? 10 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[10px] text-purple-700"
          >
            {phase === 'stripping' ? '??.??...' : srcMac.slice(0, 11)}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'done' ? 1 : 0 }}
            className="text-[8px] text-purple-500 mt-0.5"
          >
            ← {from}
          </motion.div>
        </motion.div>

        {/* IP Packet (unchanged) */}
        <motion.div
          animate={{
            scale: phase === 'stripping' ? [1, 1.02, 1] : 1,
          }}
          className="bg-blue-50 px-3 py-2 flex-1 flex items-center justify-center border-2 border-transparent"
          style={{
            borderColor: phase === 'done' ? '#60a5fa' : 'transparent',
          }}
        >
          <div className="text-center">
            <div className="text-[9px] text-blue-500">IP Packet</div>
            <div className="text-[10px] text-blue-600 font-mono">
              192.168.1.100 → 8.8.8.8
            </div>
            <motion.div
              animate={{
                color: phase === 'done' ? '#059669' : '#94a3b8',
              }}
              className="text-[8px]"
            >
              {phase === 'done' ? 'unchanged ✓' : 'preserved'}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function DeliverIllustration({ isLatest }: { isLatest: boolean }) {
  const [phase, setPhase] = useState<'arriving' | 'climbing' | 'delivered'>('arriving')
  const [activeLayer, setActiveLayer] = useState(0)

  useEffect(() => {
    if (isLatest) {
      setPhase('arriving')
      setActiveLayer(0)

      const t1 = setTimeout(() => {
        setPhase('climbing')
        setActiveLayer(1)
      }, 400)
      const t2 = setTimeout(() => setActiveLayer(2), 700)
      const t3 = setTimeout(() => setActiveLayer(3), 1000)
      const t4 = setTimeout(() => setPhase('delivered'), 1300)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
      }
    }
  }, [isLatest])

  const layers = [
    { name: 'Network', color: 'bg-blue-100', activeColor: 'bg-blue-200' },
    { name: 'Transport', color: 'bg-purple-100', activeColor: 'bg-purple-200' },
    { name: 'Application', color: 'bg-emerald-100', activeColor: 'bg-emerald-200' },
  ]

  return (
    <div className="py-2">
      <div className="flex items-center justify-center gap-6">
        {/* Packet arriving */}
        <motion.div
          animate={{
            x: phase === 'arriving' ? [0, 10, 0] : 0,
            opacity: phase === 'delivered' ? 0.3 : 1,
          }}
          transition={{ duration: 0.5, repeat: phase === 'arriving' ? Infinity : 0 }}
          className="flex items-center gap-2"
        >
          <div className="text-2xl">📨</div>
          <motion.div
            animate={{ x: phase !== 'arriving' ? 10 : 0 }}
            className="text-emerald-500 text-xl"
          >
            →
          </motion.div>
        </motion.div>

        {/* Server stack */}
        <div className="relative">
          <div className="flex flex-col-reverse items-center gap-1 p-3 rounded-lg bg-slate-50 border-2 border-slate-200">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.name}
                animate={{
                  backgroundColor: activeLayer > i ? (i === 2 ? '#d1fae5' : '#e2e8f0') : '#f8fafc',
                  scale: activeLayer === i + 1 ? 1.05 : 1,
                  borderColor: activeLayer === i + 1 ? '#60a5fa' : '#e2e8f0',
                }}
                className="px-4 py-1.5 rounded text-[10px] border-2 relative"
              >
                <span className={activeLayer > i ? (i === 2 ? 'text-emerald-700 font-semibold' : 'text-slate-600') : 'text-slate-400'}>
                  {layer.name}
                </span>
                {activeLayer === i + 1 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Checkmark badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === 'delivered' ? 1 : 0,
              opacity: phase === 'delivered' ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md"
          >
            <span className="text-white text-sm">✓</span>
          </motion.div>
        </div>

        {/* Server icon */}
        <motion.div
          animate={{
            scale: phase === 'delivered' ? [1, 1.1, 1] : 1,
          }}
          className="text-center"
        >
          <div className="text-3xl">🌐</div>
          <motion.div
            animate={{
              color: phase === 'delivered' ? '#059669' : '#64748b',
            }}
            className="text-[10px] font-mono"
          >
            8.8.8.8
          </motion.div>
          {phase === 'delivered' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[9px] text-emerald-600 font-semibold"
            >
              Received!
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function TimelineEntry({ step, stepNumber, isLatest, showMath }: { step: Step; stepNumber: number; isLatest: boolean; showMath: boolean }) {
  const getStepColor = () => {
    if (step.action === 'deliver') return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500' }
    if (step.action === 'arp') return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', dot: 'bg-amber-500' }
    if (step.action === 'forward') return { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', dot: 'bg-purple-500' }
    return { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', dot: 'bg-blue-500' }
  }

  const colors = getStepColor()

  const renderIllustration = () => {
    switch (step.calculation) {
      case 'subnet-check':
        return <SubnetCheckIllustration isLatest={isLatest} />
      case 'gateway-decision':
        return <GatewayDecisionIllustration isLatest={isLatest} />
      case 'arp':
        return <ArpIllustration targetMac={step.calcData?.targetMac as string} isLatest={isLatest} />
      case 'ttl-decrement':
        return <TtlIllustration oldTtl={step.calcData?.oldTtl as number} newTtl={step.calcData?.newTtl as number} isLatest={isLatest} />
      case 'mac-rewrite':
        return <MacRewriteIllustration
          from={step.calcData?.from as string}
          to={step.calcData?.to as string}
          srcMac={step.calcData?.srcMac as string}
          dstMac={step.calcData?.dstMac as string}
          isLatest={isLatest}
        />
      case 'deliver':
        return <DeliverIllustration isLatest={isLatest} />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative pl-6"
    >
      {/* Timeline line */}
      <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-slate-200" />

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${colors.dot} ${isLatest ? 'ring-4 ring-opacity-30 ring-current' : ''}`}
      />

      {/* Content */}
      <div className={`rounded-lg border ${colors.border} ${colors.bg} p-3 mb-3`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className={`text-sm font-semibold ${colors.text}`}>
            {stepNumber}. {step.title}
          </div>
          <div className="text-[10px] text-slate-400 shrink-0">
            {NETWORK[step.hopIndex].name}
          </div>
        </div>
        <div className="text-xs text-slate-600 mb-2">
          {step.description}
        </div>

        {/* Calculation */}
        {showMath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-2 pt-2 border-t ${colors.border} border-opacity-50`}
          >
            {renderIllustration()}
          </motion.div>
        )}

        {/* Packet state for this step */}
        <div className="mt-2 pt-2 border-t border-slate-200 border-opacity-50">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono">
            <span className={step.highlight.includes('srcMac') ? 'text-amber-600 font-bold' : 'text-slate-400'}>
              srcMAC: {step.packet.srcMac}
            </span>
            <span className={step.highlight.includes('dstMac') ? 'text-amber-600 font-bold' : 'text-slate-400'}>
              dstMAC: {step.packet.dstMac}
            </span>
            <span className={step.highlight.includes('ttl') ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              TTL: {step.packet.ttl}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function PacketJourneyDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showMath, setShowMath] = useState(true)
  const timelineRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-scroll to top when new step is added
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = 0
    }
  }, [currentStep])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const visibleSteps = JOURNEY_STEPS.slice(0, currentStep + 1)

  const playAnimation = () => {
    if (isPlaying) return
    setIsPlaying(true)
    setCurrentStep(0)

    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      if (i < JOURNEY_STEPS.length) {
        setCurrentStep(i)
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        setIsPlaying(false)
      }
    }, 1500)
  }

  const nextStep = () => {
    if (currentStep < JOURNEY_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const currentHop = JOURNEY_STEPS[currentStep].hopIndex

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">Packet Journey: 192.168.1.100 → 8.8.8.8</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMath(!showMath)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              showMath
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showMath ? 'Showing Math' : 'Show Math'}
          </button>
        </div>
      </div>

      {/* Network diagram */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {NETWORK.map((hop, i) => {
            const isActive = currentHop === i
            const isPast = currentHop > i

            return (
              <div key={i} className="flex items-center">
                <motion.div
                  className="text-center"
                  animate={{ scale: isActive ? 1.1 : 1 }}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-colors ${
                      isActive
                        ? 'bg-blue-100 border-2 border-blue-400 ring-4 ring-blue-100'
                        : isPast
                        ? 'bg-emerald-50 border-2 border-emerald-300'
                        : 'bg-slate-100 border-2 border-slate-200'
                    }`}
                  >
                    {hop.type === 'host' ? '💻' : hop.type === 'router' ? '📡' : '🌐'}
                  </div>
                  <div className={`text-[10px] font-semibold mt-1 ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>
                    {hop.name}
                  </div>
                </motion.div>
                {i < NETWORK.length - 1 && (
                  <div className="flex-1 mx-1">
                    <div
                      className={`h-1 rounded transition-colors ${
                        currentHop > i ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={playAnimation}
          disabled={isPlaying}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            isPlaying
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          <span>▶</span> {isPlaying ? 'Playing...' : 'Play'}
        </button>
        <button
          onClick={nextStep}
          disabled={isPlaying || currentStep >= JOURNEY_STEPS.length - 1}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isPlaying || currentStep >= JOURNEY_STEPS.length - 1
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Next Step
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Reset
        </button>
        <div className="ml-auto text-xs text-slate-400">
          Step {currentStep + 1} of {JOURNEY_STEPS.length}
        </div>
      </div>

      {/* Timeline - reverse chronological */}
      <div
        ref={timelineRef}
        className="max-h-[400px] overflow-y-auto pr-2 -mr-2 pl-1 -ml-1"
      >
        <AnimatePresence>
          {[...visibleSteps].reverse().map((step, idx) => {
            const actualIndex = visibleSteps.length - 1 - idx
            return (
              <TimelineEntry
                key={actualIndex}
                step={step}
                stepNumber={actualIndex + 1}
                isLatest={actualIndex === currentStep}
                showMath={showMath}
              />
            )
          })}
        </AnimatePresence>
      </div>

      {/* IP addresses reminder */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <div className="font-mono">
            <span className="text-slate-400">IP:</span>{' '}
            <span className="text-blue-600">192.168.1.100</span>
            <span className="text-slate-300 mx-2">→</span>
            <span className="text-blue-600">8.8.8.8</span>
            <span className="text-slate-400 ml-2">(unchanged end-to-end)</span>
          </div>
          {currentStep === JOURNEY_STEPS.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-emerald-600 font-medium"
            >
              <span>✓</span> Journey complete!
            </motion.div>
          )}
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <strong>Key insight:</strong> MAC addresses change at every hop (Layer 2),
        but IP addresses stay the same end-to-end (Layer 3). TTL decrements at each router.
      </div>
    </div>
  )
}
