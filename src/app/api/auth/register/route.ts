import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !name || !password) {
        return new NextResponse("Missing email, username or password", {
          status: 400,
        });
      }
    
      const exist = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    
      if (exist) {
        return new NextResponse("User already exists", { status: 400 });
      }
    
      const hashedPassword = await bcrypt.hash(password, 10);
    
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
