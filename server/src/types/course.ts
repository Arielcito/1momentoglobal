export interface Course {
  course_id: number;
  title: string;
  description: string;
  instructor_id: string;
  created_at: Date;
  category_id?: number;
  image_url: string;
  price: number;
  published_at?: Date;
  status: CourseStatus;
  updated_at: Date;
  level: CourseLevel;
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface CreateCourseDto {
  title: string;
  description: string;
  instructor_id: string;
  category_id?: number;
  image_url: string;
  price: number;
  level?: CourseLevel;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  category_id?: number;
  image_url?: string;
  price?: number;
  status?: CourseStatus;
  level?: CourseLevel;
} 