'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SetuCase() {
  return (
    <article className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <Link href="/work" className="text-slate-500 hover:text-slate-700 transition-colors">
            &larr; Back to work
          </Link>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-orange-500 font-medium mb-4">2025 - Present</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Setu
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed">
            Construction project management platform for government contractors
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-8 p-6 bg-slate-50 rounded-xl mb-16"
        >
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Role</h3>
            <p className="text-slate-900 font-medium">Founder</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Stack</h3>
            <p className="text-slate-900">React, Node.js, MongoDB, AWS</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Focus</h3>
            <p className="text-slate-900">RCPSP Planning, Progress Analytics, E2EE Messaging, Review Workflows, Data Modeling</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-slate prose-lg max-w-none"
        >
          <p className="text-xl text-slate-500 italic">
            Full case study coming soon. Currently in active development.
          </p>

          <h2>Overview</h2>
          <p>
            Started as a site-level documentation digitisation tool for Military Engineering Services (MES)
            and evolved into a full construction project management platform covering planning, progress
            tracking, inventory management, billing, and team communication.
          </p>

          <h2>Key Contributions</h2>
          <ul>
            <li>Designed core data model (projects → structures → activities)</li>
            <li>Built RCPSP-based project planning with Critical Path Method (CPM) scheduling</li>
            <li>Built progress analytics backed by daily progress updates for real-time project tracking</li>
            <li>Implemented inventory change tracking across project sites</li>
            <li>Designed multi-step review workflows for each update with correction support</li>
            <li>Built in-app messaging with attachment support and end-to-end encryption (Diffie-Hellman key exchange)</li>
            <li>Built backend primitives for transaction types, audit logs, and rule-based posting</li>
            <li>Deployed in one MES division with pilot rollout for additional divisions in progress</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20 pt-10 border-t border-slate-200"
        >
          <div className="flex justify-between items-center">
            <div></div>
            <Link
              href="/work/entendre"
              className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              Next: Entendre Finance &rarr;
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
