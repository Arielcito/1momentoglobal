import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      is_admin: boolean
      username: string
    } & DefaultSession["user"]
  }

  interface User {
    is_admin: boolean
    username: string
  }
}
