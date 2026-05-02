'use client'
import { useEffect } from 'react'

export default function CursorEffect() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Skip entirely on touch/coarse-pointer devices — they have no cursor
    if (window.matchMedia('(pointer: coarse)').matches) return

    // ── Styles ────────────────────────────────────────────────────────────────
    const style = document.createElement('style')
    style.id = 'cursor-effect-styles'
    style.textContent = `
      * { cursor: none !important; }

      .cursor-dot {
        position: fixed;
        top: 0; left: 0;
        width: 8px;
        height: 8px;
        background: #FF6B2B;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        will-change: transform;
        opacity: 0;
        transition: width .2s, height .2s, background .2s,
                    border-radius .2s, opacity .3s;
      }

      .cursor-trail {
        position: fixed;
        top: 0; left: 0;
        width: 32px;
        height: 32px;
        border: 2px solid rgba(255, 107, 43, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99998;
        will-change: transform;
        opacity: 0;
        transition: width .3s, height .3s, background .3s,
                    border-color .3s, opacity .3s;
      }

      body.cursor-hover .cursor-trail {
        width: 48px;
        height: 48px;
        background: rgba(255, 107, 43, 0.12);
        border-color: rgba(255, 107, 43, 0.85);
      }

      body.cursor-text .cursor-dot {
        width: 2px;
        height: 20px;
        border-radius: 1px;
      }

      @keyframes particleFade {
        0%   { opacity: 0.75; transform: translate(-50%, -50%); }
        100% { opacity: 0;    transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, -14px))); }
      }

      .cursor-particle {
        position: fixed;
        border-radius: 50%;
        background: #FF6B2B;
        pointer-events: none;
        z-index: 99997;
        animation: particleFade 600ms ease-out forwards;
      }

      @media (prefers-reduced-motion: reduce) {
        .cursor-particle { display: none; }
        .cursor-dot, .cursor-trail { transition: opacity .3s; }
      }
    `
    document.head.appendChild(style)

    // ── Elements ──────────────────────────────────────────────────────────────
    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    const trail = document.createElement('div')
    trail.className = 'cursor-trail'
    document.body.appendChild(dot)
    document.body.appendChild(trail)

    // ── State ─────────────────────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0
    let trailX = 0, trailY = 0
    let prevX = 0, prevY = 0
    let lastParticleTime = 0
    let rafId
    let entered = false

    // ── Mouse move ────────────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!entered) {
        // Snap trail to cursor on first entry so it doesn't sweep across screen
        trailX = mouseX
        trailY = mouseY
        entered = true
        dot.style.opacity = '1'
        trail.style.opacity = '1'
      }
    }

    // Hide elements when cursor leaves the viewport
    const onMouseLeave = () => {
      entered = false
      dot.style.opacity = '0'
      trail.style.opacity = '0'
    }
    const onMouseEnter = () => {
      if (entered) {
        dot.style.opacity = '1'
        trail.style.opacity = '1'
      }
    }

    // ── Hover state ───────────────────────────────────────────────────────────
    const onMouseOver = (e) => {
      if (e.target.closest('button, a, [role="button"], label, select, summary, .btn, .chip, .card')) {
        document.body.classList.add('cursor-hover')
        document.body.classList.remove('cursor-text')
      } else if (e.target.closest('input, textarea, [contenteditable]')) {
        document.body.classList.add('cursor-text')
        document.body.classList.remove('cursor-hover')
      } else {
        document.body.classList.remove('cursor-hover', 'cursor-text')
      }
    }

    // ── Particle ──────────────────────────────────────────────────────────────
    const spawnParticle = (x, y) => {
      const p = document.createElement('div')
      p.className = 'cursor-particle'
      const size = 3 + Math.random() * 3
      const dx = (Math.random() - 0.5) * 12
      const dy = -(10 + Math.random() * 12)
      p.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;--dx:${dx}px;--dy:${dy}px;`
      document.body.appendChild(p)
      p.addEventListener('animationend', () => p.remove(), { once: true })
    }

    // ── RAF loop ──────────────────────────────────────────────────────────────
    const animate = () => {
      // Lerp trail toward cursor
      trailX += (mouseX - trailX) * 0.12
      trailY += (mouseY - trailY) * 0.12

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`

      // Spawn particles on fast movement, throttled to every 30ms
      const vx = mouseX - prevX
      const vy = mouseY - prevY
      const velocity = Math.sqrt(vx * vx + vy * vy)
      const now = Date.now()
      if (entered && velocity > 5 && now - lastParticleTime > 30) {
        spawnParticle(mouseX, mouseY)
        lastParticleTime = now
      }

      prevX = mouseX
      prevY = mouseY
      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', onMouseOver)
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseover', onMouseOver)
      dot.remove()
      trail.remove()
      style.remove()
      document.body.classList.remove('cursor-hover', 'cursor-text')
    }
  }, [])

  return null
}
