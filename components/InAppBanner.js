'use client'
import { useState, useEffect } from 'react'

export default function InAppBanner() {
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const inApp = /Instagram|FBAN|FBAV|FB_IAB|BytedanceWebview|musical_ly|Snapchat/i.test(ua)
    if (!inApp) return
    setIsIOS(/iPhone|iPad|iPod/i.test(ua))
    setShow(true)
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 9999,
      background: '#1A1A2E', color: '#fff',
      padding: '12px 16px 12px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      borderBottom: '2px solid rgba(255,107,43,.5)',
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#FF6B2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 4 }}>
          For the best experience — including microphone and camera access — open Orivox in{' '}
          {isIOS ? 'Safari' : 'Chrome'}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', lineHeight: 1.5 }}>
          {isIOS
            ? "Tap the three dots in the bottom right corner of your screen, then tap ‘Open in Safari’"
            : "Tap the three dots in the top right corner of your screen, then tap ‘Open in Chrome’"}
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setShow(false)}
        style={{
          background: 'none', border: '1px solid rgba(255,255,255,.25)',
          borderRadius: 6, color: 'rgba(255,255,255,.7)',
          width: 28, height: 28, cursor: 'pointer',
          fontSize: 16, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}
        aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}
