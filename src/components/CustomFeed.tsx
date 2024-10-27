import { INFINITE_SCROLLING_PAGINATION } from '@/config'
import { db } from '@/lib/db'
import React, { Suspense } from 'react'
import PostFeed from './PostFeed'
import { getAuthSession } from '@/lib/auth'
import { Button } from './ui/Button'
import { ArrowBigDown, ArrowBigUp, Dot, Loader2, MessageSquare } from 'lucide-react'

const CustomFeed = async () => {
    const session = await getAuthSession()


    const followedcommunities = await db.subscription.findMany({
        where: {
            userId: session?.user?.id
        },
        include: {
            subReddit: true
        }
    })

    const posts = await db.post.findMany({
        where: {
            subreddit: {
                name: {
                    in: followedcommunities.map((item) => item.subReddit.id)
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            votes: true,
            comments: true,
            author: true,
            subreddit: true
        },
        take: INFINITE_SCROLLING_PAGINATION
    })



    return (
            <PostFeed initialPost={posts} />
    )
}

export default CustomFeed



const MainSkeleton = () => {
    return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    )
}


const Skeleton = () => {
    return (
        <div className=' flex'>
            <div className=' flex flex-col items-center'>
                <Button variant={"unstyle"}>
                    <ArrowBigUp />
                </Button>
                <Loader2 className=' animate-spin' />
                <Button variant={"unstyle"}>
                    <ArrowBigDown />
                </Button>
            </div>
            <div className=' w-full h-60  bg-white  rounded-lg overflow-hidden'>
                <div className=' flex items-center border-b border-neutral-500/30 text-xs sm:text-base w-full'>
                    <p className=' flex items-center text-neutral-600/70'>Posted by <span className=' w-40 bg-black/20 h-5 animate-pulse rounded-lg ml-2'> </span><Dot /></p>
                    <p className=' h-5 w-14 rounded-md animate-pulse bg-black/20' />
                </div>
                <div className=' w-full h-[70%] animate-pulse bg-black/20 mt-2' />

            </div>
        </div>
    )
}