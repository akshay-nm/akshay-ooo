'use client'

import { useState } from 'react'

type Layer = 'ethernet' | 'ip' | 'transport' | 'data'

const LAYERS: { id: Layer; name: string; color: string; borderColor: string }[] = [
  { id: 'ethernet', name: 'Ethernet Frame (L2)', color: 'bg-blue-50', borderColor: 'border-blue-300' },
  { id: 'ip', name: 'IP Packet (L3)', color: 'bg-emerald-50', borderColor: 'border-emerald-300' },
  { id: 'transport', name: 'TCP Segment (L4)', color: 'bg-amber-50', borderColor: 'border-amber-300' },
  { id: 'data', name: 'Application Data', color: 'bg-purple-50', borderColor: 'border-purple-300' },
]

export function EncapsulationDemo() {
  const [hoveredLayer, setHoveredLayer] = useState<Layer | null>(null)
  const [expandedView, setExpandedView] = useState(false)

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-slate-900">Protocol Encapsulation</h4>
        <button
          onClick={() => setExpandedView(!expandedView)}
          className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          {expandedView ? 'Nested View' : 'Expanded View'}
        </button>
      </div>

      {expandedView ? (
        // Expanded horizontal view
        <div className="space-y-4">
          {/* Ethernet Frame */}
          <div
            className={`rounded-lg border-2 p-3 transition-all ${
              hoveredLayer === 'ethernet' ? 'border-blue-500 bg-blue-50' : 'border-blue-200 bg-blue-50/50'
            }`}
            onMouseEnter={() => setHoveredLayer('ethernet')}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <div className="text-xs font-semibold text-blue-700 mb-2">Ethernet Frame</div>
            <div className="flex items-stretch gap-1">
              {/* Ethernet Header */}
              <div className="bg-blue-200 rounded px-2 py-3 text-center shrink-0">
                <div className="text-[10px] text-blue-800 font-medium">Preamble</div>
                <div className="text-[9px] text-blue-600">8B</div>
              </div>
              <div className="bg-blue-200 rounded px-2 py-3 text-center shrink-0">
                <div className="text-[10px] text-blue-800 font-medium">Dest MAC</div>
                <div className="text-[9px] text-blue-600">6B</div>
              </div>
              <div className="bg-blue-200 rounded px-2 py-3 text-center shrink-0">
                <div className="text-[10px] text-blue-800 font-medium">Src MAC</div>
                <div className="text-[9px] text-blue-600">6B</div>
              </div>
              <div className="bg-blue-200 rounded px-2 py-3 text-center shrink-0">
                <div className="text-[10px] text-blue-800 font-medium">Type</div>
                <div className="text-[9px] text-blue-600">2B</div>
              </div>

              {/* IP Packet (Payload) */}
              <div
                className={`flex-1 rounded border-2 p-2 transition-all ${
                  hoveredLayer === 'ip' ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 bg-emerald-50/50'
                }`}
                onMouseEnter={(e) => { e.stopPropagation(); setHoveredLayer('ip') }}
                onMouseLeave={() => setHoveredLayer('ethernet')}
              >
                <div className="text-[10px] font-semibold text-emerald-700 mb-1">IP Packet</div>
                <div className="flex items-stretch gap-1">
                  <div className="bg-emerald-200 rounded px-1.5 py-2 text-center shrink-0">
                    <div className="text-[9px] text-emerald-800 font-medium">IP Hdr</div>
                    <div className="text-[8px] text-emerald-600">20B+</div>
                  </div>

                  {/* TCP Segment */}
                  <div
                    className={`flex-1 rounded border-2 p-1.5 transition-all ${
                      hoveredLayer === 'transport' ? 'border-amber-500 bg-amber-50' : 'border-amber-200 bg-amber-50/50'
                    }`}
                    onMouseEnter={(e) => { e.stopPropagation(); setHoveredLayer('transport') }}
                    onMouseLeave={() => setHoveredLayer('ip')}
                  >
                    <div className="text-[9px] font-semibold text-amber-700 mb-1">TCP Segment</div>
                    <div className="flex items-stretch gap-1">
                      <div className="bg-amber-200 rounded px-1 py-1.5 text-center shrink-0">
                        <div className="text-[8px] text-amber-800">TCP</div>
                        <div className="text-[7px] text-amber-600">20B+</div>
                      </div>

                      {/* Application Data */}
                      <div
                        className={`flex-1 rounded border-2 p-1 text-center transition-all ${
                          hoveredLayer === 'data' ? 'border-purple-500 bg-purple-100' : 'border-purple-200 bg-purple-50'
                        }`}
                        onMouseEnter={(e) => { e.stopPropagation(); setHoveredLayer('data') }}
                        onMouseLeave={() => setHoveredLayer('transport')}
                      >
                        <div className="text-[8px] text-purple-700 font-medium">HTTP Data</div>
                        <div className="text-[7px] text-purple-500">Variable</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FCS */}
              <div className="bg-blue-200 rounded px-2 py-3 text-center shrink-0">
                <div className="text-[10px] text-blue-800 font-medium">FCS</div>
                <div className="text-[9px] text-blue-600">4B</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {LAYERS.map(layer => (
              <div
                key={layer.id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all ${
                  hoveredLayer === layer.id ? 'bg-slate-200' : ''
                }`}
              >
                <div className={`w-3 h-3 rounded ${layer.color} border ${layer.borderColor}`} />
                <span className="text-slate-600">{layer.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Nested concentric view
        <div className="space-y-4">
          <div
            className="rounded-xl border-2 border-blue-300 bg-blue-50 p-4"
            onMouseEnter={() => setHoveredLayer('ethernet')}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-blue-700">Ethernet Frame</span>
              <span className="text-xs text-blue-500">Layer 2</span>
            </div>

            <div className="flex gap-2 mb-3">
              <div className="bg-blue-200 rounded-lg px-3 py-2 text-center">
                <div className="text-xs font-medium text-blue-800">Header</div>
                <div className="text-[10px] text-blue-600">22 bytes</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xs text-blue-400">Payload →</span>
              </div>
              <div className="bg-blue-200 rounded-lg px-3 py-2 text-center">
                <div className="text-xs font-medium text-blue-800">FCS</div>
                <div className="text-[10px] text-blue-600">4 bytes</div>
              </div>
            </div>

            <div
              className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4"
              onMouseEnter={(e) => { e.stopPropagation(); setHoveredLayer('ip') }}
              onMouseLeave={() => setHoveredLayer('ethernet')}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-emerald-700">IP Packet</span>
                <span className="text-xs text-emerald-500">Layer 3</span>
              </div>

              <div className="flex gap-2 mb-3">
                <div className="bg-emerald-200 rounded-lg px-3 py-2 text-center">
                  <div className="text-xs font-medium text-emerald-800">IP Header</div>
                  <div className="text-[10px] text-emerald-600">20+ bytes</div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-xs text-emerald-400">Payload →</span>
                </div>
              </div>

              <div
                className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4"
                onMouseEnter={(e) => { e.stopPropagation(); setHoveredLayer('transport') }}
                onMouseLeave={() => setHoveredLayer('ip')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-amber-700">TCP Segment</span>
                  <span className="text-xs text-amber-500">Layer 4</span>
                </div>

                <div className="flex gap-2 mb-3">
                  <div className="bg-amber-200 rounded-lg px-3 py-2 text-center">
                    <div className="text-xs font-medium text-amber-800">TCP Header</div>
                    <div className="text-[10px] text-amber-600">20+ bytes</div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-amber-400">Payload →</span>
                  </div>
                </div>

                <div
                  className="rounded-lg border-2 border-purple-300 bg-purple-50 p-4 text-center"
                  onMouseEnter={(e) => { e.stopPropagation(); setHoveredLayer('data') }}
                  onMouseLeave={() => setHoveredLayer('transport')}
                >
                  <span className="text-sm font-semibold text-purple-700">Application Data</span>
                  <div className="text-xs text-purple-500 mt-1">HTTP, DNS, SMTP, etc.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="bg-slate-50 rounded-lg p-4 min-h-[80px]">
            {hoveredLayer === null && (
              <div className="text-sm text-slate-500 text-center">
                Hover over a layer to see details
              </div>
            )}
            {hoveredLayer === 'ethernet' && (
              <div className="text-sm">
                <div className="font-semibold text-blue-700 mb-1">Ethernet Frame (Layer 2)</div>
                <div className="text-slate-600">
                  Wraps the IP packet for transmission on the local network.
                  The EtherType field (<code className="bg-slate-200 px-1 rounded text-xs">0x0800</code>) indicates IPv4 payload.
                </div>
              </div>
            )}
            {hoveredLayer === 'ip' && (
              <div className="text-sm">
                <div className="font-semibold text-emerald-700 mb-1">IP Packet (Layer 3)</div>
                <div className="text-slate-600">
                  Contains source/destination IP addresses and routing info.
                  The Protocol field indicates what&apos;s inside (TCP=6, UDP=17, ICMP=1).
                </div>
              </div>
            )}
            {hoveredLayer === 'transport' && (
              <div className="text-sm">
                <div className="font-semibold text-amber-700 mb-1">TCP Segment (Layer 4)</div>
                <div className="text-slate-600">
                  Contains port numbers, sequence numbers, and reliability mechanisms.
                  Ensures data arrives correctly and in order.
                </div>
              </div>
            )}
            {hoveredLayer === 'data' && (
              <div className="text-sm">
                <div className="font-semibold text-purple-700 mb-1">Application Data (Layer 7)</div>
                <div className="text-slate-600">
                  The actual content: HTTP requests, DNS queries, email messages.
                  Each lower layer adds its header to carry this payload.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key insight */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          <strong>Encapsulation:</strong> Each layer wraps the layer above it. When sending,
          data travels <em>down</em> the stack (adding headers). When receiving, it travels
          <em> up</em> (stripping headers). The IP packet becomes the Ethernet frame&apos;s payload.
        </div>
      </div>
    </div>
  )
}
