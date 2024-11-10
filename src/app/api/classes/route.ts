import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ClassModel } from "@/models/class"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const classes = await ClassModel.findMany({
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    
    const newClass = await ClassModel.create({
      title: data.title,
      description: data.description,
      content: data.content,
      duration: data.duration,
      order: data.order,
      course: {
        connect: {
          course_id: data.courseId
        }
      },
      status: data.status,
      recording_url: data.videoUrl,
      is_live: data.isLive,
      scheduled_at: data.scheduledAt ? new Date(data.scheduledAt) : null,
    });

    return NextResponse.json(newClass);
  } catch (error) {
    console.error("Error al crear la clase:", error);
    return NextResponse.json(
      { error: "Error al crear la clase" },
      { status: 500 }
    );
  }
}
