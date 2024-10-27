import React, { useRef } from 'react'
import { Post, User, Vote } from "@prisma/client"
import Link from "next/link"
import { formatTimeToNow } from '@/lib/utils'
import { Dot, MessageSquare } from 'lucide-react'
import EditorOutput from './EditorOutput'
import PostVotesClient from './postVotes/PostVotesClient'



interface Props {
  subredditName: string
  post: Post & {
    author: User,
    votes: Vote[]
  }
  commentAmt: number
  currUserVote: "UP" | "DOWN" | undefined | null
  votesAmt: number
}


const Post = ({ subredditName, post, commentAmt, currUserVote, votesAmt }: Props) => {
  const pref = useRef<HTMLDivElement>(null)
  return (
    <div className=' rounded-lg bg-white shadow-md sm:px-4 py-2 flex items-center w-full'>
      <PostVotesClient postId={post.id} initialVoteAmt={votesAmt} initialVote={currUserVote} />
      <div className=' max-h-40 w-full'>
        <div className=' w-full flex gap-3 text-neutral-900/70 items-center justify-between md:justify-start  border-b border-neutral-500/20'>
          <Link href={`/r/${subredditName}`} className=' border-b border-b-zinc-200 text-neutral-800 text-sm sm:text-base'>r/{subredditName} </Link>
          <p className=' text-[0.7rem] '>Posted by u/ <span className=' text-neutral-500 font-medium text-sm'>  {post.author.name}</span> </p>
          <p className=' text-xs flex items-center'><Dot />{formatTimeToNow(new Date(post.createdAt))} </p>
        </div>
        <Link href={`/r/${subredditName}/post/${post.id}`} className=' font-medium text-lg w-full'>
          <div className=' pt-2 px-5 w-full'>
            {post.title}
          </div>
          <div className=' relative px-5 max-h-10 w-full overflow-clip' ref={pref}>
            <EditorOutput content={post.content} />
            {
              pref.current?.clientHeight === 160 ?
                <div className=' absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />
                :
                null
            }
          </div>
        </Link>
        <div className=' border-t border-neutral-500/20 w-full'>
          <Link href={`/r/${subredditName}/post/${post.id}`} className=' flex gap-1 items-center w-max text-sm sm:text-base'>
            <MessageSquare  className=' w-4 h-4 sm:w-5 sm:h-5'/> {commentAmt} comments
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Post