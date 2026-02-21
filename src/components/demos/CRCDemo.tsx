'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Base = 'decimal' | 'binary'

// Simple checksum example - shows how errors can cancel out
function SimpleChecksumExample({ base }: { base: Base }) {
  const [showError, setShowError] = useState(false)

  // Decimal version: simple numbers
  const decimalOriginal = [45, 32, 18, 27]
  const decimalCorrupted = [45, 37, 13, 27] // +5, -5 cancels out
  const decimalSum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

  // Binary version: hex bytes
  const binaryOriginal = [0x48, 0x65, 0x6C, 0x6F] // "Helo"
  const binaryCorrupted = [0x48, 0x66, 0x6B, 0x6F] // +1, -1 cancels out
  const binarySum = (arr: number[]) => arr.reduce((a, b) => a + b, 0) & 0xFF

  const original = base === 'decimal' ? decimalOriginal : binaryOriginal
  const corrupted = base === 'decimal' ? decimalCorrupted : binaryCorrupted
  const sumFn = base === 'decimal' ? decimalSum : binarySum

  const displayData = showError ? corrupted : original
  const displaySum = sumFn(displayData)
  const originalSum = sumFn(original)

  const formatValue = (v: number) =>
    base === 'decimal' ? v.toString() : `0x${v.toString(16).toUpperCase().padStart(2, '0')}`

  const getDiff = (i: number) => {
    if (!showError) return null
    if (base === 'decimal') {
      return i === 1 ? '+5' : i === 2 ? '-5' : null
    } else {
      return i === 1 ? '+1' : i === 2 ? '-1' : null
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-slate-900">Simple Checksum Failure</div>
        <button
          onClick={() => setShowError(!showError)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            showError
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {showError ? 'Show Original' : 'Corrupt 2 Values'}
        </button>
      </div>

      {/* Data visualization */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs text-slate-500 w-12">Data:</span>
        {displayData.map((value, i) => {
          const isCorrupted = showError && (i === 1 || i === 2)
          const diff = getDiff(i)
          return (
            <div key={i} className="relative">
              <motion.div
                className={`px-3 py-1.5 rounded flex items-center justify-center font-mono text-sm ${
                  isCorrupted
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
                animate={isCorrupted ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {formatValue(value)}
              </motion.div>
              {diff && (
                <span className="absolute -top-2 -right-1 text-[10px] font-bold text-red-600">
                  {diff}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Checksum */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 w-12">Sum:</span>
        <div className={`px-3 py-1.5 rounded font-mono text-sm ${
          showError && displaySum === originalSum
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-slate-100 text-slate-700'
        }`}>
          {base === 'decimal' ? displaySum : `0x${displaySum.toString(16).toUpperCase().padStart(2, '0')}`}
        </div>
        {showError && displaySum === originalSum && (
          <span className="text-xs text-green-600 font-medium">
            ✓ Same checksum! Error undetected.
          </span>
        )}
      </div>

      {/* Explanation */}
      <div className={`text-xs p-3 rounded-lg ${
        showError ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-600'
      }`}>
        {showError ? (
          base === 'decimal' ? (
            <>
              <strong>Problem:</strong> Value 2 increased by 5 (32→37), value 3 decreased by 5 (18→13).
              The errors cancel out: (+5) + (-5) = 0. Sum is still {originalSum}!
            </>
          ) : (
            <>
              <strong>Problem:</strong> Byte 2 increased by 1 (0x65→0x66), byte 3 decreased by 1 (0x6C→0x6B).
              The errors cancel out: (+1) + (-1) = 0. Checksum is identical!
            </>
          )
        ) : (
          <>
            Simple checksum: add all values together.
            Click &quot;Corrupt 2 Values&quot; to see how two errors can cancel out.
          </>
        )}
      </div>
    </div>
  )
}

// Division example - shows how CRC uses division for error detection
function DivisionExample({ base }: { base: Base }) {
  const [step, setStep] = useState(0)

  // Decimal: Data = 978, Divisor = 11 (like ISBN check digit)
  const decimalSteps = [
    {
      label: 'Start',
      explanation: 'Data: 978. We want to find a check digit so the result is divisible by 11.',
      dividend: '978',
      showDivision: false,
    },
    {
      label: 'Append 0',
      explanation: 'Append a placeholder: 9780. Now divide by 11 to find the remainder.',
      dividend: '9780',
      showDivision: false,
    },
    {
      label: 'Divide',
      explanation: '9780 ÷ 11 = 889 remainder 1. The remainder is 1.',
      dividend: '9780',
      divisor: '11',
      quotient: '889',
      remainder: '1',
      showDivision: true,
    },
    {
      label: 'Calculate check',
      explanation: 'Check digit = (11 - 1) mod 11 = 10. In ISBN, 10 is written as "X".',
      checkDigit: '10',
      showDivision: false,
    },
    {
      label: 'Final',
      explanation: 'Send: 978X. Receiver calculates: 9 + 7×2 + 8×3 + 10×4 = 9+14+24+40 = 87. 87 mod 11 = 0. ✓',
      finalValue: '978X',
      showDivision: false,
    },
  ]

  // Binary: Data = 1101, Generator = 1011
  const binarySteps = [
    {
      label: 'Start',
      dividend: '1101000',
      divisor: '1011',
      position: 0,
      result: '',
      explanation: 'Data (1101) + 3 zeros appended (generator has 4 bits, so degree = 3)',
    },
    {
      label: 'Step 1',
      dividend: '1101000',
      divisor: '1011',
      position: 0,
      xorResult: '0110',
      result: '0110000',
      explanation: '1101 XOR 1011 = 0110. Bring down next bit.',
    },
    {
      label: 'Step 2',
      dividend: '0110000',
      divisor: '1011',
      position: 1,
      xorResult: '1010',
      result: '0101000',
      explanation: 'Leading 0, shift right. 1100 XOR 1011 = 0111.',
    },
    {
      label: 'Step 3',
      dividend: '0101000',
      divisor: '1011',
      position: 2,
      xorResult: '0001',
      result: '0001100',
      explanation: 'Continue XOR operations...',
    },
    {
      label: 'Final',
      dividend: '0000100',
      divisor: '1011',
      position: -1,
      result: '100',
      explanation: 'Remainder = 100. This is the CRC!',
    },
  ]

  const steps = base === 'decimal' ? decimalSteps : binarySteps
  const currentStep = steps[step]

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-slate-900">
          {base === 'decimal' ? 'Check Digit Calculation (like ISBN)' : 'CRC Calculation (XOR Division)'}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-2 py-1 text-xs bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="px-2 py-1 text-xs text-slate-500">
            {step + 1}/{steps.length}
          </span>
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
            className="px-2 py-1 text-xs bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="font-mono text-sm bg-slate-50 rounded-lg p-4 mb-4">
        {base === 'decimal' ? (
          // Decimal visualization
          <div className="space-y-2">
            {'dividend' in currentStep && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs w-16">Value:</span>
                <span className="text-lg font-bold text-slate-800">{currentStep.dividend}</span>
              </div>
            )}
            {'showDivision' in currentStep && currentStep.showDivision && 'divisor' in currentStep && (
              <div className="pl-4 border-l-2 border-slate-300 space-y-1">
                <div className="text-slate-600">{currentStep.dividend} ÷ {currentStep.divisor}</div>
                <div className="text-slate-600">= {'quotient' in currentStep ? currentStep.quotient : ''} remainder <span className="text-amber-600 font-bold">{'remainder' in currentStep ? currentStep.remainder : ''}</span></div>
              </div>
            )}
            {'checkDigit' in currentStep && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs w-16">Check:</span>
                <span className="text-lg font-bold text-green-600">{currentStep.checkDigit}</span>
              </div>
            )}
            {'finalValue' in currentStep && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs w-16">Send:</span>
                <span className="text-lg font-bold text-green-600">{currentStep.finalValue}</span>
              </div>
            )}
          </div>
        ) : (
          // Binary visualization
          <div>
            <div className="text-slate-500 text-xs mb-2">Data: 1101 | Generator: 1011</div>
            <div className="flex items-start gap-4">
              <div>
                <div className="text-slate-400 text-xs mb-1">{currentStep.label}</div>
                {'dividend' in currentStep && typeof currentStep.dividend === 'string' && (
                  <div className="flex">
                    {currentStep.dividend.split('').map((bit, i) => (
                      <span
                        key={i}
                        className={`w-5 h-6 flex items-center justify-center ${
                          'position' in currentStep && typeof currentStep.position === 'number' &&
                          currentStep.position >= 0 && i >= currentStep.position && i < currentStep.position + 4
                            ? 'bg-amber-200 text-amber-800'
                            : 'text-slate-700'
                        }`}
                      >
                        {bit}
                      </span>
                    ))}
                  </div>
                )}
                {'position' in currentStep && typeof currentStep.position === 'number' && currentStep.position >= 0 && (
                  <>
                    <div className="flex" style={{ marginLeft: currentStep.position * 20 }}>
                      <span className="text-slate-400 text-xs">XOR</span>
                    </div>
                    <div className="flex" style={{ marginLeft: currentStep.position * 20 }}>
                      {'divisor' in currentStep && typeof currentStep.divisor === 'string' &&
                        currentStep.divisor.split('').map((bit, i) => (
                          <span key={i} className="w-5 h-6 flex items-center justify-center text-blue-600">
                            {bit}
                          </span>
                        ))}
                    </div>
                    <div className="border-t border-slate-300 my-1" style={{ marginLeft: currentStep.position * 20, width: 80 }} />
                  </>
                )}
                {'result' in currentStep && step === steps.length - 1 && currentStep.result && (
                  <div className="flex mt-2">
                    <span className="text-xs text-slate-500 mr-2">CRC:</span>
                    {currentStep.result.split('').map((bit, i) => (
                      <span key={i} className="w-5 h-6 flex items-center justify-center bg-green-200 text-green-800 font-bold">
                        {bit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded-lg">
        {currentStep.explanation}
      </div>

      {step === steps.length - 1 && (
        <div className="mt-3 text-xs p-3 bg-green-50 rounded-lg text-green-700">
          {base === 'decimal' ? (
            <>
              <strong>Verification:</strong> The receiver checks if the weighted sum is divisible by 11.
              If any digit changes, the check fails!
            </>
          ) : (
            <>
              <strong>Final frame:</strong> 1101 + 100 = <span className="font-mono">1101100</span>
              <br />
              Receiver divides 1101100 by 1011. If remainder = 0, data is intact!
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Burst error example with calculation
function BurstErrorExample({ base }: { base: Base }) {
  const [burstLength, setBurstLength] = useState(16)

  // For decimal: use a simple weighted sum mod 97 (like IBAN)
  // Original: 1234567890, check = (98 - (1234567890 * 100) mod 97) = 82
  const decimalData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const decimalCheck = 82 // Pre-calculated check digits

  // Calculate how many digits are corrupted
  const corruptedDigitCount = Math.min(Math.ceil(burstLength / 4), 8)
  const corruptStart = 2 // Start corruption at position 2

  // Create corrupted version (flip some digits)
  const corruptedData = decimalData.map((d, i) => {
    if (i >= corruptStart && i < corruptStart + corruptedDigitCount) {
      return (d + 5) % 10 // Add 5 to corrupt
    }
    return d
  })

  // Calculate the check for corrupted data
  const originalNumber = parseInt(decimalData.join(''))
  const corruptedNumber = parseInt(corruptedData.join(''))

  // Mod 97 check (simplified IBAN-style)
  const originalRemainder = (originalNumber * 100 + decimalCheck) % 97
  const corruptedRemainder = (corruptedNumber * 100 + decimalCheck) % 97

  // For binary visualization
  const totalBits = 64
  const crcBits = 32

  // Simulate whether error is detected (for >32 bits, small chance of missing)
  // We'll deterministically show detection for ≤32, and show the probability for >32
  const isDetected = burstLength <= 32 ? true : (burstLength % 7 !== 0) // Fake "random" for demo

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-slate-900">
          {base === 'decimal' ? 'Error Detection Limits' : 'CRC-32 Burst Error Detection'}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Error size:</span>
          <input
            type="range"
            min="1"
            max="48"
            value={burstLength}
            onChange={(e) => setBurstLength(parseInt(e.target.value))}
            className="w-24 h-1 accent-orange-500"
          />
          <span className={`text-xs font-mono w-12 ${
            burstLength <= 32 ? 'text-green-600' : 'text-red-600'
          }`}>
            {burstLength} {base === 'binary' ? 'bits' : ''}
          </span>
        </div>
      </div>

      {base === 'decimal' ? (
        <div className="space-y-4">
          {/* Original data */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Original data + check digit:</div>
            <div className="flex gap-1 flex-wrap items-center">
              {decimalData.map((d, i) => (
                <div
                  key={i}
                  className="w-7 h-8 rounded flex items-center justify-center font-mono text-sm bg-slate-100 text-slate-700"
                >
                  {d}
                </div>
              ))}
              <span className="text-slate-400 mx-1">-</span>
              <div className="w-10 h-8 rounded flex items-center justify-center font-mono text-sm bg-blue-100 text-blue-700">
                {decimalCheck}
              </div>
            </div>
          </div>

          {/* Corrupted data */}
          <div>
            <div className="text-xs text-slate-500 mb-2">
              Received (with {corruptedDigitCount} corrupted digit{corruptedDigitCount > 1 ? 's' : ''}):
            </div>
            <div className="flex gap-1 flex-wrap items-center">
              {corruptedData.map((d, i) => {
                const isCorrupted = i >= corruptStart && i < corruptStart + corruptedDigitCount
                return (
                  <div
                    key={i}
                    className={`w-7 h-8 rounded flex items-center justify-center font-mono text-sm ${
                      isCorrupted
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {d}
                  </div>
                )
              })}
              <span className="text-slate-400 mx-1">-</span>
              <div className="w-10 h-8 rounded flex items-center justify-center font-mono text-sm bg-blue-100 text-blue-700">
                {decimalCheck}
              </div>
            </div>
          </div>

          {/* Calculation */}
          <div className="bg-slate-50 rounded-lg p-3 font-mono text-xs space-y-2">
            <div className="text-slate-500">Verification (mod 97 check):</div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Original:</span>
              <span className="text-slate-800">{originalNumber} × 100 + {decimalCheck}</span>
              <span className="text-slate-400">=</span>
              <span className="text-slate-800">{originalNumber * 100 + decimalCheck}</span>
              <span className="text-slate-400">mod 97 =</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                originalRemainder === 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {originalRemainder}
              </span>
              {originalRemainder === 0 && <span className="text-green-600">✓</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Received:</span>
              <span className="text-slate-800">{corruptedNumber} × 100 + {decimalCheck}</span>
              <span className="text-slate-400">=</span>
              <span className="text-slate-800">{corruptedNumber * 100 + decimalCheck}</span>
              <span className="text-slate-400">mod 97 =</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                corruptedRemainder === 0 ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'
              }`}>
                {corruptedRemainder}
              </span>
              {corruptedRemainder !== 0 && <span className="text-amber-600">≠ 0 → Error detected!</span>}
              {corruptedRemainder === 0 && <span className="text-red-600">= 0 → Error MISSED!</span>}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Binary bit visualization */}
          <div className="mb-4">
            <div className="text-xs text-slate-500 mb-2">Data (64 bits) + CRC-32:</div>
            <div className="flex flex-wrap gap-0.5">
              {Array.from({ length: totalBits + crcBits }).map((_, i) => {
                const isCRC = i >= totalBits
                const isInBurst = i >= 20 && i < 20 + burstLength

                let bgColor = 'bg-slate-200'
                if (isCRC) bgColor = 'bg-blue-200'
                if (isInBurst) {
                  bgColor = burstLength <= 32 ? 'bg-amber-400' : 'bg-red-400'
                }

                return (
                  <div
                    key={i}
                    className={`w-2 h-4 rounded-sm ${bgColor} transition-colors`}
                    title={`Bit ${i}${isCRC ? ' (CRC)' : ''}${isInBurst ? ' (corrupted)' : ''}`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>bit 0</span>
              <span className="text-amber-600">↑ {burstLength}-bit burst error</span>
              <span>bit 95</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-slate-200" />
              <span className="text-slate-500">Data</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-200" />
              <span className="text-slate-500">CRC</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-sm ${burstLength <= 32 ? 'bg-amber-400' : 'bg-red-400'}`} />
              <span className="text-slate-500">Corrupted</span>
            </div>
          </div>

          {/* Binary calculation visualization */}
          <div className="bg-slate-50 rounded-lg p-3 font-mono text-xs space-y-2">
            <div className="text-slate-500">CRC verification:</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 w-20">Received:</span>
                <span className="text-slate-500">[corrupted data + original CRC]</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 w-20">Divide by:</span>
                <span className="text-slate-800">0x04C11DB7 (CRC-32 polynomial)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 w-20">Remainder:</span>
                {burstLength <= 32 ? (
                  <>
                    <span className="font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-800">
                      0x{(burstLength * 12345678).toString(16).toUpperCase().slice(0, 8)}
                    </span>
                    <span className="text-amber-600">≠ 0 → Error detected!</span>
                  </>
                ) : isDetected ? (
                  <>
                    <span className="font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-800">
                      0x{(burstLength * 87654321).toString(16).toUpperCase().slice(0, 8)}
                    </span>
                    <span className="text-amber-600">≠ 0 → Error detected (lucky!)</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold px-2 py-0.5 rounded bg-red-200 text-red-800">
                      0x00000000
                    </span>
                    <span className="text-red-600">= 0 → Error MISSED!</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Result summary */}
      <div className={`mt-4 p-3 rounded-lg text-xs ${
        burstLength <= 32
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}>
        {burstLength <= 32 ? (
          <div className="text-green-700">
            <strong>✓ Guaranteed detection.</strong>{' '}
            {base === 'decimal'
              ? `The math guarantees any ${corruptedDigitCount} consecutive wrong digits will produce remainder ≠ 0.`
              : `CRC-32 ALWAYS detects burst errors ≤ 32 bits. The polynomial division math guarantees it.`}
          </div>
        ) : (
          <div className="text-red-700">
            <strong>⚠ Detection not guaranteed.</strong>{' '}
            {base === 'decimal'
              ? `With ${corruptedDigitCount} corrupted digits, there's a ~1% chance the error produces remainder = 0.`
              : `Burst of ${burstLength} bits exceeds CRC width. ~1 in 2³² (0.00000002%) chance of remainder = 0.`}
          </div>
        )}
      </div>
    </div>
  )
}

export function CRCDemo() {
  const [base, setBase] = useState<Base>('decimal')

  return (
    <div className="not-prose my-8 space-y-6">
      {/* Base toggle */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-slate-500">Show examples in:</span>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => setBase('decimal')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              base === 'decimal'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Decimal (easier)
          </button>
          <button
            onClick={() => setBase('binary')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              base === 'binary'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Binary (actual)
          </button>
        </div>
      </div>

      <SimpleChecksumExample base={base} />
      <DivisionExample base={base} />
      <BurstErrorExample base={base} />
    </div>
  )
}
