'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Tab {
  id: string
  name: string
  isDefault: boolean
  filters: {
    dateRange: string
    wallet: string
    category: string
  }
  columns: string[]
  syncStatus: 'synced' | 'syncing' | 'local'
}

const INITIAL_TABS: Tab[] = [
  {
    id: 'all',
    name: 'All Transactions',
    isDefault: true,
    filters: { dateRange: 'All time', wallet: 'All wallets', category: 'All' },
    columns: ['Date', 'Type', 'Amount', 'Wallet', 'Category', 'Status'],
    syncStatus: 'synced',
  },
  {
    id: 'revenue',
    name: 'Revenue Only',
    isDefault: false,
    filters: { dateRange: 'This month', wallet: 'All wallets', category: 'Revenue' },
    columns: ['Date', 'Amount', 'Source', 'Status'],
    syncStatus: 'synced',
  },
  {
    id: 'q4',
    name: 'Q4 Review',
    isDefault: false,
    filters: { dateRange: 'Oct-Dec 2024', wallet: 'Treasury', category: 'All' },
    columns: ['Date', 'Type', 'Amount', 'Category', 'Notes'],
    syncStatus: 'synced',
  },
]

const ALL_COLUMNS = ['Date', 'Type', 'Amount', 'Wallet', 'Category', 'Status', 'Source', 'Notes', 'Tags']

export function SavedTabsDemo() {
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS)
  const [activeTabId, setActiveTabId] = useState('all')
  const [isEditing, setIsEditing] = useState(false)
  const [showSaveAnimation, setShowSaveAnimation] = useState(false)

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0]

  const switchTab = (tabId: string) => {
    if (tabId !== activeTabId) {
      setActiveTabId(tabId)
      setIsEditing(false)
    }
  }

  const toggleColumn = (column: string) => {
    if (!isEditing) return

    setTabs(prev => prev.map(tab => {
      if (tab.id !== activeTabId) return tab

      const newColumns = tab.columns.includes(column)
        ? tab.columns.filter(c => c !== column)
        : [...tab.columns, column]

      return { ...tab, columns: newColumns, syncStatus: 'local' as const }
    }))
  }

  const changeFilter = (key: keyof Tab['filters'], value: string) => {
    if (!isEditing) return

    setTabs(prev => prev.map(tab => {
      if (tab.id !== activeTabId) return tab
      return {
        ...tab,
        filters: { ...tab.filters, [key]: value },
        syncStatus: 'local' as const,
      }
    }))
  }

  const saveTab = () => {
    setShowSaveAnimation(true)

    // Simulate localStorage save (instant)
    setTabs(prev => prev.map(tab =>
      tab.id === activeTabId ? { ...tab, syncStatus: 'syncing' as const } : tab
    ))

    // Simulate API sync (delayed)
    setTimeout(() => {
      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId ? { ...tab, syncStatus: 'synced' as const } : tab
      ))
      setShowSaveAnimation(false)
      setIsEditing(false)
    }, 1200)
  }

  const createNewTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      name: `Custom Tab ${tabs.length}`,
      isDefault: false,
      filters: { dateRange: 'All time', wallet: 'All wallets', category: 'All' },
      columns: ['Date', 'Type', 'Amount', 'Status'],
      syncStatus: 'local',
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
    setIsEditing(true)
  }

  const reset = () => {
    setTabs(INITIAL_TABS)
    setActiveTabId('all')
    setIsEditing(false)
    setShowSaveAnimation(false)
  }

  const hasChanges = activeTab.syncStatus === 'local'

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">Persistent Tabs</h4>
          <p className="text-sm text-slate-500">Workspace configurations saved to DB &amp; localStorage</p>
        </div>
        <button
          onClick={reset}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          Reset
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="mb-4 flex items-center gap-1 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab.id === activeTabId
                ? 'text-orange-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.name}
            {tab.syncStatus === 'local' && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
            )}
            {tab.syncStatus === 'syncing' && (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            )}
            {tab.id === activeTabId && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
              />
            )}
          </button>
        ))}
        <button
          onClick={createNewTab}
          className="ml-1 flex h-8 w-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          title="New tab"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTabId}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="rounded-lg bg-slate-50 p-4"
        >
          {/* Edit Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Tab Configuration
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                isEditing
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-white text-slate-500 hover:bg-slate-100'
              }`}
            >
              {isEditing ? 'Editing...' : 'Edit'}
            </button>
          </div>

          {/* Filters */}
          <div className="mb-4">
            <div className="mb-2 text-xs font-medium text-slate-500">Default Filters</div>
            <div className="flex flex-wrap gap-2">
              <FilterPill
                label="Date"
                value={activeTab.filters.dateRange}
                isEditing={isEditing}
                options={['All time', 'This month', 'Last 30 days', 'This quarter', 'Oct-Dec 2024']}
                onChange={(v) => changeFilter('dateRange', v)}
              />
              <FilterPill
                label="Wallet"
                value={activeTab.filters.wallet}
                isEditing={isEditing}
                options={['All wallets', 'Treasury', 'Hot Wallet', 'Cold Storage']}
                onChange={(v) => changeFilter('wallet', v)}
              />
              <FilterPill
                label="Category"
                value={activeTab.filters.category}
                isEditing={isEditing}
                options={['All', 'Revenue', 'Expenses', 'Transfers', 'Fees']}
                onChange={(v) => changeFilter('category', v)}
              />
            </div>
          </div>

          {/* Columns */}
          <div className="mb-4">
            <div className="mb-2 text-xs font-medium text-slate-500">Visible Columns</div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_COLUMNS.map(col => {
                const isActive = activeTab.columns.includes(col)
                return (
                  <button
                    key={col}
                    onClick={() => toggleColumn(col)}
                    disabled={!isEditing}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : isEditing
                        ? 'bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        : 'bg-slate-200 text-slate-400'
                    } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    {col}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && hasChanges && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-slate-200 pt-4"
            >
              <button
                onClick={saveTab}
                disabled={showSaveAnimation}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:bg-orange-400"
              >
                {showSaveAnimation ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Syncing to API...
                  </>
                ) : (
                  'Save Tab'
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Sync Status Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span>Synced (DB + localStorage)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <span>Local changes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
          <span>Syncing</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 text-xs text-slate-400">
        Click &quot;Edit&quot; to modify filters and columns, then save to sync across devices
      </div>
    </div>
  )
}

function FilterPill({
  label,
  value,
  isEditing,
  options,
  onChange,
}: {
  label: string
  value: string
  isEditing: boolean
  options: string[]
  onChange: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => isEditing && setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
          isEditing
            ? 'border-orange-200 bg-white cursor-pointer hover:border-orange-300'
            : 'border-slate-200 bg-white cursor-default'
        }`}
      >
        <span className="text-slate-400">{label}:</span>
        <span className="font-medium text-slate-700">{value}</span>
        {isEditing && (
          <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-0 top-full z-20 mt-1 min-w-[150px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            >
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                    opt === value ? 'font-medium text-orange-600' : 'text-slate-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
