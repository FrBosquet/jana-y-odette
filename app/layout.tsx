import { Dancing_Script, Forum, Noto_Serif, WindSong } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'
import { esES } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import NextTopLoader from 'nextjs-toploader'

export const metadata = {
  title: 'Jana Y Odette',
  description: 'Invitación a la boda de Jana y Odette'
}

const serif = Forum({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif'
})

const script = WindSong({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-script'
})

const dancingScript = Dancing_Script({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script'
})

const noto = Noto_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans'
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="en">
        <body className={`dark min-h-s-screen antialiased ${noto.className} ${script.variable} ${serif.variable} ${dancingScript.variable} ${noto.variable} bg-slate-800`}>
          <NextTopLoader />
          <Toaster richColors />

          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
