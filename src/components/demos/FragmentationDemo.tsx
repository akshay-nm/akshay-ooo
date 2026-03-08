'use client'

import { useState } from 'react'

interface Fragment {
  id: number
  offset: number
  length: number
  moreFragments: boolean
  data: string
}

const MTU_OPTIONS = [
  { value: 1500, label: '1500 (Ethernet)' },
  { value: 576, label: '576 (Min IPv4)' },
  { value: 1280, label: '1280 (IPv6 min)' },
  { value: 512, label: '512 (Custom)' },
]

export function FragmentationDemo() {
  const [packetSize, setPacketSize] = useState(4000)
  const [mtu, setMtu] = useState(1500)
  const [showReassembly, setShowReassembly] = useState(false)
  const [showCalculation, setShowCalculation] = useState(false)

  // IP header is 20 bytes, so max payload per fragment is MTU - 20
  const maxPayload = mtu - 20
  // Fragment offset must be multiple of 8, so we round down
  const fragmentPayload = Math.floor(maxPayload / 8) * 8

  // Calculate fragments
  const fragments: Fragment[] = []
  let remaining = packetSize
  let offset = 0
  const fragmentId = 0x1A2B // Example ID

  while (remaining > 0) {
    const thisPayload = Math.min(remaining, remaining > maxPayload ? fragmentPayload : remaining)
    fragments.push({
      id: fragmentId,
      offset: offset / 8, // Stored in 8-byte units
      length: thisPayload + 20, // Include IP header
      moreFragments: remaining > thisPayload,
      data: `bytes ${offset}-${offset + thisPayload - 1}`,
    })
    offset += thisPayload
    remaining -= thisPayload
  }

  const needsFragmentation = packetSize + 20 > mtu

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">IP Fragmentation</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCalculation(!showCalculation)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              showCalculation
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showCalculation ? 'Showing Math' : 'Show Math'}
          </button>
          <button
            onClick={() => setShowReassembly(!showReassembly)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              showReassembly
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showReassembly ? 'Showing Reassembly' : 'Show Reassembly'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Original Packet Size</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="100"
              max="8000"
              step="100"
              value={packetSize}
              onChange={(e) => setPacketSize(parseInt(e.target.value))}
              className="flex-1 h-1 accent-purple-500"
            />
            <span className="font-mono text-sm text-slate-700 w-20 text-right">{packetSize} B</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Link MTU</label>
          <select
            value={mtu}
            onChange={(e) => setMtu(parseInt(e.target.value))}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
          >
            {MTU_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Original packet */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-2">Original IP Packet</div>
        <div className="flex items-stretch gap-1">
          <div className="bg-slate-200 rounded-l-lg px-3 py-4 text-center shrink-0">
            <div className="text-[10px] text-slate-600">IP Hdr</div>
            <div className="text-xs font-mono text-slate-700">20B</div>
          </div>
          <div
            className="bg-purple-100 border-2 border-purple-300 rounded-r-lg flex items-center justify-center flex-1 py-4"
            style={{ minWidth: Math.min(400, packetSize / 20) }}
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-purple-700">{packetSize} bytes payload</div>
              <div className="text-xs text-purple-500">Total: {packetSize + 20} bytes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fragmentation decision */}
      <div className={`mb-6 p-3 rounded-lg text-sm ${
        needsFragmentation
          ? 'bg-amber-50 border border-amber-200 text-amber-800'
          : 'bg-green-50 border border-green-200 text-green-800'
      }`}>
        {needsFragmentation ? (
          <>
            <strong>Fragmentation required.</strong> Packet ({packetSize + 20} bytes) exceeds MTU ({mtu} bytes).
            Will be split into <strong>{fragments.length} fragments</strong>.
          </>
        ) : (
          <>
            <strong>No fragmentation needed.</strong> Packet ({packetSize + 20} bytes) fits within MTU ({mtu} bytes).
          </>
        )}
      </div>

      {/* Calculation panel */}
      {needsFragmentation && showCalculation && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm font-semibold text-blue-800 mb-3">Step-by-Step Calculation</div>
          <div className="space-y-4 text-sm">
            {/* Step 1: Max payload */}
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800">1</span>
                <span className="font-semibold text-slate-700">Max payload per fragment</span>
              </div>
              <div className="font-mono text-xs text-slate-600 ml-7">
                MTU - IP header = {mtu} - 20 = <strong>{maxPayload}</strong> bytes
              </div>
            </div>

            {/* Step 2: Round down */}
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800">2</span>
                <span className="font-semibold text-slate-700">Round to 8-byte boundary</span>
              </div>
              <div className="font-mono text-xs text-slate-600 ml-7">
                floor({maxPayload} / 8) × 8 = floor({(maxPayload / 8).toFixed(2)}) × 8 = <strong>{fragmentPayload}</strong> bytes
              </div>
              <div className="text-xs text-slate-500 ml-7 mt-1">
                (Fragment offset field is in 8-byte units)
              </div>
            </div>

            {/* Step 3: Number of fragments */}
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800">3</span>
                <span className="font-semibold text-slate-700">Number of fragments</span>
              </div>
              <div className="font-mono text-xs text-slate-600 ml-7">
                ceil({packetSize} / {fragmentPayload}) = ceil({(packetSize / fragmentPayload).toFixed(2)}) = <strong>{fragments.length}</strong> fragments
              </div>
            </div>

            {/* Step 4: Each fragment */}
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-800">4</span>
                <span className="font-semibold text-slate-700">Calculate each fragment</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="text-left py-1 pr-3">#</th>
                      <th className="text-left py-1 pr-3">Payload bytes</th>
                      <th className="text-left py-1 pr-3">Offset (bytes)</th>
                      <th className="text-left py-1 pr-3">Offset ÷ 8</th>
                      <th className="text-left py-1 pr-3">MF flag</th>
                      <th className="text-left py-1">Total size</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {fragments.map((frag, i) => {
                      const payloadSize = frag.length - 20
                      const offsetBytes = frag.offset * 8
                      return (
                        <tr key={i} className={i === fragments.length - 1 ? 'text-emerald-700' : ''}>
                          <td className="py-1 pr-3">{i + 1}</td>
                          <td className="py-1 pr-3">{offsetBytes}–{offsetBytes + payloadSize - 1}</td>
                          <td className="py-1 pr-3">{offsetBytes}</td>
                          <td className="py-1 pr-3">{frag.offset}</td>
                          <td className="py-1 pr-3">{frag.moreFragments ? '1 (more)' : '0 (last)'}</td>
                          <td className="py-1">{payloadSize} + 20 = {frag.length}B</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {needsFragmentation && (
        <>
          {/* Fragments visualization */}
          <div className="mb-6">
            <div className="text-xs text-slate-500 mb-2">
              Fragments (each ≤ {mtu} bytes)
            </div>
            <div className="space-y-2">
              {fragments.map((frag, i) => (
                <div key={i} className="flex items-stretch gap-1">
                  {/* Fragment header info */}
                  <div className="bg-slate-100 rounded-l-lg px-2 py-2 w-24 shrink-0">
                    <div className="text-[9px] text-slate-500">Fragment {i + 1}</div>
                    <div className="text-[10px] font-mono text-slate-600">{frag.length}B total</div>
                  </div>

                  {/* IP Header with fragment fields */}
                  <div className="bg-slate-200 px-2 py-2 text-center shrink-0">
                    <div className="text-[9px] text-slate-600">IP Hdr</div>
                    <div className="text-[10px] font-mono text-slate-700">20B</div>
                  </div>

                  {/* Fragment payload */}
                  <div
                    className="bg-purple-100 border border-purple-200 flex items-center px-3 flex-1"
                    style={{ minWidth: Math.max(80, (frag.length - 20) / 10) }}
                  >
                    <div className="text-[10px] text-purple-700">{frag.data}</div>
                  </div>

                  {/* Fragment fields */}
                  <div className="bg-purple-50 border border-purple-200 rounded-r-lg px-2 py-1 shrink-0 text-[9px] space-y-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">ID:</span>
                      <span className="font-mono text-purple-700">0x{frag.id.toString(16).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">Offset:</span>
                      <span className="font-mono text-purple-700">{frag.offset}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">MF:</span>
                      <span className={`font-mono ${frag.moreFragments ? 'text-amber-600' : 'text-green-600'}`}>
                        {frag.moreFragments ? '1' : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reassembly visualization */}
          {showReassembly && (
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 mb-2">Reassembly at Destination</div>

              <div className="space-y-3">
                {/* Reassembly buffer */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-2">
                    Reassembly buffer (ID: 0x{fragmentId.toString(16).toUpperCase()})
                  </div>
                  <div className="flex gap-0.5">
                    {fragments.map((frag, i) => (
                      <div
                        key={i}
                        className="h-8 bg-purple-200 border border-purple-300 rounded flex items-center justify-center text-[9px] text-purple-700"
                        style={{ flex: frag.length - 20 }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                    <span>offset 0</span>
                    <span>offset {packetSize}</span>
                  </div>
                </div>

                {/* Reassembly steps */}
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">1</span>
                    <span>Collect all fragments with same ID (0x{fragmentId.toString(16).toUpperCase()})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">2</span>
                    <span>Sort by Fragment Offset field</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">3</span>
                    <span>Wait for fragment with MF=0 (last fragment)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-200 flex items-center justify-center text-[10px]">✓</span>
                    <span className="text-emerald-700">Concatenate payloads → original {packetSize} byte packet</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Why fragment?</strong> Different links have different MTUs. A packet might fit on
        Ethernet (1500B) but not on an older network (576B). Rather than fail, routers can split
        the packet. Modern practice: use Path MTU Discovery to avoid fragmentation entirely.
      </div>
    </div>
  )
}
