'use client'

import { useState, useMemo } from 'react'

interface Route {
  network: string
  prefix: number
  gateway: string
  iface: string
  description: string
}

const ROUTING_TABLE: Route[] = [
  { network: '192.168.1.0', prefix: 24, gateway: 'direct', iface: 'eth0', description: 'Local network' },
  { network: '192.168.0.0', prefix: 16, gateway: '192.168.1.1', iface: 'eth0', description: 'Campus network' },
  { network: '10.0.0.0', prefix: 8, gateway: '192.168.1.254', iface: 'eth0', description: 'Corporate VPN' },
  { network: '10.10.0.0', prefix: 16, gateway: '192.168.1.100', iface: 'eth0', description: 'Data center' },
  { network: '10.10.5.0', prefix: 24, gateway: '192.168.1.50', iface: 'eth0', description: 'Database servers' },
  { network: '0.0.0.0', prefix: 0, gateway: '192.168.1.1', iface: 'eth0', description: 'Default route (internet)' },
]

const EXAMPLE_IPS = [
  '192.168.1.50',
  '192.168.5.100',
  '10.10.5.25',
  '10.10.100.1',
  '10.50.0.1',
  '8.8.8.8',
  '142.250.185.78',
]

function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number)
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
}

function networkToNumber(network: string, prefix: number): { start: number; mask: number } {
  const ip = ipToNumber(network)
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0
  return { start: ip & mask, mask }
}

function matchesRoute(ip: string, route: Route): boolean {
  const ipNum = ipToNumber(ip)
  const { start, mask } = networkToNumber(route.network, route.prefix)
  return (ipNum & mask) === start
}

function ipToBinary(ip: string): string {
  return ip.split('.').map(octet =>
    parseInt(octet).toString(2).padStart(8, '0')
  ).join('')
}

