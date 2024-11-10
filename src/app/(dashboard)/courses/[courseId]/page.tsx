'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, CheckCircle } from 'lucide-react'
import { useQuery } from 'react-query'

// Interfaces
interface Instructor {
  id: string
  nombre: string
  rol: string
  imagen: string
}

interface Class {
  class_id: string
  title: string
  description: string
  duration: string
  status: string
  recording_url?: string
  is_live: boolean
  scheduled_at?: Date
  order: number
}

interface Course {
  course_id: number
  title: string
  description: string
  image_url: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: {
    name: string
  }
  instructors: Instructor[]
  classes: Class[]
}

// Funciones para fetch de datos
const fetchCourseWithClasses = async (courseId: string): Promise<Course> => {
  // Primero obtenemos todos los cursos
  const coursesResponse = await fetch('/api/courses')
  if (!coursesResponse.ok) throw new Error('Error al cargar los cursos')
  const courses = await coursesResponse.json()
  
  // Encontramos el curso específico
  const course = courses.find((c: Course) => c.course_id === parseInt(courseId))
  if (!course) throw new Error('Curso no encontrado')
  
  // Obtenemos las clases para este curso
  const classesResponse = await fetch(`/api/classes?courseId=${courseId}`)
  if (!classesResponse.ok) throw new Error('Error al cargar las clases')
  const classes = await classesResponse.json()
  
  return { ...course, classes }
}

const CourseDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string

  const { 
    data: course,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseWithClasses(courseId)
  })

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (error || !course) {
    return <div className="container mx-auto px-4 py-8">Curso no encontrado</div>
  }

  const handleClassClick = (classId: string) => {
    router.push(`/courses/${courseId}/classes/${classId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
        
        {/* Sección de instructores */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              {course.instructors?.map((instructor: Instructor) => (
                <div 
                  key={instructor.id}
                  className="flex items-center space-x-4"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={instructor.imagen} alt={instructor.nombre} />
                    <AvatarFallback>
                      {instructor.nombre.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{instructor.nombre}</p>
                    <p className="text-sm text-muted-foreground">{instructor.rol}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de clases */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Contenido del curso</h2>
          <div className="grid gap-4">
            {course.classes.map((clase) => (
              <Card 
                key={clase.class_id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleClassClick(clase.class_id)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClassClick(clase.class_id)
                  }
                }}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{clase.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {clase.description}
                      </p>
                    </div>
                    <Badge>{clase.status}</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{clase.duration}</span>
                    </div>
                    {clase.is_live && (
                      <Badge variant="secondary">En vivo</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage