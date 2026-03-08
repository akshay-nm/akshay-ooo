'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TCPField {
  name: string
  bits: number
  value: string
  color: string
  description: string
}

const TCP_HEADER_FIELDS: TCPField[] = [
  { name: 'Source Port', bits: 16, value: '54321', color: 'bg-blue-100 text-blue-700 border-blue-200', description: 'Sender\'s port number (ephemeral)' },
  { name: 'Destination Port', bits: 16, value: '443', color: 'bg-blue-100 text-blue-700 border-blue-200', description: 'Receiver\'s port number (HTTPS)' },
  { name: 'Sequence Number', bits: 32, value: '1000', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', description: 'Position of first data byte in stream' },
  { name: 'Acknowledgment Number', bits: 32, value: '5001', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', description: 'Next byte expected from sender' },
  { name: 'Data Offset', bits: 4, value: '5', color: 'bg-slate-100 text-slate-600 border-slate-200', description: 'Header length in 32-bit words' },
  { name: 'Reserved', bits: 4, value: '0', color: 'bg-slate-100 text-slate-400 border-slate-200', description: 'Reserved for future use' },
  { name: 'Flags', bits: 8, value: 'ACK', color: 'bg-purple-100 text-purple-700 border-purple-200', description: 'Control flags (SYN, ACK, FIN, etc.)' },
  { name: 'Window Size', bits: 16, value: '65535', color: 'bg-amber-100 text-amber-700 border-amber-200', description: 'Receive buffer space available' },
  { name: 'Checksum', bits: 16, value: '0xA1B2', color: 'bg-red-100 text-red-600 border-red-200', description: 'Error detection for header + data' },
  { name: 'Urgent Pointer', bits: 16, value: '0', color: 'bg-slate-100 text-slate-400 border-slate-200', description: 'Points to urgent data (if URG flag set)' },
]

const FLAGS = [
  { name: 'URG', description: 'Urgent pointer field is valid' },
  { name: 'ACK', description: 'Acknowledgment field is valid' },
  { name: 'PSH', description: 'Push data to application immediately' },
  { name: 'RST', description: 'Reset the connection' },
  { name: 'SYN', description: 'Synchronize sequence numbers' },
  { name: 'FIN', description: 'Sender is finished sending' },
]

export function TCPSegmentDemo() {
  const [selectedField, setSelectedField] = useState<TCPField | null>(null)
  const [activeFlags, setActiveFlags] = useState<string[]>(['ACK'])

  const toggleFlag = (flag: string) => {
    setActiveFlags(prev =>
      prev.includes(flag)
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    )
  }

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">TCP Segment Header</h4>
        <div className="text-xs text-slate-500">20 bytes minimum</div>
      </div>

      {/* Header visualization - 32 bits per row */}
      <div className="mb-6 bg-slate-50 rounded-lg p-4">
        <div className="text-xs text-slate-500 mb-3 flex justify-between">
          <span>Bit 0</span>
          <span>Bit 15</span>
          <span>Bit 16</span>
          <span>Bit 31</span>
        </div>

        {/* Row 1: Source Port, Dest Port */}
        <div className="flex mb-1">
          {[TCP_HEADER_FIELDS[0], TCP_HEADER_FIELDS[1]].map((field) => (
            <motion.button
              key={field.name}
              onClick={() => setSelectedField(selectedField?.name === field.name ? null : field)}
              className={`flex-1 py-3 px-2 border rounded-lg text-xs font-mono transition-all ${field.color} ${
                selectedField?.name === field.name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-semibold text-[10px] uppercase tracking-wider opacity-70 mb-1">{field.name}</div>
              <div className="font-bold">{field.value}</div>
            </motion.button>
          ))}
        </div>

        {/* Row 2: Sequence Number */}
        <motion.button
          onClick={() => setSelectedField(selectedField?.name === TCP_HEADER_FIELDS[2].name ? null : TCP_HEADER_FIELDS[2])}
          className={`w-full py-3 px-2 border rounded-lg text-xs font-mono transition-all mb-1 ${TCP_HEADER_FIELDS[2].color} ${
            selectedField?.name === TCP_HEADER_FIELDS[2].name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="font-semibold text-[10px] uppercase tracking-wider opacity-70 mb-1">{TCP_HEADER_FIELDS[2].name}</div>
          <div className="font-bold">{TCP_HEADER_FIELDS[2].value}</div>
        </motion.button>

        {/* Row 3: Ack Number */}
        <motion.button
          onClick={() => setSelectedField(selectedField?.name === TCP_HEADER_FIELDS[3].name ? null : TCP_HEADER_FIELDS[3])}
          className={`w-full py-3 px-2 border rounded-lg text-xs font-mono transition-all mb-1 ${TCP_HEADER_FIELDS[3].color} ${
            selectedField?.name === TCP_HEADER_FIELDS[3].name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="font-semibold text-[10px] uppercase tracking-wider opacity-70 mb-1">{TCP_HEADER_FIELDS[3].name}</div>
          <div className="font-bold">{TCP_HEADER_FIELDS[3].value}</div>
        </motion.button>

        {/* Row 4: Data Offset, Reserved, Flags, Window */}
        <div className="flex mb-1 gap-1">
          <motion.button
            onClick={() => setSelectedField(selectedField?.name === TCP_HEADER_FIELDS[4].name ? null : TCP_HEADER_FIELDS[4])}
            className={`w-12 py-3 px-1 border rounded-lg text-xs font-mono transition-all ${TCP_HEADER_FIELDS[4].color} ${
              selectedField?.name === TCP_HEADER_FIELDS[4].name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-[8px] opacity-70">Offset</div>
            <div className="font-bold">{TCP_HEADER_FIELDS[4].value}</div>
          </motion.button>
          <motion.button
            onClick={() => setSelectedField(selectedField?.name === TCP_HEADER_FIELDS[5].name ? null : TCP_HEADER_FIELDS[5])}
            className={`w-12 py-3 px-1 border rounded-lg text-xs font-mono transition-all ${TCP_HEADER_FIELDS[5].color} ${
              selectedField?.name === TCP_HEADER_FIELDS[5].name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-[8px] opacity-70">Rsrvd</div>
            <div className="font-bold">0</div>
          </motion.button>
          <motion.button
            onClick={() => setSelectedField(selectedField?.name === TCP_HEADER_FIELDS[6].name ? null : TCP_HEADER_FIELDS[6])}
            className={`flex-1 py-3 px-2 border rounded-lg text-xs font-mono transition-all ${TCP_HEADER_FIELDS[6].color} ${
              selectedField?.name === TCP_HEADER_FIELDS[6].name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-[8px] opacity-70">Flags</div>
            <div className="font-bold flex gap-1 justify-center">
              {activeFlags.map(f => (
                <span key={f} className="px-1 rounded bg-white/50">{f}</span>
              ))}
            </div>
          </motion.button>
          <motion.button
            onClick={() => setSelectedField(selectedField?.name === TCP_HEADER_FIELDS[7].name ? null : TCP_HEADER_FIELDS[7])}
            className={`flex-1 py-3 px-2 border rounded-lg text-xs font-mono transition-all ${TCP_HEADER_FIELDS[7].color} ${
              selectedField?.name === TCP_HEADER_FIELDS[7].name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-[8px] opacity-70">Window</div>
            <div className="font-bold">{TCP_HEADER_FIELDS[7].value}</div>
          </motion.button>
        </div>

        {/* Row 5: Checksum, Urgent Pointer */}
        <div className="flex gap-1">
          <motion.button
            onClick={() => setSelectedField(selectedField?.name === TCP_HEADER_FIELDS[8].name ? null : TCP_HEADER_FIELDS[8])}
            className={`flex-1 py-3 px-2 border rounded-lg text-xs font-mono transition-all ${TCP_HEADER_FIELDS[8].color} ${
              selectedField?.name === TCP_HEADER_FIELDS[8].name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-[8px] opacity-70">Checksum</div>
            <div className="font-bold">{TCP_HEADER_FIELDS[8].value}</div>
          </motion.button>
          <motion.button
            onClick={() => setSelectedField(selectedField?.name === TCP_HEADER_FIELDS[9].name ? null : TCP_HEADER_FIELDS[9])}
            className={`flex-1 py-3 px-2 border rounded-lg text-xs font-mono transition-all ${TCP_HEADER_FIELDS[9].color} ${
              selectedField?.name === TCP_HEADER_FIELDS[9].name ? 'ring-2 ring-offset-1 ring-blue-400' : ''
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-[8px] opacity-70">Urgent Pointer</div>
            <div className="font-bold">{TCP_HEADER_FIELDS[9].value}</div>
          </motion.button>
        </div>
      </div>

      {/* Selected field info */}
      <AnimatePresence mode="wait">
        {selectedField && (
          <motion.div
            key={selectedField.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-blue-800">{selectedField.name}</div>
              <div className="text-xs text-blue-600 font-mono">{selectedField.bits} bits</div>
            </div>
            <div className="text-sm text-blue-700">{selectedField.description}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flags editor */}
      <div className="mb-4">
        <div className="text-xs text-slate-500 mb-2">TCP Control Flags (click to toggle):</div>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map(flag => (
            <button
              key={flag.name}
              onClick={() => toggleFlag(flag.name)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                activeFlags.includes(flag.name)
                  ? 'bg-purple-100 border-purple-300 text-purple-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={flag.description}
            >
              {flag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current flags meaning */}
      {activeFlags.length > 0 && (
        <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-600">
          <span className="font-semibold">Active flags: </span>
          {activeFlags.map((flag, i) => {
            const flagInfo = FLAGS.find(f => f.name === flag)
            return (
              <span key={flag}>
                <span className="font-mono text-purple-600">{flag}</span>
                <span className="text-slate-400"> ({flagInfo?.description})</span>
                {i < activeFlags.length - 1 && ', '}
              </span>
            )
          })}
        </div>
      )}

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Click any field</strong> to learn more. The minimum TCP header is 20 bytes (160 bits).
        Options can extend it up to 60 bytes.
      </div>
    </div>
  )
}
