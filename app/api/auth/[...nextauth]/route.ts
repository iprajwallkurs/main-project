import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        const userEmail = process.env.AUTH_USERNAME || process.env.AUTH_EMAIL
        const userPass = process.env.AUTH_PASSWORD
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (!userEmail || !userPass) return null
        if (email === userEmail && password === userPass) {
          return { id: "user-1", name: "Admin User", email }
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
