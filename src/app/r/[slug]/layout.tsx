/* eslint-disable react/no-unescaped-entities */
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import { Button } from '@/components/ui/Button'
// import { INFINITE_SCROLLING_PAGINATION } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'

const layout = async ({ children, params }: { children: React.ReactNode, params: { slug: string } }) => {
    const { slug } = params
    const session = await getAuthSession()
    const name = slug.replace("%20", " ")
    const subReddit = await db.subreddit.findFirst({
        where: { name },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                }
            },
        },
    })
    if (!subReddit) {
        return (
            <div className=' py-10 mx-auto w-fit text-neutral-500/50 text-center'>
                Not found
                <p className=' text-neutral-900'>
                    "{name}"
                </p>
            </div>
        )
    }

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({
        where: {
            subredditId: subReddit?.id,
            user: { id: session.user.id }
        }
    })
    const isSubscribed = !!subscription
    const membercount = await db.subscription.count({
        where: {
            subredditId: subReddit?.id,

        }
    })
    return (
        <div className=' w-full flex flex-col md:flex-row sm:p-10 p-4 gap-5 justify-between h-full'>
            <div className=' h-full w-full'>
                {children}
            </div>
            <div className=' hidden md:block border-2 border-neutral-500/10 lg:w-1/2 xl:w-1/3 w-full p-5 rounded-lg h-full'>
                <p className=' py-2'>About</p>
                <div className=' w-full bg-white p-2 rounded-lg shadow-md space-y-2 px-5 h-full'>
                    <div className=' w-full flex justify-between items-center text-sm text-neutral-900/60'>
                        <p>Created</p>
                        <time dateTime={subReddit.createdAt.toDateString()} >
                            {format(subReddit.createdAt, 'MMMM dd, yyyy')}
                        </time>
                    </div>
                    <div className=' w-full flex justify-between items-center text-sm text-neutral-900/60'>
                        <p>Members</p>
                        <p>{membercount} </p>
                    </div>
                    {
                        subReddit.creatorId === session?.user?.id &&
                        <div>
                            <p className='text-neutral-900/60'>
                                You created this community
                            </p>
                        </div>
                    }
                    {
                        subReddit.creatorId !== session?.user?.id &&
                        <div className=' h-14'>
                            <SubscribeLeaveToggle subredditId={subReddit.id} subredditName={subReddit.name} isSubscribed={isSubscribed} />
                        </div>
                    }
                    <div>
                        <Link href={`/r/${slug}/submit`} className=' mt-5'>
                            <Button variant={"subtle"} className=' w-full'>Create Post</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default layout