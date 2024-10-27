"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient} >
            <SessionProvider>
                {children}
            </SessionProvider>
        </QueryClientProvider>
    )
}

export default QueryProvider