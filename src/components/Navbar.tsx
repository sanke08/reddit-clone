import React from 'react'
import { Button, buttonVariants } from './ui/Button'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { getServerSession } from 'next-auth'
import UserAccountNav from './UserAccountNav'
import { getAuthSession } from '@/lib/auth'
import SearchBar from './SearchBar'


const Navbar = async () => {
    // @ts-ignore
    const session = await getAuthSession()
    return (
        <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10]'>
            <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
                <Link href={"/"} className=' sm:p-5 p-2'>
                    <Home />
                </Link>
                <SearchBar />
                {
                    !session?.user ?
                        <Link href={"/sign-in"} className={twMerge(' p-5')}>
                            <Button>
                                Sign In
                            </Button>
                        </Link>

                        : <UserAccountNav user={session.user} />
                }
            </div>
        </div>
    )
}

export default Navbar