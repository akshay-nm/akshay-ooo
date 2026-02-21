'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">About</h1>

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Full-stack engineer specializing in <strong>accounting systems</strong> and{' '}
              <strong>financial infrastructure</strong>. Based in Delhi, India.
            </p>

            <h2>What I Build</h2>
            <p>
              Billing systems, financial reporting, background job infrastructure, and rule-driven
              workflows. I work primarily with TypeScript, Node.js, React/Next.js, and MongoDB—systems
              where correctness and reliability are non-negotiable.
            </p>

            <h2>How I Work</h2>
            <p>
              I use <strong>Claude Code</strong> for implementation, following <strong>TDD</strong> and{' '}
              <strong>Domain-Driven Design</strong> with hexagonal architecture. Most of my effort goes
              into design discussions—defining boundaries, clarifying constraints, shaping the domain
              model. The bottleneck is no longer writing code; it&apos;s context window management.
              This approach has compressed delivery from months to hours.
            </p>

            <h2>Background</h2>
            <p>
              B.Tech in Computer Science from AKTU (2013-2017). Since then, I&apos;ve progressed from
              building web applications to owning entire systems—billing, background infrastructure,
              and reporting at scale.
            </p>

            <h2>Current</h2>
            <p>
              Building <strong>Setu</strong>—a construction accounting platform for government
              contractors. Previously at <strong>Entendre Finance</strong>, where I joined pre-launch
              and grew from implementing specs to owning billing, background jobs, and financial
              reporting over two years.
            </p>

            <h2>Get in Touch</h2>
            <p>
              Looking for fintech teams building accounting, billing, or financial infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 mt-8 not-prose">
              <a
                href="mailto:akshay.nm92@gmail.com"
                className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Email me
              </a>
              <a
                href="https://github.com/akshay-nm"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:border-slate-400 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/akshay-nm"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:border-slate-400 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
