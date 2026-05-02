import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/react'

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
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
