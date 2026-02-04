import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import * as Prisma from "@prisma/client"

// Prisma client: use a safe construction and ignore a potential typing mismatch
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const prisma = new (Prisma as any).PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Basic validation
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        // Look up the user in the database
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) {
          // Throwing an error will surface it to the client as the `error` property
          throw new Error("No account found for this email")
        }

        // Load bcrypt at runtime so the package can be added when ready
        let bcrypt: { compare: (a: string, b: string) => Promise<boolean> } | null = null
        try {
          // @ts-expect-error - optional dependency may not be installed during development
          const imported = await import("bcrypt")
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          bcrypt = (imported as any)?.default ?? imported
        } catch {
          throw new Error("Please install 'bcrypt' (npm i bcrypt) to enable password verification")
        }

        if (!bcrypt) {
          throw new Error("Please install 'bcrypt' (npm i bcrypt) to enable password verification")
        }

        // Compare hashed password
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Incorrect password")
        }

        // Successful sign-in: return the user object (id must be string)
        return { id: String(user.id), name: user.name ?? undefined, email: user.email }
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (session.user as any).id = (token as any).id
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
