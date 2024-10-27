import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";
import { z } from "zod";


export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url)
        const session = await getAuthSession()
        let followedCommunitiesIds: string[] = []
        if (session?.user) {
            const followedCommuniies = await db.subscription.findMany({
                where: { userId: session.user.id },
                include: { subReddit: true }
            })
            followedCommunitiesIds = followedCommuniies.map((sub) => sub.subReddit.id)
        }

        const { limit, page, subredditName } = z.object({
            limit: z.string(),
            page: z.string(),
            subredditName: z.string().nullish().optional()
        }).parse({
            subredditName: url.searchParams.get("subredditName"),
            limit: url.searchParams.get("limit"),
            page: url.searchParams.get("page")
        })
        let whereClause = {}
        if (subredditName) {
            whereClause = {
                subreddit: {
                    name: subredditName
                }
            }
        } else if (session) {
            whereClause = {
                subreddit: {
                    id: { in: followedCommunitiesIds }
                }
            }
        }
        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc"
            },
            include: {
                subreddit: true,
                votes: true,
                author: true,
                comments: true
            },
            where: whereClause
        })

        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json({ message: 'Could not fetch posts' }, { status: 500 })

    }
}