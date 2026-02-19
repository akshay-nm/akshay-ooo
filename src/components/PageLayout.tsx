import { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.main
          key={router.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-20"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
