'use client'

import { useState } from 'react'

interface HeaderField {
  name: string
  shortName: string
  bits: number
  row: number
  startBit: number
  color: string
  description: string
  example: string
  values?: { value: string; meaning: string }[]
}

const IP_HEADER_FIELDS: HeaderField[] = [
  {
    name: 'Version',
    shortName: 'Ver',
    bits: 4,
    row: 0,
    startBit: 0,
    color: 'bg-slate-200',
    description: 'IP version number. IPv4 = 4, IPv6 = 6.',
    example: '0100 (4)',
  },
  {
    name: 'Internet Header Length',
    shortName: 'IHL',
    bits: 4,
    row: 0,
    startBit: 4,
    color: 'bg-slate-200',
    description: 'Header length in 32-bit words. Minimum is 5 (20 bytes), max is 15 (60 bytes with options).',
    example: '0101 (5 = 20 bytes)',
  },
  {
    name: 'Type of Service / DSCP',
    shortName: 'ToS',
    bits: 8,
    row: 0,
    startBit: 8,
    color: 'bg-cyan-200',
    description: 'Quality of Service hints. DSCP (6 bits) for traffic priority, ECN (2 bits) for congestion.',
    example: '00000000 (Best Effort)',
    values: [
      { value: '101110', meaning: 'Expedited Forwarding (low latency)' },
      { value: '000000', meaning: 'Best Effort (default)' },
    ],
  },
  {
    name: 'Total Length',
    shortName: 'Total Len',
    bits: 16,
    row: 0,
    startBit: 16,
    color: 'bg-slate-200',
    description: 'Total packet size in bytes (header + payload). Maximum 65,535 bytes.',
    example: '00000000 01000000 (64 bytes)',
  },
  {
    name: 'Identification',
    shortName: 'ID',
    bits: 16,
    row: 1,
    startBit: 0,
    color: 'bg-purple-200',
    description: 'Unique ID for the datagram. Used to reassemble fragments.',
    example: '0x1A2B',
  },
  {
    name: 'Flags',
    shortName: 'Flags',
    bits: 3,
    row: 1,
    startBit: 16,
    color: 'bg-purple-200',
    description: 'Fragmentation control. DF (Don\'t Fragment), MF (More Fragments).',
    example: '010',
    values: [
      { value: 'Bit 0', meaning: 'Reserved (always 0)' },
      { value: 'Bit 1 (DF)', meaning: '1 = Don\'t Fragment' },
      { value: 'Bit 2 (MF)', meaning: '1 = More Fragments follow' },
    ],
  },
  {
    name: 'Fragment Offset',
    shortName: 'Frag Offset',
    bits: 13,
    row: 1,
    startBit: 19,
    color: 'bg-purple-200',
    description: 'Position of this fragment in the original datagram. In 8-byte units.',
    example: '0000000000000 (first fragment)',
  },
  {
    name: 'Time To Live',
    shortName: 'TTL',
    bits: 8,
    row: 2,
    startBit: 0,
    color: 'bg-amber-200',
    description: 'Hop limit. Decremented by each router. Packet dropped when it reaches 0.',
    example: '01000000 (64 hops)',
    values: [
      { value: '64', meaning: 'Linux default' },
      { value: '128', meaning: 'Windows default' },
      { value: '255', meaning: 'Maximum' },
    ],
  },
  {
    name: 'Protocol',
    shortName: 'Proto',
    bits: 8,
    row: 2,
    startBit: 8,
    color: 'bg-blue-200',
    description: 'What protocol is encapsulated in the payload.',
    example: '00000110 (6 = TCP)',
    values: [
      { value: '1', meaning: 'ICMP' },
      { value: '6', meaning: 'TCP' },
      { value: '17', meaning: 'UDP' },
      { value: '47', meaning: 'GRE' },
      { value: '50', meaning: 'ESP (IPsec)' },
    ],
  },
  {
    name: 'Header Checksum',
    shortName: 'Checksum',
    bits: 16,
    row: 2,
    startBit: 16,
    color: 'bg-slate-200',
    description: 'Error detection for the header only. Recomputed at each hop (TTL changes).',
    example: '0x4F5A',
  },
  {
    name: 'Source IP Address',
    shortName: 'Source IP',
    bits: 32,
    row: 3,
    startBit: 0,
    color: 'bg-emerald-200',
    description: 'IP address of the sender.',
    example: '192.168.1.100',
  },
  {
    name: 'Destination IP Address',
    shortName: 'Dest IP',
    bits: 32,
    row: 4,
    startBit: 0,
    color: 'bg-emerald-200',
    description: 'IP address of the intended recipient.',
    example: '142.250.185.78 (google.com)',
  },
]

