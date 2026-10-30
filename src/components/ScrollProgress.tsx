import { motion, useScroll, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function ScrollProgress() {
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.25 })
  if (reduced) return null
  return <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />
}
