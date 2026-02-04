import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

const prisma = new PrismaClient()

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) throw new Error("No account found for this email")

        const { compare } = await import("bcrypt")
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) throw new Error("Incorrect password")

        return { id: String(user.id), name: user.name ?? undefined, email: user.email }
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    verifyRequest: "/login",
    newUser: "/signup"
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        (session.user as any).id = String((user as any).id)
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
