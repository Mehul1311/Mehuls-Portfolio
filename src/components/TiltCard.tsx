import { type HTMLAttributes, type PointerEvent, type ReactNode, useRef } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & { children: ReactNode; max?: number }

export function TiltCard({ children, className = '', max = 7, onPointerMove, onPointerLeave, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const move = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    const el = ref.current
    if (!el || event.pointerType !== 'mouse') return
    const { left, top, width, height } = el.getBoundingClientRect()
    const px = (event.clientX - left) / width
    const py = (event.clientY - top) / height
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
      el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
    })
  }

  const leave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event)
    cancelAnimationFrame(frame.current)
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }

  return <div ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>{children}</div>
}
