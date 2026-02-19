'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PoplinkCase() {
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
          <p className="text-orange-500 font-medium mb-4">2022</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Poplink Ads
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed">
            Contextual ad overlays for blogs without third-party cookies
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
            <p className="text-slate-900 font-medium">Founding Engineer</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Stack</h3>
            <p className="text-slate-900">React, Node.js, NLP</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Focus</h3>
            <p className="text-slate-900">Content Analysis, Privacy</p>
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
            Built a contextual advertising system that analyzes blog/article content to display
            relevant ads without relying on third-party cookies or user tracking. A timely
            solution given the industry&apos;s shift away from cookie-based targeting.
          </p>

          <h2>How It Worked</h2>

          <h3>Article Ingestion &amp; Classification</h3>
          <p>
            Client articles were scraped and stored in our database, then processed through
            MonkeyLearn to generate context maps - classifying each article and extracting
            semantic meaning for individual words and phrases.
          </p>

          <h3>Ad Classification</h3>
          <p>
            Ads were similarly classified by context. This let us pre-compute which ads
            matched which articles based on contextual alignment, not user behavior.
          </p>

          <h3>ptag Integration</h3>
          <p>
            Publishers added a single script tag to their markup (similar to gtag). When
            loaded, ptag sent the page URL to our backend. We identified which article
            the user was viewing and determined which contextually-matched ads to serve.
          </p>

          <h3>Keyword Targeting</h3>
          <p>
            The script tracked which keywords were visible in the user&apos;s viewport.
            When a targetable keyword scrolled into view, we displayed the matching ad
            as a popup link on that term - hence &quot;Poplink&quot;.
          </p>

          <h3>Click Funnel</h3>
          <p>
            When users clicked a popup link, they passed through our tracking funnel before
            reaching the advertised site. This recorded the ad click, attributed it to the
            publisher, and provided conversion data to advertisers - all without cookies.
          </p>

          <h2>Technical Highlights</h2>
          <ul>
            <li>MonkeyLearn-powered article and ad classification</li>
            <li>Pre-computed context matching between articles and ads</li>
            <li>Lightweight embed script with minimal page load impact</li>
            <li>Real-time viewport tracking for keyword visibility</li>
            <li>Click attribution through redirect funnel</li>
            <li>Privacy-first: no user tracking or cookie storage</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20 pt-10 border-t border-slate-200"
        >
          <div className="flex justify-between items-center">
            <Link
              href="/work/entendre"
              className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              &larr; Previous: Entendre Finance
            </Link>
            <div></div>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
