'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { WorkflowDemo } from '@/components/demos/WorkflowDemo'

const skills = [
  { category: 'Domain', items: ['Accounting Systems', 'Billing & Payments', 'Financial Reporting', 'Compliance & Audit'] },
  { category: 'Stack', items: ['TypeScript', 'Node.js', 'React', 'Next.js', 'MongoDB'] },
  { category: 'Systems', items: ['Background Jobs', 'Data Pipelines', 'Rules Engines', 'Third-party Integrations'] },
]

const caseStudies = [
  {
    slug: 'setu',
    title: 'Setu',
    description: 'Construction accounting platform for government contractors',
    role: 'Founder',
    timeline: '2025 - Present',
  },
  {
    slug: 'entendre',
    title: 'Entendre Finance',
    description: 'Double-entry crypto accounting with AI-assisted workflows',
    role: 'Full-Stack Engineer',
    timeline: '2023 - 2025',
  },
  {
    slug: 'poplink',
    title: 'Poplink Ads',
    description: 'Contextual ad overlays for blogs without third-party cookies',
    role: 'Founding Engineer',
    timeline: '2022',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-orange-500 font-medium mb-4">Hi, I&apos;m</p>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              Akshay Kumar
            </h1>
            <p className="text-2xl md:text-3xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
              Full-stack engineer specializing in <strong className="text-slate-900">accounting systems</strong> and <strong className="text-slate-900">financial infrastructure</strong>. Billing, reporting, and data pipelines.
            </p>
            <div className="flex gap-4">
              <Link
                href="/work"
                className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                View my work
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:border-slate-400 transition-colors"
              >
                About me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How I Work Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">How I Work</h2>
            <div className="prose prose-slate prose-lg max-w-none">
              <p className="text-slate-600 leading-relaxed">
                I use <strong className="text-slate-900">Claude Code</strong> for implementation,
                following <strong className="text-slate-900">TDD</strong> and
                <strong className="text-slate-900"> Domain-Driven Design</strong> with hexagonal
                architecture. Most of my effort goes into <strong className="text-slate-900">design
                discussions</strong> rather than writing code—defining boundaries, clarifying
                constraints, and shaping the domain model.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The bottleneck is no longer implementation; it&apos;s <strong className="text-slate-900">context
                window management</strong>. AI can write accurate code when given precise design
                constraints. My job is ensuring those constraints are clear. This approach has
                compressed delivery from <strong className="text-slate-900">months to hours</strong>.
              </p>
            </div>
            <WorkflowDemo />
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-slate-900 mb-12"
          >
            What I work with
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-sm font-medium text-orange-500 uppercase tracking-wide mb-4">
                  {skill.category}
                </h3>
                <ul className="space-y-2">
                  {skill.items.map((item) => (
                    <li key={item} className="text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900">Featured Work</h2>
            <Link href="/work" className="text-orange-500 font-medium hover:text-orange-600">
              View all &rarr;
            </Link>
          </motion.div>
          <div className="space-y-6">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/work/${study.slug}`}
                  className="block p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-slate-600 mt-1">{study.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 shrink-0">
                      <span>{study.role}</span>
                      <span className="text-slate-300">|</span>
                      <span>{study.timeline}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Let&apos;s work together</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Looking for <strong className="text-slate-200">fintech teams</strong> building accounting, billing, or financial infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:akshay.nm92@gmail.com"
                className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Get in touch
              </a>
              <a
                href="https://buymeacoffee.com/akshaynm92"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 border border-slate-600 text-slate-300 font-medium rounded-lg hover:border-slate-400 hover:text-white transition-colors"
              >
                Buy me a coffee
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
