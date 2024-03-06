import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db/prisma";

import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import { env } from "process";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!
        })
    ]
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}