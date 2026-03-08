'use client'

import { useState, useMemo } from 'react'

interface SubnetCalculation {
  ip: string
  prefix: number
  hostBits: number
  totalAddresses: number
  usableHosts: number
  networkAddress: string
  broadcastAddress: string
  firstUsable: string
  lastUsable: string
  subnetMask: string
  wildcardMask: string
}

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

function ipToBinary(ip: string): string {
  return ip
    .split('.')
    .map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
    .join('.')
}

function calculateSubnet(ip: string, prefix: number): SubnetCalculation {
  const hostBits = 32 - prefix
  const totalAddresses = Math.pow(2, hostBits)
  const usableHosts = Math.max(0, totalAddresses - 2)

  const ipNum = ipToNumber(ip)
  const mask = prefix === 0 ? 0 : (~0 << hostBits) >>> 0
  const networkNum = (ipNum & mask) >>> 0
  const broadcastNum = (networkNum | ~mask) >>> 0

  const networkAddress = numberToIp(networkNum)
  const broadcastAddress = numberToIp(broadcastNum)
  const firstUsable = totalAddresses > 2 ? numberToIp(networkNum + 1) : networkAddress
  const lastUsable = totalAddresses > 2 ? numberToIp(broadcastNum - 1) : broadcastAddress
  const subnetMask = numberToIp(mask)
  const wildcardMask = numberToIp(~mask >>> 0)

  return {
    ip,
    prefix,
    hostBits,
    totalAddresses,
    usableHosts,
    networkAddress,
    broadcastAddress,
    firstUsable,
    lastUsable,
    subnetMask,
    wildcardMask,
  }
}

const EXAMPLE_SUBNETS = [
  { ip: '192.168.1.100', prefix: 24, name: '/24 (common)' },
  { ip: '10.0.0.0', prefix: 22, name: '/22 (1024)' },
  { ip: '172.16.5.130', prefix: 28, name: '/28 (16)' },
  { ip: '192.168.100.200', prefix: 26, name: '/26 (64)' },
  { ip: '10.10.10.10', prefix: 8, name: '/8 (huge)' },
]

