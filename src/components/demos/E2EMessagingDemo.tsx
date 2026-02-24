'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Step =
  | 'idle'
  | 'key-gen-a'
  | 'key-gen-b'
  | 'exchange'
  | 'shared-secret'
  | 'encrypt'
  | 'send'
  | 'decrypt'
  | 'delivered'

const STEP_DESCRIPTIONS: Record<Step, string> = {
  idle: 'Click to see how all client-server communication is secured',
  'key-gen-a': 'Client A generates a private-public key pair',
  'key-gen-b': 'Client B generates a private-public key pair',
  exchange: 'Public keys are exchanged over the network',
  'shared-secret': 'Both clients independently compute the same shared secret',
  encrypt: 'All data — messages, attachments, updates — encrypted with the shared secret',
  send: 'Encrypted payload sent — server only sees ciphertext',
  decrypt: 'Client B decrypts with their copy of the shared secret',
  delivered: 'Data delivered securely — server never sees plaintext',
}

const STEP_ORDER: Step[] = [
  'idle', 'key-gen-a', 'key-gen-b', 'exchange', 'shared-secret', 'encrypt', 'send', 'decrypt', 'delivered',
]

export function E2EMessagingDemo() {
  const [step, setStep] = useState<Step>('idle')
  const [isRunning, setIsRunning] = useState(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const stepIndex = STEP_ORDER.indexOf(step)
  const isActive = (s: Step) => STEP_ORDER.indexOf(s) <= stepIndex

  const runAnimation = async () => {
    setIsRunning(true)
    setStep('idle')

    await delay(400)
    setStep('key-gen-a')
    await delay(700)
    setStep('key-gen-b')
    await delay(700)
    setStep('exchange')
    await delay(900)
    setStep('shared-secret')
    await delay(900)
    setStep('encrypt')
    await delay(800)
    setStep('send')
    await delay(800)
    setStep('decrypt')
    await delay(800)
    setStep('delivered')

    await delay(1500)
    setIsRunning(false)
  }

  return (
    <div className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 not-prose">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">E2E Encrypted Communication</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          step === 'delivered' ? 'bg-green-100 text-green-700' :
          step !== 'idle' ? 'bg-blue-100 text-blue-700' :
          'bg-slate-200 text-slate-500'
        }`}>
          {step === 'idle' ? 'Ready' : step === 'delivered' ? 'Secure' : 'In Progress'}
        </span>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-5 mb-6 overflow-x-auto">
        <div className="flex items-start justify-between gap-4 min-w-[420px]">
          {/* User A */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <UserBox label="Client A" sublabel="Site Engineer" active={isActive('key-gen-a')} highlight={step === 'key-gen-a' || step === 'encrypt'} />

            <AnimatePresence>
              {isActive('key-gen-a') && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-1">
                  <KeyBadge label="Private Key" value="a = 7" type="private" />
                  <KeyBadge label="Public Key" value="A = g^a mod p" type="public" />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isActive('shared-secret') && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                  <KeyBadge label="Shared Secret" value="s = B^a mod p" type="secret" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Middle: Exchange / Message */}
          <div className="flex-1 flex flex-col items-center gap-2 pt-12">
            <AnimatePresence>
              {isActive('exchange') && !isActive('encrypt') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-2"
                >
                  <div className="flex items-center gap-1 justify-center">
                    <motion.span animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-xs text-blue-500">A</motion.span>
                    <span className="text-slate-400 text-xs">&harr;</span>
                    <motion.span animate={{ x: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-xs text-purple-500">B</motion.span>
                  </div>
                  <div className="text-[10px] text-slate-400">Public key exchange</div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isActive('encrypt') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-2"
                >
                  {/* Message */}
                  <motion.div
                    animate={step === 'send' ? { x: [0, 30], opacity: [1, 0.8] } : {}}
                    className={`p-2 rounded-lg border text-xs ${
                      isActive('send') ? 'bg-slate-100 border-slate-300' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    {isActive('send') ? (
                      <span className="font-mono text-slate-500">a3f8...encrypted...9b2c</span>
                    ) : (
                      <span className="text-blue-700">&quot;Foundation pour complete&quot;</span>
                    )}
                  </motion.div>

                  {/* Attachment */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-1.5 rounded border text-[10px] ${
                      isActive('send') ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-blue-50 border-blue-200 text-blue-600'
                    }`}
                  >
                    {isActive('send') ? 'encrypted-file.enc' : 'site-photo.jpg'}
                  </motion.div>

                  {isActive('send') && !isActive('decrypt') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-slate-400"
                    >
                      Server sees only ciphertext
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User B */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <UserBox label="Client B" sublabel="Junior Engineer" active={isActive('key-gen-b')} highlight={step === 'key-gen-b' || step === 'decrypt'} />

            <AnimatePresence>
              {isActive('key-gen-b') && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-1">
                  <KeyBadge label="Private Key" value="b = 11" type="private" />
                  <KeyBadge label="Public Key" value="B = g^b mod p" type="public" />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isActive('shared-secret') && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                  <KeyBadge label="Shared Secret" value="s = A^b mod p" type="secret" />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isActive('delivered') && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="w-full p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-xs text-green-700 font-medium">&quot;Foundation pour complete&quot;</div>
                  <div className="text-[10px] text-green-500 mt-0.5">site-photo.jpg</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-600 mb-4 h-6">
        {STEP_DESCRIPTIONS[step]}
      </div>

      <button
        onClick={runAnimation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isRunning ? 'Running...' : 'Run E2E Communication Flow'}
      </button>
    </div>
  )
}

function UserBox({ label, sublabel, active, highlight }: { label: string; sublabel: string; active: boolean; highlight: boolean }) {
  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.3,
        scale: highlight ? 1.05 : 1,
        borderColor: highlight ? '#3b82f6' : '#e2e8f0',
      }}
      className="w-full p-3 rounded-lg border-2 bg-white text-center"
    >
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className="text-[10px] text-slate-400">{sublabel}</div>
    </motion.div>
  )
}

function KeyBadge({ label, value, type }: { label: string; value: string; type: 'private' | 'public' | 'secret' }) {
  const styles = {
    private: 'bg-red-50 border-red-200 text-red-700',
    public: 'bg-blue-50 border-blue-200 text-blue-700',
    secret: 'bg-green-50 border-green-200 text-green-700',
  }

  return (
    <div className={`p-1.5 rounded border text-center ${styles[type]}`}>
      <div className="text-[9px] uppercase tracking-wider font-medium opacity-70">{label}</div>
      <div className="text-[10px] font-mono">{value}</div>
    </div>
  )
}
