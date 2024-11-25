import pool from '../config/database';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/category';

export class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    const result = await pool.query('SELECT * FROM "Category" ORDER BY name');
    return result.rows;
  }

  async getCategoryById(id: number): Promise<Category | null> {
    const result = await pool.query('SELECT * FROM "Category" WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    const { name, description } = categoryData;

    const result = await pool.query(
      `INSERT INTO "Category" (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description]
    );

    return result.rows[0];
  }

  async updateCategory(id: number, categoryData: UpdateCategoryDto): Promise<Category> {
    const { name, description } = categoryData;

    const result = await pool.query(
      `UPDATE "Category" 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [name, description, id]
    );

    if (!result.rows[0]) {
      throw new Error('Categoría no encontrada');
    }

    return result.rows[0];
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await pool.query('DELETE FROM "Category" WHERE id = $1 RETURNING *', [id]);
    
    if (!result.rows[0]) {
      throw new Error('Categoría no encontrada');
    }
  }
} 