import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Props = { onReady?: () => void }

export function Loader({ onReady }: Props) {
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reduced ? 80 : 650)
    return () => window.clearTimeout(timer)
  }, [reduced])

  return (
    <AnimatePresence onExitComplete={() => onReady?.()}>
      {visible && <motion.div className="boot-loader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] } }}>
        <div className="boot-center">
          <motion.div className="boot-mark" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>MS</motion.div>
          <motion.div className="boot-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduced ? 0.01 : 0.55, ease: 'easeOut' }} />
        </div>
      </motion.div>}
    </AnimatePresence>
  )
}
