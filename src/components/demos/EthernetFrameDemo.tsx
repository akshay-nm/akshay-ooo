'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FrameField {
  id: string
  name: string
  size: string
  bytes: number
  color: string
  description: string
  details: string[]
}

const FRAME_FIELDS: FrameField[] = [
  {
    id: 'preamble',
    name: 'Preamble',
    size: '7 bytes',
    bytes: 7,
    color: 'bg-slate-400',
    description: 'Synchronization pattern',
    details: [
      'Alternating 1s and 0s (10101010...)',
      'Allows receiver to sync with sender clock',
      'Not technically part of the frame',
    ],
  },
  {
    id: 'sfd',
    name: 'SFD',
    size: '1 byte',
    bytes: 1,
    color: 'bg-slate-500',
    description: 'Start Frame Delimiter',
    details: [
      'Pattern: 10101011',
      'The final "11" signals frame start',
      'Marks end of preamble',
    ],
  },
  {
    id: 'dest-mac',
    name: 'Dest MAC',
    size: '6 bytes',
    bytes: 6,
    color: 'bg-blue-500',
    description: 'Destination MAC address',
    details: [
      'Hardware address of recipient',
      'Format: XX:XX:XX:XX:XX:XX',
      'FF:FF:FF:FF:FF:FF = broadcast',
    ],
  },
  {
    id: 'src-mac',
    name: 'Src MAC',
    size: '6 bytes',
    bytes: 6,
    color: 'bg-blue-400',
    description: 'Source MAC address',
    details: [
      'Hardware address of sender',
      'First 3 bytes = vendor (OUI)',
      'Last 3 bytes = device ID',
    ],
  },
  {
    id: 'ethertype',
    name: 'Type',
    size: '2 bytes',
    bytes: 2,
    color: 'bg-amber-500',
    description: 'EtherType / Length',
    details: [
      '0x0800 = IPv4',
      '0x86DD = IPv6',
      '0x0806 = ARP',
      'If ≤ 1500, indicates payload length',
    ],
  },
  {
    id: 'payload',
    name: 'Payload',
    size: '46-1500 bytes',
    bytes: 46,
    color: 'bg-emerald-500',
    description: 'Data being transmitted',
    details: [
      'Minimum 46 bytes (padded if smaller)',
      'Maximum 1500 bytes (MTU)',
      'Contains IP packet or other protocol data',
    ],
  },
  {
    id: 'fcs',
    name: 'FCS',
    size: '4 bytes',
    bytes: 4,
    color: 'bg-red-400',
    description: 'Frame Check Sequence',
    details: [
      'CRC-32 checksum',
      'Detects transmission errors',
      'Calculated over entire frame',
      'Bad FCS = frame dropped',
    ],
  },
]

// Scale bytes to visual width (log scale for better visibility)
const getWidth = (bytes: number) => {
  const minWidth = 8
  const scale = Math.log(bytes + 1) * 15
  return Math.max(minWidth, scale)
}

export function EthernetFrameDemo() {
  const [activeField, setActiveField] = useState<FrameField | null>(null)

  const totalBytes = FRAME_FIELDS.reduce((sum, f) => sum + f.bytes, 0)

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900">Ethernet Frame Structure</h4>
        <p className="text-sm text-slate-500">Click on a segment to learn more</p>
      </div>

      {/* Frame Diagram */}
      <div className="mb-6">
        <div className="flex h-14 overflow-hidden rounded-lg border border-slate-200">
          {FRAME_FIELDS.map((field) => (
            <motion.button
              key={field.id}
              onClick={() => setActiveField(activeField?.id === field.id ? null : field)}
              className={`${field.color} relative cursor-pointer transition-all ${
                activeField?.id === field.id
                  ? 'ring-2 ring-slate-900 ring-offset-1 z-10'
                  : 'hover:brightness-110'
              }`}
              style={{ flex: `${getWidth(field.bytes)} 1 0%` }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-xs font-bold truncate px-1">{field.name}</span>
                <span className="text-[10px] opacity-80">{field.size}</span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Byte scale */}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>0</span>
          <span>← {totalBytes}+ bytes (payload varies) →</span>
          <span>1518 max</span>
        </div>
      </div>

      {/* Field Details */}
      <AnimatePresence mode="wait">
        {activeField ? (
          <motion.div
            key={activeField.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border-2 border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded ${activeField.color}`} />
                  <span className="font-semibold text-slate-900">{activeField.name}</span>
                  <span className="text-sm text-slate-500">({activeField.size})</span>
                </div>
                <p className="text-slate-600 mb-3">{activeField.description}</p>
                <ul className="space-y-1">
                  {activeField.details.map((detail, i) => (
                    <li key={i} className="text-sm text-slate-500 flex items-start gap-2">
                      <span className="text-slate-300 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center text-slate-400"
          >
            Click a segment above to see details
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-slate-400" />
            <span className="text-slate-500">Sync</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-blue-500" />
            <span className="text-slate-500">Addressing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span className="text-slate-500">Protocol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span className="text-slate-500">Data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-red-400" />
            <span className="text-slate-500">Error Check</span>
          </div>
        </div>
      </div>
    </div>
  )
}