export function IPHeaderDemo() {
  const [selectedField, setSelectedField] = useState<HeaderField | null>(null)
  const [showBinary, setShowBinary] = useState(false)

  // Group fields by row
  const rows: HeaderField[][] = [[], [], [], [], []]
  IP_HEADER_FIELDS.forEach(field => {
    rows[field.row].push(field)
  })

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">IPv4 Header Structure</h4>
        <button
          onClick={() => setShowBinary(!showBinary)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            showBinary
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {showBinary ? 'Showing Bits' : 'Show Bits'}
        </button>
      </div>

      {/* Bit scale */}
      {showBinary && (
        <div className="mb-2 flex">
          <div className="w-16 shrink-0" />
          <div className="flex-1 flex text-[8px] text-slate-400 font-mono">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="flex-1 text-center">
                {i}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header visualization */}
      <div className="space-y-1">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-stretch gap-1">
            {/* Row label */}
            <div className="w-16 shrink-0 flex items-center text-xs text-slate-400 font-mono">
              {showBinary ? `${rowIndex * 32}-${rowIndex * 32 + 31}` : `Row ${rowIndex}`}
            </div>

            {/* Fields */}
            <div className="flex-1 flex gap-0.5">
              {row.map((field) => (
                <button
                  key={field.name}
                  onClick={() => setSelectedField(selectedField?.name === field.name ? null : field)}
                  className={`
                    relative rounded-lg px-2 py-3 text-center transition-all cursor-pointer
                    ${field.color}
                    ${selectedField?.name === field.name
                      ? 'ring-2 ring-slate-900 ring-offset-1'
                      : 'hover:brightness-95'
                    }
                  `}
                  style={{ flex: field.bits }}
                  title={field.name}
                >
                  <div className="text-[10px] font-semibold text-slate-700 truncate">
                    {field.shortName}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {field.bits}b
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Byte markers */}
      <div className="flex mt-2">
        <div className="w-16 shrink-0" />
        <div className="flex-1 flex justify-between text-[10px] text-slate-400">
          <span>0</span>
          <span>Byte 4</span>
          <span>Byte 8</span>
          <span>Byte 12</span>
          <span>Byte 16</span>
          <span>20</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded bg-emerald-200" />
          <span className="text-slate-500">Addresses</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded bg-amber-200" />
          <span className="text-slate-500">TTL</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded bg-blue-200" />
          <span className="text-slate-500">Protocol</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded bg-purple-200" />
          <span className="text-slate-500">Fragmentation</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded bg-cyan-200" />
          <span className="text-slate-500">QoS</span>
        </div>
      </div>

      {/* Field details panel */}
      <div className={`mt-4 rounded-lg border transition-all overflow-hidden ${
        selectedField ? 'border-slate-300 bg-slate-50' : 'border-transparent'
      }`}>
        {selectedField ? (
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-slate-900">{selectedField.name}</div>
                <div className="text-xs text-slate-500">
                  {selectedField.bits} bits (Row {selectedField.row}, bits {selectedField.startBit}-{selectedField.startBit + selectedField.bits - 1})
                </div>
              </div>
              <button
                onClick={() => setSelectedField(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-3">{selectedField.description}</p>

            <div className="bg-white rounded border border-slate-200 p-2 mb-3">
              <div className="text-xs text-slate-500 mb-1">Example value:</div>
              <div className="font-mono text-sm text-slate-800">{selectedField.example}</div>
            </div>

            {selectedField.values && (
              <div>
                <div className="text-xs text-slate-500 mb-2">Common values:</div>
                <div className="space-y-1">
                  {selectedField.values.map((v, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono">{v.value}</code>
                      <span className="text-slate-600">{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-slate-400">
            Click a field to see details
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 mb-2">Quick Reference: Protocol Numbers</div>
        <div className="flex flex-wrap gap-2">
          {[
            { num: 1, name: 'ICMP' },
            { num: 6, name: 'TCP' },
            { num: 17, name: 'UDP' },
            { num: 47, name: 'GRE' },
            { num: 50, name: 'ESP' },
            { num: 89, name: 'OSPF' },
          ].map(p => (
            <div key={p.num} className="px-2 py-1 rounded bg-blue-50 border border-blue-100">
              <span className="font-mono text-xs text-blue-700">{p.num}</span>
              <span className="text-xs text-blue-600 ml-1">= {p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
