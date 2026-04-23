import { Providers } from './providers'

export const metadata = {
  title: 'Orivox - AI Speaking Coach',
  description: 'Practice speaking and get AI feedback',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
