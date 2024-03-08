import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/db/prisma";
import { env } from "process";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async session({session, user}) {
            session.user.id = user.id
            return session;
        }
    },
    events: {
        async signIn({user}) {
            await mergeAnonymousCartIntoUserCart(user.id);

        }
    }
}
