'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from "@/hooks/use-toast"
import type { CreateCourseInput } from '@/types/course'
import type { CourseLevel } from '@/types/course'
import { PlusCircle } from 'lucide-react'
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreateCourse: (course: CreateCourseInput) => void
}

interface Category {
  id: number
  name: string
  description?: string
}

export const CreateCourseModal = ({ isOpen, onClose, onCreateCourse }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<CreateCourseInput>({
    title: '',
    description: '',
    price: 0,
    level: 'BEGINNER',
    category_id: null,
    is_published: false,
    thumbnail_url: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Error al cargar categorías')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las categorías"
        })
      }
    }

    fetchCategories()
  }, [toast])

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() })
      })

      if (!response.ok) throw new Error('Error al crear categoría')

      const newCategoryData = await response.json()
      setCategories(prev => [...prev, newCategoryData])
      setFormData(prev => ({ ...prev, category_id: newCategoryData.id }))
      setNewCategory('')
      setShowNewCategoryInput(false)
      
      toast({
        title: "Éxito",
        description: "Categoría creada exitosamente"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la categoría"
      })
    }
  }

  const handleCleanForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      level: 'BEGINNER',
      category_id: null,
      is_published: false,
      thumbnail_url: ''
    })
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.thumbnail_url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes subir una imagen de portada"
      });
      setIsLoading(false);
      return;
    }

    if (formData.title.length < 3) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El título debe tener al menos 3 caracteres"
      })
      setIsLoading(false)
      return
    }

    if (formData.description.length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La descripción debe tener al menos 10 caracteres"
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price)
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details?.[0]?.message || error.error || 'Error al crear el curso')
      }

      const newCourse = await response.json()
      onCreateCourse(newCourse)
      toast({
        title: "Éxito",
        description: "Curso creado exitosamente"
      })
      handleCleanForm()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al crear el curso'
      })
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    handleCleanForm()
    onClose()
  }

  const handleFileUploadComplete = (res: { url: string }[]) => {
    setFormData(prev => ({ ...prev, thumbnail_url: res[0].url }));
    toast({
      title: "Éxito",
      description: "Imagen subida exitosamente"
    });
  };

  const handleFileUploadError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "Error al subir la imagen"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Curso</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Nivel</Label>
            <Select
              value={formData.level}
              onValueChange={(value: typeof CourseLevel[keyof typeof CourseLevel]) => 
                setFormData(prev => ({ ...prev, level: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Principiante</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                <SelectItem value="ADVANCED">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            {!showNewCategoryInput ? (
              <Select
                value={formData.category_id?.toString() || ''}
                onValueChange={(value) => {
                  if (value === 'new') {
                    setShowNewCategoryInput(true)
                    return
                  }
                  setFormData(prev => ({ ...prev, category_id: Number(value) }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new" className="text-primary">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Crear nueva categoría</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nombre de la nueva categoría"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleCreateCategory}
                  disabled={!newCategory.trim()}
                >
                  Crear
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowNewCategoryInput(false)
                    setNewCategory('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Imagen de portada</Label>
            <div className="flex flex-col gap-4">
              {formData.thumbnail_url ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={formData.thumbnail_url}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                  >
                    Eliminar
                  </Button>
                </div>
              ) : (
                <UploadButton<OurFileRouter>
                  endpoint="thumbnailUploader"
                  onClientUploadComplete={handleFileUploadComplete}
                  onUploadError={handleFileUploadError}
                  className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Curso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 