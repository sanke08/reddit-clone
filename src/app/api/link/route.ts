import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
        const url = new URL(req.url)
        const href = url.searchParams.get("url")
        if (!href) {
            return NextResponse.json({ message: "Invalid Href" }, { status: 400 })
        }
        const { data } = await axios.get(href)
        const titleMatch = data.match(/<title>(.*?)<\/title>/)
        const title = titleMatch ? titleMatch[1] : ''
        const descriptionMatch = data.match(
            /<meta name="description" content="(.*?)"/
        )
        const description = descriptionMatch ? descriptionMatch[1] : ''
        const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/)
        const imageUrl = imageMatch ? imageMatch[1] : ''
        return new Response(
            JSON.stringify({
                success: 1,
                meta: {
                    title,
                    description,
                    image: {
                        url: imageUrl,
                    },
                },
            })
        )

}