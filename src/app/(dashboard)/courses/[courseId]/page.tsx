'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, CheckCircle } from 'lucide-react'

// Interfaces
interface Instructor {
  nombre: string
  rol: string
  imagen: string
}

interface Clase {
  id: number
  titulo: string
  descripcion: string
  imagen: string
  duracion: string
  estudiantes: number
  nivel: string
}

// Datos mock (temporalmente aquí, luego moverlos a un archivo separado)
const instructores: Instructor[] = [
  {
    nombre: "Ana García",
    rol: "Desarrolladora Senior de React",
    imagen: "/placeholder.svg?height=100&width=100"
  },
  {
    nombre: "Carlos Rodríguez",
    rol: "Arquitecto de Software",
    imagen: "/placeholder.svg?height=100&width=100"
  }
]

const aprendizajes = [
  "Dominar los fundamentos de React y su ecosistema",
  "Crear componentes reutilizables y escalables",
  "Manejar el estado de la aplicación de manera eficiente",
  "Implementar enrutamiento para aplicaciones de una sola página",
  "Optimizar el rendimiento de aplicaciones React"
]

const clases: Clase[] = [
  {
    id: 1,
    titulo: "Introducción a React",
    descripcion: "Aprende los fundamentos de React y cómo crear componentes reutilizables.",
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "1h 30min",
    estudiantes: 120,
    nivel: "Principiante"
  },
  // ... resto de las clases del mock
]

const CourseDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId

  const handleClassClick = (classId: number) => {
    router.push(`/courses/${courseId}/classes/${classId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Desarrollo Avanzado con React</h1>
        
        {/* Sección de instructores */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Instructores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              {instructores.map((instructor, index) => (
                <div 
                  key={instructor.nombre}
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

        {/* Sección de objetivos de aprendizaje */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lo que aprenderás</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aprendizajes.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de clases */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Contenido del curso</h2>
          <div className="grid gap-4">
            {clases.map((clase) => (
              <Card 
                key={clase.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleClassClick(clase.id)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClassClick(clase.id)
                  }
                }}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{clase.titulo}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {clase.descripcion}
                      </p>
                    </div>
                    <Badge>{clase.nivel}</Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{clase.duracion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{clase.estudiantes} estudiantes</span>
                    </div>
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