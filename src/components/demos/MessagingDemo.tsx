'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  sender: string
  role: string
  text: string
  attachment?: { name: string; type: string }
  side: 'left' | 'right'
  encrypted?: boolean
}

const MESSAGES: Message[] = [
  {
    sender: 'Ramesh',
    role: 'Site Engineer',
    text: 'Foundation pour for Pillar A is done. Attaching site photos.',
    attachment: { name: 'pillar-a-photos.zip', type: 'archive' },
    side: 'left',
  },
  {
    sender: 'Suresh',
    role: 'Jr. Engineer',
    text: 'Received. The rebar alignment looks off in photo 3 — can you take a closer shot?',
    side: 'right',
  },
  {
    sender: 'Ramesh',
    role: 'Site Engineer',
    text: 'Here you go. Alignment is within spec, the angle was misleading.',
    attachment: { name: 'rebar-closeup.jpg', type: 'image' },
    side: 'left',
  },
  {
    sender: 'Suresh',
    role: 'Jr. Engineer',
    text: 'Confirmed. Approving the progress update now.',
    side: 'right',
  },
]

export function MessagingDemo() {
  const [revealedCount, setRevealedCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showEncryption, setShowEncryption] = useState(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runAnimation = async () => {
    setIsRunning(true)
    setRevealedCount(0)
    setShowEncryption(false)

    for (let i = 1; i <= MESSAGES.length; i++) {
      await delay(900)
      setRevealedCount(i)
    }

    await delay(600)
    setShowEncryption(true)

    await delay(2000)
    setIsRunning(false)
  }

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">In-App Messaging</h3>
        <div className="flex items-center gap-2">
          {showEncryption && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-green-100 text-green-700"
            >
              E2EE
            </motion.span>
          )}
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            revealedCount === MESSAGES.length ? 'bg-green-100 text-green-700' :
            revealedCount > 0 ? 'bg-blue-100 text-blue-700' :
            'bg-slate-200 text-slate-500'
          }`}>
            {revealedCount === 0 ? 'Ready' : `${revealedCount} / ${MESSAGES.length} messages`}
          </span>
        </div>
      </div>

      {/* Project context header */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 px-4 py-2 flex items-center gap-2">
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Project</span>
        <span className="text-xs font-medium text-slate-700">Bridge Construction — NH48</span>
        <span className="text-slate-300 mx-1">/</span>
        <span className="text-xs text-slate-500">Pillar A</span>
      </div>

      {/* Chat area */}
      <div className="bg-white rounded-b-xl border border-slate-200 p-4 mb-6 min-h-[200px]">
        <div className="space-y-3">
          <AnimatePresence>
            {MESSAGES.slice(0, revealedCount).map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, x: msg.side === 'left' ? -10 : 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.side === 'right' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${msg.side === 'right' ? 'items-end' : 'items-start'}`}>
                  <div className={`text-[10px] mb-0.5 ${msg.side === 'right' ? 'text-right' : ''}`}>
                    <span className="font-medium text-slate-600">{msg.sender}</span>
                    <span className="text-slate-400 ml-1">{msg.role}</span>
                  </div>
                  <div className={`p-3 rounded-lg text-xs ${
                    msg.side === 'left'
                      ? 'bg-slate-100 text-slate-700 rounded-tl-none'
                      : 'bg-blue-500 text-white rounded-tr-none'
                  }`}>
                    {showEncryption ? (
                      <span className="font-mono text-[10px] opacity-60">
                        {msg.side === 'left' ? 'a9f3...encrypted...7b2e' : 'c4d1...encrypted...8a3f'}
                      </span>
                    ) : (
                      msg.text
                    )}
                  </div>
                  {msg.attachment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-1 flex items-center gap-1.5 p-2 rounded border ${
                        msg.side === 'left'
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <span className="text-xs">
                        {msg.attachment.type === 'image' ? '🖼️' : '📎'}
                      </span>
                      <span className={`text-[10px] font-medium ${
                        showEncryption ? 'font-mono text-slate-400' : msg.side === 'left' ? 'text-slate-600' : 'text-blue-700'
                      }`}>
                        {showEncryption ? 'encrypted-file.enc' : msg.attachment.name}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {revealedCount === 0 && (
            <div className="text-center text-sm text-slate-300 py-8">
              No messages yet
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {revealedCount === 0 && 'Click to simulate a project conversation'}
        {revealedCount > 0 && revealedCount < MESSAGES.length && 'Messages stay in project context — no switching to external apps'}
        {revealedCount === MESSAGES.length && !showEncryption && 'Conversation complete — toggling to server view...'}
        {showEncryption && 'This is what the server sees — only ciphertext, never plaintext'}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Chatting...' : 'Run Conversation'}
      </button>
    </div>
  )
}
