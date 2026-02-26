'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const topics = [
  {
    slug: 'networking',
    title: 'Networking',
    description: 'TCP/IP, DNS, HTTP, and how the internet works',
    status: 'in-progress' as const,
    articles: [
      {
        slug: 'networking',
        title: 'Layers 1 & 2: Physical & Data Link',
        description: 'Ethernet frames, MAC addresses, CSMA/CD, CRC',
        layer: '1-2',
      },
      {
        slug: 'networking/network-layer',
        title: 'Layer 3: Network Layer',
        description: 'IP addresses, routing, ICMP, IPv6',
        layer: '3',
      },
    ],
  },
]

export default function NotesPage() {
  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Notes
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Concepts I&apos;m exploring, explained through illustrations and examples.
            You only truly understand something if you can teach it.
          </p>
        </motion.header>

        {/* Topics */}
        <div className="space-y-8">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {/* Topic header */}
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {topic.title}
                    </h2>
                    {topic.status === 'in-progress' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{topic.description}</p>
                </div>

                {/* Articles list */}
                <div className="divide-y divide-slate-100">
                  {topic.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/notes/${article.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors shrink-0">
                        L{article.layer}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">
                          {article.title}
                        </div>
                        <div className="text-sm text-slate-500 truncate">
                          {article.description}
                        </div>
                      </div>
                      <span className="text-slate-300 group-hover:text-orange-400 transition-colors">
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-slate-50 rounded-xl text-center"
        >
          <p className="text-slate-500">
            More topics coming as I work through courses and build projects.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
