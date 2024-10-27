/* eslint-disable react/no-unescaped-entities */
import Editor from '@/components/Editor'
import { INFINITE_SCROLLING_PAGINATION } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import React from 'react'




interface Props {
    params: {
        slug: string
    }
}



const page = async ({ params }: Props) => {

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
        <div className=' md:w-full lg:w-1/2'>
            <div>
                <p className=' font-medium'>Create Post <span className=' text-xs text-neutral-500/70'>in {name}  </span> </p>
            </div>
            <div className=' py-5'>
                <Editor subredditId={subReddit.id} />

            </div>

        </div>
    )
}

export default page