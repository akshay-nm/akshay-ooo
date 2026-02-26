export type Note = {
  title: string
  description: string
  topic: string
  href: string
}

export const notes: Note[] = [
  {
    title: 'OSI Model — 7 Layers of Abstraction',
    description: 'How each network layer builds on the previous one',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'Ethernet Frame Structure',
    description: 'Preamble, SFD, MAC addresses, EtherType, payload, and FCS',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'Unicast, Broadcast, Multicast',
    description: 'Three addressing modes — one-to-one, one-to-all, one-to-many',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'Collision Domains — Hub vs Switch',
    description: 'How hubs and switches affect collision domains differently',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'CSMA/CD Protocol',
    description: 'Listen, transmit, detect, backoff — shared media access control',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'Why 64-Byte Minimum Frame Size',
    description: 'Round-trip propagation delay and collision detection timing',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'Why the Preamble Exists',
    description: 'Clock synchronization and Phase-Locked Loop (PLL) operation',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'Error Detection with CRC',
    description: 'Cyclic Redundancy Check — polynomial division and XOR',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'MAC Addresses',
    description: '48-bit identifiers — OUI, I/G bit, U/L bit, special addresses',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'ARP — Address Resolution Protocol',
    description: 'Mapping IP addresses to MAC addresses via broadcasting',
    topic: 'Networking',
    href: '/notes/networking',
  },
  {
    title: 'What Layer 3 Does',
    description: 'Local delivery vs global routing — switches vs routers',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'IP Addresses',
    description: 'Logical network identifiers — MAC is fingerprint, IP is mailing address',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'Network vs Host — Subnet Masks',
    description: 'How subnet masks split IP addresses into network and host portions',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'CIDR Notation',
    description: 'Shorthand for subnet masks — /24, /8, /12 and address counts',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'Private vs Public Addresses',
    description: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 and address exhaustion',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'NAT — Network Address Translation',
    description: 'How routers rewrite packet headers to share a public IP',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'IPv4 Packet Structure',
    description: 'Header fields — version, IHL, TTL, protocol, checksum, addresses',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'TTL, Protocol Field, Fragmentation',
    description: 'Loop prevention, payload identification, and packet reassembly',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'How Routing Works',
    description: 'Read destination, longest prefix match, forward, decrement TTL',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'Longest Prefix Match',
    description: 'How routers choose the most specific route from the routing table',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'ICMP — Diagnostics & Errors',
    description: 'Echo, Time Exceeded, Destination Unreachable, Redirect',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'How Traceroute Works',
    description: 'Increasing TTL to map network hops via Time Exceeded messages',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
  {
    title: 'IPv6 — 128-bit Addressing',
    description: 'No NAT, no fragmentation, no checksum, built-in IPsec',
    topic: 'Networking',
    href: '/notes/networking/network-layer',
  },
]

export const topics = [...new Set(notes.map((n) => n.topic))]
