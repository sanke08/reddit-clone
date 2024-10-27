import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



export const PATCH = async (req: NextRequest) => {
    try {
        const session = await getAuthSession()
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { name } = UsernameValidator.parse(body)

        const username = await db.user.findFirst({
            where: {
                username: name,
            },
        })

        if (username) {
            return new Response('Username is taken', { status: 409 })
        }

        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                username: name,
            },
        })

        return NextResponse.json({ message: 'update successfully' })





    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.message }, { status: 400 })
        }
        return NextResponse.json({
            message:'Could not update username at this time. Please try later'
        },
            { status: 500 }
        )
    }
}