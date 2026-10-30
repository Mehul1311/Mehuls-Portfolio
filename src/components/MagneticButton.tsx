import { type PropsWithChildren, useEffect, useRef } from 'react'
import gsap from 'gsap'

type Props = PropsWithChildren<{ href: string; external?: boolean; variant?: 'primary' | 'ghost' }>

export function MagneticButton({ href, external, children, variant = 'primary' }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(pointer: coarse)').matches) return
    const qx = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const qy = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })
    const move = (event: PointerEvent) => {
      const bounds = el.getBoundingClientRect()
      qx((event.clientX - bounds.left - bounds.width / 2) * 0.16)
      qy((event.clientY - bounds.top - bounds.height / 2) * 0.16)
    }
    const leave = () => { qx(0); qy(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [])

  return <a ref={ref} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={`magnetic-button${variant === 'ghost' ? ' magnetic-button--ghost' : ''}`}><span>{children}</span></a>
}
