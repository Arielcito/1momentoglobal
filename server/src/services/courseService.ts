import pool from '../config/database';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../types/course';

export class CourseService {
  async getAllCourses(): Promise<Course[]> {
    const result = await pool.query('SELECT * FROM "Course" ORDER BY created_at DESC');
    return result.rows;
  }

  async getCourseById(id: number): Promise<Course | null> {
    const result = await pool.query('SELECT * FROM "Course" WHERE course_id = $1', [id]);
    return result.rows[0] || null;
  }

  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    const result = await pool.query('SELECT * FROM "Course" WHERE instructor_id = $1', [instructorId]);
    return result.rows;
  }

  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    const { title, description, instructor_id, category_id, image_url, price, level } = courseData;
    
    const result = await pool.query(
      `INSERT INTO "Course" (
        title, description, instructor_id, category_id, image_url, price, level, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'DRAFT')
      RETURNING *`,
      [title, description, instructor_id, category_id, image_url, price, level]
    );

    return result.rows[0];
  }

  async updateCourse(id: number, courseData: UpdateCourseDto): Promise<Course> {
    const { title, description, category_id, image_url, price, status, level } = courseData;

    const result = await pool.query(
      `UPDATE "Course" 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           image_url = COALESCE($4, image_url),
           price = COALESCE($5, price),
           status = COALESCE($6, status),
           level = COALESCE($7, level),
           updated_at = CURRENT_TIMESTAMP
       WHERE course_id = $8
       RETURNING *`,
      [title, description, category_id, image_url, price, status, level, id]
    );

    if (!result.rows[0]) {
      throw new Error('Curso no encontrado');
    }

    return result.rows[0];
  }

  async deleteCourse(id: number): Promise<void> {
    const result = await pool.query('DELETE FROM "Course" WHERE course_id = $1 RETURNING *', [id]);
    
    if (!result.rows[0]) {
      throw new Error('Curso no encontrado');
    }
  }

  async publishCourse(id: number): Promise<Course> {
    const result = await pool.query(
      `UPDATE "Course" 
       SET status = 'PUBLISHED',
           published_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE course_id = $1
       RETURNING *`,
      [id]
    );

    if (!result.rows[0]) {
      throw new Error('Curso no encontrado');
    }

    return result.rows[0];
  }
} 