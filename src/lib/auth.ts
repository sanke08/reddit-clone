import { NextAuthOptions, getServerSession } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"
import { nanoid } from "nanoid"

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async session({ session }) {
      const isExist = await db.user.findFirst({
        where: { email: session.user?.email }
      })
      if (isExist) {
        // @ts-ignore
        session.user.id = isExist.id
        // @ts-ignore
        session.user.name = isExist.name
        // @ts-ignore
        session.user.email = isExist.email
        // @ts-ignore
        session.user.image = isExist.image
        // @ts-ignore
        session.user.username = isExist.username
      }
      return session
    },
    async signIn({ profile }) {
      try {
        const isExist = await db.user.findFirst({
          where: { email: profile?.email }
        })
        if (!isExist) {
          await db.user.create({
            data: {
              email: profile?.email,
              name: profile?.name,
              // @ts-ignore
              image: profile?.picture,
              username: (profile?.name?.toLocaleLowerCase() + nanoid(10)).toString()
            }
          })
        }
        return true
      } catch (error) {
        return false
      }
    },
    redirect() {
      return "/"
    }
  }
}
export const getAuthSession = () => getServerSession(authOptions)