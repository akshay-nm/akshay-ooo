'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProjectHierarchyDemo } from '@/components/demos/ProjectHierarchyDemo'
import { RCPSPPlanningDemo } from '@/components/demos/RCPSPPlanningDemo'
import { ProgressAnalyticsDemo } from '@/components/demos/ProgressAnalyticsDemo'
import { InventoryTrackingDemo } from '@/components/demos/InventoryTrackingDemo'
import { ReviewWorkflowDemo } from '@/components/demos/ReviewWorkflowDemo'
import { E2EMessagingDemo } from '@/components/demos/E2EMessagingDemo'
import { AuditTrailDemo } from '@/components/demos/AuditTrailDemo'
import { MessagingDemo } from '@/components/demos/MessagingDemo'
import { AICopilotDemo } from '@/components/demos/AICopilotDemo'

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
            <p className="text-slate-900">RCPSP Planning, Progress Analytics, Inventory Tracking, Messaging, AI Copilot, E2EE Communication, Review Workflows, Audit Trail, Data Modeling</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-slate prose-lg max-w-none"
        >
          <h2>Overview</h2>
          <p>
            Started as a site-level documentation digitisation tool for Military Engineering Services (MES)
            and evolved into a full construction project management platform covering planning, progress
            tracking, inventory management, billing, and team communication.
          </p>

          {/* Core Features */}
          <div className="not-prose border-t border-slate-200 mt-12 pt-8 mb-6">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Core Features</span>
          </div>

          <h3>Construction Hierarchy</h3>
          <p>
            Every construction project breaks down into <strong>structures</strong> (pillars, spans, blocks)
            and further into <strong>activities</strong> (foundation pour, rebar installation, curing).
            This three-level hierarchy is the backbone of the platform — progress, inventory, scheduling,
            and reviews all operate at the activity level, while rollups give project-wide visibility.
          </p>

          <ProjectHierarchyDemo />

          <h3>RCPSP-Based Planning</h3>
          <p>
            Construction projects have <strong>resource constraints</strong> — a single crane can&apos;t be
            at two structures simultaneously. Activities have <strong>dependencies</strong> — you can&apos;t
            pour a deck before the pillars are up. The planner uses Resource-Constrained Project Scheduling
            (RCPSP) with <strong>Critical Path Method (CPM)</strong> to produce a feasible schedule that
            respects both constraints, and highlights the critical path — the sequence of activities where
            any delay delays the entire project.
          </p>

          <RCPSPPlanningDemo />

          <h3>Progress Analytics</h3>
          <p>
            Site engineers submit <strong>daily progress updates</strong> for each activity. These feed into
            analytics that compare <strong>planned vs actual</strong> completion, surface delays early, and
            track completion rates across the project. When an update shows a site falling behind, the
            variance is immediately visible — enabling corrective action before deadlines slip.
          </p>

          <ProgressAnalyticsDemo />

          <h3>Inventory Tracking</h3>
          <p>
            Materials flow from <strong>central warehouse to site to activity</strong>. Every allocation
            and consumption is recorded and tied to a specific activity, so at any point you can see where
            materials are, how much has been used, and whether the numbers add up. Full reconciliation
            across all levels ensures nothing goes unaccounted.
          </p>

          <InventoryTrackingDemo />

          {/* Workflows & Communication */}
          <div className="not-prose border-t border-slate-200 mt-12 pt-8 mb-6">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Workflows &amp; Communication</span>
          </div>

          <h3>Multi-Step Review Workflows</h3>
          <p>
            Every progress or inventory update goes through <strong>configurable approval stages</strong>.
            A site engineer submits, a junior engineer reviews, and a senior engineer gives final approval.
            At any stage, the reviewer can <strong>reject with a correction note</strong> — the submitter
            corrects and resubmits. This ensures data accuracy without bottlenecking the process, and every
            decision is recorded.
          </p>

          <ReviewWorkflowDemo />

          <h3>E2E Encrypted Communication</h3>
          <p>
            All client-server communication is <strong>end-to-end encrypted using Diffie-Hellman key
            exchange</strong>. Each client establishes a shared secret with the server, and every payload —
            messages, file attachments, progress updates, and all data — is encrypted
            before leaving the device. Nothing travels in plaintext. In-app messaging with
            <strong> file attachment support</strong> is built on top of this encrypted layer.
          </p>

          <E2EMessagingDemo />

          <h3>In-App Messaging</h3>
          <p>
            Project communication is built directly into the platform — no need to switch to WhatsApp
            or email. Team members can <strong>message within project context</strong> with full
            <strong> file attachment support</strong> for sharing site photos, documents, and reports.
            All messages flow through the E2EE layer, so conversations stay private and on-record.
          </p>

          <MessagingDemo />

          <h3>AI Copilot</h3>
          <p>
            An AI copilot assists users across the platform. For data entry, it <strong>suggests values
            and auto-fills fields</strong> based on historical patterns, reducing manual effort and
            errors during daily updates. For project oversight, it provides <strong>summaries and
            insights</strong> across project data — surfacing trends, flagging anomalies, and helping
            decision-makers stay on top of progress without digging through raw numbers.
          </p>

          <AICopilotDemo />

          {/* Accountability */}
          <div className="not-prose border-t border-slate-200 mt-12 pt-8 mb-6">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Accountability</span>
          </div>

          <h3>Audit Trail</h3>
          <p>
            Every action that updates any read model is tracked — submissions, approvals, rejections,
            corrections, and system-generated updates. The audit trail ensures full visibility into
            <strong> who did what and when</strong>, which is critical for government construction
            projects where accountability and documentation are non-negotiable.
          </p>

          <AuditTrailDemo />

          {/* Deployment */}
          <div className="not-prose border-t border-slate-200 mt-12 pt-8 mb-6">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Deployment</span>
          </div>

          <h2>Current Status</h2>
          <p>
            Completed a successful 3-month pilot and is now being adopted in the DGMAP division
            of Military Engineering Services (MES).
          </p>
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
