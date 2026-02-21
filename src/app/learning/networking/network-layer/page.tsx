'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SubnetDemo } from '@/components/demos/SubnetDemo'

export default function NetworkLayerPage() {
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
            <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
              Layer 3
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
              In Progress
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Network Layer
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            IP addresses, routing, and how packets find their way across the internet.
          </p>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="prose prose-slate prose-lg max-w-none"
        >
          {/* Layer 3 Overview */}
          <section>
            <h2>What Layer 3 Does</h2>
            <p>
              Layer 2 (Data Link) handles communication on a <strong>single network segment</strong>—devices
              connected to the same switch or hub. But the internet is millions of separate networks.
              How does a packet get from your laptop to a server in another country?
            </p>

            <p>
              That&apos;s Layer 3&apos;s job: <strong>routing packets between networks</strong>.
            </p>

            <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="text-sm font-semibold text-blue-800 mb-1">Layer 2: Local Delivery</div>
                <div className="text-xs text-blue-700">
                  MAC addresses, same network segment, switches
                </div>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-sm font-semibold text-emerald-800 mb-1">Layer 3: Global Routing</div>
                <div className="text-xs text-emerald-700">
                  IP addresses, across networks, routers
                </div>
              </div>
            </div>
          </section>

          {/* IP Addresses */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>IP Addresses</h2>
            <p>
              While MAC addresses identify <em>hardware</em>, IP addresses identify
              <em> network locations</em>. Think of it like:
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-slate-700 mb-1">MAC Address</div>
                  <div className="text-slate-500">Like a person&apos;s fingerprint—permanent, tied to the physical device</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">IP Address</div>
                  <div className="text-slate-500">Like a mailing address—can change when you move networks</div>
                </div>
              </div>
            </div>

            <h3>IPv4 Structure</h3>
            <p>
              IPv4 addresses are 32 bits, written as four decimal octets: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">192.168.1.100</code>
            </p>

            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex justify-center gap-1 mb-3">
                  {['192', '168', '1', '100'].map((octet, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-14 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {octet}
                      </div>
                      {i < 3 && <span className="mx-1 text-slate-400">.</span>}
                    </div>
                  ))}
                </div>
                <div className="text-center text-xs text-slate-500">
                  4 octets × 8 bits = 32 bits total = ~4.3 billion addresses
                </div>
              </div>
            </div>

            <h3>Network vs Host</h3>
            <p>
              Every IP address has two parts: the <strong>network portion</strong> (which network
              you&apos;re on) and the <strong>host portion</strong> (which device on that network).
              The <strong>subnet mask</strong> defines where this split happens.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center gap-4">
                  <span className="w-24 text-slate-500">IP:</span>
                  <span className="text-slate-800">192.168.1.100</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-slate-500">Mask:</span>
                  <span className="text-slate-800">255.255.255.0</span>
                  <span className="text-xs text-slate-400">(/24)</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center gap-4">
                  <span className="w-24 text-slate-500">Network:</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">192.168.1</span>
                  <span className="text-slate-400">.0</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-slate-500">Host:</span>
                  <span className="text-slate-400">0.0.0.</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">100</span>
                </div>
              </div>
            </div>

            <p>
              With a /24 mask, the first 24 bits identify the network, leaving 8 bits for hosts.
              That&apos;s 2<sup>8</sup> - 2 = <strong>254 usable addresses</strong> per network
              (minus network address and broadcast).
            </p>

            <h3>CIDR Notation</h3>
            <p>
              Instead of writing the full subnet mask, <strong>CIDR notation</strong> just appends
              the number of network bits:
            </p>

            <div className="not-prose my-6 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-36">192.168.1.0/24</code>
                <span className="text-slate-600">256 addresses (254 usable)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-36">10.0.0.0/8</code>
                <span className="text-slate-600">16.7 million addresses</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-36">172.16.0.0/12</code>
                <span className="text-slate-600">1 million addresses</span>
              </div>
            </div>

            <SubnetDemo />
          </section>

          {/* Private vs Public */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Private vs Public Addresses</h2>
            <p>
              With only ~4.3 billion IPv4 addresses and billions of devices, we&apos;d run out fast.
              The solution: <strong>private address ranges</strong> that can be reused on every
              local network.
            </p>

            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Range</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">CIDR</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Addresses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">10.0.0.0 – 10.255.255.255</td>
                      <td className="px-4 py-2 font-mono text-xs">/8</td>
                      <td className="px-4 py-2 text-slate-600">16.7 million</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">172.16.0.0 – 172.31.255.255</td>
                      <td className="px-4 py-2 font-mono text-xs">/12</td>
                      <td className="px-4 py-2 text-slate-600">1 million</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">192.168.0.0 – 192.168.255.255</td>
                      <td className="px-4 py-2 font-mono text-xs">/16</td>
                      <td className="px-4 py-2 text-slate-600">65,536</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p>
              Your home router has a <strong>public IP</strong> (assigned by your ISP) and assigns
              <strong> private IPs</strong> to devices on your network. <strong>NAT (Network Address
              Translation)</strong> rewrites packet headers so all your devices share one public IP.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">NAT in Action</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Your laptop:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">192.168.1.100</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500">Router rewrites to:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">203.0.113.50</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Server reply to:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">203.0.113.50</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500">Router forwards to:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">192.168.1.100</span>
                </div>
              </div>
            </div>
          </section>

          {/* IP Packet Structure */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>IP Packet Structure</h2>
            <p>
              Just like Ethernet frames wrap data at Layer 2, IP <strong>packets</strong> wrap
              data at Layer 3. The Ethernet frame&apos;s payload contains the IP packet.
            </p>

            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500 mb-2">IPv4 Header (20+ bytes)</div>
                <div className="flex flex-wrap gap-1">
                  {[
                    { name: 'Ver', bytes: '4b', color: 'bg-slate-100' },
                    { name: 'IHL', bytes: '4b', color: 'bg-slate-100' },
                    { name: 'ToS', bytes: '1', color: 'bg-slate-100' },
                    { name: 'Total Length', bytes: '2', color: 'bg-slate-100' },
                    { name: 'ID', bytes: '2', color: 'bg-purple-100' },
                    { name: 'Flags', bytes: '3b', color: 'bg-purple-100' },
                    { name: 'Fragment Offset', bytes: '13b', color: 'bg-purple-100' },
                    { name: 'TTL', bytes: '1', color: 'bg-amber-100' },
                    { name: 'Protocol', bytes: '1', color: 'bg-blue-100' },
                    { name: 'Checksum', bytes: '2', color: 'bg-slate-100' },
                    { name: 'Source IP', bytes: '4', color: 'bg-emerald-100' },
                    { name: 'Dest IP', bytes: '4', color: 'bg-emerald-100' },
                  ].map((field, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1.5 rounded text-xs font-medium ${field.color} text-slate-700`}
                    >
                      {field.name}
                      <span className="text-slate-400 ml-1">({field.bytes})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h3>Key Fields</h3>

            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700 font-semibold shrink-0">TTL</span>
                <span className="text-slate-700">
                  <strong>Time To Live</strong> — Decremented by each router. When it hits 0, the packet
                  is dropped. Prevents infinite routing loops. (Usually starts at 64 or 128)
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700 font-semibold shrink-0">Protocol</span>
                <span className="text-slate-700">
                  What&apos;s inside the payload: <code className="bg-slate-100 px-1 rounded">6</code> = TCP,
                  <code className="bg-slate-100 px-1 rounded">17</code> = UDP,
                  <code className="bg-slate-100 px-1 rounded">1</code> = ICMP
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-700 font-semibold shrink-0">Fragmentation</span>
                <span className="text-slate-700">
                  If a packet is too large for a link&apos;s MTU, it can be split into fragments.
                  ID, Flags, and Offset fields handle reassembly at the destination.
                </span>
              </div>
            </div>
          </section>

          {/* Routing */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>How Routing Works</h2>
            <p>
              Every router maintains a <strong>routing table</strong>—a list of network destinations
              and where to forward packets for each. When a packet arrives:
            </p>

            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">1</span>
                <span className="text-slate-700">
                  Router reads the <strong>destination IP</strong> from the packet header
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">2</span>
                <span className="text-slate-700">
                  Looks up the <strong>longest matching prefix</strong> in its routing table
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">3</span>
                <span className="text-slate-700">
                  Forwards the packet to the <strong>next hop</strong> (another router or the destination)
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">4</span>
                <span className="text-slate-700">
                  Decrements <strong>TTL</strong> (drops packet if it reaches 0)
                </span>
              </div>
            </div>

            <h3>Example Routing Table</h3>
            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">Destination</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">Gateway</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">Interface</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-3 py-2">192.168.1.0/24</td>
                      <td className="px-3 py-2 text-slate-500">directly connected</td>
                      <td className="px-3 py-2">eth0</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">10.0.0.0/8</td>
                      <td className="px-3 py-2">192.168.1.1</td>
                      <td className="px-3 py-2">eth0</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="px-3 py-2">0.0.0.0/0</td>
                      <td className="px-3 py-2">192.168.1.254</td>
                      <td className="px-3 py-2">eth0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                The <code className="bg-slate-100 px-1 rounded">0.0.0.0/0</code> entry is the <strong>default route</strong>—used
                when no other entry matches.
              </div>
            </div>

            <h3>Longest Prefix Match</h3>
            <p>
              If multiple routes match, the router picks the <strong>most specific one</strong>
              (longest prefix). For destination <code className="bg-slate-100 px-1 rounded">10.1.2.3</code>:
            </p>

            <div className="not-prose my-6 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-32">10.0.0.0/8</code>
                <span className="text-slate-500">matches (8 bits)</span>
              </div>
              <div className="flex items-center gap-3">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-32">10.1.0.0/16</code>
                <span className="text-slate-500">matches (16 bits)</span>
              </div>
              <div className="flex items-center gap-3">
                <code className="bg-emerald-100 px-2 py-1 rounded font-mono text-xs w-32">10.1.2.0/24</code>
                <span className="text-emerald-600 font-medium">wins! (24 bits - most specific)</span>
              </div>
            </div>
          </section>

          {/* ICMP */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>ICMP: Network Diagnostics</h2>
            <p>
              <strong>ICMP (Internet Control Message Protocol)</strong> is Layer 3&apos;s error
              reporting and diagnostic tool. It&apos;s what powers <code className="bg-slate-100 px-1 rounded">ping</code> and <code className="bg-slate-100 px-1 rounded">traceroute</code>.
            </p>

            <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-sm font-semibold text-slate-700 mb-1">Echo Request/Reply</div>
                <div className="text-xs text-slate-500">
                  <code className="bg-slate-100 px-1 rounded">ping</code> sends Echo Request (type 8),
                  target responds with Echo Reply (type 0)
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-sm font-semibold text-slate-700 mb-1">Time Exceeded</div>
                <div className="text-xs text-slate-500">
                  Sent when TTL hits 0. This is how <code className="bg-slate-100 px-1 rounded">traceroute</code> maps
                  the path to a destination.
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-sm font-semibold text-slate-700 mb-1">Destination Unreachable</div>
                <div className="text-xs text-slate-500">
                  Network unreachable, host unreachable, port unreachable, etc.
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-sm font-semibold text-slate-700 mb-1">Redirect</div>
                <div className="text-xs text-slate-500">
                  Router tells sender there&apos;s a better route available
                </div>
              </div>
            </div>

            <h3>How Traceroute Works</h3>
            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">1</span>
                  <span className="text-slate-700">
                    Send packet with <strong>TTL=1</strong>. First router decrements to 0,
                    drops it, sends back ICMP &quot;Time Exceeded&quot;
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">2</span>
                  <span className="text-slate-700">
                    Send packet with <strong>TTL=2</strong>. Second router sends Time Exceeded
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">3</span>
                  <span className="text-slate-700">
                    Repeat with increasing TTL until destination responds with Echo Reply
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 font-mono text-xs text-slate-600">
                <div>$ traceroute google.com</div>
                <div className="text-slate-400">1  192.168.1.1    1.2ms</div>
                <div className="text-slate-400">2  10.0.0.1       5.1ms</div>
                <div className="text-slate-400">3  72.14.215.85   12.3ms</div>
                <div className="text-slate-400">...</div>
              </div>
            </div>
          </section>

          {/* IPv6 */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>IPv6: The Future</h2>
            <p>
              IPv4&apos;s 4.3 billion addresses weren&apos;t enough. <strong>IPv6</strong> expands
              to 128 bits—enough for 340 undecillion addresses (3.4 × 10<sup>38</sup>).
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-500 mb-2">IPv6 Address</div>
              <div className="font-mono text-sm text-slate-800 break-all">
                2001:0db8:85a3:0000:0000:8a2e:0370:7334
              </div>
              <div className="text-xs text-slate-500 mt-2">
                8 groups of 4 hex digits, separated by colons
              </div>
            </div>

            <h3>IPv6 Shorthand</h3>
            <div className="not-prose my-6 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 w-20">Full:</span>
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs">2001:0db8:0000:0000:0000:0000:0000:0001</code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 w-20">Shortened:</span>
                <code className="bg-emerald-100 px-2 py-1 rounded font-mono text-xs">2001:db8::1</code>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Leading zeros can be dropped. A single <code className="bg-slate-100 px-1 rounded">::</code> can
              replace consecutive groups of zeros (but only once per address).
            </p>

            <h3>Key Differences from IPv4</h3>
            <div className="not-prose my-6 space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <span className="text-emerald-600">✓</span>
                <span className="text-slate-700"><strong>No NAT needed</strong> — Enough addresses for every device to have a public IP</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-emerald-600">✓</span>
                <span className="text-slate-700"><strong>No fragmentation by routers</strong> — Source must handle it (Path MTU Discovery)</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-emerald-600">✓</span>
                <span className="text-slate-700"><strong>No header checksum</strong> — Layer 4 handles error detection</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-emerald-600">✓</span>
                <span className="text-slate-700"><strong>Built-in IPsec support</strong> — Encryption at the network layer</span>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Layer 3 Summary</h2>
            <div className="not-prose my-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="space-y-2 text-sm text-emerald-800">
                <div><strong>IP addresses</strong> identify network locations (not hardware)</div>
                <div><strong>Subnets</strong> divide address space into manageable chunks</div>
                <div><strong>Routers</strong> forward packets between networks using routing tables</div>
                <div><strong>TTL</strong> prevents infinite loops; enables traceroute</div>
                <div><strong>NAT</strong> lets many devices share one public IP</div>
                <div><strong>ICMP</strong> provides error reporting and diagnostics</div>
                <div><strong>IPv6</strong> solves address exhaustion with 128-bit addresses</div>
              </div>
            </div>

            <div className="not-prose my-6 rounded-lg border-l-4 border-slate-400 bg-slate-50 p-4">
              <p className="text-slate-600 text-sm">
                <strong>Next up:</strong> Layer 4 (Transport) — TCP and UDP, ports, reliable delivery,
                and how applications multiplex over a single IP address.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <nav className="mt-16 pt-8 border-t border-slate-200">
            <Link
              href="/learning/networking"
              className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-slate-400 group-hover:text-blue-600 text-xl">&larr;</span>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">Previous</div>
                <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                  Layers 1 &amp; 2: Physical &amp; Data Link
                </div>
                <div className="text-sm text-slate-500">
                  Ethernet frames, MAC addresses, CSMA/CD, CRC
                </div>
              </div>
            </Link>
          </nav>
        </motion.div>
      </div>
    </article>
  )
}
