'use client'
import { useState, useEffect } from 'react'

function detectApp(ua) {
  if (/Instagram/i.test(ua))             return 'instagram'
  if (/FBAN|FBAV/i.test(ua))             return 'facebook'
  if (/BytedanceWebview|musical_ly|TikTok/i.test(ua)) return 'tiktok'
  if (/Snapchat/i.test(ua))              return 'snapchat'
  return null
}

function getInstruction(app, isIOS) {
  switch (app) {
    case 'instagram':
      return isIOS
        ? "Tap the three dots in the top right corner, then tap 'Open in Safari'"
        : "Tap the three dots in the top right corner, then tap 'Open in Chrome'"
    case 'facebook':
      return isIOS
        ? "Tap the three dots in the top right corner, then tap 'Open in Safari'"
        : "Tap the three dots in the top right corner, then tap 'Open in Chrome'"
    case 'tiktok':
      return isIOS
        ? "Tap the three dots in the top right corner, then tap 'Open in Safari'"
        : "Tap the three dots in the top right corner, then tap 'Open in external browser'"
    case 'snapchat':
      return "Tap the three dots and select 'Open in browser'"
    default:
      return isIOS
        ? "Tap the share icon and choose 'Open in Safari'"
        : "Tap the menu and choose 'Open in Chrome'"
  }
}

export default function InAppBanner() {
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [app, setApp] = useState(null)

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const detected = detectApp(ua)
    if (!detected) return
    setApp(detected)
    setIsIOS(/iPhone|iPad|iPod/i.test(ua))
    setShow(true)
  }, [])

  if (!show || !app) return null

  const targetBrowser = app === 'tiktok' && !isIOS ? 'an external browser' : isIOS ? 'Safari' : 'Chrome'

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 9999,
      background: '#1A1A2E', color: '#fff',
      padding: '12px 16px 12px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      borderBottom: '2px solid rgba(255,107,43,.5)',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#FF6B2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 4 }}>
          For the best experience — including microphone and camera access — open Orivox in {targetBrowser}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', lineHeight: 1.5 }}>
          {getInstruction(app, isIOS)}
        </div>
      </div>

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
