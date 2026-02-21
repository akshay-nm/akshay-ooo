'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { EthernetFrameDemo } from '@/components/demos/EthernetFrameDemo'
import { CSMAStateMachine } from '@/components/demos/CSMAStateMachine'
import { CSMASwimLanes } from '@/components/demos/CSMASwimLanes'
import { CRCDemo } from '@/components/demos/CRCDemo'
import { MACAddressDemo } from '@/components/demos/MACAddressDemo'

export default function NetworkingPage() {
  return (
    <article className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <Link href="/learning" className="text-slate-500 hover:text-slate-700 transition-colors">
            &larr; Back to learning
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Networking
          </h1>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-slate prose-lg max-w-none"
        >
          {/* OSI Context */}
          <section className="mb-12">
            <h2>Layers of Abstraction</h2>
            <p>
              The OSI model is a stack of abstractions. At the bottom, everything is
              voltage changes on a wire—bits. Each layer above solves a different problem
              without worrying about the layers below.
            </p>
            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-6 text-right">7</span>
                  <span>Application</span>
                  <span className="text-slate-300">— HTTP, FTP, DNS</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-6 text-right">6</span>
                  <span>Presentation</span>
                  <span className="text-slate-300">— encryption, compression</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-6 text-right">5</span>
                  <span>Session</span>
                  <span className="text-slate-300">— connections, sessions</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-6 text-right">4</span>
                  <span>Transport</span>
                  <span className="text-slate-300">— TCP, UDP, ports</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-6 text-right">3</span>
                  <span>Network</span>
                  <span className="text-slate-300">— IP, routing</span>
                </div>
                <div className="flex items-center gap-3 rounded bg-orange-100 px-2 py-1 text-orange-700">
                  <span className="w-6 text-right font-bold">2</span>
                  <span className="font-bold">Data Link</span>
                  <span className="text-orange-500">— Ethernet frames, MAC addresses</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-6 text-right">1</span>
                  <span>Physical</span>
                  <span className="text-slate-300">— voltage, bits on wire</span>
                </div>
              </div>
            </div>
            <p>
              <strong>Layer 1 (Physical)</strong> deals with raw bits—voltage levels,
              cable specs, timing. <strong>Layer 2 (Data Link)</strong> adds structure:
              how do we group bits into meaningful chunks? How do we address devices on
              a local network? How do we detect transmission errors?
            </p>
            <p>
              The answer is <strong>frames</strong>.
            </p>
          </section>

          {/* Ethernet Frame Section */}
          <section>
            <h2>Ethernet Frame</h2>
            <p>
              A frame is the data link layer&apos;s unit of transmission. It wraps raw
              data with addressing, type information, and error checking. The bits still
              travel as voltage on the wire—but now they have structure.
            </p>
            <p>
              Think of it like an envelope. The payload is your letter. The MAC addresses
              are the &quot;to&quot; and &quot;from&quot; fields. The FCS is a seal that
              proves nothing was tampered with in transit.
            </p>

            <EthernetFrameDemo />

            <h3>Breaking it down</h3>

            <div className="not-prose space-y-3 my-6">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-900">Preamble</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">7 bytes</span>
                </div>
                <p className="text-slate-600 text-sm">
                  A repeating pattern of <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">10101010</code>.
                  The receiver&apos;s NIC uses this to synchronize its clock with the incoming
                  signal. Without it, the receiver wouldn&apos;t know where one bit ends and
                  the next begins.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-900">SFD</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">1 byte</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Start Frame Delimiter. The pattern <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">10101011</code>.
                  That final <code className="rounded bg-orange-100 px-1.5 py-0.5 font-mono text-xs text-orange-700">11</code> breaks
                  the pattern and signals: &quot;the real frame starts now.&quot;
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-900">Destination MAC</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">6 bytes</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Where this frame is going. Switches read this to decide which port to forward to.{' '}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">FF:FF:FF:FF:FF:FF</code>{' '}
                  means broadcast—send to everyone.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-900">Source MAC</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">6 bytes</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Where this frame came from. Switches also use this to build their MAC address tables.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-900">EtherType</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">2 bytes</span>
                </div>
                <p className="text-slate-600 text-sm mb-2">
                  What&apos;s inside the payload? Without this field, the receiver wouldn&apos;t know how to interpret the data.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-blue-50 px-2 py-1 text-xs font-mono text-blue-700">0x0800 → IPv4</span>
                  <span className="rounded bg-purple-50 px-2 py-1 text-xs font-mono text-purple-700">0x86DD → IPv6</span>
                  <span className="rounded bg-amber-50 px-2 py-1 text-xs font-mono text-amber-700">0x0806 → ARP</span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-900">Payload</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">46-1500 bytes</span>
                </div>
                <p className="text-slate-600 text-sm">
                  The actual data—usually an IP packet. Minimum 46 bytes (padded with zeros if smaller).
                  Maximum 1500 bytes (MTU). Larger data must be fragmented at a higher layer.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-900">FCS</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">4 bytes</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Frame Check Sequence. A CRC-32 checksum over the entire frame. The receiver
                  recalculates it—if it doesn&apos;t match, the frame is <em>silently dropped</em>.
                  No retransmission at this layer; that&apos;s TCP&apos;s job.
                </p>
              </div>
            </div>

            {/* Key Insight Callout */}
            <div className="not-prose my-8 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-orange-900">Key insight</span>
              </div>
              <p className="text-orange-800 text-sm">
                Ethernet is <em>best-effort</em>. Frames can be dropped, arrive out of
                order, or get corrupted. The data link layer doesn&apos;t care—it just
                moves frames between directly connected devices. Reliability comes from
                higher layers.
              </p>
            </div>
          </section>

          {/* Addressing Types Section */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Unicast, Broadcast, Multicast</h2>
            <p>
              Not all frames are addressed the same way. The destination MAC determines
              who should process the frame.
            </p>

            <div className="not-prose grid gap-4 my-6">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-semibold text-blue-900">Unicast</span>
                </div>
                <p className="text-blue-800 text-sm mb-2">
                  One-to-one. Frame addressed to a specific device&apos;s MAC address.
                  Only that device processes it; others ignore it.
                </p>
                <code className="text-xs font-mono text-blue-600">
                  e.g., 00:1A:2B:3C:4D:5E
                </code>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="font-semibold text-amber-900">Broadcast</span>
                </div>
                <p className="text-amber-800 text-sm mb-2">
                  One-to-all. Frame sent to every device on the local network.
                  Used when you don&apos;t know the destination MAC (like ARP requests).
                </p>
                <code className="text-xs font-mono text-amber-600">
                  FF:FF:FF:FF:FF:FF
                </code>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="font-semibold text-purple-900">Multicast</span>
                </div>
                <p className="text-purple-800 text-sm mb-2">
                  One-to-many. Frame sent to a group of devices that have subscribed
                  to a multicast address. Used for streaming, routing protocols.
                </p>
                <code className="text-xs font-mono text-purple-600">
                  01:00:5E:xx:xx:xx (IPv4 multicast range)
                </code>
              </div>
            </div>

            <p>
              How do NICs know whether to process a frame? They check the destination MAC.
              If it matches their own address, is broadcast, or matches a multicast group
              they&apos;ve joined—they process it. Otherwise, they drop it silently.
            </p>
          </section>

          {/* Collision Domains Section */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Collision Domains</h2>
            <p>
              Early Ethernet used a shared medium—one wire, many devices. If two devices
              transmitted simultaneously, signals collided and corrupted each other.
              The set of devices that can collide is called a <strong>collision domain</strong>.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-slate-700 w-20 shrink-0">Hub</span>
                  <span className="text-slate-600">
                    All ports share one collision domain. A frame sent to one port is
                    repeated to all ports. Collisions everywhere.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-slate-700 w-20 shrink-0">Switch</span>
                  <span className="text-slate-600">
                    Each port is its own collision domain. The switch buffers frames
                    and forwards only to the correct port. No collisions between ports.
                  </span>
                </div>
              </div>
            </div>

            <h3>CSMA/CD</h3>
            <p>
              How did devices handle collisions? <strong>Carrier Sense Multiple Access
              with Collision Detection</strong>:
            </p>

            <div className="not-prose my-6 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600">1</span>
                <span className="text-slate-700"><strong>Listen</strong> — Is the wire idle?</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600">2</span>
                <span className="text-slate-700"><strong>Transmit</strong> — If idle, send your frame</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600">3</span>
                <span className="text-slate-700"><strong>Detect</strong> — While sending, check for collision</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600">4</span>
                <span className="text-slate-700"><strong>Backoff</strong> — If collision, wait random time, retry</span>
              </div>
            </div>

            <p>
              This is essentially a <strong>state machine</strong>. Each device transitions
              between states based on what it observes on the wire.
            </p>

            <CSMAStateMachine />

            <p>
              Here&apos;s what happens when multiple devices share a hub—each trying
              to greet everyone else:
            </p>

            <CSMASwimLanes />

            <div className="not-prose my-6 rounded-lg border-l-4 border-slate-400 bg-slate-50 p-4">
              <p className="text-slate-600 text-sm">
                <strong>Modern networks:</strong> Full-duplex switched Ethernet has
                eliminated collisions. Each device has a dedicated path to the switch.
                CSMA/CD is largely historical—but understanding it explains why
                Ethernet frames have minimum sizes and why the preamble exists.
              </p>
            </div>

            <h3>Why 64 bytes minimum?</h3>
            <p>
              For collision detection to work, the sender must still be transmitting
              when the collision signal returns. If the frame is too short, the sender
              finishes before hearing the collision—and thinks it succeeded.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500 mb-3 font-medium">Collision detection timing</div>

              {/* Timeline illustration */}
              <div className="space-y-4">
                {/* Scenario 1: Frame too short */}
                <div>
                  <div className="text-xs font-medium text-red-600 mb-2">Frame too short — collision missed</div>
                  <div className="relative h-8 bg-slate-100 rounded overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-16 bg-red-200 flex items-center justify-center text-xs text-red-700 font-mono">
                      TX
                    </div>
                    <div className="absolute left-32 top-0 h-full w-24 bg-red-400 flex items-center justify-center text-xs text-white font-mono">
                      collision arrives
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Sender finished at T=1. Collision signal arrives at T=2. Too late—sender thinks it worked.
                  </div>
                </div>

                {/* Scenario 2: Frame long enough */}
                <div>
                  <div className="text-xs font-medium text-green-600 mb-2">Frame long enough — collision detected</div>
                  <div className="relative h-8 bg-slate-100 rounded overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-48 bg-green-200 flex items-center justify-center text-xs text-green-700 font-mono">
                      TX (still sending...)
                    </div>
                    <div className="absolute left-32 top-0 h-full w-24 bg-green-500 flex items-center justify-center text-xs text-white font-mono">
                      collision!
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Sender still transmitting when collision arrives. Detected! Abort and retry.
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-600">
                  <strong>The math:</strong> At 10 Mbps with max cable length (2500m), round-trip time is ~51μs.
                  At 10 Mbps, that&apos;s <code className="bg-slate-100 px-1 rounded">512 bits = 64 bytes</code>.
                  Any frame shorter than 64 bytes gets padded.
                </div>
              </div>
            </div>

            <h3>Why does the preamble exist?</h3>
            <p>
              Ethernet is asynchronous—the receiver&apos;s clock isn&apos;t synced with the sender&apos;s.
              The preamble gives the receiver time to lock onto the signal before real data arrives.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500 mb-3 font-medium">Clock synchronization</div>

              <div className="space-y-4">
                {/* Without preamble */}
                <div>
                  <div className="text-xs font-medium text-red-600 mb-2">Without preamble — data corrupted</div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {['1','0','1','1','0','0','1','0'].map((bit, i) => (
                        <div key={i} className={`w-6 h-6 flex items-center justify-center text-xs font-mono border ${i < 3 ? 'bg-red-100 border-red-300 text-red-400' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
                          {i < 3 ? '?' : bit}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">← first bits lost while receiver syncs</span>
                  </div>
                </div>

                {/* With preamble */}
                <div>
                  <div className="text-xs font-medium text-green-600 mb-2">With preamble — clean data</div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {['1','0','1','0','1','0','1','0'].map((bit, i) => (
                        <div key={i} className="w-6 h-6 flex items-center justify-center text-xs font-mono bg-amber-50 border border-amber-200 text-amber-600">
                          {bit}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-amber-600 font-medium">preamble</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      <div className="w-6 h-6 flex items-center justify-center text-xs font-mono bg-orange-100 border border-orange-300 text-orange-700">1</div>
                      <div className="w-6 h-6 flex items-center justify-center text-xs font-mono bg-orange-100 border border-orange-300 text-orange-700">1</div>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">SFD</span>
                    <div className="flex ml-2">
                      {['1','0','1','1','0','0','1','0'].map((bit, i) => (
                        <div key={i} className="w-6 h-6 flex items-center justify-center text-xs font-mono bg-green-100 border border-green-300 text-green-700">
                          {bit}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-green-600 font-medium">← actual data (all intact)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-600">
                  The receiver&apos;s PLL (Phase-Locked Loop) uses the alternating <code className="bg-slate-100 px-1 rounded">10101010</code> pattern
                  to lock onto the signal frequency. By the time real data arrives, the clock is synced.
                </div>
              </div>
            </div>
          </section>

          {/* CRC Section */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Error Detection with CRC</h2>
            <p>
              Remember the FCS field in the Ethernet frame? It contains a <strong>CRC-32</strong> checksum.
              But why CRC instead of a simple sum of bytes?
            </p>

            <h3>The Problem with Simple Checksums</h3>
            <p>
              A simple checksum just adds up all the bytes. If the sum matches, the data is
              probably intact. But there&apos;s a fatal flaw: <strong>errors can cancel out</strong>.
            </p>

            <CRCDemo />

            <h3>How CRC Works</h3>
            <p>
              CRC treats the entire frame as a giant binary number and divides it by a
              special polynomial using XOR operations. The remainder becomes the checksum.
            </p>

            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">1</span>
                <span className="text-slate-700">
                  <strong>Sender:</strong> Append N zeros to data (N = polynomial degree).
                  Divide by polynomial. The remainder is the CRC.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">2</span>
                <span className="text-slate-700">
                  <strong>Sender:</strong> Append CRC to the original data and transmit.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">3</span>
                <span className="text-slate-700">
                  <strong>Receiver:</strong> Divide received (data + CRC) by the same polynomial.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">4</span>
                <span className="text-slate-700">
                  <strong>Receiver:</strong> If remainder = 0, data is intact. Otherwise, drop the frame.
                </span>
              </div>
            </div>

            <h3>Why Polynomial Division?</h3>
            <p>
              The mathematical properties of polynomial division guarantee detection of:
            </p>

            <div className="not-prose my-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="text-sm font-semibold text-green-800 mb-1">✓ All single-bit errors</div>
                <div className="text-xs text-green-700">Any one bit flipped → detected</div>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="text-sm font-semibold text-green-800 mb-1">✓ All double-bit errors</div>
                <div className="text-xs text-green-700">Any two bits flipped → detected</div>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="text-sm font-semibold text-green-800 mb-1">✓ All odd-count errors</div>
                <div className="text-xs text-green-700">1, 3, 5... bits flipped → detected</div>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="text-sm font-semibold text-green-800 mb-1">✓ Burst errors ≤ 32 bits</div>
                <div className="text-xs text-green-700">Consecutive corrupted bits → detected</div>
              </div>
            </div>

            <div className="not-prose my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
              <div className="text-sm text-amber-800">
                <strong>Important:</strong> CRC detects errors but cannot correct them.
                If the CRC fails, the frame is <em>silently dropped</em>. Higher layers
                (like TCP) handle retransmission.
              </div>
            </div>

            <h3>Ethernet&apos;s CRC-32</h3>
            <p>
              Ethernet uses the polynomial <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">0x04C11DB7</code>,
              producing a 32-bit checksum. This detects any burst error up to 32 consecutive bits—more
              than enough for typical electrical noise on a cable.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900 mb-2">Speed in Practice</div>
              <p className="text-sm text-slate-600 mb-3">
                Despite the math looking expensive, CRC is blazingly fast:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-1">Software (lookup tables)</div>
                  <div className="text-slate-500">
                    Pre-computed tables turn division into table lookups.
                    A single CPU core can process <strong className="text-slate-700">~3-5 GB/s</strong>.
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-1">Hardware (dedicated circuits)</div>
                  <div className="text-slate-500">
                    Network cards have CRC logic in silicon.
                    Your NIC computes CRC at <strong className="text-slate-700">line rate</strong>—100 Gbps+
                    with zero CPU overhead.
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                The XOR operations parallelize perfectly in hardware. A 1500-byte frame&apos;s CRC
                takes <strong>nanoseconds</strong>—the math never becomes the bottleneck.
              </p>
            </div>
          </section>

          {/* MAC Addresses Section */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>MAC Addresses</h2>
            <p>
              Every network interface has a <strong>MAC address</strong>—a 48-bit (6 octet)
              identifier that&apos;s supposed to be globally unique. This is what goes in
              the Source and Destination fields of every Ethernet frame.
            </p>

            <h3>Structure</h3>
            <p>
              A MAC address is split into two halves:
            </p>

            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-blue-100 text-blue-700 w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1-3</span>
                <span className="text-slate-700">
                  <strong>OUI (Organizationally Unique Identifier)</strong> — First 3 octets.
                  Assigned to manufacturers by IEEE. Apple, Intel, Cisco each have their own prefixes.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-emerald-100 text-emerald-700 w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">4-6</span>
                <span className="text-slate-700">
                  <strong>NIC-specific</strong> — Last 3 octets.
                  Assigned by the manufacturer to each device they produce.
                </span>
              </div>
            </div>

            <MACAddressDemo />

            <h3>Special Bits</h3>
            <p>
              The first octet contains two special bits that change how the address behaves:
            </p>

            <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                <div className="text-sm font-semibold text-purple-800 mb-1">Bit 0: I/G (Individual/Group)</div>
                <div className="text-xs text-purple-700">
                  <strong>0</strong> = Unicast (one device)<br />
                  <strong>1</strong> = Multicast (group of devices)
                </div>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="text-sm font-semibold text-amber-800 mb-1">Bit 1: U/L (Universal/Local)</div>
                <div className="text-xs text-amber-700">
                  <strong>0</strong> = Burned-in by manufacturer<br />
                  <strong>1</strong> = Set by software (VM, container)
                </div>
              </div>
            </div>

            <h3>Special Addresses</h3>
            <div className="not-prose my-6 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs">FF:FF:FF:FF:FF:FF</code>
                <span className="text-slate-600">Broadcast — all devices must process</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs">01:00:5E:xx:xx:xx</code>
                <span className="text-slate-600">IPv4 multicast range</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs">33:33:xx:xx:xx:xx</code>
                <span className="text-slate-600">IPv6 multicast range</span>
              </div>
            </div>

            <h3>Bridging to Layer 3: ARP</h3>
            <p>
              MAC addresses work at Layer 2, but applications use IP addresses (Layer 3).
              <strong> ARP (Address Resolution Protocol)</strong> bridges this gap:
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">1</span>
                  <span className="text-slate-700">
                    Device wants to send to <code className="bg-white px-1 rounded">192.168.1.50</code> but
                    doesn&apos;t know its MAC address.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">2</span>
                  <span className="text-slate-700">
                    Broadcasts ARP request: <em>&quot;Who has 192.168.1.50?&quot;</em>
                    (sent to <code className="bg-white px-1 rounded">FF:FF:FF:FF:FF:FF</code>)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">3</span>
                  <span className="text-slate-700">
                    Target device replies: <em>&quot;That&apos;s me! My MAC is AC:DE:48:12:34:56&quot;</em>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">4</span>
                  <span className="text-slate-700">
                    Sender caches the mapping and uses it for future frames.
                  </span>
                </div>
              </div>
            </div>

            <div className="not-prose my-6 rounded-lg border-l-4 border-slate-400 bg-slate-50 p-4">
              <p className="text-slate-600 text-sm">
                <strong>Security note:</strong> ARP has no authentication. Anyone can claim to own
                any IP address, enabling <em>ARP spoofing</em> attacks. This is why public Wi-Fi
                is risky without VPN/HTTPS.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <nav className="mt-16 pt-8 border-t border-slate-200">
            <Link
              href="/learning/networking/network-layer"
              className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
            >
              <div>
                <div className="text-xs text-slate-500 mb-1">Next up</div>
                <div className="font-semibold text-slate-900 group-hover:text-emerald-700">
                  Layer 3: Network Layer
                </div>
                <div className="text-sm text-slate-500">
                  IP addresses, routing, and how packets traverse the internet
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-emerald-600 text-xl">&rarr;</span>
            </Link>
          </nav>
        </motion.div>
      </div>
    </article>
  )
}
