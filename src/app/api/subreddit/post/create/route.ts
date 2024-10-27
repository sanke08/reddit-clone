import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession()
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        const body =await  req.json()
        const { subredditId, title, content } = PostValidator.parse(body)
  
        const subscriptionExist = await db.subscription.findFirst({
            where: {
                subredditId,
                // @ts-ignore
                userId: session.user.id
            }
        })
        if (!subscriptionExist) {
            return NextResponse.json({ message: "Subscribe to post" }, { status: 400 })
        }
        await db.post.create({
            data: {
                title, subredditId, content, authorId: session.user.id
            }
        })
        return NextResponse.json({ message:"Created successfully" })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid PoST req data passed" }, { status: 422 })
        }
        return NextResponse.json({ message: "Could not subscribed" }, { status: 500 })
    }
}