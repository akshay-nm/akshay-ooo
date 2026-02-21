'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const concepts = [
  // Add concepts as you learn them
  // {
  //   id: 'osi-model',
  //   title: 'OSI Model',
  //   description: 'The 7 layers of network communication',
  // },
]

export default function NetworkingPage() {
  return (
    <article className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <Link href="/learning" className="text-slate-500 hover:text-slate-700 transition-colors">
            &larr; Back to learning
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-orange-500 font-medium mb-4 block">In Progress</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Networking
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Understanding how computers communicate. TCP/IP, DNS, HTTP, routing,
            and the protocols that power the internet.
          </p>
        </motion.header>

        {/* Content area - add illustrations and concepts here */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-slate prose-lg max-w-none"
        >
          {concepts.length === 0 ? (
            <div className="not-prose p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
              <p className="text-slate-500 mb-2">
                Working through networking concepts...
              </p>
              <p className="text-sm text-slate-400">
                Illustrations and explanations will appear here as I learn.
              </p>
            </div>
          ) : (
            <>
              {/* Concepts will be rendered here */}
            </>
          )}
        </motion.div>

        {/* Placeholder for future structure */}
        {/*
        Example structure for a concept:

        <section className="mb-16">
          <h2>OSI Model</h2>
          <p>Introduction text...</p>

          <OSIModelDiagram />  // Interactive illustration component

          <h3>Layer 1: Physical</h3>
          <p>Explanation...</p>
        </section>
        */}
      </div>
    </article>
  )
}
