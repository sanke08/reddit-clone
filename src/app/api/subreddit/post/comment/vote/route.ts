import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator, PostVoteValidator } from "@/lib/validators/vote";
// import { CachedPost } from "@/types/redis";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { commentId, voteType } = CommentVoteValidator.parse(body)
        const session = await getAuthSession()
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorizes" }, { status: 401 })
        }
        const existVote = await db.commentVote.findFirst({
            where: {
                commentId,
                userId: session.user.id,
            }
        })
        if (existVote) {
            if (existVote.type === voteType) {
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    }
                })
                return NextResponse.json({ message: "ok" }, { status: 200 })
            } else {
                await db.commentVote.update({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    },
                    data: {
                        type: voteType
                    }
                })
                return NextResponse.json({ message: "ok" }, { status: 200 })
            }
        }
        await db.commentVote.create({
            data: {
                userId: session.user.id,
                commentId,
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