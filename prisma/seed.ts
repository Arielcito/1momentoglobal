import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First create a test user if it doesn't exist
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      username: 'testuser',
      is_admin: true,
    },
  })

  // Create a test course
  const course = await prisma.course.create({
    data: {
      title: 'Curso de Trading Avanzado',
      description: 'Aprende estrategias avanzadas de trading',
      instructor_id: user.id,
    },
  })

  // Create 5 example classes
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        course_id: course.course_id,
        title: 'Introducción al Análisis Técnico',
        description: 'Fundamentos básicos del análisis técnico en trading',
        scheduled_at: new Date('2024-03-15T10:00:00Z'),
        is_live: false,
        recording_url: 'https://example.com/recording1.mp4',
      },
    }),
    prisma.class.create({
      data: {
        course_id: course.course_id,
        title: 'Patrones de Velas Japonesas',
        description: 'Identificación y uso de patrones de velas japonesas',
        scheduled_at: new Date('2024-03-16T10:00:00Z'),
        is_live: false,
        recording_url: 'https://example.com/recording2.mp4',
      },
    }),
    prisma.class.create({
      data: {
        course_id: course.course_id,
        title: 'Estrategias de Trading Intradiario',
        description: 'Técnicas efectivas para el trading intradiario',
        scheduled_at: new Date('2024-03-17T10:00:00Z'),
        is_live: false,
        recording_url: 'https://example.com/recording3.mp4',
      },
    }),
    prisma.class.create({
      data: {
        course_id: course.course_id,
        title: 'Gestión del Riesgo',
        description: 'Principios fundamentales de la gestión del riesgo',
        scheduled_at: new Date('2024-03-18T10:00:00Z'),
        is_live: true,
        recording_url: null,
      },
    }),
    prisma.class.create({
      data: {
        course_id: course.course_id,
        title: 'Psicología del Trading',
        description: 'Aspectos psicológicos y emocionales del trading',
        scheduled_at: new Date('2024-03-19T10:00:00Z'),
        is_live: false,
        recording_url: 'https://example.com/recording5.mp4',
      },
    }),
  ])

  console.log({ user, course, classes })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 