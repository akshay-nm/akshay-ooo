'use client'

import { useEffect, useState } from 'react'

type Props = {
  html: string
  speed?: number
  onDone?: () => void
}

export function Typewriter({ html, speed = 18, onDone }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= html.length) {
      onDone?.()
      return
    }
    const id = window.setTimeout(() => setIndex((i) => i + 1), speed)
    return () => window.clearTimeout(id)
  }, [index, html, speed, onDone])

  return <span dangerouslySetInnerHTML={{ __html: html.slice(0, index) }} />
}
