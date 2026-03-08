'use client'

import { useState, useMemo } from 'react'

function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.')
}

function ipToBinaryArray(ip: string): string[] {
  return ip.split('.').map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
}

function prefixToMask(prefix: number): number {
  return prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0
}

const EXAMPLE_PAIRS = [
  { ipA: '192.168.1.100', ipB: '192.168.1.50', prefix: 24, name: 'Same /24' },
  { ipA: '192.168.1.100', ipB: '192.168.2.50', prefix: 24, name: 'Different /24' },
  { ipA: '10.0.1.5', ipB: '10.0.2.100', prefix: 22, name: 'Same /22' },
  { ipA: '10.0.5.1', ipB: '10.0.1.1', prefix: 22, name: 'Different /22' },
  { ipA: '172.16.0.1', ipB: '172.16.15.254', prefix: 20, name: 'Same /20' },
]

export function SameSubnetDemo() {
  const [ipA, setIpA] = useState('192.168.1.100')
  const [ipB, setIpB] = useState('192.168.2.50')
  const [prefix, setPrefix] = useState(24)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  const isValidIpA = /^(\d{1,3}\.){3}\d{1,3}$/.test(ipA) &&
    ipA.split('.').every((n) => parseInt(n) >= 0 && parseInt(n) <= 255)
  const isValidIpB = /^(\d{1,3}\.){3}\d{1,3}$/.test(ipB) &&
    ipB.split('.').every((n) => parseInt(n) >= 0 && parseInt(n) <= 255)

  const calculation = useMemo(() => {
    if (!isValidIpA || !isValidIpB) return null

    const mask = prefixToMask(prefix)
    const numA = ipToNumber(ipA)
    const numB = ipToNumber(ipB)
    const networkA = (numA & mask) >>> 0
    const networkB = (numB & mask) >>> 0
    const sameSubnet = networkA === networkB

    return {
      mask,
      maskIp: numberToIp(mask),
      networkA,
      networkB,
      networkAIp: numberToIp(networkA),
      networkBIp: numberToIp(networkB),
      sameSubnet,
      binaryA: ipToBinaryArray(ipA),
      binaryB: ipToBinaryArray(ipB),
      binaryMask: ipToBinaryArray(numberToIp(mask)),
      binaryNetworkA: ipToBinaryArray(numberToIp(networkA)),
      binaryNetworkB: ipToBinaryArray(numberToIp(networkB)),
    }
  }, [ipA, ipB, prefix, isValidIpA, isValidIpB])

  const runAnimation = () => {
    setShowAnimation(true)
    setAnimationStep(0)
    const steps = [1, 2, 3, 4]
    let i = 0
    const interval = setInterval(() => {
      i++
      if (i < steps.length) {
        setAnimationStep(i)
      } else {
        clearInterval(interval)
      }
    }, 800)
  }

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">Same Subnet? Checker</h4>
        <button
          onClick={runAnimation}
          className="px-3 py-1.5 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Show AND Operation
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">IP Address A</label>
          <input
            type="text"
            value={ipA}
            onChange={(e) => {
              setIpA(e.target.value)
              setShowAnimation(false)
            }}
            className={`w-full px-3 py-2 font-mono text-sm border rounded-lg ${
              isValidIpA ? 'border-slate-200' : 'border-red-300 bg-red-50'
            }`}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">IP Address B</label>
          <input
            type="text"
            value={ipB}
            onChange={(e) => {
              setIpB(e.target.value)
              setShowAnimation(false)
            }}
            className={`w-full px-3 py-2 font-mono text-sm border rounded-lg ${
              isValidIpB ? 'border-slate-200' : 'border-red-300 bg-red-50'
            }`}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Subnet Mask</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">/</span>
            <input
              type="range"
              min="0"
              max="32"
              value={prefix}
              onChange={(e) => {
                setPrefix(parseInt(e.target.value))
                setShowAnimation(false)
              }}
              className="flex-1 h-1 accent-blue-500"
            />
            <span className="font-mono text-sm text-slate-700 w-8">/{prefix}</span>
          </div>
        </div>
      </div>

      {/* Quick examples */}
      <div className="flex flex-wrap gap-2 mb-6">
        {EXAMPLE_PAIRS.map((ex, i) => (
          <button
            key={i}
            onClick={() => {
              setIpA(ex.ipA)
              setIpB(ex.ipB)
              setPrefix(ex.prefix)
              setShowAnimation(false)
            }}
            className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {ex.name}
          </button>
        ))}
      </div>

      {calculation && (
        <>
          {/* Binary AND visualization */}
          <div className="space-y-4 mb-6">
            {/* IP A AND Mask */}
            <div className={`rounded-lg border p-4 transition-all ${
              showAnimation && animationStep >= 1 ? 'border-blue-300 bg-blue-50' : 'border-slate-200'
            }`}>
              <div className="text-xs text-slate-500 mb-2">IP A: Apply subnet mask</div>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-slate-500">IP A:</span>
                  <div className="flex gap-1">
                    {calculation.binaryA.map((octet, i) => (
                      <span key={i}>
                        {octet.split('').map((bit, j) => {
                          const bitIndex = i * 8 + j
                          const isNetwork = bitIndex < prefix
                          return (
                            <span
                              key={j}
                              className={isNetwork ? 'text-blue-600' : 'text-slate-400'}
                            >
                              {bit}
                            </span>
                          )
                        })}
                        {i < 3 && <span className="text-slate-300">.</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-slate-500">Mask:</span>
                  <div className="flex gap-1">
                    {calculation.binaryMask.map((octet, i) => (
                      <span key={i}>
                        {octet.split('').map((bit, j) => (
                          <span
                            key={j}
                            className={bit === '1' ? 'text-slate-700' : 'text-slate-300'}
                          >
                            {bit}
                          </span>
                        ))}
                        {i < 3 && <span className="text-slate-300">.</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-2 flex items-center gap-2">
                  <span className="w-16 text-slate-500">AND =</span>
                  <div className="flex gap-1">
                    {calculation.binaryNetworkA.map((octet, i) => (
                      <span key={i} className="font-bold text-blue-700">
                        {octet}
                        {i < 3 && <span className="text-slate-300">.</span>}
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-400 ml-2">=</span>
                  <span className="font-bold text-blue-700 ml-2">{calculation.networkAIp}</span>
                </div>
              </div>
            </div>

            {/* IP B AND Mask */}
            <div className={`rounded-lg border p-4 transition-all ${
              showAnimation && animationStep >= 2 ? 'border-purple-300 bg-purple-50' : 'border-slate-200'
            }`}>
              <div className="text-xs text-slate-500 mb-2">IP B: Apply subnet mask</div>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-slate-500">IP B:</span>
                  <div className="flex gap-1">
                    {calculation.binaryB.map((octet, i) => (
                      <span key={i}>
                        {octet.split('').map((bit, j) => {
                          const bitIndex = i * 8 + j
                          const isNetwork = bitIndex < prefix
                          return (
                            <span
                              key={j}
                              className={isNetwork ? 'text-purple-600' : 'text-slate-400'}
                            >
                              {bit}
                            </span>
                          )
                        })}
                        {i < 3 && <span className="text-slate-300">.</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-slate-500">Mask:</span>
                  <div className="flex gap-1">
                    {calculation.binaryMask.map((octet, i) => (
                      <span key={i}>
                        {octet.split('').map((bit, j) => (
                          <span
                            key={j}
                            className={bit === '1' ? 'text-slate-700' : 'text-slate-300'}
                          >
                            {bit}
                          </span>
                        ))}
                        {i < 3 && <span className="text-slate-300">.</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-2 flex items-center gap-2">
                  <span className="w-16 text-slate-500">AND =</span>
                  <div className="flex gap-1">
                    {calculation.binaryNetworkB.map((octet, i) => (
                      <span key={i} className="font-bold text-purple-700">
                        {octet}
                        {i < 3 && <span className="text-slate-300">.</span>}
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-400 ml-2">=</span>
                  <span className="font-bold text-purple-700 ml-2">{calculation.networkBIp}</span>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className={`rounded-lg border p-4 transition-all ${
              showAnimation && animationStep >= 3
                ? calculation.sameSubnet
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-red-300 bg-red-50'
                : 'border-slate-200'
            }`}>
              <div className="text-xs text-slate-500 mb-2">Compare network addresses:</div>
              <div className="flex items-center gap-4 font-mono text-sm">
                <span className="text-blue-700 font-bold">{calculation.networkAIp}</span>
                <span className="text-slate-400">
                  {calculation.sameSubnet ? '=' : '≠'}
                </span>
                <span className="text-purple-700 font-bold">{calculation.networkBIp}</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className={`rounded-lg border p-4 ${
            calculation.sameSubnet
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-red-200 bg-red-50'
          }`}>
            <div className={`text-lg font-bold mb-2 ${
              calculation.sameSubnet ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {calculation.sameSubnet ? '✓ Same Subnet' : '✗ Different Subnets'}
            </div>
            <div className={`text-sm ${
              calculation.sameSubnet ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {calculation.sameSubnet ? (
                <>
                  Both {ipA} and {ipB} are in network <strong>{calculation.networkAIp}/{prefix}</strong>.
                  They can communicate directly on the local network.
                </>
              ) : (
                <>
                  {ipA} is in network <strong>{calculation.networkAIp}</strong>, but {ipB} is in network <strong>{calculation.networkBIp}</strong>.
                  Traffic must go through a <strong>gateway/router</strong>.
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>The rule:</strong> Apply the subnet mask to both IPs using AND.
        If the results match, they&apos;re on the same subnet. If not, you need a router.
      </div>
    </div>
  )
}
