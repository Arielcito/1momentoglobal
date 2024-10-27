import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

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

    // Crear el usuario y la cuenta en una transacción
    const result = await prisma.$transaction(async (prisma) => {
      // Crear el usuario
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

      // Crear la cuenta asociada
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: crypto.randomUUID(), // Generar un ID único
          // Campos opcionales que podrían ser útiles
          access_token: crypto.randomBytes(64).toString('hex'),
          expires_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 días
        },
      });

      // Crear una sesión inicial
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          sessionToken: crypto.randomBytes(32).toString('hex'),
        },
      });

      return { user, account, session };
    });

    return NextResponse.json({
      user: {
        name: result.user.name,
        email: result.user.email,
        username: result.user.username
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
