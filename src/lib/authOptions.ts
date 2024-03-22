import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { env } from "./env";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
  providers: [
    CredentialsProvider({
        name:'Email',
        credentials:{
            email:{label:"Email",type: "text", placeholder: "j.smith@email.com"},
            password: {  label: "Password", type: "password", placeholder:"*******" }
        },
        async authorize(credentials) {
          if(!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where:{
              email:credentials.email
            }
          });

          if(!user) {
            return null;
          }

          if(user && user.password) {
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);

            if(!passwordMatch) {
              return null
            }
          }
          return user;
        }

    }),

    GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session:{
    strategy:'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.id = user.id
      }
      
      return token;
    },
    async session({ session, user, token }) {
        session.user.email = token.email;
        session.user.id = token.id as string;

      return session;
    },
    
  },

  events: {
    async signIn({ user }) {
      await mergeAnonymousCartIntoUserCart(user.id);
    },
  },
};
