"use client"
import { ExtendedPost } from '@/types/db'
import React, { Suspense, useEffect, useRef } from 'react'
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from '@tanstack/react-query'
import { INFINITE_SCROLLING_PAGINATION } from '@/config'
import axios from 'axios'
import Post from './Post'
import { useSession } from 'next-auth/react'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'

interface Props {
    initialPost: ExtendedPost[],
    subredditName?: string
}

const PostFeed = ({ subredditName, initialPost }: Props) => {
    const { data: session } = useSession()
    const lastPost = useRef<HTMLElement>(null)


    const { ref, entry } = useIntersection({
        root: lastPost.current,
        threshold: 0
    })
    // @ts-ignore
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['infinite-scroll'],
        queryFn: async ({ pageParam = 1 }) => {
            const query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION}&page=${pageParam}` + (!!subredditName ? `?subredditName=${subredditName}` : "")
            const { data } = await axios.get(query)
            return data as ExtendedPost[]
        },
        getNextPageParam: (_lastPost, pages) => {
            return pages.length + 1
        },
        initialData: {
            pages: [initialPost], pageParams: [1]
        }
    })
    const posts = data?.pages.flatMap((page) => page)

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage()
        }
    }, [entry, fetchNextPage])

    return (
        <Suspense fallback={<MainSkeleton />} >
            <div className=' py-2'>
                <div className=' flex flex-col gap-2'>
                    {
                        posts && posts.map((post, index) => {
                            const votesAmt = post?.votes?.reduce((acc, vote) => {
                                if (vote.type === "UP") return acc + 1
                                if (vote.type === "DOWN") return acc - 1
                                return acc
                            }, 0)
                            const currUserVote = post.votes?.find((vote) => (
                                vote.userId === session?.user?.id
                            ))
                            {
                                if (posts.length - 1 === index) {
                                    return (
                                        <div ref={ref} key={post.id}>
                                            <Post commentAmt={post.comments.length} votesAmt={votesAmt} currUserVote={currUserVote?.type} subredditName={post.subreddit?.name} post={post} />
                                        </div>
                                    )
                                } else {
                                    return (
                                        <Post commentAmt={post.comments.length} votesAmt={votesAmt} currUserVote={currUserVote?.type} key={post.id} subredditName={post.subreddit?.name} post={post} />
                                    )
                                }
                            }
                        })
                    }
                </div>
            </div>
        </Suspense>
    )
}

export default PostFeed




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
                <ArrowBigUp />
                <Loader2 className=' animate-spin' />
                <ArrowBigDown />
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