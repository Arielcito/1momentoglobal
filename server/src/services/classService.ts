import pool from '../config/database';
import type { Class, CreateClassDto, UpdateClassDto } from '../types/class';

export class ClassService {
  async getAllClassesByCourse(courseId: number): Promise<Class[]> {
    const result = await pool.query(
      'SELECT * FROM "Class" WHERE course_id = $1 ORDER BY order',
      [courseId]
    );
    return result.rows;
  }

  async getClassById(id: number): Promise<Class | null> {
    const result = await pool.query('SELECT * FROM "Class" WHERE class_id = $1', [id]);
    return result.rows[0] || null;
  }

  async createClass(classData: CreateClassDto): Promise<Class> {
    const {
      course_id,
      title,
      description,
      scheduled_at,
      is_live,
      recording_url,
      content,
      duration,
      order
    } = classData;

    const result = await pool.query(
      `INSERT INTO "Class" (
        course_id, title, description, scheduled_at, is_live,
        recording_url, content, duration, order, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'DRAFT')
      RETURNING *`,
      [course_id, title, description, scheduled_at, is_live, recording_url, content, duration, order]
    );

    return result.rows[0];
  }

  async updateClass(id: number, classData: UpdateClassDto): Promise<Class> {
    const {
      title,
      description,
      scheduled_at,
      is_live,
      recording_url,
      content,
      duration,
      order,
      status
    } = classData;

    const result = await pool.query(
      `UPDATE "Class" 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           scheduled_at = COALESCE($3, scheduled_at),
           is_live = COALESCE($4, is_live),
           recording_url = COALESCE($5, recording_url),
           content = COALESCE($6, content),
           duration = COALESCE($7, duration),
           order = COALESCE($8, order),
           status = COALESCE($9, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE class_id = $10
       RETURNING *`,
      [title, description, scheduled_at, is_live, recording_url, content, duration, order, status, id]
    );

    if (!result.rows[0]) {
      throw new Error('Clase no encontrada');
    }

    return result.rows[0];
  }

  async deleteClass(id: number): Promise<void> {
    const result = await pool.query('DELETE FROM "Class" WHERE class_id = $1 RETURNING *', [id]);
    
    if (!result.rows[0]) {
      throw new Error('Clase no encontrada');
    }
  }

  async publishClass(id: number): Promise<Class> {
    const result = await pool.query(
      `UPDATE "Class" 
       SET status = 'PUBLISHED',
           published_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE class_id = $1
       RETURNING *`,
      [id]
    );

    if (!result.rows[0]) {
      throw new Error('Clase no encontrada');
    }

    return result.rows[0];
  }
} 