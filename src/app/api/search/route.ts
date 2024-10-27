import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
    const url = new URL(req.url)
    const q = url.searchParams.get("q")
    if (!q) return NextResponse.json({ message: "Invalid query" }, { status: 400 })
    const results = await db.subreddit.findMany({
        where: {
            name: {
                startsWith: "new"
            }
        },
        include: {
            _count: true
        },
        take: 5
    })
    return NextResponse.json(results)

}