import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/react'
import CursorEffect from '../components/CursorEffect'

export const metadata = {
  title: 'Orivox - AI Speaking Coach',
  description: 'Practice speaking and get AI feedback',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <CursorEffect />
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <footer style={{textAlign:'center',padding:'14px 24px',fontSize:12,color:'#8A7E74',fontFamily:'Nunito,sans-serif'}}>
          By using Orivox you agree to our{' '}
          <a href="/about#terms" style={{color:'#8A7E74',textDecoration:'underline',textDecorationColor:'#C4B8AF'}}>Terms &amp; Privacy</a>
        </footer>
      </body>
    </html>
  )
}
