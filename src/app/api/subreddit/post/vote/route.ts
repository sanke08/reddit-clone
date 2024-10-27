import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostVoteValidator } from "@/lib/validators/vote";
// import { CachedPost } from "@/types/redis";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



const CASHED_AFTER_UPVOTES = 1

export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { postId, voteType } = PostVoteValidator.parse(body)
        const session = await getAuthSession()
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorizes" }, { status: 401 })
        }
        const existVote = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId: postId
            }
        })
        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            include: {
                author: true,
                votes: true
            }
        })
        if (!post) {
            return NextResponse.json({ message: "Post Not Found" }, { status: 404 })
        }
        if (existVote) {
            if (existVote.type === voteType) {
                await db.vote.delete({
                    where: {
                        userId_postId: {
                            postId,
                            userId: session.user.id
                        }
                    }
                })
                return NextResponse.json({ message: "ok" }, { status: 200 })
            }
            await db.vote.update({
                where: {
                    userId_postId: {
                        postId,
                        userId: session.user.id
                    }
                },
                data: {
                    type: voteType
                }
            })
            return NextResponse.json({ message: "ok" }, { status: 200 })
        }
        await db.vote.create({
            data: {
                userId: session.user.id,
                postId,
                type: voteType
            }
        })
        return NextResponse.json({ message: "ok" }, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid Post req passesd" }, { status: 422 })
        }
        return NextResponse.json({ message: "could not register your vote ,please try again" }, { status: 500 })
    }
}