'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Ledger {
  id: string
  name: string
  icon: string
  connected: boolean
  lastSync?: string
  selected: boolean
  syncProgress: number
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
}

const INITIAL_LEDGERS: Ledger[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    icon: '📗',
    connected: true,
    lastSync: '2 days ago',
    selected: true,
    syncProgress: 0,
    syncStatus: 'idle',
  },
  {
    id: 'xero',
    name: 'Xero',
    icon: '📘',
    connected: true,
    lastSync: '5 days ago',
    selected: true,
    syncProgress: 0,
    syncStatus: 'idle',
  },
  {
    id: 'netsuite',
    name: 'NetSuite',
    icon: '📙',
    connected: false,
    selected: false,
    syncProgress: 0,
    syncStatus: 'idle',
  },
]

const ENTRIES_TO_SYNC = 89

export function GLSyncDemo() {
  const [ledgers, setLedgers] = useState<Ledger[]>(INITIAL_LEDGERS)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showFieldMapping, setShowFieldMapping] = useState(false)

  const toggleLedger = (id: string) => {
    if (isSyncing) return
    setLedgers(prev => prev.map(l =>
      l.id === id && l.connected ? { ...l, selected: !l.selected } : l
    ))
  }

  const startSync = () => {
    const selectedLedgers = ledgers.filter(l => l.selected && l.connected)
    if (selectedLedgers.length === 0 || isSyncing) return

    setIsSyncing(true)
    setLedgers(prev => prev.map(l =>
      l.selected && l.connected
        ? { ...l, syncStatus: 'syncing', syncProgress: 0 }
        : l
    ))
  }

  useEffect(() => {
    if (!isSyncing) return

    const syncingLedgers = ledgers.filter(l => l.syncStatus === 'syncing')
    if (syncingLedgers.length === 0) {
      setIsSyncing(false)
      return
    }

    const intervals = syncingLedgers.map(ledger => {
      // Different sync speeds for each platform
      const speed = ledger.id === 'quickbooks' ? 80 : ledger.id === 'xero' ? 120 : 100

      return setInterval(() => {
        setLedgers(prev => prev.map(l => {
          if (l.id !== ledger.id || l.syncStatus !== 'syncing') return l

          const newProgress = Math.min(l.syncProgress + Math.random() * 15, 100)
          if (newProgress >= 100) {
            return { ...l, syncProgress: 100, syncStatus: 'success', lastSync: 'Just now' }
          }
          return { ...l, syncProgress: newProgress }
        }))
      }, speed)
    })

    return () => intervals.forEach(clearInterval)
  }, [isSyncing, ledgers])

  const reset = () => {
    setLedgers(INITIAL_LEDGERS)
    setIsSyncing(false)
  }

  const allSynced = ledgers.filter(l => l.selected && l.connected).every(l => l.syncStatus === 'success')
  const selectedCount = ledgers.filter(l => l.selected && l.connected).length

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">Sync to External Ledgers</h4>
          <p className="text-sm text-slate-500">{ENTRIES_TO_SYNC} journal entries ready to sync</p>
        </div>
        {allSynced && (
          <button
            onClick={reset}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            Reset Demo
          </button>
        )}
      </div>

      {/* Field Mapping Toggle */}
      <button
        onClick={() => setShowFieldMapping(!showFieldMapping)}
        className="mb-4 flex w-full items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100"
      >
        <span className="font-medium text-slate-600">Field Mapping Preview</span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${showFieldMapping ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Field Mapping Panel */}
      <AnimatePresence>
        {showFieldMapping && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                Entendre → External Ledger
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Journal Entry Date</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-medium text-slate-700">Transaction Date</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Ledger Account</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-medium text-slate-700">Account</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Debit/Credit</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-medium text-slate-700">Line Amount</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Memo</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-medium text-slate-700">Description</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Reference ID</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-medium text-slate-700">Doc Number</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ledger List */}
      <div className="mb-4 space-y-2">
        {ledgers.map(ledger => (
          <div
            key={ledger.id}
            className={`rounded-lg border p-4 transition-all ${
              ledger.connected
                ? ledger.selected
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
                : 'border-slate-100 bg-slate-50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleLedger(ledger.id)}
                  disabled={!ledger.connected || isSyncing}
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    ledger.selected && ledger.connected
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-slate-300 bg-white'
                  } ${!ledger.connected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {ledger.selected && ledger.connected && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <span className="text-xl">{ledger.icon}</span>
                <div>
                  <span className="font-medium text-slate-900">{ledger.name}</span>
                  {ledger.lastSync && (
                    <p className="text-xs text-slate-500">Last sync: {ledger.lastSync}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {ledger.connected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                    Not connected
                  </span>
                )}
              </div>
            </div>

            {/* Sync Progress */}
            <AnimatePresence>
              {(ledger.syncStatus === 'syncing' || ledger.syncStatus === 'success') && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    {/* Progress bar */}
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        className={`h-full rounded-full ${
                          ledger.syncStatus === 'success' ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${ledger.syncProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>

                    {/* Count */}
                    <span className="min-w-[80px] text-right text-sm font-medium text-slate-600">
                      {Math.round((ledger.syncProgress / 100) * ENTRIES_TO_SYNC)}/{ENTRIES_TO_SYNC}
                    </span>

                    {/* Status icon */}
                    {ledger.syncStatus === 'success' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500"
                      >
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    ) : (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Sync Button */}
      <button
        onClick={startSync}
        disabled={isSyncing || selectedCount === 0 || allSynced}
        className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
          isSyncing || selectedCount === 0 || allSynced
            ? 'cursor-not-allowed bg-slate-100 text-slate-400'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {isSyncing
          ? 'Syncing...'
          : allSynced
          ? 'All synced!'
          : `Sync ${selectedCount} Ledger${selectedCount !== 1 ? 's' : ''}`}
      </button>

      {/* Footer */}
      <div className="mt-4 text-xs text-slate-400">
        Each platform uses its native API client for reliable sync
      </div>
    </div>
  )
}
