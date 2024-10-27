"use client"
import React, { useRef, useState } from 'react'
import { Comment, CommentVote, User, VoteType } from "@prisma/client"
import { formatTimeToNow } from '@/lib/utils'
import UserAvatar from './UserAvatar'
import CommentVotes from './CommentVote'
import { Button } from './ui/Button'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import { useMutation } from '@tanstack/react-query'
import { CommentRequest } from '@/lib/validators/comment'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'


type ExtendedComment = Comment & {
    votes: CommentVote[],
    user: User
}

interface Props {
    comment: ExtendedComment
    initialVoteAmt: number
    initialVote: CommentVote | undefined
    postId: string
}

const Postcomment = ({ comment, initialVoteAmt, initialVote, postId }: Props) => {

    const commentRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { data: session } = useSession()
    const [isReplying, sestIsReplying] = useState<boolean>(false)
    const [input, setInput] = useState<string>("")

    const { mutate: Post, isPending } = useMutation({
        mutationFn: async ({ postId, replyToId, text }: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId
            }
            const { data } = await axios.patch("/api/subreddit/post/comment", payload)
            return data
        },
        onSuccess: () => {
            setInput("")
            sestIsReplying(false)
            router.refresh()
        },
        onError: () => {
            return toast({
                title: "something went wrong",
                description: "Comment not posted ,pease try again",
                variant: "destructive"
            })
        }
    })



    return (
        <div ref={commentRef} className=' bg-white rounded-lg p-2 shadow-md'>
            <div className=' flex'>
                <UserAvatar name={comment.user.name} url={comment.user.image} />
                <div className=' ml-2 flex items-center gap-x-2'>
                    <p className=' text-neutral-900/70'>
                        {comment.user.username}
                    </p>
                    <p className=' text-xs text-neutral-700/60'>
                        {formatTimeToNow(new Date(comment.createdAt))}
                    </p>
                </div>
            </div>
            <p className=' ml-3 text-neutral-900/70'>
                {comment.text}
            </p>
            <div className=' flex gap-1 items-center'>
                <CommentVotes commentId={comment.id} initialVoteAmt={initialVoteAmt} initialVote={initialVote} />
                <Button
                    onClick={() => {
                        if (!session?.user) return router.push("/sign-in")
                        sestIsReplying(true)
                    }}
                    variant={"ghost"} size={"xs"} className=' text-neutral-700/70'><MessageSquare className=' h-4 w-4' /> Reply
                </Button>
            </div>
            {
                isReplying ?
                    <div>
                        <Label htmlFor='comment' >Your comment</Label>
                        <div className=' mt-2 px-10'>
                            <Textarea value={input} onChange={(e) => setInput(e.target.value)} id='comment' className=' bg-white' placeholder='What are your Thought' rows={1} />
                        </div>
                        <div className=' mt-2 flex justify-end gap-4'>
                            <Button onClick={() => { sestIsReplying(false) }} variant={"ghost"} >Cancle</Button>
                            <Button onClick={() => {
                                if (!session?.user) return
                                Post({ text: input, postId, replyToId: comment.replyToId ?? comment.id })
                            }}
                                disabled={input.length === 0} isLoading={isPending}  >post</Button>
                        </div>
                    </div>
                    : null
            }
        </div>
    )
}

export default Postcomment