"use client"
import React from 'react'
import UserAvatar from './UserAvatar'
import { Session } from 'next-auth'
import { Input } from './ui/Input'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import { Image, Link } from 'lucide-react'

const MiniCreatePost = ({ session }: { session: Session | null }) => {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <div className=' w-full bg-white rounded-lg shadow-md p-4 lg:w-[40vw] md:w-[50vw]'>
            <div className=' relative pb-5'>
                <UserAvatar url={session?.user?.image} name={session?.user?.name} />
                <p className=' md:w-3 md:h-3 h-2 aspect-square absolute right-0 md:left-7 bottom-5 rounded-full border-2 border-white bg-green-500' />
            </div>
            <div className=' flex gap-2'>
                <Input onClick={() => router.push(pathname + "/submit")} readOnly placeholder='Create Post' />
                <Button variant={"ghost"} ><Image size={15} /> </Button>
                <Button variant={"ghost"}><Link size={15} /> </Button>
            </div>
        </div>
    )
}

export default MiniCreatePost