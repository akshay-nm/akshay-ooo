'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Packet {
  id: number
  status: 'sending' | 'delivered' | 'lost' | 'retransmitting'
  position: number // 0 to 1
}

export function TCPvsUDPDemo() {
  const [tcpPackets, setTcpPackets] = useState<Packet[]>([])
  const [udpPackets, setUdpPackets] = useState<Packet[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [tcpDelivered, setTcpDelivered] = useState<number[]>([])
  const [udpDelivered, setUdpDelivered] = useState<number[]>([])

  const reset = useCallback(() => {
    setTcpPackets([])
    setUdpPackets([])
    setTcpDelivered([])
    setUdpDelivered([])
    setIsRunning(false)
  }, [])

  const startSimulation = useCallback(() => {
    if (isRunning) return
    reset()
    setIsRunning(true)
  }, [isRunning, reset])

  useEffect(() => {
    if (!isRunning) return

    const packetsToSend = [1, 2, 3, 4, 5]
    const lostPackets = [2, 4] // Packets 2 and 4 will be "lost"
    let packetIndex = 0

    const sendNextPacket = () => {
      if (packetIndex >= packetsToSend.length) return

      const packetId = packetsToSend[packetIndex]
      const isLost = lostPackets.includes(packetId)

      // Send TCP packet
      setTcpPackets(prev => [...prev, { id: packetId, status: 'sending', position: 0 }])
      // Send UDP packet
      setUdpPackets(prev => [...prev, { id: packetId, status: 'sending', position: 0 }])

      // Animate packets
      const animateInterval = setInterval(() => {
        setTcpPackets(prev => prev.map(p =>
          p.id === packetId && p.status === 'sending'
            ? { ...p, position: Math.min(p.position + 0.1, 1) }
            : p
        ))
        setUdpPackets(prev => prev.map(p =>
          p.id === packetId && p.status === 'sending'
            ? { ...p, position: Math.min(p.position + 0.15, 1) } // UDP is faster
            : p
        ))
      }, 50)

      // Handle delivery/loss
      setTimeout(() => {
        clearInterval(animateInterval)

        // TCP: if lost, will retransmit
        if (isLost) {
          setTcpPackets(prev => prev.map(p =>
            p.id === packetId ? { ...p, status: 'lost', position: 0.5 } : p
          ))
          // UDP: packet is just lost
          setUdpPackets(prev => prev.map(p =>
            p.id === packetId ? { ...p, status: 'lost', position: 0.6 } : p
          ))

          // TCP retransmit after delay
          setTimeout(() => {
            setTcpPackets(prev => prev.map(p =>
              p.id === packetId ? { ...p, status: 'retransmitting', position: 0 } : p
            ))

            // Animate retransmission
            const retransmitInterval = setInterval(() => {
              setTcpPackets(prev => prev.map(p =>
                p.id === packetId && p.status === 'retransmitting'
                  ? { ...p, position: Math.min(p.position + 0.1, 1) }
                  : p
              ))
            }, 50)

            setTimeout(() => {
              clearInterval(retransmitInterval)
              setTcpPackets(prev => prev.map(p =>
                p.id === packetId ? { ...p, status: 'delivered', position: 1 } : p
              ))
              setTcpDelivered(prev => [...prev, packetId].sort((a, b) => a - b))
            }, 600)
          }, 400)
        } else {
          // Successful delivery
          setTcpPackets(prev => prev.map(p =>
            p.id === packetId ? { ...p, status: 'delivered', position: 1 } : p
          ))
          setUdpPackets(prev => prev.map(p =>
            p.id === packetId ? { ...p, status: 'delivered', position: 1 } : p
          ))
          setTcpDelivered(prev => [...prev, packetId].sort((a, b) => a - b))
          setUdpDelivered(prev => [...prev, packetId])
        }
      }, 600)

      packetIndex++
      if (packetIndex < packetsToSend.length) {
        setTimeout(sendNextPacket, 400)
      } else {
        setTimeout(() => setIsRunning(false), 2000)
      }
    }

    sendNextPacket()
  }, [isRunning])

  const renderPacketPath = (packets: Packet[], protocol: 'tcp' | 'udp') => (
    <div className="relative h-16 bg-slate-100 rounded-lg overflow-hidden">
      {/* Path line */}
      <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-300 -translate-y-1/2" />

      {/* Packets */}
      <AnimatePresence>
        {packets.map(packet => (
          <motion.div
            key={`${packet.id}-${packet.status}`}
            initial={{ left: '10%', opacity: 0 }}
            animate={{
              left: `${10 + packet.position * 80}%`,
              opacity: packet.status === 'lost' ? 0 : 1,
              scale: packet.status === 'lost' ? 0.5 : 1,
            }}
            transition={{ duration: 0.1 }}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow ${
              packet.status === 'delivered'
                ? 'bg-emerald-500 text-white'
                : packet.status === 'retransmitting'
                ? 'bg-amber-500 text-white'
                : packet.status === 'lost'
                ? 'bg-red-500 text-white'
                : protocol === 'tcp'
                ? 'bg-blue-500 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {packet.id}
            {packet.status === 'lost' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 text-red-500"
              >
                ✕
              </motion.span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sender/Receiver labels */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-lg">📤</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg">📥</div>
    </div>
  )

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-slate-900">TCP vs UDP: Packet Delivery</h4>
        <button
          onClick={isRunning ? reset : startSimulation}
          className={`px-4 py-2 text-xs rounded-lg transition-colors ${
            isRunning
              ? 'bg-slate-500 text-white hover:bg-slate-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isRunning ? 'Reset' : 'Send 5 Packets'}
        </button>
      </div>

      <div className="text-xs text-slate-500 mb-4 p-2 rounded bg-amber-50 border border-amber-200">
        Packets 2 and 4 will be &quot;lost&quot; in transit. Watch how TCP and UDP handle it differently.
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* TCP Side */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-sm font-semibold text-slate-700">TCP (Reliable)</span>
          </div>
          {renderPacketPath(tcpPackets, 'tcp')}
          <div className="mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">Received:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(id => (
                  <span
                    key={id}
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono ${
                      tcpDelivered.includes(id)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-emerald-600">
              Lost packets retransmitted. All data arrives in order.
            </div>
          </div>
        </div>

        {/* UDP Side */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-sm font-semibold text-slate-700">UDP (Fast)</span>
          </div>
          {renderPacketPath(udpPackets, 'udp')}
          <div className="mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">Received:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(id => (
                  <span
                    key={id}
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono ${
                      udpDelivered.includes(id)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-400'
                    }`}
                  >
                    {udpDelivered.includes(id) ? id : '✕'}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-amber-600">
              Lost packets are gone forever. Faster but incomplete.
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-6 rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">Feature</th>
              <th className="px-3 py-2 text-left font-semibold text-blue-700">TCP</th>
              <th className="px-3 py-2 text-left font-semibold text-amber-700">UDP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-3 py-2 text-slate-600">Connection</td>
              <td className="px-3 py-2">Connection-oriented</td>
              <td className="px-3 py-2">Connectionless</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-slate-600">Reliability</td>
              <td className="px-3 py-2 text-emerald-600">Guaranteed delivery</td>
              <td className="px-3 py-2 text-amber-600">Best effort</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-slate-600">Ordering</td>
              <td className="px-3 py-2 text-emerald-600">In-order delivery</td>
              <td className="px-3 py-2 text-amber-600">No ordering</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-slate-600">Speed</td>
              <td className="px-3 py-2 text-amber-600">Slower (overhead)</td>
              <td className="px-3 py-2 text-emerald-600">Faster</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-slate-600">Header size</td>
              <td className="px-3 py-2">20+ bytes</td>
              <td className="px-3 py-2">8 bytes</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-slate-600">Use cases</td>
              <td className="px-3 py-2">HTTP, SSH, FTP, Email</td>
              <td className="px-3 py-2">DNS, Streaming, Gaming</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Trade-off:</strong> TCP guarantees delivery but adds latency (handshake, ACKs, retransmits).
        UDP is faster but packets can be lost. Choose based on your application&apos;s needs.
      </div>
    </div>
  )
}
