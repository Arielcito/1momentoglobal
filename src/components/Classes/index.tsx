'use client'

import { useEffect, useState } from 'react'
import { Class } from '@prisma/client'
import { formatDate } from '@/lib/utils'

interface ClassWithCourse extends Class {
  course: {
    title: string
  }
}

export function ClassesComponent() {
  const [classes, setClasses] = useState<ClassWithCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mis Clases Anteriores</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <div
            key={classItem.class_id}
            className="bg-card text-card-foreground rounded-lg shadow-sm p-4"
          >
            {classItem.recording_url ? (
              <div className="aspect-video bg-muted rounded-md mb-2">
                <video
                  src={classItem.recording_url}
                  controls
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center">
                <span className="text-muted-foreground">No hay grabación disponible</span>
              </div>
            )}
            <h3 className="font-medium">{classItem.title}</h3>
            <p className="text-sm text-muted-foreground">{classItem.course.title}</p>
            <p className="text-sm text-muted-foreground">
              {classItem.scheduled_at ? formatDate(classItem.scheduled_at) : 'Fecha no disponible'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
