import { prisma } from "@/lib/prisma"
import type { Class, Prisma } from "@prisma/client"

export const ClassModel = {
  async getById(id: number): Promise<Class | null> {
    return prisma.class.findUnique({
      where: { class_id: id },
      include: {
        course: true,
      }
    })
  },

  async getByCourse(courseId: number): Promise<Class[]> {
    return prisma.class.findMany({
      where: { course_id: courseId },
    })
  },

  async create(data: Prisma.ClassCreateInput): Promise<Class> {
    return prisma.class.create({ data })
  },

  async update(id: number, data: Prisma.ClassUpdateInput): Promise<Class> {
    return prisma.class.update({
      where: { class_id: id },
      data
    })
  },

  async delete(id: number): Promise<Class> {
    return prisma.class.delete({
      where: { class_id: id }
    })
  }
} 