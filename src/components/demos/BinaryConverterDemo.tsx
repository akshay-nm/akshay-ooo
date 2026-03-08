'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1]

type Mode = 'decimal-to-binary' | 'binary-to-decimal'

interface DecimalStep {
  power: number
  fits: boolean
  remaining: number
  previousRemaining: number
}

function decimalToBinarySteps(decimal: number): DecimalStep[] {
  const steps: DecimalStep[] = []
  let remaining = decimal

  for (const power of POWERS_OF_2) {
    const fits = remaining >= power
    const previousRemaining = remaining
    if (fits) {
      remaining -= power
    }
    steps.push({ power, fits, remaining, previousRemaining })
  }

  return steps
}

function binaryToDecimalSteps(binary: string): { bit: string; power: number; value: number }[] {
  const paddedBinary = binary.padStart(8, '0').slice(-8)
  return paddedBinary.split('').map((bit, i) => ({
    bit,
    power: POWERS_OF_2[i],
    value: bit === '1' ? POWERS_OF_2[i] : 0,
  }))
}

export function BinaryConverterDemo() {
  const [mode, setMode] = useState<Mode>('decimal-to-binary')
  const [decimalInput, setDecimalInput] = useState('192')
  const [binaryInput, setBinaryInput] = useState('11000000')
  const [showSteps, setShowSteps] = useState(true)

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAnimationStep, setCurrentAnimationStep] = useState(-1)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [accumulatorValue, setAccumulatorValue] = useState(0)
  const [showingAccumulatorAdd, setShowingAccumulatorAdd] = useState<number | null>(null)

  const decimalValue = parseInt(decimalInput) || 0
  const isValidDecimal = decimalValue >= 0 && decimalValue <= 255

  const binaryValue = binaryInput.replace(/[^01]/g, '').slice(0, 8)
  const isValidBinary = /^[01]{1,8}$/.test(binaryValue)

  const decimalSteps = useMemo(() => {
    if (!isValidDecimal) return []
    return decimalToBinarySteps(decimalValue)
  }, [decimalValue, isValidDecimal])

  const binarySteps = useMemo(() => {
    if (!isValidBinary) return []
    return binaryToDecimalSteps(binaryValue)
  }, [binaryValue, isValidBinary])

  const binaryResult = decimalSteps.map(s => (s.fits ? '1' : '0')).join('')
  const decimalResult = binarySteps.reduce((sum, s) => sum + s.value, 0)

  const totalSteps = mode === 'decimal-to-binary' ? decimalSteps.length : binarySteps.length

  // Animation logic
  const resetAnimation = useCallback(() => {
    setIsPlaying(false)
    setCurrentAnimationStep(-1)
    setAccumulatorValue(0)
    setShowingAccumulatorAdd(null)
  }, [])

  const playAnimation = useCallback(() => {
    resetAnimation()
    setIsPlaying(true)
    setCurrentAnimationStep(0)
  }, [resetAnimation])

  // Animation tick
  useEffect(() => {
    if (!isPlaying || currentAnimationStep < 0) return

    const baseDelay = 800 / animationSpeed

    const timer = setTimeout(() => {
      if (currentAnimationStep < totalSteps - 1) {
        // For binary-to-decimal, update accumulator
        if (mode === 'binary-to-decimal') {
          const step = binarySteps[currentAnimationStep]
          if (step.value > 0) {
            setShowingAccumulatorAdd(step.value)
            setTimeout(() => {
              setAccumulatorValue(prev => prev + step.value)
              setShowingAccumulatorAdd(null)
            }, 300 / animationSpeed)
          }
        }
        setCurrentAnimationStep(prev => prev + 1)
      } else {
        // Final step
        if (mode === 'binary-to-decimal') {
          const step = binarySteps[currentAnimationStep]
          if (step.value > 0) {
            setShowingAccumulatorAdd(step.value)
            setTimeout(() => {
              setAccumulatorValue(prev => prev + step.value)
              setShowingAccumulatorAdd(null)
              setIsPlaying(false)
            }, 300 / animationSpeed)
          } else {
            setIsPlaying(false)
          }
        } else {
          setIsPlaying(false)
        }
      }
    }, baseDelay)

    return () => clearTimeout(timer)
  }, [isPlaying, currentAnimationStep, totalSteps, animationSpeed, mode, binarySteps])

  // Reset animation when input changes
  useEffect(() => {
    resetAnimation()
  }, [decimalInput, binaryInput, mode, resetAnimation])

  const isStepVisible = (stepIndex: number) => {
    if (!isPlaying && currentAnimationStep === -1) return true // Show all when not animating
    return stepIndex <= currentAnimationStep
  }

  const isCurrentStep = (stepIndex: number) => {
    return isPlaying && stepIndex === currentAnimationStep
  }

  return (
    <div className="not-prose my-8 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">Binary ↔ Decimal Converter</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              showSteps
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showSteps ? 'Showing Steps' : 'Show Steps'}
          </button>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('decimal-to-binary')}
          className={`flex-1 px-4 py-2 text-sm rounded-lg transition-colors ${
            mode === 'decimal-to-binary'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Decimal → Binary
        </button>
        <button
          onClick={() => setMode('binary-to-decimal')}
          className={`flex-1 px-4 py-2 text-sm rounded-lg transition-colors ${
            mode === 'binary-to-decimal'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Binary → Decimal
        </button>
      </div>

      {mode === 'decimal-to-binary' ? (
        <div className="space-y-6">
          {/* Input */}
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Enter decimal (0-255):</label>
            <input
              type="number"
              min="0"
              max="255"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              className={`w-32 px-3 py-2 font-mono text-lg border rounded-lg ${
                isValidDecimal ? 'border-slate-200' : 'border-red-300 bg-red-50'
              }`}
            />
            {!isValidDecimal && (
              <div className="text-xs text-red-500 mt-1">Must be 0-255</div>
            )}
          </div>

          {/* Animation controls */}
          {showSteps && isValidDecimal && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <button
                onClick={playAnimation}
                disabled={isPlaying}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  isPlaying
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <span>▶</span> Play
              </button>
              <button
                onClick={resetAnimation}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
              >
                Reset
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-500">Speed:</span>
                <select
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="text-xs border border-slate-200 rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
              {isPlaying && (
                <div className="text-xs text-slate-500">
                  Step {currentAnimationStep + 1} of {totalSteps}
                </div>
              )}
            </div>
          )}

          {/* Powers of 2 reference */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-xs text-slate-500 mb-3">Powers of 2 (memorize these!):</div>
            <div className="flex gap-1">
              {POWERS_OF_2.map((power, i) => (
                <motion.div
                  key={i}
                  className="flex-1 text-center"
                  animate={{
                    scale: isCurrentStep(i) ? 1.1 : 1,
                    backgroundColor: isCurrentStep(i) ? '#dbeafe' : 'transparent',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ borderRadius: '0.5rem', padding: '0.25rem' }}
                >
                  <div className="text-[10px] text-slate-400">2<sup>{7 - i}</sup></div>
                  <div className={`font-mono text-sm font-bold ${isCurrentStep(i) ? 'text-blue-700' : 'text-slate-700'}`}>
                    {power}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated decimal value dropping through */}
          {showSteps && isValidDecimal && isPlaying && currentAnimationStep >= 0 && (
            <div className="flex justify-center">
              <motion.div
                key={currentAnimationStep}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-4 py-2 bg-blue-100 rounded-lg border-2 border-blue-300"
              >
                <span className="text-xs text-blue-600">Current value:</span>
                <span className="font-mono text-xl font-bold text-blue-800 ml-2">
                  {currentAnimationStep === 0
                    ? decimalValue
                    : decimalSteps[currentAnimationStep - 1]?.remaining ?? 0}
                </span>
              </motion.div>
            </div>
          )}

          {/* Step-by-step calculation */}
          {showSteps && isValidDecimal && (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700">
                Step-by-step: Does {decimalValue} fit?
              </div>
              <div className="p-4 space-y-2">
                <AnimatePresence>
                  {decimalSteps.map((step, i) => (
                    isStepVisible(i) && (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          height: 'auto',
                          scale: isCurrentStep(i) ? 1.02 : 1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 25,
                          delay: isPlaying ? 0 : i * 0.05,
                        }}
                        className={`flex items-center gap-3 text-sm font-mono p-2 rounded ${
                          isCurrentStep(i)
                            ? 'bg-blue-100 ring-2 ring-blue-400'
                            : step.fits
                            ? 'bg-emerald-50'
                            : 'bg-slate-50'
                        }`}
                      >
                        <span className="w-24 text-slate-500">
                          {step.previousRemaining} ≥ {step.power}?
                        </span>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: isPlaying ? 0.2 : 0, type: 'spring' }}
                          className={`w-8 font-bold ${step.fits ? 'text-emerald-600' : 'text-slate-400'}`}
                        >
                          {step.fits ? 'YES' : 'NO'}
                        </motion.span>
                        <span className="text-slate-400">→</span>
                        <motion.span
                          initial={{ rotateY: 90 }}
                          animate={{ rotateY: 0 }}
                          transition={{ delay: isPlaying ? 0.3 : 0, type: 'spring' }}
                          className={`w-6 font-bold ${step.fits ? 'text-emerald-700' : 'text-slate-400'}`}
                        >
                          {step.fits ? '1' : '0'}
                        </motion.span>
                        {step.fits && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: isPlaying ? 0.4 : 0 }}
                            className="text-slate-600"
                          >
                            <span className="text-slate-400 mr-2">→</span>
                            {step.previousRemaining} - {step.power} = {step.remaining}
                          </motion.span>
                        )}
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Result */}
          {isValidDecimal && (!isPlaying || currentAnimationStep === totalSteps - 1) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
            >
              <div className="text-sm text-emerald-700 mb-2">Result:</div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-lg text-slate-700">{decimalValue}</span>
                <span className="text-slate-400">=</span>
                <div className="flex gap-0.5">
                  {binaryResult.split('').map((bit, i) => (
                    <motion.div
                      key={i}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{
                        delay: i * 0.08,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      className={`w-8 h-10 rounded flex items-center justify-center font-mono text-lg font-bold ${
                        bit === '1' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {bit}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Input */}
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Enter binary (8 bits):</label>
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: isCurrentStep(i) ? 1.1 : 1,
                    y: isCurrentStep(i) ? -4 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <input
                    type="text"
                    maxLength={1}
                    value={binaryValue[i] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^01]/g, '')
                      const newBinary = binaryValue.padStart(8, '0').split('')
                      newBinary[i] = val || '0'
                      setBinaryInput(newBinary.join(''))
                      if (val && i < 7) {
                        const next = e.target.parentElement?.nextElementSibling?.querySelector('input') as HTMLInputElement
                        next?.focus()
                      }
                    }}
                    className={`w-10 h-12 text-center font-mono text-lg font-bold border rounded-lg transition-all ${
                      isCurrentStep(i)
                        ? 'border-blue-400 ring-2 ring-blue-200 bg-blue-50'
                        : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animation controls */}
          {showSteps && isValidBinary && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <button
                onClick={playAnimation}
                disabled={isPlaying}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  isPlaying
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <span>▶</span> Play
              </button>
              <button
                onClick={resetAnimation}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
              >
                Reset
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-500">Speed:</span>
                <select
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="text-xs border border-slate-200 rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
              {isPlaying && (
                <div className="text-xs text-slate-500">
                  Step {currentAnimationStep + 1} of {totalSteps}
                </div>
              )}
            </div>
          )}

          {/* Powers of 2 reference with values */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-xs text-slate-500 mb-3">Each bit position has a value:</div>
            <div className="flex gap-1">
              {POWERS_OF_2.map((power, i) => (
                <motion.div
                  key={i}
                  className="flex-1 text-center"
                  animate={{
                    scale: isCurrentStep(i) ? 1.1 : 1,
                    backgroundColor: isCurrentStep(i) ? '#dbeafe' : 'transparent',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ borderRadius: '0.5rem', padding: '0.25rem' }}
                >
                  <div className="text-[10px] text-slate-400">bit {7 - i}</div>
                  <div className={`font-mono text-sm font-bold ${isCurrentStep(i) ? 'text-blue-700' : 'text-slate-700'}`}>
                    {power}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Accumulator */}
          {showSteps && isValidBinary && isPlaying && (
            <div className="flex justify-center">
              <motion.div
                className="relative px-6 py-4 bg-emerald-100 rounded-xl border-2 border-emerald-300 min-w-[150px] text-center"
                animate={{ scale: showingAccumulatorAdd ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-xs text-emerald-600 mb-1">Accumulator</div>
                <motion.div
                  key={accumulatorValue}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="font-mono text-3xl font-bold text-emerald-800"
                >
                  {accumulatorValue}
                </motion.div>
                <AnimatePresence>
                  {showingAccumulatorAdd && (
                    <motion.div
                      initial={{ opacity: 1, y: -30, scale: 1 }}
                      animate={{ opacity: 0, y: 0, scale: 0.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="font-mono text-xl font-bold text-blue-600">
                        +{showingAccumulatorAdd}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {/* Step-by-step calculation */}
          {showSteps && isValidBinary && (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700">
                Step-by-step: Add up the 1s
              </div>
              <div className="p-4">
                <div className="flex gap-1 mb-4">
                  {binarySteps.map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 text-center"
                      animate={{
                        scale: isCurrentStep(i) ? 1.1 : 1,
                        y: isCurrentStep(i) ? -8 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <motion.div
                        className={`w-full h-10 rounded flex items-center justify-center font-mono text-lg font-bold transition-colors ${
                          isCurrentStep(i)
                            ? 'bg-blue-300 text-blue-900 ring-2 ring-blue-500'
                            : step.bit === '1'
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                        animate={{
                          rotateY: isStepVisible(i) ? 0 : 90,
                        }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        {step.bit}
                      </motion.div>
                      <div className="text-xs text-slate-500 mt-1">×{step.power}</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: isStepVisible(i) ? 1 : 0,
                        }}
                        className={`font-mono text-sm font-bold mt-1 ${
                          step.value > 0 ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      >
                        {step.value > 0 ? `+${step.value}` : '—'}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="border-t border-slate-200 pt-3 text-sm font-mono text-center"
                  animate={{
                    opacity: !isPlaying || currentAnimationStep === totalSteps - 1 ? 1 : 0.5,
                  }}
                >
                  {binarySteps
                    .filter((s) => s.value > 0)
                    .map((s) => s.value)
                    .join(' + ') || '0'}{' '}
                  = <span className="font-bold text-emerald-700">{decimalResult}</span>
                </motion.div>
              </div>
            </div>
          )}

          {/* Result */}
          {isValidBinary && (!isPlaying || currentAnimationStep === totalSteps - 1) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
            >
              <div className="text-sm text-emerald-700 mb-2">Result:</div>
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {binaryValue.padStart(8, '0').split('').map((bit, i) => (
                    <motion.div
                      key={i}
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`w-6 h-8 rounded flex items-center justify-center font-mono text-sm font-bold ${
                        bit === '1' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {bit}
                    </motion.div>
                  ))}
                </div>
                <span className="text-slate-400">=</span>
                <motion.span
                  key={decimalResult}
                  initial={{ scale: 1.5, color: '#10b981' }}
                  animate={{ scale: 1, color: '#065f46' }}
                  className="font-mono text-2xl font-bold"
                >
                  {decimalResult}
                </motion.span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Quick practice */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 mb-2">Quick practice (click to try):</div>
        <div className="flex flex-wrap gap-2">
          {mode === 'decimal-to-binary' ? (
            [192, 168, 255, 127, 10, 172, 224, 0].map((num) => (
              <button
                key={num}
                onClick={() => setDecimalInput(String(num))}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  decimalInput === String(num)
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))
          ) : (
            ['11000000', '10101000', '11111111', '01111111', '00001010', '10101100', '11100000', '00000000'].map((bin) => (
              <button
                key={bin}
                onClick={() => setBinaryInput(bin)}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  binaryValue === bin
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bin}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <strong>Tip:</strong> Memorize 128, 64, 32, 16, 8, 4, 2, 1. For decimal→binary, ask &quot;does it fit?&quot;
        at each position. For binary→decimal, just add up the values where there&apos;s a 1.
      </div>
    </div>
  )
}
