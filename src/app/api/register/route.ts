import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, username } = body;

    if (!name || !email || !password || !username) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const exist = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      },
    });

    if (exist) {
      return new NextResponse(
        exist.email === email ? "Email already exists" : "Username already exists", 
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        stream: {
          create: {
            name: `${name}'s stream`,
          }
        }
      },
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      "Internal Error", 
      { status: 500 }
    );
  }
}
