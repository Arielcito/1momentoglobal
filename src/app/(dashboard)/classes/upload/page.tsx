'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Video, PlusCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_COURSES } from "@/data/courses"
import { ClassStatus } from "@prisma/client"
import { CreateCourseModal } from '@/components/CreateCourseModal'

interface UploadClassForm {
  title: string
  description: string
  content?: string
  duration?: number
  order: number
  courseId: number
  status: ClassStatus
  scheduledAt?: Date
  isLive: boolean
}

export default function UploadClassPage() {
  const { data: session } = useSession()
  const [isUploading, setIsUploading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<UploadClassForm>({
    title: '',
    description: '',
    content: '',
    duration: undefined,
    order: 1,
    courseId: 0,
    status: 'DRAFT',
    isLive: false
  })
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Aquí iría la lógica de subida del video y creación de la clase
      console.log('Form Data:', formData)
      console.log('Video File:', videoFile)
      
      // Simular carga
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error('Error al subir la clase:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateCourse = async (courseData: any) => {
    try {
      // Aquí iría la lógica para crear el curso
      console.log('Nuevo curso:', courseData)
      
      // Simular creación exitosa
      // En un caso real, aquí se haría la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Actualizar la lista de cursos (en un caso real, recargarías los datos)
      // Por ahora solo cerramos el modal
      setIsCreateCourseModalOpen(false)
    } catch (error) {
      console.error('Error al crear el curso:', error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Subir Nueva Clase</CardTitle>
          <CardDescription>
            Sube una nueva clase grabada para tus estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Curso */}
            <div className="space-y-2">
              <Label htmlFor="courseId">Curso</Label>
              <Select
                value={formData.courseId.toString()}
                onValueChange={(value) => {
                  if (value === 'new') {
                    setIsCreateCourseModalOpen(true)
                    return
                  }
                  setFormData(prev => ({ ...prev, courseId: Number(value) }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_COURSES.map((course) => (
                    <SelectItem 
                      key={course.course_id} 
                      value={course.course_id.toString()}
                    >
                      {course.title}
                    </SelectItem>
                  ))}
                  <SelectItem value="new" className="text-primary">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Crear nuevo curso</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <Label>Video de la Clase</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                {videoFile ? (
                  <div className="space-y-2">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm">{videoFile.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setVideoFile(null)}
                    >
                      Cambiar video
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer space-y-2 flex flex-col items-center">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Arrastra un video o haz clic para seleccionar
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setVideoFile(file)
                      }}
                    />
                    <Button type="button" variant="secondary">
                      Seleccionar Video
                    </Button>
                  </label>
                )}
              </div>
            </div>

            {/* Título de la Clase */}
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Clase</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Introducción al Análisis Técnico"
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el contenido de la clase..."
                rows={4}
                required
              />
            </div>

            {/* Contenido Detallado */}
            <div className="space-y-2">
              <Label htmlFor="content">Contenido Detallado</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Contenido detallado de la clase..."
                rows={6}
              />
            </div>

            {/* Duración y Orden */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  placeholder="60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Orden en el curso</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Estado y Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ClassStatus) => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Borrador</SelectItem>
                    <SelectItem value="PUBLISHED">Publicado</SelectItem>
                    <SelectItem value="ARCHIVED">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isLive">Tipo de Clase</Label>
                <Select
                  value={formData.isLive.toString()}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, isLive: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Grabada</SelectItem>
                    <SelectItem value="true">En vivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fecha Programada (solo si es en vivo) */}
            {formData.isLive && (
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Fecha y Hora Programada</Label>
                <Input
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      scheduledAt: new Date(e.target.value) 
                    }))
                  }
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || !videoFile || !formData.courseId}
            >
              {isUploading ? 'Subiendo...' : 'Subir Clase'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onCreateCourse={handleCreateCourse}
      />
    </div>
  )
} 