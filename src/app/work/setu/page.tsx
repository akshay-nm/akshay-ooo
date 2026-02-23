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
            Construction project management platform
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
            <p className="text-slate-900">RCPSP Planning, Progress Analytics, Inventory Tracking, E2EE Messaging, Review Workflows, Audit Trail, Data Modeling</p>
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
            <li>Designed core data model mapping construction hierarchy — projects, structures, and activities — enabling granular tracking at every level</li>
            <li>Built RCPSP-based project planning with Critical Path Method (CPM) scheduling to handle resource constraints and activity dependencies across concurrent structures</li>
            <li>Built progress analytics dashboard backed by daily progress updates, enabling real-time visibility into project timelines, delays, and completion rates</li>
            <li>Implemented inventory change tracking across project sites, capturing material movement and consumption tied to specific activities</li>
            <li>Designed multi-step review workflows where each progress or inventory update goes through configurable approval stages with correction and rejection support at every step</li>
            <li>Built in-app messaging with file attachments and end-to-end encryption using Diffie-Hellman key exchange, keeping project communication secure and contextual</li>
            <li>Implemented comprehensive audit trail — every action that updates a read model is tracked, ensuring full visibility into who did what and when</li>
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
