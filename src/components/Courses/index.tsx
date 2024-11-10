'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

// Definimos el tipo Course basado en el schema de Prisma
type Course = {
  course_id: number
  title: string
  description: string
  image_url: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: {
    name: string
  }
  classes: any[]
}

export function CoursesGrid() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses')
        if (!response.ok) throw new Error('Error al cargar los cursos')
        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (isLoading) {
    return <div role="status" aria-live="polite">Cargando cursos...</div>
  }

  const handleCourseClick = (courseId: number) => {
    router.push(`/courses/${courseId}`)
  }

  const handleKeyDown = (event: React.KeyboardEvent, courseId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCourseClick(courseId)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2" role="list">
      {courses.map((course) => (
        <Card 
          key={course.course_id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCourseClick(course.course_id)}
          onKeyDown={(e) => handleKeyDown(e, course.course_id)}
          tabIndex={0}
          role="listitem"
          aria-label={`Curso: ${course.title}`}
        >
          <CardHeader className="p-0">
            <div className="relative aspect-video">
              <Image
                src={course.image_url}
                alt={course.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-xl">{course.title}</CardTitle>
              {course.category && (
                <Badge>{course.category.name}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Badge variant="secondary">
              {course.classes?.length || 0} clases
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 