export function SubnetCalculatorDemo() {
  const [ipInput, setIpInput] = useState('10.0.0.0')
  const [prefixInput, setPrefixInput] = useState(22)
  const [currentStep, setCurrentStep] = useState(0)
  const [showAllSteps, setShowAllSteps] = useState(false)

  const isValidIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(ipInput) &&
    ipInput.split('.').every((n) => parseInt(n) >= 0 && parseInt(n) <= 255)

  const calc = useMemo(() => {
    if (!isValidIp) return null
    return calculateSubnet(ipInput, prefixInput)
  }, [ipInput, prefixInput, isValidIp])

  const steps = [
    {
      title: 'Calculate host bits',
      formula: '32 - prefix',
      calculation: `32 - ${prefixInput} = ${32 - prefixInput}`,
      result: `${32 - prefixInput} host bits`,
    },
    {
      title: 'Calculate total addresses',
      formula: '2^(host bits)',
      calculation: `2^${32 - prefixInput} = ${Math.pow(2, 32 - prefixInput).toLocaleString()}`,
      result: `${Math.pow(2, 32 - prefixInput).toLocaleString()} addresses`,
    },
    {
      title: 'Calculate usable hosts',
      formula: 'total - 2 (network & broadcast)',
      calculation: `${Math.pow(2, 32 - prefixInput).toLocaleString()} - 2 = ${Math.max(0, Math.pow(2, 32 - prefixInput) - 2).toLocaleString()}`,
      result: `${Math.max(0, Math.pow(2, 32 - prefixInput) - 2).toLocaleString()} usable`,
    },
    {
      title: 'Find network address',
      formula: 'IP AND subnet mask (zero out host bits)',
      calculation: calc ? `${ipInput} AND ${calc.subnetMask}` : '',
      result: calc?.networkAddress || '',
    },
    {
      title: 'Find broadcast address',
      formula: 'Network + (block size - 1)',
      calculation: calc ? `${calc.networkAddress} + ${calc.totalAddresses - 1}` : '',
      result: calc?.broadcastAddress || '',
    },
    {
      title: 'Find usable range',
      formula: 'Network+1 to Broadcast-1',
      calculation: '',
      result: calc ? `${calc.firstUsable} to ${calc.lastUsable}` : '',
    },
  ]

  const visibleSteps = showAllSteps ? steps : steps.slice(0, currentStep + 1)

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">Subnet Calculator (with steps)</h4>
        <button
          onClick={() => setShowAllSteps(!showAllSteps)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            showAllSteps
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {showAllSteps ? 'Step by Step' : 'Show All Steps'}
        </button>
      </div>

      {/* Input */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">IP Address</label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => {
              setIpInput(e.target.value)
              setCurrentStep(0)
            }}
            className={`w-full px-3 py-2 font-mono text-sm border rounded-lg ${
              isValidIp ? 'border-slate-200' : 'border-red-300 bg-red-50'
            }`}
            placeholder="10.0.0.0"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Prefix Length</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">/</span>
            <input
              type="range"
              min="0"
              max="32"
              value={prefixInput}
              onChange={(e) => {
                setPrefixInput(parseInt(e.target.value))
                setCurrentStep(0)
              }}
              className="flex-1 h-1 accent-blue-500"
            />
            <span className="font-mono text-sm text-slate-700 w-8">/{prefixInput}</span>
          </div>
        </div>
      </div>

      {/* Quick examples */}
      <div className="flex flex-wrap gap-2 mb-6">
        {EXAMPLE_SUBNETS.map((ex) => (
          <button
            key={`${ex.ip}/${ex.prefix}`}
            onClick={() => {
              setIpInput(ex.ip)
              setPrefixInput(ex.prefix)
              setCurrentStep(0)
            }}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              ipInput === ex.ip && prefixInput === ex.prefix
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {calc && (
        <>
          {/* Binary visualization */}
          <div className="mb-6 bg-slate-50 rounded-lg p-4">
            <div className="text-xs text-slate-500 mb-2">Binary view (network | host):</div>
            <div className="font-mono text-sm">
              <div className="flex flex-wrap">
                {ipToBinary(ipInput).split('').map((char, i) => {
                  const bitIndex = i - Math.floor(i / 9) // Account for dots
                  const isNetwork = bitIndex < prefixInput
                  const isDot = char === '.'
                  return (
                    <span
                      key={i}
                      className={`${
                        isDot
                          ? 'text-slate-300 mx-0.5'
                          : isNetwork
                          ? 'text-blue-600 bg-blue-100 px-0.5 rounded'
                          : 'text-amber-600 bg-amber-100 px-0.5 rounded'
                      }`}
                    >
                      {char}
                    </span>
                  )
                })}
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
                  <span className="text-slate-500">Network ({prefixInput} bits)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200" />
                  <span className="text-slate-500">Host ({32 - prefixInput} bits)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-step calculation */}
          <div className="space-y-3 mb-6">
            {visibleSteps.map((step, i) => (
              <div
                key={i}
                className={`rounded-lg border p-4 transition-all ${
                  i === currentStep && !showAllSteps
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-700">{step.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{step.formula}</div>
                    {step.calculation && (
                      <div className="font-mono text-sm text-slate-700 mt-2 bg-slate-100 px-2 py-1 rounded inline-block">
                        {step.calculation}
                      </div>
                    )}
                    <div className="font-mono text-sm font-bold text-emerald-700 mt-2">
                      → {step.result}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next step button */}
          {!showAllSteps && currentStep < steps.length - 1 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Next Step →
            </button>
          )}

          {/* Final summary */}
          {(showAllSteps || currentStep === steps.length - 1) && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 mt-4">
              <div className="text-sm font-semibold text-emerald-800 mb-3">Summary: {ipInput}/{prefixInput}</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-emerald-600">Network:</span>
                  <span className="font-mono ml-2 text-emerald-800">{calc.networkAddress}</span>
                </div>
                <div>
                  <span className="text-emerald-600">Broadcast:</span>
                  <span className="font-mono ml-2 text-emerald-800">{calc.broadcastAddress}</span>
                </div>
                <div>
                  <span className="text-emerald-600">First usable:</span>
                  <span className="font-mono ml-2 text-emerald-800">{calc.firstUsable}</span>
                </div>
                <div>
                  <span className="text-emerald-600">Last usable:</span>
                  <span className="font-mono ml-2 text-emerald-800">{calc.lastUsable}</span>
                </div>
                <div>
                  <span className="text-emerald-600">Subnet mask:</span>
                  <span className="font-mono ml-2 text-emerald-800">{calc.subnetMask}</span>
                </div>
                <div>
                  <span className="text-emerald-600">Usable hosts:</span>
                  <span className="font-mono ml-2 text-emerald-800">{calc.usableHosts.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Quick mental math:</strong> /24 = 256 addresses (254 usable), /25 = 128, /26 = 64, /27 = 32, /28 = 16.
        Each prefix bit halves the block size.
      </div>
    </div>
  )
}
