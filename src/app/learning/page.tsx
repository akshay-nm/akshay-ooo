'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const topics = [
  {
    slug: 'networking',
    title: 'Networking',
    description: 'TCP/IP, DNS, HTTP, and how the internet works',
    status: 'in-progress' as const,
    articles: 0,
  },
]

export default function LearningPage() {
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
            Learning
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Concepts I&apos;m exploring, explained through illustrations and examples.
            Learning in public helps me understand things deeply.
          </p>
        </motion.header>

        {/* Topics */}
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/learning/${topic.slug}`}
                className="block p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
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
                  <div className="text-sm text-slate-400 shrink-0">
                    {topic.articles === 0 ? 'Coming soon' : `${topic.articles} articles`}
                  </div>
                </div>
              </Link>
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
