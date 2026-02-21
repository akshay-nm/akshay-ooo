'use client'

import { useState } from 'react'

// Well-known OUIs for demonstration
const KNOWN_OUIS: Record<string, string> = {
  '00:1A:2B': 'Ayecom Technology',
  'AC:DE:48': 'Apple Inc.',
  '00:50:56': 'VMware',
  '08:00:27': 'Oracle VirtualBox',
  'FF:FF:FF': 'Broadcast',
  '01:00:5E': 'IPv4 Multicast',
  '33:33:00': 'IPv6 Multicast',
}

const EXAMPLE_MACS = [
  { mac: 'AC:DE:48:12:34:56', label: 'Apple device' },
  { mac: '00:50:56:C0:00:08', label: 'VMware VM' },
  { mac: 'FF:FF:FF:FF:FF:FF', label: 'Broadcast' },
  { mac: '01:00:5E:00:00:01', label: 'Multicast' },
  { mac: '02:42:AC:11:00:02', label: 'Docker container' },
]

function parseMac(mac: string): number[] {
  return mac.split(':').map(h => parseInt(h, 16))
}

function formatBinary(byte: number): string {
  return byte.toString(2).padStart(8, '0')
}

export function MACAddressDemo() {
  const [selectedMac, setSelectedMac] = useState('AC:DE:48:12:34:56')
  const bytes = parseMac(selectedMac)

  const oui = selectedMac.slice(0, 8).toUpperCase()
  const ouiName = KNOWN_OUIS[oui] || 'Unknown manufacturer'

  // Special bits in first octet
  const firstOctet = bytes[0]
  const isMulticast = (firstOctet & 0x01) === 1  // Bit 0 (I/G bit)
  const isLocal = (firstOctet & 0x02) === 2      // Bit 1 (U/L bit)

  const isBroadcast = selectedMac === 'FF:FF:FF:FF:FF:FF'

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">MAC Address Structure</h4>
      </div>

      {/* Example selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {EXAMPLE_MACS.map(({ mac, label }) => (
          <button
            key={mac}
            onClick={() => setSelectedMac(mac)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              selectedMac === mac
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main visualization */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        {/* Bytes display */}
        <div className="flex justify-center gap-1 mb-2">
          {bytes.map((byte, i) => (
            <div key={i} className="text-center">
              <div className={`w-12 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${
                i < 3
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                {byte.toString(16).toUpperCase().padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {i < 3 ? `OUI ${i + 1}` : `NIC ${i - 2}`}
              </div>
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-200 border border-blue-300" />
            <span className="text-slate-600">OUI (Manufacturer)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300" />
            <span className="text-slate-600">NIC-specific</span>
          </div>
        </div>
      </div>

      {/* OUI info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-xs text-slate-500 mb-1">Manufacturer (OUI)</div>
          <div className="font-mono text-sm text-slate-800">{oui}</div>
          <div className="text-xs text-slate-600 mt-1">{ouiName}</div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-xs text-slate-500 mb-1">Device ID</div>
          <div className="font-mono text-sm text-slate-800">{selectedMac.slice(9)}</div>
          <div className="text-xs text-slate-600 mt-1">Assigned by manufacturer</div>
        </div>
      </div>

      {/* Special bits visualization */}
      <div className="rounded-lg border border-slate-200 p-4">
        <div className="text-sm font-semibold text-slate-700 mb-3">First Octet: Special Bits</div>

        <div className="flex items-center gap-4 mb-4">
          <div className="font-mono text-lg text-slate-800">
            {formatBinary(firstOctet).split('').map((bit, i) => (
              <span
                key={i}
                className={`${
                  i === 7 ? 'text-purple-600 font-bold' :
                  i === 6 ? 'text-amber-600 font-bold' :
                  'text-slate-400'
                }`}
              >
                {bit}
              </span>
            ))}
          </div>
          <div className="text-xs text-slate-500">
            = 0x{firstOctet.toString(16).toUpperCase().padStart(2, '0')}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* I/G bit */}
          <div className={`rounded-lg p-3 ${
            isMulticast || isBroadcast
              ? 'bg-purple-50 border border-purple-200'
              : 'bg-slate-50 border border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-purple-600">Bit 0</span>
              <span className="text-slate-500">I/G (Individual/Group)</span>
            </div>
            <div className={`font-medium ${
              isMulticast || isBroadcast ? 'text-purple-700' : 'text-slate-700'
            }`}>
              {isBroadcast ? '1 → Broadcast (all devices)' :
               isMulticast ? '1 → Multicast (group)' : '0 → Unicast (single device)'}
            </div>
          </div>

          {/* U/L bit */}
          <div className={`rounded-lg p-3 ${
            isLocal
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-slate-50 border border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-amber-600">Bit 1</span>
              <span className="text-slate-500">U/L (Universal/Local)</span>
            </div>
            <div className={`font-medium ${isLocal ? 'text-amber-700' : 'text-slate-700'}`}>
              {isLocal ? '1 → Locally administered' : '0 → Universally administered (IEEE)'}
            </div>
          </div>
        </div>
      </div>

      {/* Context-specific note */}
      {isBroadcast && (
        <div className="mt-4 p-3 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-700">
          <strong>FF:FF:FF:FF:FF:FF</strong> is the broadcast address. All devices on the local
          network must process this frame. Used by ARP, DHCP, and other discovery protocols.
        </div>
      )}

      {isMulticast && !isBroadcast && (
        <div className="mt-4 p-3 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-700">
          <strong>Multicast addresses</strong> target a group of devices that have subscribed
          to receive frames for this address. Only interested devices process the frame.
        </div>
      )}

      {isLocal && !isBroadcast && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
          <strong>Locally administered</strong> addresses are set by software (VMs, containers,
          manual config) rather than burned into hardware by the manufacturer.
        </div>
      )}
    </div>
  )
}
