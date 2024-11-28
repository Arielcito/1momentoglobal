import { db } from '../db';
import {  classes } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { Class, CreateClassDto, UpdateClassDto } from '../types/class';

export class ClassService {
  async getAllClassesByCourse(courseId: number): Promise<Class[]> {
    return await db.select()
      .from(classes)
      .where(eq(classes.courseId, courseId))
      .orderBy(classes.order)
  }

  async getClassById(id: number): Promise<Class | null> {
    const result = await db.select()
      .from(classes)
      .where(eq(classes.classId, id));
    return result[0] || null;
  }

  async createClass(classData: CreateClassDto): Promise<Class> {
    const result = await db.insert(classes)
      .values({
        courseId: classData.courseId,
        title: classData.title,
        description: classData.description,
        scheduledAt: classData.scheduledAt,
        isLive: classData.isLive,
        recordingUrl: classData.recordingUrl,
        content: classData.content,
        duration: classData.duration,
        order: classData.order,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return result[0];
  }

  async updateClass(id: number, classData: UpdateClassDto): Promise<Class> {
    const result = await db.update(classes)
      .set({
        ...classData,
        updatedAt: new Date().toISOString()
      })
      .where(eq(classes.classId, id))
      .returning();

    if (!result[0]) {
      throw new Error('Clase no encontrada');
    }

    return result[0];
  }

  async deleteClass(id: number): Promise<void> {
    const result = await db.delete(classes)
      .where(eq(classes.classId, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Clase no encontrada');
    }
  }

  async publishClass(id: number): Promise<Class> {
    const result = await db.update(classes)
      .set({
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(classes.classId, id))
      .returning();

    if (!result[0]) {
      throw new Error('Clase no encontrada');
    }

    return result[0];
  }
} 