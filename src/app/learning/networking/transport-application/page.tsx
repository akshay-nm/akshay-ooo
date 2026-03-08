'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TCPSegmentDemo } from '@/components/demos/TCPSegmentDemo'
import { HandshakeDemo } from '@/components/demos/HandshakeDemo'
import { TCPvsUDPDemo } from '@/components/demos/TCPvsUDPDemo'
import { SocketStateDemo } from '@/components/demos/SocketStateDemo'
import { PortsDemo } from '@/components/demos/PortsDemo'
import { FullStackDemo } from '@/components/demos/FullStackDemo'
import { SequenceNumberDemo } from '@/components/demos/SequenceNumberDemo'

export default function TransportApplicationPage() {
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
            &larr; Back to Learning
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              Layer 4
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
              Layer 7
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Transport &amp; Application Layers
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            TCP, UDP, ports, sockets, and how applications communicate reliably over the network.
          </p>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="prose prose-slate prose-lg max-w-none"
        >
          {/* Learning Objectives */}
          <section className="not-prose mb-12">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                After reading this, you should be able to:
              </h2>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">1</span>
                  <span className="text-sm text-slate-700">
                    <strong>Explain the TCP segment structure</strong> — identify sequence numbers, acknowledgment numbers,
                    flags, window size, and their purposes
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">2</span>
                  <span className="text-sm text-slate-700">
                    <strong>Walk through the 3-way handshake</strong> — describe SYN, SYN-ACK, ACK and why each step is needed
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">3</span>
                  <span className="text-sm text-slate-700">
                    <strong>Compare TCP vs UDP</strong> — choose the right protocol based on reliability, ordering, and latency requirements
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">4</span>
                  <span className="text-sm text-slate-700">
                    <strong>Identify TCP socket states</strong> — understand LISTEN, ESTABLISHED, TIME_WAIT, and state transitions
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">5</span>
                  <span className="text-sm text-slate-700">
                    <strong>Explain ports and sockets</strong> — how multiple applications share one IP address
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0">6</span>
                  <span className="text-sm text-slate-700">
                    <strong>Trace a request through all layers</strong> — follow an HTTP request from browser to server and back
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Part 1: Transport Layer */}
          <div className="not-prose mb-8">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Part 1</div>
            <div className="text-2xl font-bold text-slate-900">Transport Layer (Layer 4)</div>
          </div>

          {/* 1. Introduction to Transport */}
          <section>
            <h2>Why We Need the Transport Layer</h2>
            <p>
              The Network Layer (IP) gets packets from host to host, but that&apos;s not enough.
              IP is <strong>unreliable</strong>—packets can be lost, duplicated, or arrive out of order.
              And a host runs many applications—how does it know which app should receive each packet?
            </p>

            <p>
              The <strong>Transport Layer</strong> solves both problems:
            </p>

            <div className="not-prose my-6 space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <span className="text-blue-600 shrink-0">✓</span>
                <span className="text-slate-700"><strong>Multiplexing</strong> — Use port numbers to direct traffic to the right application</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-blue-600 shrink-0">✓</span>
                <span className="text-slate-700"><strong>Reliable delivery</strong> (TCP) — Acknowledge data, retransmit losses, order segments</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-blue-600 shrink-0">✓</span>
                <span className="text-slate-700"><strong>Flow control</strong> — Prevent sender from overwhelming receiver</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-blue-600 shrink-0">✓</span>
                <span className="text-slate-700"><strong>Congestion control</strong> — Avoid overwhelming the network</span>
              </div>
            </div>
          </section>

          {/* 2. TCP Segment Structure */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>TCP Segment Structure</h2>
            <p>
              <strong>TCP (Transmission Control Protocol)</strong> provides reliable, ordered delivery.
              Each TCP segment has a header with fields that enable acknowledgments, ordering,
              and connection management.
            </p>

            <TCPSegmentDemo />

            <h3>Key Header Fields</h3>
            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700 font-semibold shrink-0 w-28 text-center">Seq Number</span>
                <span className="text-slate-700">
                  Position of this segment&apos;s first byte in the stream. Enables ordering and duplicate detection.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-700 font-semibold shrink-0 w-28 text-center">Ack Number</span>
                <span className="text-slate-700">
                  Next byte the receiver expects. Confirms receipt of all bytes before this number.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700 font-semibold shrink-0 w-28 text-center">Window</span>
                <span className="text-slate-700">
                  How many bytes the receiver can accept. Flow control prevents buffer overflow.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-700 font-semibold shrink-0 w-28 text-center">Flags</span>
                <span className="text-slate-700">
                  Control bits: SYN (connect), ACK (acknowledge), FIN (close), RST (reset), PSH (push), URG (urgent).
                </span>
              </div>
            </div>
          </section>

          {/* 3. TCP Three-Way Handshake */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>TCP Three-Way Handshake</h2>
            <p>
              Before any data can flow, TCP establishes a connection using a <strong>three-way handshake</strong>.
              This synchronizes sequence numbers on both sides and confirms both endpoints are ready.
            </p>

            <HandshakeDemo />

            <h3>Why Three Messages?</h3>
            <div className="not-prose my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
              <div className="text-sm text-blue-800">
                <strong>Two isn&apos;t enough:</strong> If the server only sent SYN-ACK, it wouldn&apos;t know if
                the client received it. The client&apos;s final ACK confirms the server&apos;s SYN-ACK arrived,
                ensuring both sides have synchronized sequence numbers.
              </div>
            </div>

            <h3>Connection Teardown</h3>
            <p>
              Closing a TCP connection uses a <strong>four-way handshake</strong>:
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-4">
                  <span className="w-20 text-slate-500">FIN →</span>
                  <span className="text-slate-700">Client: &quot;I&apos;m done sending&quot;</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-slate-500">← ACK</span>
                  <span className="text-slate-700">Server: &quot;Got it&quot;</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-slate-500">← FIN</span>
                  <span className="text-slate-700">Server: &quot;I&apos;m done too&quot;</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-slate-500">ACK →</span>
                  <span className="text-slate-700">Client: &quot;Got it, goodbye&quot;</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. TCP vs UDP */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>TCP vs UDP</h2>
            <p>
              <strong>UDP (User Datagram Protocol)</strong> is the other main transport protocol.
              Unlike TCP, UDP is <strong>connectionless</strong> and <strong>unreliable</strong>—it just
              sends packets without acknowledgment or ordering.
            </p>

            <TCPvsUDPDemo />

            <div className="not-prose my-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="text-sm font-semibold text-blue-800 mb-2">Use TCP when:</div>
                <div className="space-y-1 text-xs text-blue-700">
                  <div>• Data must arrive complete (files, web pages)</div>
                  <div>• Order matters (database queries)</div>
                  <div>• You can tolerate latency</div>
                </div>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="text-sm font-semibold text-amber-800 mb-2">Use UDP when:</div>
                <div className="space-y-1 text-xs text-amber-700">
                  <div>• Speed beats reliability (video streaming)</div>
                  <div>• Old data is useless (live gaming)</div>
                  <div>• You handle reliability yourself (DNS, QUIC)</div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. TCP Socket States */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>TCP Socket States</h2>
            <p>
              A TCP connection goes through various <strong>states</strong> during its lifetime.
              Understanding these states helps debug connection issues and understand what
              <code className="bg-slate-100 px-1 rounded">netstat</code> output means.
            </p>

            <SocketStateDemo />

            <h3>Common State Issues</h3>
            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700 font-semibold shrink-0">TIME_WAIT</span>
                <span className="text-slate-700">
                  Socket lingers for 2×MSL (typically 60 seconds) to handle delayed packets.
                  Too many can exhaust ports—common on busy servers.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-red-100 px-2 py-0.5 text-red-700 font-semibold shrink-0">CLOSE_WAIT</span>
                <span className="text-slate-700">
                  Application received FIN but hasn&apos;t closed its end.
                  Often indicates a bug—app isn&apos;t calling <code>close()</code>.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700 font-semibold shrink-0">SYN_RECV</span>
                <span className="text-slate-700">
                  Server sent SYN-ACK, waiting for ACK. Too many = possible SYN flood attack.
                </span>
              </div>
            </div>
          </section>

          {/* 6. Ports and Sockets */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Ports and Sockets</h2>
            <p>
              A <strong>port</strong> is a 16-bit number (0-65535) that identifies an application endpoint.
              Combined with an IP address, it forms a <strong>socket</strong>—the unique identifier for
              one end of a connection.
            </p>

            <PortsDemo />

            <h3>Port Ranges</h3>
            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Range</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Name</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">0 - 1023</td>
                      <td className="px-4 py-2">Well-known</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Reserved for system services (HTTP=80, HTTPS=443, SSH=22)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">1024 - 49151</td>
                      <td className="px-4 py-2">Registered</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Assigned to applications (MySQL=3306, PostgreSQL=5432)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">49152 - 65535</td>
                      <td className="px-4 py-2">Dynamic</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Ephemeral ports for client connections</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3>What Uniquely Identifies a Connection?</h3>
            <p>
              A TCP connection is identified by a <strong>5-tuple</strong>:
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="font-mono text-sm text-slate-700 space-y-1">
                <div className="flex gap-2">
                  <span className="text-slate-500">1.</span>
                  <span>Protocol (TCP or UDP)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">2.</span>
                  <span>Source IP</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">3.</span>
                  <span>Source Port</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">4.</span>
                  <span>Destination IP</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">5.</span>
                  <span>Destination Port</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                This is how a web server handles thousands of connections on port 443—each has a different client IP:port.
              </div>
            </div>
          </section>

          {/* 7. TCP Reliability Mechanisms */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>How TCP Ensures Reliability</h2>
            <p>
              TCP uses several mechanisms to guarantee reliable, ordered delivery over
              an unreliable network:
            </p>

            <div className="not-prose my-6 space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">Acknowledgments &amp; Retransmission</div>
                <div className="text-sm text-slate-600">
                  Receiver ACKs received data. If sender doesn&apos;t get ACK within timeout, it retransmits.
                  Duplicate ACKs trigger fast retransmit.
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">Sequence Numbers</div>
                <div className="text-sm text-slate-600">
                  Every byte has a sequence number. Receiver reorders out-of-order segments
                  and detects duplicates.
                </div>
              </div>
            </div>

            <SequenceNumberDemo />

            <div className="not-prose my-6 space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">Flow Control (Window)</div>
                <div className="text-sm text-slate-600">
                  Receiver advertises available buffer space. Sender won&apos;t send more than
                  the window allows, preventing overflow.
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">Congestion Control</div>
                <div className="text-sm text-slate-600">
                  TCP starts slow (slow start), ramps up exponentially, then linearly (congestion avoidance).
                  Packet loss signals congestion—sender backs off.
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">Checksum</div>
                <div className="text-sm text-slate-600">
                  Header includes checksum over header + data. Corrupted segments are discarded.
                </div>
              </div>
            </div>
          </section>

          {/* 8. Firewalls and Port Security */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Firewalls and Port Security</h2>
            <p>
              <strong>Firewalls</strong> control network traffic based on rules. Most operate at
              Layer 3/4, filtering by IP addresses, ports, and protocols.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">Common Firewall Rules</div>
              <div className="font-mono text-xs space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">ALLOW</span>
                  <span>TCP port 443 (HTTPS) from any</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">ALLOW</span>
                  <span>TCP port 22 (SSH) from 10.0.0.0/8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">DENY</span>
                  <span>TCP port 3306 (MySQL) from any</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">DENY</span>
                  <span>all from any (default deny)</span>
                </div>
              </div>
            </div>

            <h3>Stateful vs Stateless Firewalls</h3>
            <div className="not-prose my-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">Stateless</div>
                <div className="text-xs text-slate-600">
                  Each packet judged independently. Must explicitly allow return traffic.
                  Fast but limited.
                </div>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="text-sm font-semibold text-blue-800 mb-2">Stateful</div>
                <div className="text-xs text-blue-700">
                  Tracks connection state. Return traffic automatically allowed for
                  established connections. More intelligent.
                </div>
              </div>
            </div>

            <div className="not-prose my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
              <div className="text-sm text-amber-800">
                <strong>Security principle:</strong> Default deny—block everything, then explicitly
                allow only what&apos;s needed. Expose minimum necessary ports.
              </div>
            </div>
          </section>

          {/* Part 2: Application Layer */}
          <div className="not-prose mt-20 mb-8">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Part 2</div>
            <div className="text-2xl font-bold text-slate-900">Application Layer (Layer 7)</div>
          </div>

          {/* 9. Application Protocols */}
          <section>
            <h2>Application Layer Protocols</h2>
            <p>
              The Application Layer is where user-facing protocols live. These protocols
              define how applications communicate—the format of messages, the sequence of exchanges,
              and the semantics of requests and responses.
            </p>

            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Protocol</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Port</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Transport</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-2 font-semibold">HTTP/HTTPS</td>
                      <td className="px-4 py-2 font-mono text-xs">80/443</td>
                      <td className="px-4 py-2">TCP</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Web pages, APIs</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">DNS</td>
                      <td className="px-4 py-2 font-mono text-xs">53</td>
                      <td className="px-4 py-2">UDP/TCP</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Domain name resolution</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">SSH</td>
                      <td className="px-4 py-2 font-mono text-xs">22</td>
                      <td className="px-4 py-2">TCP</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Secure shell access</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">SMTP</td>
                      <td className="px-4 py-2 font-mono text-xs">25/587</td>
                      <td className="px-4 py-2">TCP</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Email sending</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">FTP</td>
                      <td className="px-4 py-2 font-mono text-xs">21</td>
                      <td className="px-4 py-2">TCP</td>
                      <td className="px-4 py-2 text-xs text-slate-500">File transfer</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 10. HTTP Basics */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>HTTP: The Web&apos;s Protocol</h2>
            <p>
              <strong>HTTP (Hypertext Transfer Protocol)</strong> is a request-response protocol.
              The client sends a request; the server sends a response. Simple, stateless, and ubiquitous.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-800 p-4 overflow-x-auto">
              <div className="font-mono text-xs text-slate-100">
                <div className="text-emerald-400">GET /api/users HTTP/1.1</div>
                <div className="text-slate-400">Host: example.com</div>
                <div className="text-slate-400">User-Agent: Mozilla/5.0</div>
                <div className="text-slate-400">Accept: application/json</div>
                <div className="text-slate-500 mt-4">---</div>
                <div className="text-blue-400 mt-2">HTTP/1.1 200 OK</div>
                <div className="text-slate-400">Content-Type: application/json</div>
                <div className="text-slate-400">Content-Length: 52</div>
                <div className="text-slate-300 mt-2">{`{"users": [{"id": 1, "name": "Alice"}]}`}</div>
              </div>
            </div>

            <h3>HTTP Methods</h3>
            <div className="not-prose my-6 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-emerald-100 px-2 py-1 rounded font-mono text-xs text-emerald-700 w-20 text-center">GET</code>
                <span className="text-slate-600">Retrieve a resource (idempotent, cacheable)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-blue-100 px-2 py-1 rounded font-mono text-xs text-blue-700 w-20 text-center">POST</code>
                <span className="text-slate-600">Create a resource or submit data</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-amber-100 px-2 py-1 rounded font-mono text-xs text-amber-700 w-20 text-center">PUT</code>
                <span className="text-slate-600">Replace a resource entirely</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-purple-100 px-2 py-1 rounded font-mono text-xs text-purple-700 w-20 text-center">PATCH</code>
                <span className="text-slate-600">Partially update a resource</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-red-100 px-2 py-1 rounded font-mono text-xs text-red-700 w-20 text-center">DELETE</code>
                <span className="text-slate-600">Remove a resource</span>
              </div>
            </div>
          </section>

          {/* 11. DNS */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>DNS: The Internet&apos;s Phone Book</h2>
            <p>
              <strong>DNS (Domain Name System)</strong> translates human-readable names like
              <code className="bg-slate-100 px-1 rounded">example.com</code> into IP addresses.
              Without DNS, you&apos;d have to memorize IP addresses for every website.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">DNS Resolution Steps</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">1</span>
                  <span className="text-slate-700">
                    Check <strong>local cache</strong> (browser, OS)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">2</span>
                  <span className="text-slate-700">
                    Query <strong>recursive resolver</strong> (usually your ISP or 8.8.8.8)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">3</span>
                  <span className="text-slate-700">
                    Resolver queries <strong>root servers</strong> → <strong>TLD servers</strong> → <strong>authoritative servers</strong>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">4</span>
                  <span className="text-slate-700">
                    Answer returned and <strong>cached</strong> with TTL
                  </span>
                </div>
              </div>
            </div>

            <h3>Record Types</h3>
            <div className="not-prose my-6 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-16 text-center">A</code>
                <span className="text-slate-600">IPv4 address</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-16 text-center">AAAA</code>
                <span className="text-slate-600">IPv6 address</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-16 text-center">CNAME</code>
                <span className="text-slate-600">Alias to another domain</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-16 text-center">MX</code>
                <span className="text-slate-600">Mail server for the domain</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-16 text-center">TXT</code>
                <span className="text-slate-600">Arbitrary text (SPF, DKIM, verification)</span>
              </div>
            </div>
          </section>

          {/* 12. All Layers Working Together */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>All Layers Working Together</h2>
            <p>
              Let&apos;s trace an HTTP request through every layer of the stack—from your browser
              typing a URL to the server responding with a web page. This shows how all the
              pieces fit together.
            </p>

            <FullStackDemo />

            <div className="not-prose my-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4">
              <div className="text-sm text-emerald-800">
                <strong>Key insight:</strong> Each layer adds its own header and only talks to the
                same layer on the other side. HTTP doesn&apos;t know about TCP segments; TCP doesn&apos;t
                know about IP routing; IP doesn&apos;t know about Ethernet frames. This
                <strong> encapsulation</strong> lets each layer evolve independently.
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Summary</h2>
            <div className="not-prose my-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="space-y-2 text-sm text-blue-800">
                <div><strong>Transport Layer</strong> provides process-to-process communication via ports</div>
                <div><strong>TCP</strong> gives reliable, ordered delivery with connection establishment</div>
                <div><strong>UDP</strong> is fast and simple—no connection, no reliability guarantees</div>
                <div><strong>Sockets</strong> are IP:port pairs that identify connection endpoints</div>
                <div><strong>Firewalls</strong> filter traffic based on IPs, ports, and protocols</div>
                <div><strong>Application Layer</strong> protocols (HTTP, DNS) define message formats and semantics</div>
                <div><strong>Encapsulation</strong> lets each layer work independently</div>
              </div>
            </div>

            <div className="not-prose my-6 rounded-lg border-l-4 border-slate-400 bg-slate-50 p-4">
              <p className="text-slate-600 text-sm">
                <strong>Next up:</strong> Network security — TLS/SSL, certificate chains, common attacks,
                and how to protect your applications.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <nav className="mt-16 pt-8 border-t border-slate-200">
            <Link
              href="/learning/networking/network-layer"
              className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-slate-400 group-hover:text-blue-600 text-xl">&larr;</span>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">Previous</div>
                <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                  Layer 3: Network Layer
                </div>
                <div className="text-sm text-slate-500">
                  IP addresses, routing, and how packets find their way
                </div>
              </div>
            </Link>
          </nav>
        </motion.div>
      </div>
    </article>
  )
}
