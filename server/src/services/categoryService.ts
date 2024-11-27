import { db } from '../db';
import { category } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category';

export class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(category).orderBy(category.name);
  } 

  async getCategoryById(id: number): Promise<Category | null> {
    const result = await db.select().from(category).where(eq(category.id, id));
    return result[0] || null;
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    const result = await db.insert(category)
      .values({
        name: categoryData.name,
        description: categoryData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();
    
    return result[0];
  }

  async updateCategory(id: number, categoryData: UpdateCategoryDto): Promise<Category> {
    const result = await db.update(category)
      .set({
        name: categoryData.name,
        description: categoryData.description,
        updatedAt: new Date().toISOString()
      })
      .where(eq(category.id, id))
      .returning();

    if (!result[0]) {
      throw new Error('Categoría no encontrada');
    }

    return result[0];
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await db.delete(category)
      .where(eq(category.id, id))
      .returning();
    
    if (!result[0]) {
      throw new Error('Categoría no encontrada');
    }
  }
} 