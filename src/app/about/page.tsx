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
              I&apos;m a full-stack engineer based in Delhi, India with 8+ years of experience
              building production-grade web applications.
            </p>

            <h2>What I Do</h2>
            <p>
              I specialize in building accounting systems, background job infrastructure, and
              rule-driven workflows. My work typically involves TypeScript, Node.js, React/Next.js,
              and MongoDB, with a focus on systems where correctness, clarity, and reliability matter.
            </p>

            <h2>Background</h2>
            <p>
              I have a B.Tech in Computer Science from AKTU (2013-2017). Since then, I&apos;ve worked
              across the stack - from building small web applications and admin panels to leading
              development on crypto accounting platforms and construction management systems.
            </p>

            <h2>Current Focus</h2>
            <p>
              I founded Ninana Technologies in 2019, and we&apos;re currently building Setu - a construction
              accounting platform for government contractors. Previously, I was at Entendre Finance
              working on crypto accounting infrastructure.
            </p>

            <h2>Beyond Code</h2>
            <p>
              When I&apos;m not coding, I enjoy exploring new technologies, contributing to open source,
              and occasionally writing about software engineering topics.
            </p>

            <h2>Get in Touch</h2>
            <p>
              I&apos;m currently available for freelance work and full-time opportunities.
              Feel free to reach out.
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
