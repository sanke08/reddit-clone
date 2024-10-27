import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import React from 'react'
import Postcomment from './Postcomment'
import Createcomment from './Createcomment'



const CommentSection = async ({ postId }: { postId: string }) => {

    const session = await getAuthSession()
    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null
        },
        include: {
            votes: true,
            user: true,
            replies: {
                include: {
                    user: true,
                    votes: true,
                }
            }
        }
    })



    return (
        <div>
            
            <div className=' flex flex-col gap-y-5 mt-5'>
                {
                    comments.filter((comment) => !comment.replyToId).map((topLevelcomment) => {
                        const topLevelCommentVoteAmt = topLevelcomment.votes.reduce((acc, vote) => {
                            if (vote.type === "UP") return acc + 1
                            if (vote.type === "DOWN") return acc - 1
                            return acc
                        }, 0)
                        // @ts-ignore
                        const topLevelComentVoteType = topLevelcomment.votes.find((vote) => vote.userId === session?.user?.id)
                        return (
                            <div key={topLevelcomment.id}>
                                <Postcomment comment={topLevelcomment}
                                    initialVote={topLevelComentVoteType}
                                    initialVoteAmt={topLevelCommentVoteAmt}
                                    postId={postId} />

                                {
                                    topLevelcomment.replies.sort((a, b) => b.votes.length - a.votes.length).map((reply) => {
                                        const replyVoteAmt = reply.votes.reduce((acc, vote) => {
                                            if (vote.type === "UP") return acc + 1
                                            if (vote.type === "DOWN") return acc - 1
                                            return acc
                                        }, 0)
                                        // @ts-ignore
                                        const replyVoteType = reply.votes.find((vote) => vote.userId === session?.user?.id)
                                        
                                        return (
                                            <div key={reply.id} className=' ml-7 border-l-zinc-500/50 border-l-2 '>
                                                <Postcomment comment={reply}
                                                    initialVote={replyVoteType}
                                                    initialVoteAmt={replyVoteAmt}
                                                    postId={postId} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CommentSection