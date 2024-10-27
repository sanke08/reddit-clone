import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession()
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        const body = await req.body
        const { subredditId } = SubredditSubscriptionValidator.parse(body)
        const subscriptionExist = await db.subscription.findFirst({
            where: {
                subredditId,
                // @ts-ignore
                userId: session.user.id
            }
        })
        if (subscriptionExist) {
            return NextResponse.json({ message: "You already subscribed to this subreddit" }, { status: 400 })
        }
        await db.subscription.create({
            data: {
                subredditId,
                // @ts-ignore
                userId: session.user.id
            }
        })
        return NextResponse.json({ subredditId })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.message }, { status: 422 })
        }
        return NextResponse.json({ message: "Could not subscribed" }, { status: 500 })

    }
}