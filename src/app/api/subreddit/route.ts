import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { db } from "@/lib/db";
import { z } from "zod";

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuthSession()
        if (!session?.user) return NextResponse.json({ message: "Unautharized" }, { status: 401 })
        const body = await req.json()
        const { name } = SubredditValidator.parse(body)
        const subredditExist = await db.subreddit.findFirst({
            where: {
                name
            }
        })
        if (subredditExist) {
            return NextResponse.json({ message: "Subreddit already exist" }, { status: 409 })
        }
        const subReddit = await db.subreddit.create({
            data: {
                name,
                // @ts-ignore
                creatorId: session.user?.id
            }
        })
        await db.subscription.create({
            data: {
                // @ts-ignore
                userId: session.user.id,
                subredditId: subReddit.id
            }
        })
        return NextResponse.json({ name: subReddit.name }, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.message }, { status: 422 })
        }
        return NextResponse.json({ message: "Could not create Subreddit" }, { status: 500 })
    }
}