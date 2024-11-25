export interface Class {
  class_id: number;
  course_id: number;
  title: string;
  description: string;
  scheduled_at?: Date;
  is_live: boolean;
  recording_url?: string;
  content?: string;
  created_at: Date;
  duration?: number;
  order: number;
  published_at?: Date;
  status: ClassStatus;
  updated_at: Date;
}

export enum ClassStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface CreateClassDto {
  course_id: number;
  title: string;
  description: string;
  scheduled_at?: Date;
  is_live?: boolean;
  recording_url?: string;
  content?: string;
  duration?: number;
  order: number;
}

export interface UpdateClassDto {
  title?: string;
  description?: string;
  scheduled_at?: Date;
  is_live?: boolean;
  recording_url?: string;
  content?: string;
  duration?: number;
  order?: number;
  status?: ClassStatus;
} 