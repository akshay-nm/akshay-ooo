'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { notes, topics, type Note } from './data'

const PAGE_SIZE = 10

const columnHelper = createColumnHelper<Note>()

const columns = [
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => (
      <Link
        href={info.row.original.href}
        className="font-medium text-slate-900 hover:text-orange-500 transition-colors"
      >
        {info.getValue()}
      </Link>
    ),
    filterFn: 'includesString',
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => (
      <span className="text-slate-500">{info.getValue()}</span>
    ),
    filterFn: 'includesString',
  }),
  columnHelper.accessor('topic', {
    header: 'Topic',
    cell: (info) => (
      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
        {info.getValue()}
      </span>
    ),
    filterFn: 'equals',
  }),
]

export default function NotesPage() {
  const [search, setSearch] = useState('')
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []
    if (activeTopic) {
      filters.push({ id: 'topic', value: activeTopic })
    }
    return filters
  }, [activeTopic])

  const table = useReactTable({
    data: notes,
    columns,
    state: {
      globalFilter: search,
      columnFilters,
    },
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const filteredRows = table.getRowModel().rows
  const visibleRows = filteredRows.slice(0, visibleCount)
  const hasMore = visibleCount < filteredRows.length

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [search, activeTopic])

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => prev + PAGE_SIZE)
    }
  }, [hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Notes
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Concepts I&apos;m exploring, explained through illustrations and examples.
            You only truly understand something if you can teach it.
          </p>
        </motion.header>

        {/* Search + Topic Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTopic(null)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeTopic === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  activeTopic === topic
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-slate-200 rounded-xl overflow-hidden"
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-slate-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-slate-700">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {visibleRows.length > 0 ? (
                visibleRows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                    No notes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Infinite scroll sentinel */}
        {hasMore && (
          <div ref={sentinelRef} className="py-8 text-center text-slate-400 text-sm">
            Loading more...
          </div>
        )}

        {/* Count */}
        <div className="mt-4 text-sm text-slate-400">
          {filteredRows.length} {filteredRows.length === 1 ? 'note' : 'notes'}
        </div>
      </div>
    </div>
  )
}
