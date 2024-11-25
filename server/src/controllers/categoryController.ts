import type { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import type { CreateCategoryDto, UpdateCategoryDto } from '../types/category';

const categoryService = new CategoryService();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías', error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(Number.parseInt(id));
    
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la categoría', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData: CreateCategoryDto = req.body;
    const newCategory = await categoryService.createCategory(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría', error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryData: UpdateCategoryDto = req.body;
    const updatedCategory = await categoryService.updateCategory(Number.parseInt(id), categoryData);
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(Number.parseInt(id));
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría', error });
  }
}; 