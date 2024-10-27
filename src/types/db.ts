
import { Post, Comment, User, Vote, Subreddit } from "@prisma/client"

export type ExtendedPost = Post & {
    subreddit:Subreddit,
    votes:Vote[],
    author:User,
    comments:Comment[]
}