export function RoutingDemo() {
  const [destinationIp, setDestinationIp] = useState('10.10.5.25')
  const [isValidIp, setIsValidIp] = useState(true)
  const [showBinaryDetail, setShowBinaryDetail] = useState(false)

  const handleIpChange = (value: string) => {
    setDestinationIp(value)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (ipRegex.test(value)) {
      const parts = value.split('.').map(Number)
      setIsValidIp(parts.every(p => p >= 0 && p <= 255))
    } else {
      setIsValidIp(false)
    }
  }

  const matches = useMemo(() => {
    if (!isValidIp) return []
    return ROUTING_TABLE
      .filter(route => matchesRoute(destinationIp, route))
      .sort((a, b) => b.prefix - a.prefix) // Sort by prefix length descending
  }, [destinationIp, isValidIp])

  const bestMatch = matches[0]
  const destBinary = isValidIp ? ipToBinary(destinationIp) : ''

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">Longest Prefix Match</h4>
        <button
          onClick={() => setShowBinaryDetail(!showBinaryDetail)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            showBinaryDetail
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {showBinaryDetail ? 'Showing Binary' : 'Show Binary'}
        </button>
      </div>

      {/* Destination input */}
      <div className="mb-6">
        <label className="text-xs text-slate-500 mb-2 block">Destination IP Address</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={destinationIp}
            onChange={(e) => handleIpChange(e.target.value)}
            className={`flex-1 px-3 py-2 font-mono text-sm border rounded-lg ${
              isValidIp ? 'border-slate-200' : 'border-red-300 bg-red-50'
            }`}
            placeholder="e.g., 10.10.5.25"
          />
        </div>
        {/* Quick select */}
        <div className="flex flex-wrap gap-1 mt-2">
          {EXAMPLE_IPS.map(ip => (
            <button
              key={ip}
              onClick={() => handleIpChange(ip)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                destinationIp === ip
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ip}
            </button>
          ))}
        </div>
      </div>

      {/* Binary representation */}
      {isValidIp && (
        <div className="mb-6 bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-500 mb-1">Destination in binary:</div>
          <div className="font-mono text-sm flex gap-1">
            {destBinary.match(/.{8}/g)?.map((octet, i) => (
              <span key={i} className="text-slate-700">
                {octet}
                {i < 3 && <span className="text-slate-300">.</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Routing table */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-2">Routing Table</div>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Network</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Gateway</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Match?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROUTING_TABLE.map((route, i) => {
                const isMatch = isValidIp && matchesRoute(destinationIp, route)
                const isBest = bestMatch === route

                return (
                  <tr
                    key={i}
                    className={`transition-colors ${
                      isBest ? 'bg-emerald-50' : isMatch ? 'bg-amber-50' : ''
                    }`}
                  >
                    <td className="px-3 py-2">
                      <div className="font-mono">{route.network}/{route.prefix}</div>
                      <div className="text-slate-400">{route.description}</div>
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-600">
                      {route.gateway === 'direct' ? (
                        <span className="text-slate-400">directly connected</span>
                      ) : route.gateway}
                    </td>
                    <td className="px-3 py-2">
                      {isValidIp && (
                        isMatch ? (
                          <div className="flex items-center gap-1">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              isBest
                                ? 'bg-emerald-200 text-emerald-800'
                                : 'bg-amber-200 text-amber-800'
                            }`}>
                              {isBest ? `✓ BEST (/${route.prefix})` : `/${route.prefix}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match explanation */}
      {isValidIp && bestMatch && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-800 mb-2">
            Routing Decision
          </div>
          <div className="space-y-2 text-sm text-emerald-700">
            <div>
              <strong>{matches.length}</strong> route{matches.length > 1 ? 's' : ''} match{matches.length === 1 ? 'es' : ''} destination {destinationIp}
            </div>
            {matches.length > 1 && (
              <div className="text-xs">
                Matching prefixes: {matches.map(m => `/${m.prefix}`).join(', ')}
              </div>
            )}
            <div className="pt-2 border-t border-emerald-200">
              <strong>Winner:</strong> {bestMatch.network}/{bestMatch.prefix}
              <span className="text-emerald-600"> (longest prefix = most specific)</span>
            </div>
            <div>
              <strong>Action:</strong>{' '}
              {bestMatch.gateway === 'direct'
                ? `Deliver directly on ${bestMatch.iface} (destination is on local network)`
                : `Forward to gateway ${bestMatch.gateway} via ${bestMatch.iface}`
              }
            </div>
          </div>
        </div>
      )}

      {/* Visual prefix comparison */}
      {isValidIp && matches.length > 0 && showBinaryDetail && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 mb-3">Binary comparison (bit-by-bit matching):</div>

          {/* Destination binary */}
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <div className="text-xs text-slate-500 mb-2">Destination: {destinationIp}</div>
            <div className="flex gap-0.5 font-mono text-sm">
              {destBinary.split('').map((bit, i) => (
                <div
                  key={i}
                  className={`w-5 h-6 flex items-center justify-center rounded text-xs font-bold ${
                    i < (bestMatch?.prefix || 0)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {bit}
                </div>
              ))}
            </div>
            <div className="flex mt-1">
              {[8, 16, 24, 32].map((mark) => (
                <div key={mark} className="text-[9px] text-slate-400" style={{ width: `${(mark / 32) * 100}%`, textAlign: 'right' }}>
                  {mark}
                </div>
              ))}
            </div>
          </div>

          {/* Compare each matching route */}
          <div className="space-y-3">
            {matches.slice(0, 4).map((route, idx) => {
              const routeBinary = ipToBinary(route.network)
              const isBest = idx === 0

              return (
                <div
                  key={idx}
                  className={`rounded-lg border p-3 ${
                    isBest ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">
                      {route.network}/{route.prefix}
                      <span className="font-normal text-slate-400 ml-2">({route.description})</span>
                    </span>
                    {isBest && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-200 text-emerald-800">
                        WINNER
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 font-mono text-sm">
                    {routeBinary.split('').map((bit, i) => {
                      const isInPrefix = i < route.prefix
                      const destBit = destBinary[i]
                      const matches = bit === destBit

                      return (
                        <div
                          key={i}
                          className={`w-5 h-6 flex items-center justify-center rounded text-xs font-bold ${
                            isInPrefix
                              ? matches
                                ? isBest
                                  ? 'bg-emerald-200 text-emerald-800'
                                  : 'bg-amber-200 text-amber-800'
                                : 'bg-red-200 text-red-800'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                          title={isInPrefix ? (matches ? 'Match!' : 'No match') : 'Not checked (host portion)'}
                        >
                          {bit}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    First <strong>{route.prefix}</strong> bits must match →
                    <span className={isBest ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>
                      {' '}{route.prefix} bits compared
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-emerald-200" />
              <span className="text-slate-500">Matching bits (winner)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-amber-200" />
              <span className="text-slate-500">Matching bits (other)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-slate-100" />
              <span className="text-slate-500">Not checked</span>
            </div>
          </div>
        </div>
      )}

      {/* Simple prefix comparison (when binary detail is off) */}
      {isValidIp && matches.length > 1 && !showBinaryDetail && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 mb-2">Why longest prefix wins:</div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 w-16">Dest:</span>
              <span className="text-slate-700">{destBinary}</span>
            </div>
            {matches.slice(0, 3).map((route, i) => {
              const routeBinary = ipToBinary(route.network)
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-slate-500 w-16">/{route.prefix}:</span>
                  <span>
                    <span className={i === 0 ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                      {routeBinary.slice(0, route.prefix)}
                    </span>
                    <span className="text-slate-300">
                      {routeBinary.slice(route.prefix)}
                    </span>
                  </span>
                  <span className={`text-[10px] ${i === 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    ({route.prefix} bits match)
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Longest prefix match:</strong> When multiple routes match, pick the most specific one.
        A /24 route is more specific than /16, which is more specific than /8.
        The default route (0.0.0.0/0) matches everything but always loses to any other match.
      </div>
    </div>
  )
}
