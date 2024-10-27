import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentValidator } from "@/lib/validators/comment"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const { text, postId, replyToId } = CommentValidator.parse(body)
        const session = await getAuthSession()
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        
        await db.comment.create({
            data: {
                postId,
                text,
                replyToId,
                author: session?.user?.id
            }
        })
        
        return NextResponse.json({ message: "created Successfully" }, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid data passed" }, { status: 422 })
        }
        return NextResponse.json({ message: "Could not ctreate comment" }, { status: 500 })
    }
}