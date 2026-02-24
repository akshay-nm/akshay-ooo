'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TreeNode {
  label: string
  type: 'project' | 'structure' | 'activity'
  children?: TreeNode[]
}

const PROJECT_TREE: TreeNode = {
  label: 'Bridge Construction — NH48',
  type: 'project',
  children: [
    {
      label: 'Pillar A',
      type: 'structure',
      children: [
        { label: 'Foundation Pour', type: 'activity' },
        { label: 'Rebar Installation', type: 'activity' },
        { label: 'Column Casting', type: 'activity' },
      ],
    },
    {
      label: 'Pillar B',
      type: 'structure',
      children: [
        { label: 'Foundation Pour', type: 'activity' },
        { label: 'Rebar Installation', type: 'activity' },
      ],
    },
    {
      label: 'Deck Span',
      type: 'structure',
      children: [
        { label: 'Formwork Setup', type: 'activity' },
        { label: 'Concrete Pouring', type: 'activity' },
        { label: 'Curing & Finishing', type: 'activity' },
      ],
    },
  ],
}

const TYPE_STYLES = {
  project: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-700' },
  structure: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-700' },
  activity: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', badge: 'bg-green-100 text-green-700' },
}

export function ProjectHierarchyDemo() {
  const [expandedLevel, setExpandedLevel] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setExpandedLevel(0)
    setSelectedNode(null)

    await delay(500)
    setExpandedLevel(1)
    setSelectedNode('Bridge Construction — NH48')

    await delay(800)
    setExpandedLevel(2)
    setSelectedNode('Pillar A')

    await delay(800)
    setExpandedLevel(3)
    setSelectedNode('Foundation Pour')

    await delay(1200)
    setSelectedNode(null)
    setIsRunning(false)
  }

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Construction Hierarchy</h3>
        <div className="flex items-center gap-3">
          {(['project', 'structure', 'activity'] as const).map((type) => (
            <span key={type} className={`text-[10px] font-medium px-2 py-0.5 rounded ${TYPE_STYLES[type].badge}`}>
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6">
        <TreeNodeView
          node={PROJECT_TREE}
          expandedLevel={expandedLevel}
          depth={0}
          selectedNode={selectedNode}
        />
      </div>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {expandedLevel === 0 && 'Click to expand the construction hierarchy'}
        {expandedLevel === 1 && 'Project contains multiple structures — independent trackable units'}
        {expandedLevel === 2 && 'Each structure breaks down into schedulable activities'}
        {expandedLevel === 3 && 'Activities are the smallest trackable unit — progress, inventory, and reviews happen here'}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Expanding...' : 'Expand Hierarchy'}
      </button>
    </div>
  )
}

function TreeNodeView({
  node,
  expandedLevel,
  depth,
  selectedNode,
}: {
  node: TreeNode
  expandedLevel: number
  depth: number
  selectedNode: string | null
}) {
  const style = TYPE_STYLES[node.type]
  const isVisible = depth < expandedLevel
  const isSelected = selectedNode === node.label

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={depth > 0 ? 'ml-6 mt-2' : ''}
    >
      <motion.div
        animate={{
          scale: isSelected ? 1.02 : 1,
          borderColor: isSelected ? undefined : undefined,
        }}
        className={`flex items-center gap-3 p-3 rounded-lg border ${style.border} ${style.bg} ${
          isSelected ? 'ring-2 ring-offset-1 ring-slate-400' : ''
        }`}
      >
        <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
          {node.type}
        </span>
        <span className={`text-sm font-medium ${style.text}`}>{node.label}</span>
      </motion.div>

      <AnimatePresence>
        {node.children && depth + 1 < expandedLevel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-l-2 border-slate-200"
          >
            {node.children.map((child) => (
              <TreeNodeView
                key={child.label}
                node={child}
                expandedLevel={expandedLevel}
                depth={depth + 1}
                selectedNode={selectedNode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
