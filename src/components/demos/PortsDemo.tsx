'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Connection {
  id: number
  clientIp: string
  clientPort: number
  serverPort: number
  protocol: 'HTTP' | 'HTTPS' | 'SSH' | 'DNS'
  status: 'active' | 'closing'
}

const WELL_KNOWN_PORTS = [
  { port: 22, name: 'SSH', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { port: 53, name: 'DNS', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { port: 80, name: 'HTTP', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { port: 443, name: 'HTTPS', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
]

const CLIENT_IPS = ['192.168.1.10', '192.168.1.25', '10.0.0.50', '172.16.5.100']

export function PortsDemo() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [nextId, setNextId] = useState(1)
  const [isAutoMode, setIsAutoMode] = useState(false)

  const addConnection = (serverPort: number, protocol: Connection['protocol']) => {
    const newConnection: Connection = {
      id: nextId,
      clientIp: CLIENT_IPS[Math.floor(Math.random() * CLIENT_IPS.length)],
      clientPort: 49152 + Math.floor(Math.random() * 16383),
      serverPort,
      protocol,
      status: 'active',
    }
    setConnections(prev => [...prev, newConnection])
    setNextId(prev => prev + 1)
  }

  const removeConnection = (id: number) => {
    setConnections(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'closing' as const } : c))
    )
    setTimeout(() => {
      setConnections(prev => prev.filter(c => c.id !== id))
    }, 300)
  }

  // Auto-mode: randomly add/remove connections
  useEffect(() => {
    if (!isAutoMode) return

    const interval = setInterval(() => {
      const action = Math.random()

      if (action < 0.6 || connections.length === 0) {
        // Add a connection
        const portInfo = WELL_KNOWN_PORTS[Math.floor(Math.random() * WELL_KNOWN_PORTS.length)]
        addConnection(portInfo.port, portInfo.name as Connection['protocol'])
      } else {
        // Remove a connection
        const activeConnections = connections.filter(c => c.status === 'active')
        if (activeConnections.length > 0) {
          const toRemove = activeConnections[Math.floor(Math.random() * activeConnections.length)]
          removeConnection(toRemove.id)
        }
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [isAutoMode, connections.length])

  const groupedConnections = WELL_KNOWN_PORTS.map(portInfo => ({
    ...portInfo,
    connections: connections.filter(c => c.serverPort === portInfo.port),
  }))

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-slate-900">Ports &amp; Sockets</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              isAutoMode
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isAutoMode ? 'Auto: ON' : 'Auto: OFF'}
          </button>
          <button
            onClick={() => setConnections([])}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Server visualization */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-3">Server: 203.0.113.50 (click a port to add a connection)</div>

        <div className="grid grid-cols-4 gap-3">
          {WELL_KNOWN_PORTS.map(portInfo => (
            <button
              key={portInfo.port}
              onClick={() => addConnection(portInfo.port, portInfo.name as Connection['protocol'])}
              className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md ${portInfo.color}`}
            >
              <div className="text-2xl font-bold font-mono">{portInfo.port}</div>
              <div className="text-xs font-semibold">{portInfo.name}</div>

              {/* Connection count badge */}
              {groupedConnections.find(g => g.port === portInfo.port)!.connections.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center"
                >
                  {groupedConnections.find(g => g.port === portInfo.port)!.connections.length}
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active connections */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-2">
          Active Connections ({connections.filter(c => c.status === 'active').length})
        </div>

        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 grid grid-cols-5 gap-2">
            <div>Protocol</div>
            <div>Client IP</div>
            <div>Client Port</div>
            <div>Server Port</div>
            <div></div>
          </div>

          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {connections.length === 0 ? (
                <div className="px-3 py-4 text-xs text-slate-400 text-center">
                  No active connections. Click a port above to add one.
                </div>
              ) : (
                connections.map(conn => (
                  <motion.div
                    key={conn.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 py-2 text-xs grid grid-cols-5 gap-2 items-center"
                  >
                    <div className="font-semibold">{conn.protocol}</div>
                    <div className="font-mono text-slate-600">{conn.clientIp}</div>
                    <div className="font-mono text-slate-600">{conn.clientPort}</div>
                    <div className="font-mono text-slate-600">{conn.serverPort}</div>
                    <button
                      onClick={() => removeConnection(conn.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors text-right"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 5-tuple explanation */}
      {connections.length > 0 && (
        <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-xs font-semibold text-blue-800 mb-2">Example 5-tuple (from first connection):</div>
          <div className="font-mono text-xs text-blue-700 space-y-1">
            <div className="flex gap-2">
              <span className="text-blue-500 w-24">Protocol:</span>
              <span>TCP</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-500 w-24">Src IP:</span>
              <span>{connections[0]?.clientIp}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-500 w-24">Src Port:</span>
              <span>{connections[0]?.clientPort}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-500 w-24">Dst IP:</span>
              <span>203.0.113.50</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-500 w-24">Dst Port:</span>
              <span>{connections[0]?.serverPort}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            This unique combination identifies the connection. Multiple clients can connect to the same server port because each has a different 5-tuple.
          </div>
        </div>
      )}

      {/* Port ranges info */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="font-semibold text-slate-700 mb-1">Well-known</div>
          <div className="text-slate-500">0 - 1023</div>
          <div className="text-[10px] text-slate-400 mt-1">System services</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="font-semibold text-slate-700 mb-1">Registered</div>
          <div className="text-slate-500">1024 - 49151</div>
          <div className="text-[10px] text-slate-400 mt-1">Applications</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="font-semibold text-slate-700 mb-1">Dynamic</div>
          <div className="text-slate-500">49152 - 65535</div>
          <div className="text-[10px] text-slate-400 mt-1">Client ephemeral</div>
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Key concept:</strong> A server listens on one port but handles thousands of connections.
        Each connection has a unique 5-tuple. The client&apos;s ephemeral port makes each connection distinct.
      </div>
    </div>
  )
}
