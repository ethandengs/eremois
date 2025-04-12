import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import GoogleAnalytics from './components/GoogleAnalytics'
import localFont from 'next/font/local'
import type { Metadata } from 'next'

const glacialIndifference = localFont({
  src: [
    {
      path: '../../public/fonts/GlacialIndifference-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GlacialIndifference-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-glacial',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'erēmois - Privacy-first Time Management',
  description: 'Privacy-first time management with Edge AI',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
    ],
  },
}

function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navigation />
      {children}
      <Footer />
    </AuthProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={glacialIndifference.variable}>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen font-glacial antialiased bg-[#111111] text-white">
        <RootContent>{children}</RootContent>
      </body>
    </html>
  )
}
