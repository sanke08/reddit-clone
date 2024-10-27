/* eslint-disable react/no-unescaped-entities */
import MiniCreatePost from '@/components/MiniCreatePost'
import PostFeed from '@/components/PostFeed'
import { INFINITE_SCROLLING_PAGINATION } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'

interface Props {
    params: {
        slug: string
    }
}


const page = async ({ params }: Props) => {
    const session = await getAuthSession()
    const { slug } = params
    const name = slug.replace("%20", " ")
    const subReddit = await db.subreddit.findFirst({
        where: { name },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true
                },
                orderBy:{
                    createdAt:"desc"
                }
            },
            
        },
        take: INFINITE_SCROLLING_PAGINATION

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
    return (
        <div className=' w-full h-full'>
            <p className=' font-bold text-lg py-2'>
                {subReddit?.name}
            </p>
            <MiniCreatePost session={session} />
            <PostFeed initialPost={subReddit.posts} subredditName={subReddit.name}/>
            {/*  */}
        </div>
    )
}

export default page