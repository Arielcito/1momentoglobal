import type { Request, Response } from 'express';
import { ClassService } from '../services/classService';
import type { CreateClassDto, UpdateClassDto } from '../types/class';

const classService = new ClassService();

export const getClassesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const classes = await classService.getAllClassesByCourse(Number.parseInt(courseId));
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las clases', error });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classItem = await classService.getClassById(Number.parseInt(id));
    
    if (!classItem) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }
    
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la clase', error });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const classData: CreateClassDto = req.body;
    const newClass = await classService.createClass(classData);
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la clase', error });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classData: UpdateClassDto = req.body;
    const updatedClass = await classService.updateClass(Number.parseInt(id), classData);
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la clase', error });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await classService.deleteClass(Number.parseInt(id));
    res.json({ message: 'Clase eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la clase', error });
  }
};

export const publishClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publishedClass = await classService.publishClass(Number.parseInt(id));
    res.json(publishedClass);
  } catch (error) {
    res.status(500).json({ message: 'Error al publicar la clase', error });
  }
}; 