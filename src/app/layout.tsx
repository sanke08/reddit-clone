import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toaster'
import QueryProvider from '@/components/providers/QueryClientProvider'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className=' text-slate-900 light bg-white'>
      <body className=' min-h-screen pt-16 bg-slate-100 antialiased'>
        <QueryProvider>
          <Navbar />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
