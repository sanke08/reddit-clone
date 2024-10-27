"use client"

import React, { useState } from 'react'
import { Button } from './ui/Button'
import { User } from 'lucide-react'
import Link from 'next/link'
import { signIn } from "next-auth/react"
import { useToast } from '@/hooks/use-toast'
// import {} from "lucide-react"



const SignIn = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const handleLogin = async () => {
        setLoading(true)
        try {
            await signIn("google")
        } catch (error) {
            toast({ title: "There was a problem", description: "There was a error logging in with Google", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className=' m-5'>
                <Button variant={"ghost"}>Home</Button>
            </div>
            <div className=' h-[70vh] w-full flex flex-col justify-center items-center text-center'>
                <div>
                    <User size={30} />
                </div>
                <h1 className=' font-bold text-xl my-1'>Welcome back</h1>
                <div className=' w-1/3 mb-1'>
                    By continuing, you are setting up a Breadit account and agree to our
                    User Agreement and Privacy Policy.
                </div>
                <Button onClick={handleLogin} isLoading={loading} className=' w-1/3'> Google</Button>
                <div className=' mt-2'>
                    New to Breaddit?{' '}
                    <Link
                        href='/sign-up'
                        className='hover:text-zinc-800 text-sm underline underline-offset-4 text-indigo-500'>
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignIn