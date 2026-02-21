'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Job {
  id: string
  name: string
  progress: number
  status: 'running' | 'paused' | 'completed' | 'cancelled'
  total: number
  processed: number
}

export function JobTrackerDemo() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [trackerMinimized, setTrackerMinimized] = useState(false)
  const [activeJobInSheet, setActiveJobInSheet] = useState<string | null>(null)

  const startJob = useCallback((name: string, total: number) => {
    const id = `job-${Date.now()}`
    const newJob: Job = {
      id,
      name,
      progress: 0,
      status: 'running',
      total,
      processed: 0,
    }
    setJobs(prev => [...prev, newJob])
    setActiveJobInSheet(id)
    return id
  }, [])

  const closeSheet = () => {
    setSheetOpen(false)
    setActiveJobInSheet(null)
  }

  const togglePause = (jobId: string) => {
    setJobs(prev => prev.map(j =>
      j.id === jobId
        ? { ...j, status: j.status === 'paused' ? 'running' : 'paused' }
        : j
    ))
  }

  const cancelJob = (jobId: string) => {
    setJobs(prev => prev.map(j =>
      j.id === jobId ? { ...j, status: 'cancelled' } : j
    ))
  }

  const dismissJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId))
  }

  const reset = () => {
    setJobs([])
    setSheetOpen(false)
    setActiveJobInSheet(null)
    setTrackerMinimized(false)
  }

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.status !== 'running') return job
        const increment = Math.random() * 8 + 2
        const newProcessed = Math.min(job.processed + increment, job.total)
        const newProgress = (newProcessed / job.total) * 100

        if (newProgress >= 100) {
          return { ...job, progress: 100, processed: job.total, status: 'completed' }
        }
        return { ...job, progress: newProgress, processed: Math.floor(newProcessed) }
      }))
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const runningJobs = jobs.filter(j => j.status === 'running' || j.status === 'paused')
  const sheetJob = jobs.find(j => j.id === activeJobInSheet)
  const trackerJobs = sheetOpen ? jobs.filter(j => j.id !== activeJobInSheet) : jobs

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">Background Job Tracker</h4>
          <p className="text-sm text-slate-500">Jobs follow you across the app</p>
        </div>
        {jobs.length > 0 && (
          <button
            onClick={reset}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            Reset
          </button>
        )}
      </div>

      {/* Demo Area */}
      <div className="relative min-h-[300px] rounded-lg bg-slate-50 p-4">
        {/* Trigger Buttons */}
        {!sheetOpen && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSheetOpen(true)}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Open Transaction Sheet
            </button>
            <button
              onClick={() => startJob('Asset Snapshot', 500)}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Run Asset Snapshot
            </button>
            <button
              onClick={() => startJob('Reconciliation', 250)}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Run Reconciliation
            </button>
          </div>
        )}

        {/* Sheet Simulation */}
        <AnimatePresence>
          {sheetOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-lg border border-slate-200 bg-white shadow-lg"
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h5 className="font-medium text-slate-900">Transaction Classification</h5>
                <button
                  onClick={closeSheet}
                  className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Sheet Content */}
              <div className="p-4">
                {!sheetJob ? (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-slate-500">
                      142 transactions selected for classification
                    </p>
                    <button
                      onClick={() => startJob('Classify Transactions', 142)}
                      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                    >
                      Start Classification
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Inline Progress */}
                    <div className="mb-4 text-center">
                      <div className="mb-2 text-sm text-slate-600">
                        {sheetJob.status === 'completed' ? (
                          <span className="text-green-600">Classification complete!</span>
                        ) : sheetJob.status === 'cancelled' ? (
                          <span className="text-red-600">Classification cancelled</span>
                        ) : (
                          <>Classifying transactions...</>
                        )}
                      </div>

                      {/* Progress Ring */}
                      <div className="relative mx-auto mb-3 h-24 w-24">
                        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={sheetJob.status === 'completed' ? '#22c55e' : '#f97316'}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={251.2}
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * sheetJob.progress) / 100 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-semibold text-slate-700">
                            {Math.round(sheetJob.progress)}%
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-slate-500">
                        {sheetJob.processed} / {sheetJob.total} transactions
                      </div>
                    </div>

                    {/* Inline Controls */}
                    {sheetJob.status !== 'completed' && sheetJob.status !== 'cancelled' && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => togglePause(sheetJob.id)}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
                        >
                          {sheetJob.status === 'paused' ? 'Resume' : 'Pause'}
                        </button>
                        <button
                          onClick={() => cancelJob(sheetJob.id)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {sheetJob.status === 'running' && (
                      <p className="mt-4 text-center text-xs text-slate-400">
                        Close this sheet - job will continue in the tracker below
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!sheetOpen && jobs.length === 0 && (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            Click a button above to start a background job
          </div>
        )}

        {/* Global Job Tracker */}
        <AnimatePresence>
          {trackerJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-4 left-4 w-72"
            >
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {/* Tracker Header */}
                <button
                  onClick={() => setTrackerMinimized(!trackerMinimized)}
                  className="flex w-full items-center justify-between bg-slate-800 px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                      {runningJobs.length}
                    </div>
                    <span className="text-sm font-medium text-white">Background Jobs</span>
                  </div>
                  <svg
                    className={`h-4 w-4 text-slate-400 transition-transform ${trackerMinimized ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Tracker Content */}
                <AnimatePresence>
                  {!trackerMinimized && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="max-h-48 overflow-y-auto">
                        {trackerJobs.map(job => (
                          <div key={job.id} className="border-b border-slate-100 p-3 last:border-b-0">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">{job.name}</span>
                              <div className="flex items-center gap-1">
                                {job.status === 'running' || job.status === 'paused' ? (
                                  <>
                                    <button
                                      onClick={() => togglePause(job.id)}
                                      className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                      title={job.status === 'paused' ? 'Resume' : 'Pause'}
                                    >
                                      {job.status === 'paused' ? (
                                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      ) : (
                                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => cancelJob(job.id)}
                                      className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                      title="Cancel"
                                    >
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => dismissJob(job.id)}
                                    className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                    title="Dismiss"
                                  >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Progress */}
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    job.status === 'completed'
                                      ? 'bg-green-500'
                                      : job.status === 'cancelled'
                                      ? 'bg-red-400'
                                      : job.status === 'paused'
                                      ? 'bg-amber-400'
                                      : 'bg-orange-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${job.progress}%` }}
                                />
                              </div>
                              <span className="min-w-[36px] text-right text-xs text-slate-500">
                                {Math.round(job.progress)}%
                              </span>
                            </div>

                            {/* Status */}
                            <div className="mt-1 text-xs text-slate-400">
                              {job.status === 'completed' && 'Completed'}
                              {job.status === 'cancelled' && 'Cancelled'}
                              {job.status === 'paused' && 'Paused'}
                              {job.status === 'running' && `${job.processed} / ${job.total}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs text-slate-400">
        Try: Start a job in the sheet, then close it - the job continues in the tracker
      </div>
    </div>
  )
}
