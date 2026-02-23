'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { RulesBuilderDemo } from '@/components/demos/RulesBuilderDemo'
import { JobFlowDiagram } from '@/components/demos/JobFlowDiagram'
import { StripeOnboardingFlow } from '@/components/demos/StripeOnboardingFlow'
import { S3UploadFlow } from '@/components/demos/S3UploadFlow'
import { AccountingPeriodDemo } from '@/components/demos/AccountingPeriodDemo'
import { TimezoneDemo } from '@/components/demos/TimezoneDemo'
import { GLSyncDemo } from '@/components/demos/GLSyncDemo'
import { JobTrackerDemo } from '@/components/demos/JobTrackerDemo'
import { BalanceCarryoverDemo } from '@/components/demos/BalanceCarryoverDemo'
import { SavedTabsDemo } from '@/components/demos/SavedTabsDemo'

export default function EntendreCase() {
  return (
    <article className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <Link href="/work" className="text-slate-500 hover:text-slate-700 transition-colors">
            &larr; Back to work
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-orange-500 font-medium mb-4">2023 - 2025</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            <a
              href="https://entendre.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
            >
              Entendre Finance
            </a>
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed">
            Double-entry crypto accounting with AI-assisted workflows
          </p>
          <p className="text-base text-slate-500 mt-4">
            Joined pre-launch as an early engineer. Over two years, grew from implementing
            specs to owning entire systems—billing, background infrastructure, and reporting.
          </p>
        </motion.header>

        {/* Meta info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-8 p-6 bg-slate-50 rounded-xl mb-16"
        >
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Role</h3>
            <p className="text-slate-900 font-medium">Full-Stack Engineer</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Stack</h3>
            <p className="text-slate-900">Next.js, Node.js, MongoDB, AWS</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Focus</h3>
            <p className="text-slate-900">AI Agents, Accounting Automation, Integrations</p>
          </div>
        </motion.div>

        {/* TL;DR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 bg-orange-50 border border-orange-100 rounded-xl mb-16"
        >
          <h3 className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-3">TL;DR</h3>
          <ul className="space-y-2 text-slate-700">
            <li>Built <strong>visual rules engine</strong> with user-configurable cron jobs for automated transaction classification</li>
            <li>Owned <strong>Stripe billing</strong> integration, <strong>background job infrastructure</strong>, and <strong>financial reporting</strong></li>
            <li>Shipped <strong>multi-timezone support</strong>, third-party GL sync (QuickBooks/Xero), and full accounting period management</li>
            <li>Implemented pixel-perfect <strong>UI components</strong> from Figma, <strong>filtering system</strong> (shadcn), and API layer (TanStack Query, JWT auth)</li>
          </ul>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-slate prose-lg max-w-none"
        >
          <h2>The Problem</h2>
          <p>
            Crypto accounting is a nightmare. Transactions flow in from dozens of wallets and exchanges,
            each with different data formats. Accountants must classify thousands of transactions into
            proper journal entries - doing this manually is slow, error-prone, and doesn&apos;t scale.
            Teams needed a way to define classification rules once and have the system apply them
            automatically across their entire transaction history.
          </p>

          {/* Core Features */}
          <div className="not-prose border-t border-slate-200 mt-12 pt-8 mb-6">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Core Features</span>
          </div>

          <h3>Rules Engine UI</h3>
          <p>
            A visual condition-builder letting users create classification rules (e.g., &quot;if source
            wallet is X and amount &gt; Y, categorize as revenue&quot;) that auto-generate journal entries.
            Users could define complex conditions with <strong>AND/OR logic</strong>, preview matching
            transactions, and see journal entries before committing. Also built <strong>user-configurable
            cron jobs</strong> for scheduled classification.
          </p>

          <RulesBuilderDemo />

          <h3>Background Job Infrastructure</h3>
          <p>
            Reliable pipelines for backfills, asset snapshots, reconciliation, and long-running
            transaction processing with <strong>retry logic and failure recovery</strong>. Jobs could
            be triggered from anywhere in the UI - a sheet, a modal, a bulk action. Each showed
            <strong> inline progress</strong>, but if users navigated away, tracking moved to a
            <strong> global job tracker</strong> in the corner. Users could monitor all running jobs,
            <strong> pause or cancel</strong> them, and see real-time progress without losing context.
          </p>

          <JobFlowDiagram />

          <JobTrackerDemo />

          <h3>Stripe Billing Integration</h3>
          <p>
            Full subscription lifecycle: <strong>trials, plan enforcement, upgrades</strong>, and payment
            reliability. Handled edge cases like failed payments, mid-cycle plan changes, and
            usage-based billing.
          </p>

          <StripeOnboardingFlow />

          <h3>S3 Presigned URL Uploads</h3>
          <p>
            Secure file attachments via <strong>presigned URLs</strong>. Files upload directly to S3,
            bypassing our servers. <strong>S3 events trigger Lambda</strong> to update database references.
          </p>

          <S3UploadFlow />

          {/* Accounting Features */}
          <div className="not-prose border-t border-slate-200 mt-12 pt-8 mb-6">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Accounting Features</span>
          </div>

          <h3>Multi-Timezone Support</h3>
          <p>
            Different firms needed different <strong>end-of-day cutoffs</strong> based on location.
            Implemented organization-level timezone configuration affecting all timestamps, reports,
            and data filtering. Critically, <strong>accounting periods depend on timezone</strong> -
            a transaction at 11 PM UTC on March 31 falls in March for a London firm but April for
            a Tokyo firm. Changing timezone <strong>invalidates existing journal entries</strong> and
            requires re-classification, so users see a confirmation showing exactly which periods
            and entries will be affected before proceeding.
          </p>

          <TimezoneDemo />

          <h3>Third-Party GL Sync</h3>
          <p>
            Streamlined <strong>QuickBooks and Xero</strong> integration into a unified service handling
            authentication, field mapping, and error recovery consistently across platforms.
          </p>

          <GLSyncDemo />

          <h3>Accounting Period Management</h3>
          <ul>
            <li><strong>Journal entry rollups</strong> for period closes</li>
            <li>On-demand <strong>ledger balance recalculation</strong></li>
            <li><strong>Impairment workflows</strong> with audit trails</li>
          </ul>

          <AccountingPeriodDemo />

          <h3>Financial Reporting</h3>
          <p>
            All reports (balance sheet, trial balance, income statement) are powered by
            <strong> pre-computed account balances</strong>, not calculated on-the-fly. When a
            period closes, ending balances are computed from journal entries and
            <strong> carried forward</strong> as the next period&apos;s opening balance. This makes
            reports <strong>instant</strong> regardless of transaction volume.
          </p>
          <ul>
            <li><strong>Balance sheet, trial balance, income statement</strong></li>
            <li>Timezone-aware date filtering</li>
            <li><strong>CSV export</strong> for downstream analysis</li>
          </ul>

          <BalanceCarryoverDemo />

          {/* UI/UX */}
          <div className="not-prose border-t border-slate-200 mt-12 pt-8 mb-6">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">UI &amp; Infrastructure</span>
          </div>

          <h3>App-Wide Filtering</h3>
          <p>
            Unified filtering across all views: date ranges, wallets, accounts, categories, tags.
            Backend <strong>DRY filter helpers</strong> - composable and unit testable.
          </p>

          <h3>Persistent Tabs</h3>
          <p>
            Power users needed to save their workspace configurations. Built a <strong>tabs system
            persisted to database</strong> and exposed via API, allowing users to save UI state
            including <strong>default filters, column preferences, and view settings</strong>. Hybrid
            storage with <strong>localStorage for instant load</strong> and API sync for cross-device
            access. Each tab remembers exactly how the user left it.
          </p>

          <SavedTabsDemo />

          <h3>Table Components</h3>
          <ul>
            <li><strong>Backend-driven multi-column sorting</strong> (any asc/desc combination)</li>
            <li><strong>Infinite scroll</strong>, row selection, inline actions</li>
            <li>Custom cell renderers for <strong>currencies, debits/credits, dates, status</strong></li>
            <li>Pixel-perfect implementation from Figma specs</li>
          </ul>

          <h3>Page Headers &amp; API Layer</h3>
          <ul>
            <li>Responsive headers from Figma: title, breadcrumbs, action buttons</li>
            <li><strong>TanStack Query</strong> with centralized query keys</li>
            <li><strong>JWT + refresh token</strong> flow via Axios interceptor</li>
          </ul>

          {/* Approach & Outcome */}
          <div className="not-prose border-t border-slate-200 mt-12 pt-8 mb-6">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Summary</span>
          </div>

          <h2>Technical Approach</h2>
          <p>
            Prioritized <strong>composable, testable code</strong>. Filter helpers, API hooks, and UI
            components designed for reuse. Figma specs followed precisely. Rules engine used
            <strong>declarative JSON</strong> - simpler UI, auditable rules, predictable execution.
          </p>

          <h2>Outcome</h2>
          <p>
            Shipped a full-featured accounting platform: <strong>reliable background jobs at scale</strong>,
            seamless billing lifecycle, accurate multi-timezone reporting, and consistent UI across
            complex data views. The rules engine significantly <strong>reduced manual classification work</strong>.
          </p>
        </motion.div>

        {/* Next/Prev navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20 pt-10 border-t border-slate-200"
        >
          <div className="flex justify-between items-center">
            <Link
              href="/work/setu"
              className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              &larr; Previous: Setu
            </Link>
            <Link
              href="/work/poplink"
              className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              Next: Poplink Ads &rarr;
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
