'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Engine } from 'json-rules-engine'

type Operator = 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'contains'
type Field = 'wallet' | 'amount' | 'type' | 'token'

interface Condition {
  id: string
  field: Field
  operator: Operator
  value: string
}

interface JournalEntry {
  debit: { account: string; amount: number }
  credit: { account: string; amount: number }
  memo: string
}

const FIELDS: { value: Field; label: string }[] = [
  { value: 'wallet', label: 'Wallet Address' },
  { value: 'amount', label: 'Amount' },
  { value: 'type', label: 'Transaction Type' },
  { value: 'token', label: 'Token' },
]

const OPERATORS: { value: Operator; label: string }[] = [
  { value: 'equal', label: 'equals' },
  { value: 'notEqual', label: 'not equals' },
  { value: 'greaterThan', label: '>' },
  { value: 'lessThan', label: '<' },
  { value: 'contains', label: 'contains' },
]

const SAMPLE_TRANSACTIONS = [
  { wallet: '0x1234...abcd', amount: 5000, type: 'receive', token: 'USDC' },
  { wallet: '0x5678...efgh', amount: 250, type: 'send', token: 'ETH' },
  { wallet: '0x1234...abcd', amount: 10000, type: 'receive', token: 'USDC' },
]

export function RulesBuilderDemo() {
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', field: 'type', operator: 'equal', value: 'receive' },
    { id: '2', field: 'amount', operator: 'greaterThan', value: '1000' },
  ])
  const [classification, setClassification] = useState('Revenue')
  const [results, setResults] = useState<{ transaction: any; matched: boolean; entry?: JournalEntry }[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: Date.now().toString(), field: 'wallet', operator: 'equal', value: '' },
    ])
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const buildRuleJson = useCallback(() => {
    return {
      conditions: {
        all: conditions.map((c) => ({
          fact: c.field,
          operator: c.operator,
          value: c.field === 'amount' ? Number(c.value) : c.value,
        })),
      },
      event: {
        type: 'classification',
        params: {
          category: classification,
        },
      },
    }
  }, [conditions, classification])

  const runRule = async () => {
    setIsRunning(true)
    setResults([])

    const engine = new Engine()
    const rule = buildRuleJson()
    engine.addRule(rule)

    const newResults: typeof results = []

    for (const transaction of SAMPLE_TRANSACTIONS) {
      await new Promise((resolve) => setTimeout(resolve, 300)) // Visual delay

      const { events } = await engine.run(transaction)
      const matched = events.length > 0

      newResults.push({
        transaction,
        matched,
        entry: matched
          ? {
              debit: { account: 'Cash', amount: transaction.amount },
              credit: { account: classification, amount: transaction.amount },
              memo: `Auto-classified: ${transaction.type} of ${transaction.amount} ${transaction.token}`,
            }
          : undefined,
      })
      setResults([...newResults])
    }

    setIsRunning(false)
  }

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Rules Builder Demo</h3>
        <button
          onClick={() => setShowJson(!showJson)}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          {showJson ? 'Hide' : 'Show'} JSON
        </button>
      </div>

      {/* Condition Builder */}
      <div className="space-y-3 mb-6">
        <p className="text-sm text-slate-600 mb-3">
          If <span className="font-medium">all</span> of these conditions match:
        </p>
        <AnimatePresence>
          {conditions.map((condition, index) => (
            <motion.div
              key={condition.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 flex-wrap"
            >
              {index > 0 && <span className="text-sm text-slate-400 w-12">AND</span>}
              {index === 0 && <span className="w-12" />}
              <select
                value={condition.field}
                onChange={(e) => updateCondition(condition.id, { field: e.target.value as Field })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
              >
                {FIELDS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
              <select
                value={condition.operator}
                onChange={(e) => updateCondition(condition.id, { operator: e.target.value as Operator })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
              >
                {OPERATORS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                placeholder="value"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm w-32"
              />
              <button
                onClick={() => removeCondition(condition.id)}
                className="p-2 text-slate-400 hover:text-red-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={addCondition}
          className="text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          + Add condition
        </button>
      </div>

      {/* Classification */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-slate-200">
        <p className="text-sm text-slate-600 mb-2">Then classify as:</p>
        <select
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium"
        >
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
          <option value="Transfer">Internal Transfer</option>
          <option value="Investment">Investment</option>
        </select>
      </div>

      {/* JSON Preview */}
      <AnimatePresence>
        {showJson && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(buildRuleJson(), null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run Button */}
      <button
        onClick={runRule}
        disabled={isRunning || conditions.length === 0}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
      >
        {isRunning ? 'Running rule...' : 'Run against sample transactions'}
      </button>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-sm font-medium text-slate-700">Results:</p>
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  result.matched
                    ? 'bg-green-50 border-green-200'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm">
                    <span className="font-mono text-slate-600">
                      {result.transaction.type} {result.transaction.amount} {result.transaction.token}
                    </span>
                    <span className="text-slate-400 ml-2">from {result.transaction.wallet}</span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      result.matched
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {result.matched ? 'Matched' : 'No match'}
                  </span>
                </div>
                {result.entry && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-green-200 text-xs"
                  >
                    <p className="font-medium text-green-800 mb-1">Generated Journal Entry:</p>
                    <div className="grid grid-cols-2 gap-2 text-green-700">
                      <div>DR: {result.entry.debit.account} ${result.entry.debit.amount}</div>
                      <div>CR: {result.entry.credit.account} ${result.entry.credit.amount}</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
