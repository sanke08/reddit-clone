import CommentSection from '@/components/CommentSection'
import CommentVotes from '@/components/CommentVote'
import Createcomment from '@/components/Createcomment'
import EditorOutput from '@/components/EditorOutput'
import PostVotesClient from '@/components/postVotes/PostVotesClient'
import { Button } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Dot, Loader2, MessageSquare } from 'lucide-react'
import React, { Suspense } from 'react'

interface Props {
    params: {
        postId: string
    }
}
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

const page = async ({ params }: Props) => {
    const session = await getAuthSession()
    const post: (Post & { votes: Vote[]; author: User }) | null = await db.post.findUnique({
        where: {
            id: params.postId
        },
        include: {
            author: true,
            votes: true,
        }
    })

    if (!post) {
        return (
            <div className=' w-max mx-auto text-neutral-700/50'>
                Post Not Found
            </div>
        )
    }
    const postVoteamt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1
        if (vote.type === "DOWN") return acc - 1
        return acc
    }, 0)
    // @ts-ignore
    const currVoteType = post.votes.find((vote) => vote.userId === session?.user?.id)?.type

    

    return (
        <>
            <div className=' flex gap-3 items-start bg-white sm:p-3 rounded-lg shadow-md'>
                <Suspense fallback={<Loader2 />} >
                    <PostVotesClient initialVoteAmt={postVoteamt} postId={post.id} initialVote={currVoteType} />
                    <div className=' w-full'>
                        <div className=' flex items-center border-b border-neutral-500/30 text-xs sm:text-base'>
                            <p className=' flex items-center text-neutral-600/70'>Posted by <span>{post.author.username} </span><Dot /></p>
                            {formatTimeToNow(new Date(post.createdAt))}
                        </div>
                        <div>
                            {post.title}
                        </div>
                        <EditorOutput content={post.content} />
                    </div>
                </Suspense>
            </div>
            <Createcomment postId={post.id} />
            <div>
                <Suspense fallback={<MainSkeleton />} >
                    <CommentSection postId={post.id} />
                    {/* <Skeleton /> */}
                </Suspense>
            </div>
        </>
    )
}

export default page


const MainSkeleton=()=>{
    return (
        <>
        <Skeleton/>
        <Skeleton/>
        <Skeleton/>
        <Skeleton/>
        </>
    )
}


const Skeleton = () => {
    return (
        <div className=' flex'>
            {/* <div className=' flex flex-col items-center'>
                <Button variant={"unstyle"}>
                    <ArrowBigUp />
                </Button>
                <Loader2 className=' animate-spin' />
                <Button variant={"unstyle"}>
                    <ArrowBigDown />
                </Button>
            </div> */}
            <div className=' w-full h-60  bg-white  rounded-lg overflow-hidden'>
                <div className=' flex items-center border-b border-neutral-500/30 text-xs sm:text-base w-full'>
                    <p className=' flex items-center text-neutral-600/70'>Posted by <span className=' w-40 bg-black/20 h-5 animate-pulse rounded-lg ml-2'> </span><Dot /></p>
                    <p className=' h-5 w-14 rounded-md animate-pulse bg-black/20' />
                </div>
                <div className=' w-full h-[70%] animate-pulse bg-black/20 mt-2' />
                <div className=' flex gap-1 items-center h-[20%]'>
                    <div className=' flex items-center'>
                        <Button variant={"unstyle"}>
                            <ArrowBigUp /> </Button>

                <Loader2 className=' animate-spin' />
                        <Button variant={"unstyle"}>
                            <ArrowBigDown />
                        </Button>
                    </div>
                    <Button
                        variant={"ghost"} size={"xs"} className=' text-neutral-700/70'><MessageSquare className=' h-4 w-4' /> Reply
                    </Button>
                </div>
            </div>
        </div>
    )
}