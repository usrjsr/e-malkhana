import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "./db"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        await dbConnect()

        const user = await User.findOne({ username: credentials.username })
        if (!user) {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )
        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.officerId,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
}
