import type { Request, Response } from 'express';
import { CourseService } from '../services/courseService';
import type { CreateCourseDto, UpdateCourseDto } from '../types/course';

const courseService = new CourseService();

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos', error });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(Number.parseInt(id));
    
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el curso', error });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const courseData: CreateCourseDto = req.body;
    const newCourse = await courseService.createCourse(courseData);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el curso', error });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const courseData: UpdateCourseDto = req.body;
    const updatedCourse = await courseService.updateCourse(Number.parseInt(id), courseData);
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el curso', error });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await courseService.deleteCourse(Number.parseInt(id));
    res.json({ message: 'Curso eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el curso', error });
  }
};

export const publishCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publishedCourse = await courseService.publishCourse(Number.parseInt(id));
    res.json(publishedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error al publicar el curso', error });
  }
};

export const getCoursesByInstructor = async (req: Request, res: Response) => {
  try {
    const { instructorId } = req.params;
    const courses = await courseService.getCoursesByInstructor(instructorId);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos del instructor', error });
  }
}; 