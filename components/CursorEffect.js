'use client'
import { useEffect } from 'react'

export default function CursorEffect() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Skip on touch / coarse-pointer devices — no cursor to follow
    if (window.matchMedia('(pointer: coarse)').matches) return

    // ── Styles ────────────────────────────────────────────────────────────────
    const style = document.createElement('style')
    style.id = 'cursor-glow-styles'
    style.textContent = `
      .cursor-glow {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        background: radial-gradient(
          600px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
          rgba(255, 107, 43, 0.08) 0%,
          rgba(255, 107, 43, 0.03) 40%,
          transparent 70%
        );
      }
    `
    document.head.appendChild(style)

    // ── Glow element ──────────────────────────────────────────────────────────
    const glow = document.createElement('div')
    glow.className = 'cursor-glow'
    document.body.appendChild(glow)

    // ── Track mouse → update CSS variables ───────────────────────────────────
    const onMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px')
      document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px')
    }

    // Move glow far off-screen when cursor leaves the viewport
    const onMouseLeave = () => {
      document.documentElement.style.setProperty('--mouse-x', '-9999px')
      document.documentElement.style.setProperty('--mouse-y', '-9999px')
    }

    document.addEventListener('mousemove', onMouseMove)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      glow.remove()
      style.remove()
      document.documentElement.style.removeProperty('--mouse-x')
      document.documentElement.style.removeProperty('--mouse-y')
    }
  }, [])

  return null
}
