import { Vote } from "prisma/prisma-client"
export type CachedPost = {
    id: string
    title: string
    authorUserName: string
    content: string
    currvote: Vote | null
    createdAt: Date
}