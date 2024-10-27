import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const classes = await prisma.class.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              user: {
                email: session.user.email
              }
            }
          }
        }
      },
      include: {
        course: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        scheduled_at: 'desc'
      }
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error("[CLASSES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
