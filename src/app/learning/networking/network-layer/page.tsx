'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SubnetDemo } from '@/components/demos/SubnetDemo'
import { EncapsulationDemo } from '@/components/demos/EncapsulationDemo'
import { IPHeaderDemo } from '@/components/demos/IPHeaderDemo'
import { RoutingDemo } from '@/components/demos/RoutingDemo'
import { FragmentationDemo } from '@/components/demos/FragmentationDemo'
import { TracerouteDemo } from '@/components/demos/TracerouteDemo'
import { BinaryConverterDemo } from '@/components/demos/BinaryConverterDemo'
import { SubnetCalculatorDemo } from '@/components/demos/SubnetCalculatorDemo'
import { SameSubnetDemo } from '@/components/demos/SameSubnetDemo'
import { PacketJourneyDemo } from '@/components/demos/PacketJourneyDemo'

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
          {/* Learning Objectives */}
          <section className="not-prose mb-12">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                After reading this, you should be able to:
              </h2>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">1</span>
                  <span className="text-sm text-slate-700">
                    <strong>Convert between decimal and binary IP addresses</strong> — given 192.168.1.100,
                    write the 32-bit binary representation (and vice versa)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">2</span>
                  <span className="text-sm text-slate-700">
                    <strong>Calculate subnet boundaries</strong> — given 10.0.0.0/22, determine the network
                    address, broadcast address, and number of usable hosts
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">3</span>
                  <span className="text-sm text-slate-700">
                    <strong>Determine if two IPs are on the same subnet</strong> — apply the subnet mask
                    to check if packets route locally or need a gateway
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">4</span>
                  <span className="text-sm text-slate-700">
                    <strong>Perform longest prefix match</strong> — given a routing table and destination IP,
                    determine which route wins and why
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">5</span>
                  <span className="text-sm text-slate-700">
                    <strong>Calculate IP fragmentation</strong> — given a packet size and MTU, determine
                    the number of fragments, their offsets, and flag values
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">6</span>
                  <span className="text-sm text-slate-700">
                    <strong>Trace packet forwarding</strong> — walk through the ARP lookup, routing decision,
                    and TTL decrement at each hop
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Part 1: Addressing */}
          <div className="not-prose mb-8">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Part 1</div>
            <div className="text-2xl font-bold text-slate-900">Addressing</div>
          </div>

          {/* 1. IPv4 Addresses */}
          <section>
            <h2>IPv4 Addresses</h2>
            <p>
              While Layer 2 uses MAC addresses to identify hardware on a local segment,
              Layer 3 uses <strong>IP addresses</strong> to identify network locations.
              IP addresses can change when you move networks—they describe <em>where</em> you
              are, not <em>what</em> you are.
            </p>

            <h3>Structure</h3>
            <p>
              IPv4 addresses are 32 bits, written as four decimal octets separated by dots:
            </p>

            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex justify-center gap-1 mb-4">
                  {['192', '168', '1', '100'].map((octet, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-14 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {octet}
                      </div>
                      {i < 3 && <span className="mx-1 text-slate-400">.</span>}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-1 mb-3">
                  {['11000000', '10101000', '00000001', '01100100'].map((binary, i) => (
                    <div key={i} className="flex items-center">
                      <div className="px-2 py-1 rounded font-mono text-xs text-slate-600 bg-slate-100">
                        {binary}
                      </div>
                      {i < 3 && <span className="mx-1 text-slate-300">.</span>}
                    </div>
                  ))}
                </div>
                <div className="text-center text-xs text-slate-500">
                  4 octets × 8 bits = 32 bits total = ~4.3 billion addresses
                </div>
              </div>
            </div>

            <BinaryConverterDemo />

            <h3>Network and Host Portions</h3>
            <p>
              Every IP address has two parts: the <strong>network portion</strong> identifies
              which network you&apos;re on, and the <strong>host portion</strong> identifies
              which device on that network. The <strong>subnet mask</strong> tells you where
              the boundary is.
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
                  <span className="text-xs text-slate-400">(/24 = first 24 bits are network)</span>
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
          </section>

          {/* 2. CIDR Notation */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>CIDR Notation</h2>
            <p>
              Originally, IP addresses were divided into fixed &quot;classes&quot; (A, B, C) with
              predetermined sizes. This was wasteful—Class B gave 65,536 addresses even if
              you needed 500.
            </p>

            <p>
              <strong>CIDR (Classless Inter-Domain Routing)</strong> eliminated classes in 1993.
              Now you specify any prefix length using <strong>slash notation</strong>:
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <code className="bg-slate-100 px-2 py-1 rounded font-mono text-sm w-40">192.168.1.0/24</code>
                  <span className="text-sm text-slate-600">24 network bits → 256 addresses</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="bg-slate-100 px-2 py-1 rounded font-mono text-sm w-40">10.0.0.0/8</code>
                  <span className="text-sm text-slate-600">8 network bits → 16.7 million addresses</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="bg-slate-100 px-2 py-1 rounded font-mono text-sm w-40">172.16.0.0/22</code>
                  <span className="text-sm text-slate-600">22 network bits → 1,024 addresses</span>
                </div>
              </div>
            </div>

            <div className="not-prose my-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4">
              <div className="text-sm text-emerald-800">
                <strong>Key insight:</strong> The number after the slash is how many bits
                are &quot;locked&quot; for the network portion. The remaining bits are for hosts.
                A /24 has 8 host bits = 2<sup>8</sup> = 256 addresses.
              </div>
            </div>
          </section>

          {/* 3. Subnetting */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Subnetting</h2>
            <p>
              <strong>Subnetting</strong> is dividing a network into smaller pieces by borrowing
              bits from the host portion. Why do this?
            </p>

            <div className="not-prose my-6 space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <span className="text-emerald-600 shrink-0">✓</span>
                <span className="text-slate-700"><strong>Efficient address use</strong> — Allocate exactly what&apos;s needed</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-emerald-600 shrink-0">✓</span>
                <span className="text-slate-700"><strong>Security boundaries</strong> — Isolate departments or zones</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-emerald-600 shrink-0">✓</span>
                <span className="text-slate-700"><strong>Reduced broadcast traffic</strong> — Broadcasts stay within the subnet</span>
              </div>
            </div>

            <h3>Subnet Math</h3>
            <p>
              For any CIDR block, you need to find: the <strong>network address</strong> (first),
              the <strong>broadcast address</strong> (last), and the <strong>usable range</strong>
              (everything in between).
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">Example: 10.0.0.0/22</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500">Host bits:</span>
                  <span className="font-mono">32 - 22 = 10 bits</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500">Total addresses:</span>
                  <span className="font-mono">2<sup>10</sup> = 1,024</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500">Usable hosts:</span>
                  <span className="font-mono">1,024 - 2 = 1,022</span>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2 flex items-center gap-4">
                  <span className="w-32 text-slate-500">Network:</span>
                  <span className="font-mono text-blue-700">10.0.0.0</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500">First usable:</span>
                  <span className="font-mono text-emerald-700">10.0.0.1</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500">Last usable:</span>
                  <span className="font-mono text-emerald-700">10.0.3.254</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500">Broadcast:</span>
                  <span className="font-mono text-amber-700">10.0.3.255</span>
                </div>
              </div>
            </div>

            <SubnetDemo />

            <SubnetCalculatorDemo />
          </section>

          {/* 4. Private Addresses & NAT */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Private Address Space</h2>
            <p>
              Certain IP ranges are reserved for <strong>private use</strong>. These addresses
              are <em>non-routable</em> on the public internet—routers will drop them.
              Every home and office reuses these same ranges internally.
            </p>

            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Range</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">CIDR</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Addresses</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Typical Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">10.0.0.0 – 10.255.255.255</td>
                      <td className="px-4 py-2 font-mono text-xs">/8</td>
                      <td className="px-4 py-2 text-slate-600">16.7M</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Large enterprise, cloud</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">172.16.0.0 – 172.31.255.255</td>
                      <td className="px-4 py-2 font-mono text-xs">/12</td>
                      <td className="px-4 py-2 text-slate-600">1M</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Medium networks</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">192.168.0.0 – 192.168.255.255</td>
                      <td className="px-4 py-2 font-mono text-xs">/16</td>
                      <td className="px-4 py-2 text-slate-600">65K</td>
                      <td className="px-4 py-2 text-xs text-slate-500">Home routers, small office</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3>NAT: Network Address Translation</h3>
            <p>
              Since private addresses can&apos;t reach the internet directly, your router uses
              <strong> NAT</strong> to rewrite packet headers. All your devices share the
              router&apos;s single public IP address.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">NAT in Action</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500">Outbound:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">192.168.1.100:54321</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500">NAT rewrites to</span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">203.0.113.50:12345</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500">Inbound:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">203.0.113.50:12345</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500">NAT rewrites to</span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">192.168.1.100:54321</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                The router maintains a translation table mapping internal (IP:port) to external (IP:port).
              </div>
            </div>

            <h3>Other Reserved Ranges</h3>
            <div className="not-prose my-6 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-36">127.0.0.0/8</code>
                <span className="text-slate-600">Loopback (localhost)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-36">169.254.0.0/16</code>
                <span className="text-slate-600">Link-local (APIPA—when DHCP fails)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <code className="bg-slate-100 px-2 py-1 rounded font-mono text-xs w-36">224.0.0.0/4</code>
                <span className="text-slate-600">Multicast</span>
              </div>
            </div>
          </section>

          {/* Part 2: The IP Datagram */}
          <div className="not-prose mt-20 mb-8">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Part 2</div>
            <div className="text-2xl font-bold text-slate-900">The IP Datagram</div>
          </div>

          {/* 5. IP Header Structure */}
          <section>
            <h2>IP Header Structure</h2>
            <p>
              IP wraps your data in a <strong>datagram</strong>. The header contains everything
              routers need to forward the packet: source and destination addresses, length,
              protocol type, and more.
            </p>

            <IPHeaderDemo />

            <p>
              Key fields to understand:
            </p>

            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700 font-semibold shrink-0 w-20 text-center">TTL</span>
                <span className="text-slate-700">
                  Hop counter. Decremented by each router. When it hits 0, the packet is dropped
                  to prevent infinite loops.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700 font-semibold shrink-0 w-20 text-center">Protocol</span>
                <span className="text-slate-700">
                  What&apos;s inside the payload: TCP (6), UDP (17), ICMP (1), etc.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-700 font-semibold shrink-0 w-20 text-center">ID/Flags</span>
                <span className="text-slate-700">
                  Fragmentation control. Identification links fragments; flags indicate if more follow.
                </span>
              </div>
            </div>
          </section>

          {/* 6. Encapsulation */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Encapsulation</h2>
            <p>
              Each network layer wraps the data from the layer above. Your HTTP request becomes
              the payload of a TCP segment, which becomes the payload of an IP datagram, which
              becomes the payload of an Ethernet frame.
            </p>

            <EncapsulationDemo />

            <p>
              The IP datagram travels <em>inside</em> the Ethernet frame. When a packet crosses
              networks, the Ethernet header changes at each hop (new source/destination MACs),
              but the IP header stays the same (except TTL decrement and checksum update).
            </p>
          </section>

          {/* 7. Fragmentation */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Fragmentation</h2>
            <p>
              Different links have different <strong>MTU (Maximum Transmission Unit)</strong> values.
              Ethernet is typically 1500 bytes. If a packet is too large, it must be <strong>fragmented</strong>
              into smaller pieces.
            </p>

            <FragmentationDemo />

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">Fragmentation Fields</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500 font-mono">Identification</span>
                  <span className="text-slate-700">Same ID links all fragments of the original datagram</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500 font-mono">Fragment Offset</span>
                  <span className="text-slate-700">Position of this fragment (in 8-byte units)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500 font-mono">MF (More Fragments)</span>
                  <span className="text-slate-700">1 = more fragments follow, 0 = this is the last</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-slate-500 font-mono">DF (Don&apos;t Fragment)</span>
                  <span className="text-slate-700">If set, router drops packet instead of fragmenting</span>
                </div>
              </div>
            </div>

            <div className="not-prose my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
              <div className="text-sm text-amber-800">
                <strong>Modern practice:</strong> Fragmentation is avoided. <strong>Path MTU Discovery</strong>
                uses the DF flag to probe the path—if a packet is too big, the router sends back an ICMP
                &quot;Fragmentation Needed&quot; message. The sender then reduces packet size. IPv6 doesn&apos;t allow
                routers to fragment at all.
              </div>
            </div>
          </section>

          {/* Part 3: Forwarding */}
          <div className="not-prose mt-20 mb-8">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Part 3</div>
            <div className="text-2xl font-bold text-slate-900">Forwarding Packets</div>
          </div>

          {/* 8. Basic Routing */}
          <section>
            <h2>How Routing Works</h2>
            <p>
              A <strong>router</strong> connects different networks. When a packet arrives, the router
              must decide: <em>where do I send this next?</em>
            </p>

            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">1</span>
                <span className="text-slate-700">
                  Receive packet, read the <strong>destination IP</strong> from the header
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">2</span>
                <span className="text-slate-700">
                  Look up destination in the <strong>routing table</strong>
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">3</span>
                <span className="text-slate-700">
                  Use <strong>ARP</strong> to get the next hop&apos;s MAC address (if needed)
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">4</span>
                <span className="text-slate-700">
                  <strong>Decrement TTL</strong>—if it hits 0, drop the packet and send ICMP error
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">5</span>
                <span className="text-slate-700">
                  Build new Ethernet frame and <strong>forward</strong> out the appropriate interface
                </span>
              </div>
            </div>

            <h3>Local vs. Remote: When Do I Need the Gateway?</h3>
            <p>
              Before sending, a host must determine: is the destination <strong>on my subnet</strong>
              (send directly) or <strong>remote</strong> (send to gateway)?
            </p>

            <SameSubnetDemo />
          </section>

          {/* 9. ARP */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>ARP: Address Resolution Protocol</h2>
            <p>
              IP addresses exist at Layer 3, but Ethernet frames use MAC addresses at Layer 2.
              <strong> ARP bridges this gap</strong>—it resolves an IP address to a MAC address
              on the local network.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">How ARP Works</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">1</span>
                  <span className="text-slate-700">
                    Router needs to forward packet to <code className="bg-white px-1 rounded">192.168.1.50</code>,
                    but only knows the IP
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">2</span>
                  <span className="text-slate-700">
                    Broadcasts ARP request: <em>&quot;Who has 192.168.1.50? Tell me your MAC.&quot;</em>
                    (sent to <code className="bg-white px-1 rounded">FF:FF:FF:FF:FF:FF</code>)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">3</span>
                  <span className="text-slate-700">
                    Target replies: <em>&quot;That&apos;s me! My MAC is AC:DE:48:12:34:56&quot;</em>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">4</span>
                  <span className="text-slate-700">
                    Router caches the mapping in its <strong>ARP table</strong> for future use
                  </span>
                </div>
              </div>
            </div>

            <div className="not-prose my-6">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-800 text-slate-100 p-3 font-mono text-xs">
                  <div className="text-slate-400">$ arp -a</div>
                  <div className="mt-2 space-y-1">
                    <div>192.168.1.1    at AC:DE:48:00:11:22 on en0</div>
                    <div>192.168.1.50   at AC:DE:48:12:34:56 on en0</div>
                    <div>192.168.1.100  at 00:50:56:C0:00:08 on en0</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="not-prose my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
              <div className="text-sm text-amber-800">
                <strong>Security note:</strong> ARP has no authentication. Anyone can claim to own
                any IP address, enabling <em>ARP spoofing</em> attacks where an attacker redirects
                traffic through their machine.
              </div>
            </div>

            <h3>Putting It All Together: A Packet&apos;s Journey</h3>
            <p>
              Now let&apos;s trace a packet from your computer to Google&apos;s server, seeing how
              the subnet check, ARP, MAC addresses, and TTL all work together at each hop.
            </p>

            <PacketJourneyDemo />
          </section>

          {/* 10. Routing Tables */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Routing Tables</h2>
            <p>
              Every router maintains a <strong>routing table</strong>—a list of network destinations
              and where to forward packets for each. When multiple routes match, the router uses
              <strong> longest prefix match</strong>: the most specific route wins.
            </p>

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
                <code className="bg-slate-100 px-1 rounded">0.0.0.0/0</code> is the <strong>default route</strong>—it
                matches everything but loses to any more specific match.
              </div>
            </div>

            <h3>Longest Prefix Match</h3>
            <p>
              If destination is <code className="bg-slate-100 px-1 rounded">10.1.2.3</code>:
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
                <span className="text-emerald-600 font-medium">wins (24 bits—most specific)</span>
              </div>
            </div>

            <RoutingDemo />
          </section>

          {/* Part 4: Routing Protocols */}
          <div className="not-prose mt-20 mb-8">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Part 4</div>
            <div className="text-2xl font-bold text-slate-900">How Routers Learn Routes</div>
          </div>

          {/* 11. Autonomous Systems */}
          <section>
            <h2>Autonomous Systems</h2>
            <p>
              An <strong>Autonomous System (AS)</strong> is a collection of IP networks under a
              single organization&apos;s control. Each AS has a unique <strong>ASN (Autonomous System
              Number)</strong> and its own routing policy.
            </p>

            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">Example ASNs</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">AS15169</span>
                  <span className="text-slate-600">Google</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">AS32934</span>
                  <span className="text-slate-600">Facebook</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">AS16509</span>
                  <span className="text-slate-600">Amazon AWS</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">AS7922</span>
                  <span className="text-slate-600">Comcast</span>
                </div>
              </div>
            </div>

            <p>
              This organizational structure determines which routing protocols are used:
            </p>

            <div className="not-prose my-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="text-sm font-semibold text-blue-800">IGP</div>
                <div className="text-xs text-blue-600 mt-1">
                  Interior Gateway Protocol
                </div>
                <div className="text-xs text-blue-500 mt-2">
                  Routing <em>within</em> an AS
                </div>
              </div>
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                <div className="text-sm font-semibold text-purple-800">EGP</div>
                <div className="text-xs text-purple-600 mt-1">
                  Exterior Gateway Protocol
                </div>
                <div className="text-xs text-purple-500 mt-2">
                  Routing <em>between</em> ASes
                </div>
              </div>
            </div>
          </section>

          {/* 12. Interior Gateway Protocols */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Interior Gateway Protocols (IGP)</h2>
            <p>
              IGPs handle routing <strong>within</strong> an organization. Routers share information
              with each other to keep their routing tables up-to-date.
            </p>

            <h3>Distance Vector: RIP</h3>
            <div className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">RIP (Routing Information Protocol)</div>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• Routers share their <strong>entire routing table</strong> with neighbors</div>
                <div>• Uses <strong>hop count</strong> as metric (max 15 hops)</div>
                <div>• Updates sent every 30 seconds</div>
                <div>• Simple but slow to converge, limited scale</div>
              </div>
            </div>

            <h3>Link State: OSPF</h3>
            <div className="not-prose my-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm font-semibold text-emerald-800 mb-2">OSPF (Open Shortest Path First)</div>
              <div className="space-y-2 text-sm text-emerald-700">
                <div>• Routers share <strong>link state</strong> info (their connections)</div>
                <div>• Each router builds a <strong>complete map</strong> of the network</div>
                <div>• Uses <strong>Dijkstra&apos;s algorithm</strong> to compute shortest paths</div>
                <div>• Fast convergence, scales to large networks</div>
                <div>• Most common IGP in enterprise networks</div>
              </div>
            </div>
          </section>

          {/* 13. Exterior Gateway Protocols */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Exterior Gateway Protocols (EGP)</h2>
            <p>
              EGPs handle routing <strong>between</strong> different organizations—between
              Autonomous Systems. This is how the global internet works.
            </p>

            <h3>BGP: The Protocol of the Internet</h3>
            <div className="not-prose my-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="text-sm font-semibold text-purple-800 mb-2">BGP (Border Gateway Protocol)</div>
              <div className="space-y-2 text-sm text-purple-700">
                <div>• The <strong>only EGP</strong> used on the internet today</div>
                <div>• Routes between <strong>Autonomous Systems</strong></div>
                <div>• Uses <strong>path vector</strong>—announces full AS path to destinations</div>
                <div>• Routing decisions based on <strong>policy</strong>, not just shortest path</div>
                <div>• ~900,000+ routes in the global BGP table</div>
              </div>
            </div>

            <h3>AS Relationships</h3>
            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700 font-semibold shrink-0">Transit</span>
                <span className="text-slate-700">
                  Provider carries traffic for customer. Customer pays provider.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-700 font-semibold shrink-0">Peering</span>
                <span className="text-slate-700">
                  Two ASes exchange traffic directly, typically settlement-free.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700 font-semibold shrink-0">IXP</span>
                <span className="text-slate-700">
                  Internet Exchange Point—physical location where ASes meet to peer.
                </span>
              </div>
            </div>
          </section>

          {/* 14. TTL and Traceroute */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>TTL, ICMP, and Traceroute</h2>
            <p>
              <strong>ICMP (Internet Control Message Protocol)</strong> is used for network
              diagnostics and error reporting. It powers <code className="bg-slate-100 px-1 rounded">ping</code>
              and <code className="bg-slate-100 px-1 rounded">traceroute</code>.
            </p>

            <h3>How Traceroute Works</h3>
            <p>
              Traceroute cleverly uses the <strong>TTL field</strong> to discover the path
              packets take:
            </p>

            <div className="not-prose my-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">1</span>
                <span className="text-slate-700">
                  Send packet with <strong>TTL=1</strong>. First router decrements to 0, drops it,
                  sends back ICMP &quot;Time Exceeded&quot;—revealing its IP.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">2</span>
                <span className="text-slate-700">
                  Send packet with <strong>TTL=2</strong>. Second router sends ICMP—revealing its IP.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="rounded-full bg-slate-200 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">3</span>
                <span className="text-slate-700">
                  Continue until destination replies with ICMP &quot;Echo Reply&quot; or port unreachable.
                </span>
              </div>
            </div>

            <TracerouteDemo />
          </section>

          {/* Summary */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <h2>Summary</h2>
            <div className="not-prose my-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="space-y-2 text-sm text-emerald-800">
                <div><strong>IP addresses</strong> identify network locations (network + host portions)</div>
                <div><strong>CIDR</strong> enables flexible address allocation with slash notation</div>
                <div><strong>Subnetting</strong> divides networks; private addresses use NAT</div>
                <div><strong>IP datagrams</strong> carry data with headers containing TTL, protocol, addresses</div>
                <div><strong>Routers</strong> use routing tables with longest prefix match</div>
                <div><strong>ARP</strong> resolves IP to MAC for the next hop</div>
                <div><strong>IGPs</strong> (OSPF, RIP) handle routing within an AS</div>
                <div><strong>BGP</strong> handles routing between ASes across the internet</div>
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
          <nav className="mt-16 pt-8 border-t border-slate-200 space-y-3">
            <Link
              href="/learning/networking/transport-application"
              className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div>
                <div className="text-xs text-slate-500 mb-1">Next</div>
                <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                  Layers 4 &amp; 7: Transport &amp; Application
                </div>
                <div className="text-sm text-slate-500">
                  TCP, UDP, ports, sockets, HTTP, DNS
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-blue-600 text-xl">&rarr;</span>
            </Link>
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
