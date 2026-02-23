'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const caseStudies = [
  {
    slug: 'setu',
    title: 'Setu',
    description: 'Construction project management platform',
    role: 'Founder',
    timeline: '2025 - Present',
    highlights: ['RCPSP Planning', 'E2EE Messaging', 'Review Workflows'],
  },
  {
    slug: 'entendre',
    title: 'Entendre Finance',
    description: 'Double-entry crypto accounting with AI-assisted workflows',
    role: 'Full-Stack Engineer',
    timeline: '2023 - 2025',
    highlights: ['Rules Engine UI', 'Background Jobs', 'Stripe Billing'],
  },
  {
    slug: 'poplink',
    title: 'Poplink Ads',
    description: 'Contextual ad overlays for blogs without third-party cookies',
    role: 'Founding Engineer',
    timeline: '2022',
    highlights: ['Content Analysis', 'Contextual Targeting', 'Privacy-first'],
  },
]

export default function Work() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Work</h1>
          <p className="text-xl text-slate-600 max-w-2xl mb-16">
            A selection of projects I&apos;ve worked on, from crypto accounting platforms to contextual advertising systems.
          </p>
        </motion.div>

        <div className="space-y-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/work/${study.slug}`}
                className="block p-8 border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-slate-500">{study.timeline}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-sm text-slate-500">{study.role}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors mb-3">
                      {study.title}
                    </h2>
                    <p className="text-slate-600 mb-4">{study.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {study.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-orange-500 font-medium shrink-0 group-hover:translate-x-1 transition-transform">
                    Read case study &rarr;
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
