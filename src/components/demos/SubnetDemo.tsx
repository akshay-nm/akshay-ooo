'use client'

import { useState } from 'react'

const COMMON_PREFIXES = [8, 16, 20, 24, 28, 30, 32]

function calculateSubnetInfo(prefix: number) {
  const hostBits = 32 - prefix
  const totalAddresses = Math.pow(2, hostBits)
  const usableHosts = hostBits >= 2 ? totalAddresses - 2 : (hostBits === 1 ? 0 : 1)

  // Calculate subnet mask octets
  const mask = []
  for (let i = 0; i < 4; i++) {
    const bitsInOctet = Math.min(8, Math.max(0, prefix - i * 8))
    mask.push(256 - Math.pow(2, 8 - bitsInOctet))
  }

  return {
    prefix,
    hostBits,
    totalAddresses,
    usableHosts,
    mask: mask.join('.'),
  }
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
  return n.toString()
}

export function SubnetDemo() {
  const [prefix, setPrefix] = useState(24)
  const info = calculateSubnetInfo(prefix)

  // Example IP for visualization
  const exampleIP = [192, 168, 1, 100]

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-slate-900">Subnet Mask Visualizer</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Prefix:</span>
          <select
            value={prefix}
            onChange={(e) => setPrefix(parseInt(e.target.value))}
            className="px-2 py-1 text-sm border border-slate-200 rounded-lg bg-white"
          >
            {Array.from({ length: 33 }, (_, i) => i).map((p) => (
              <option key={p} value={p}>/{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick select common sizes */}
      <div className="flex flex-wrap gap-2 mb-6">
        {COMMON_PREFIXES.map((p) => (
          <button
            key={p}
            onClick={() => setPrefix(p)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              prefix === p
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            /{p}
            <span className="ml-1 opacity-70">
              {p === 8 && '(Class A)'}
              {p === 16 && '(Class B)'}
              {p === 24 && '(Class C)'}
              {p === 30 && '(P2P)'}
              {p === 32 && '(Host)'}
            </span>
          </button>
        ))}
      </div>

      {/* 32-bit visualization */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-2">32 bits:</div>
        <div className="flex gap-0.5">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className={`h-6 flex-1 rounded-sm transition-colors ${
                i < prefix
                  ? 'bg-blue-400'
                  : 'bg-amber-400'
              }`}
              title={`Bit ${i + 1}: ${i < prefix ? 'Network' : 'Host'}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>bit 1</span>
          <span>bit 32</span>
        </div>
        <div className="flex mt-2 text-xs">
          <div
            className="text-blue-600 font-medium"
            style={{ width: `${(prefix / 32) * 100}%` }}
          >
            {prefix > 4 && `← ${prefix} bits (network)`}
          </div>
          <div
            className="text-amber-600 font-medium text-right"
            style={{ width: `${((32 - prefix) / 32) * 100}%` }}
          >
            {32 - prefix > 4 && `${32 - prefix} bits (host) →`}
          </div>
        </div>
      </div>

      {/* Octet breakdown */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-2">Example: {exampleIP.join('.')}/{prefix}</div>
        <div className="flex gap-2 justify-center">
          {exampleIP.map((octet, i) => {
            const octetStart = i * 8
            const octetEnd = octetStart + 8
            const networkBitsInOctet = Math.min(8, Math.max(0, prefix - octetStart))
            const isFullNetwork = networkBitsInOctet === 8
            const isFullHost = networkBitsInOctet === 0
            const isPartial = !isFullNetwork && !isFullHost

            return (
              <div key={i} className="text-center">
                <div className={`w-16 h-12 rounded-lg flex items-center justify-center font-mono text-lg font-bold border-2 ${
                  isFullNetwork
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : isFullHost
                    ? 'bg-amber-100 border-amber-300 text-amber-700'
                    : 'bg-gradient-to-r from-blue-100 to-amber-100 border-purple-300 text-purple-700'
                }`}>
                  {octet}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {isPartial && `${networkBitsInOctet}/${8 - networkBitsInOctet}`}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-200 border border-blue-300" />
            <span className="text-slate-500">Network</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-200 border border-amber-300" />
            <span className="text-slate-500">Host</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-200 to-amber-200 border border-purple-300" />
            <span className="text-slate-500">Split</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg bg-slate-50 p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Subnet Mask</div>
          <div className="font-mono text-sm text-slate-800">{info.mask}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">CIDR</div>
          <div className="font-mono text-sm text-slate-800">/{prefix}</div>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <div className="text-xs text-blue-600 mb-1">Total Addresses</div>
          <div className="font-bold text-blue-800">{formatNumber(info.totalAddresses)}</div>
        </div>
        <div className="rounded-lg bg-amber-50 p-3 text-center">
          <div className="text-xs text-amber-600 mb-1">Usable Hosts</div>
          <div className="font-bold text-amber-800">{formatNumber(info.usableHosts)}</div>
        </div>
      </div>

      {/* Common sizes reference */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 mb-2">Common Subnet Sizes</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500">
                <th className="text-left py-1 pr-4">CIDR</th>
                <th className="text-left py-1 pr-4">Mask</th>
                <th className="text-right py-1 pr-4">Hosts</th>
                <th className="text-left py-1">Use Case</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className={prefix === 8 ? 'bg-emerald-50' : ''}>
                <td className="py-1 pr-4 font-mono">/8</td>
                <td className="py-1 pr-4 font-mono">255.0.0.0</td>
                <td className="py-1 pr-4 text-right">16.7M</td>
                <td className="py-1 text-slate-500">Large enterprise, ISP</td>
              </tr>
              <tr className={prefix === 16 ? 'bg-emerald-50' : ''}>
                <td className="py-1 pr-4 font-mono">/16</td>
                <td className="py-1 pr-4 font-mono">255.255.0.0</td>
                <td className="py-1 pr-4 text-right">65K</td>
                <td className="py-1 text-slate-500">Campus network</td>
              </tr>
              <tr className={prefix === 24 ? 'bg-emerald-50' : ''}>
                <td className="py-1 pr-4 font-mono">/24</td>
                <td className="py-1 pr-4 font-mono">255.255.255.0</td>
                <td className="py-1 pr-4 text-right">254</td>
                <td className="py-1 text-slate-500">Home/small office</td>
              </tr>
              <tr className={prefix === 28 ? 'bg-emerald-50' : ''}>
                <td className="py-1 pr-4 font-mono">/28</td>
                <td className="py-1 pr-4 font-mono">255.255.255.240</td>
                <td className="py-1 pr-4 text-right">14</td>
                <td className="py-1 text-slate-500">Small VLAN</td>
              </tr>
              <tr className={prefix === 30 ? 'bg-emerald-50' : ''}>
                <td className="py-1 pr-4 font-mono">/30</td>
                <td className="py-1 pr-4 font-mono">255.255.255.252</td>
                <td className="py-1 pr-4 text-right">2</td>
                <td className="py-1 text-slate-500">Point-to-point link</td>
              </tr>
              <tr className={prefix === 32 ? 'bg-emerald-50' : ''}>
                <td className="py-1 pr-4 font-mono">/32</td>
                <td className="py-1 pr-4 font-mono">255.255.255.255</td>
                <td className="py-1 pr-4 text-right">1</td>
                <td className="py-1 text-slate-500">Single host route</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
