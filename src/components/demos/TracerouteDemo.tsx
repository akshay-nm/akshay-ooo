'use client'

import { useState, useEffect, useCallback } from 'react'

interface Hop {
  id: number
  name: string
  ip: string
  latency: number
  location: string
}

const HOPS: Hop[] = [
  { id: 1, name: 'Home Router', ip: '192.168.1.1', latency: 1, location: 'Your network' },
  { id: 2, name: 'ISP Gateway', ip: '10.0.0.1', latency: 5, location: 'ISP local' },
  { id: 3, name: 'ISP Core', ip: '72.14.215.85', latency: 12, location: 'Regional' },
  { id: 4, name: 'Internet Exchange', ip: '198.32.132.50', latency: 18, location: 'IX point' },
  { id: 5, name: 'CDN Edge', ip: '142.250.68.14', latency: 22, location: 'Nearby DC' },
  { id: 6, name: 'Destination', ip: '142.250.185.78', latency: 25, location: 'google.com' },
]

type AnimationState = 'idle' | 'running' | 'complete'

interface PacketState {
  ttl: number
  position: number // Which hop it's at (0 = source, 1-6 = hops)
  state: 'traveling' | 'expired' | 'arrived' | 'returning'
}

export function TracerouteDemo() {
  const [animationState, setAnimationState] = useState<AnimationState>('idle')
  const [currentTTL, setCurrentTTL] = useState(0)
  const [discoveredHops, setDiscoveredHops] = useState<number[]>([])
  const [packet, setPacket] = useState<PacketState | null>(null)
  const [icmpReturn, setIcmpReturn] = useState<number | null>(null)

  const reset = useCallback(() => {
    setAnimationState('idle')
    setCurrentTTL(0)
    setDiscoveredHops([])
    setPacket(null)
    setIcmpReturn(null)
  }, [])

  const runTraceroute = useCallback(() => {
    reset()
    setAnimationState('running')
    setCurrentTTL(1)
  }, [reset])

  // Animation loop
  useEffect(() => {
    if (animationState !== 'running' || currentTTL === 0) return

    // Send packet with current TTL
    setPacket({ ttl: currentTTL, position: 0, state: 'traveling' })

    // Animate packet traveling
    let pos = 0
    const travelInterval = setInterval(() => {
      pos++
      if (pos <= currentTTL && pos <= HOPS.length) {
        setPacket({ ttl: currentTTL - pos, position: pos, state: 'traveling' })
      } else {
        clearInterval(travelInterval)

        // TTL expired at this hop or reached destination
        const expiredAt = Math.min(currentTTL, HOPS.length)
        const reachedDestination = currentTTL >= HOPS.length

        if (reachedDestination) {
          setPacket({ ttl: 0, position: HOPS.length, state: 'arrived' })
        } else {
          setPacket({ ttl: 0, position: expiredAt, state: 'expired' })
        }

        // ICMP response coming back
        setTimeout(() => {
          setIcmpReturn(expiredAt)

          // Show ICMP traveling back
          let returnPos = expiredAt
          const returnInterval = setInterval(() => {
            returnPos--
            setIcmpReturn(returnPos)

            if (returnPos <= 0) {
              clearInterval(returnInterval)

              // Hop discovered
              setDiscoveredHops(prev => [...prev, expiredAt])
              setPacket(null)
              setIcmpReturn(null)

              // Next TTL or complete
              setTimeout(() => {
                if (reachedDestination) {
                  setAnimationState('complete')
                } else {
                  setCurrentTTL(prev => prev + 1)
                }
              }, 300)
            }
          }, 150)
        }, 300)
      }
    }, 200)

    return () => clearInterval(travelInterval)
  }, [animationState, currentTTL])

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">Traceroute: TTL in Action</h4>
        <button
          onClick={animationState === 'idle' ? runTraceroute : reset}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            animationState === 'running'
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
          disabled={animationState === 'running'}
        >
          {animationState === 'idle' ? 'Run Traceroute' : animationState === 'running' ? 'Running...' : 'Reset'}
        </button>
      </div>

      {/* Network visualization */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between">
          {/* Source */}
          <div className="text-center z-10">
            <div className="w-12 h-12 rounded-lg bg-blue-100 border-2 border-blue-300 flex items-center justify-center mb-1">
              <span className="text-lg">💻</span>
            </div>
            <div className="text-[10px] text-slate-500">You</div>
          </div>

          {/* Hops */}
          {HOPS.map((hop, i) => {
            const isDiscovered = discoveredHops.includes(hop.id)
            const isPacketHere = packet?.position === hop.id
            const isIcmpHere = icmpReturn === hop.id
            const isExpired = isPacketHere && packet?.state === 'expired'
            const isArrived = isPacketHere && packet?.state === 'arrived'

            return (
              <div key={hop.id} className="text-center z-10 relative">
                <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center mb-1 transition-all ${
                  isArrived
                    ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300'
                    : isExpired
                    ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300'
                    : isDiscovered
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-slate-100 border-slate-200'
                }`}>
                  {hop.id === HOPS.length ? (
                    <span className="text-lg">🌐</span>
                  ) : (
                    <span className="text-lg">📡</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500">
                  {isDiscovered ? hop.name : `Hop ${hop.id}`}
                </div>
                {isDiscovered && (
                  <div className="text-[9px] font-mono text-slate-400">{hop.ip}</div>
                )}

                {/* Packet indicator */}
                {isPacketHere && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${
                      isExpired ? 'bg-amber-500 text-white' :
                      isArrived ? 'bg-emerald-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      TTL={packet.ttl}
                    </div>
                  </div>
                )}

                {/* ICMP indicator */}
                {isIcmpHere && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <div className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-amber-500 text-white animate-pulse">
                      ICMP
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Connection lines */}
        <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-200 -z-0" />

        {/* Packet traveling line */}
        {packet && (
          <div
            className="absolute top-5 left-12 h-1.5 bg-blue-400 rounded-full transition-all duration-200"
            style={{
              width: `${(packet.position / (HOPS.length + 1)) * 100}%`,
            }}
          />
        )}

        {/* ICMP return line */}
        {icmpReturn !== null && (
          <div
            className="absolute top-7 left-12 h-1 bg-amber-400 rounded-full transition-all duration-150"
            style={{
              width: `${(icmpReturn / (HOPS.length + 1)) * 100}%`,
            }}
          />
        )}
      </div>

      {/* Current status */}
      <div className={`mb-4 p-3 rounded-lg text-sm ${
        animationState === 'complete'
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          : animationState === 'running'
          ? 'bg-blue-50 border border-blue-200 text-blue-800'
          : 'bg-slate-50 border border-slate-200 text-slate-600'
      }`}>
        {animationState === 'idle' && (
          <span>Click &quot;Run Traceroute&quot; to see how TTL discovers the path to google.com</span>
        )}
        {animationState === 'running' && packet && (
          <span>
            Sending packet with <strong>TTL={currentTTL}</strong>...
            {packet.state === 'expired' && ` TTL expired at hop ${packet.position}, receiving ICMP Time Exceeded`}
            {packet.state === 'arrived' && ' Destination reached!'}
          </span>
        )}
        {animationState === 'complete' && (
          <span>
            <strong>Traceroute complete!</strong> Found {HOPS.length} hops to destination.
          </span>
        )}
      </div>

      {/* Results table */}
      {discoveredHops.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Hop</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">IP Address</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">RTT</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {discoveredHops.map(hopId => {
                const hop = HOPS.find(h => h.id === hopId)!
                return (
                  <tr key={hopId} className={hopId === HOPS.length ? 'bg-emerald-50' : ''}>
                    <td className="px-3 py-2 text-slate-600">{hopId}</td>
                    <td className="px-3 py-2 text-slate-800">{hop.ip}</td>
                    <td className="px-3 py-2 text-slate-600">{hop.latency}ms</td>
                    <td className="px-3 py-2 text-slate-500">{hop.location}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>How it works:</strong> Send packets with increasing TTL (1, 2, 3...).
        Each router decrements TTL. When TTL=0, router drops the packet and sends back
        ICMP &quot;Time Exceeded&quot; — revealing its IP. Keep going until destination replies.
      </div>
    </div>
  )
}
