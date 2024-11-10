'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useClass } from '@/hooks/useClass'
import { Skeleton } from '@/components/ui/skeleton'

const ClassPage = () => {
  const params = useParams()
  const router = useRouter()
  const { data: classes, isLoading, error } = useClass(params.courseId as string)
  
  const classId = Number(params.classId)
  const currentClass = classes?.find(clase => clase.class_id === classId)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error al cargar la clase</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentClass) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal con el video y detalles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reproductor de video */}
          {currentClass.recording_url && (
            <div className="relative aspect-video w-full bg-slate-950 rounded-lg overflow-hidden">
              <iframe
                src={currentClass.recording_url}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Detalles de la clase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{currentClass.title}</h1>
              <Badge>{currentClass.status}</Badge>
            </div>
            
            {currentClass.duration && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{currentClass.duration} minutos</span>
                </div>
              </div>
            )}

            <p className="text-muted-foreground">
              {currentClass.description}
            </p>
          </div>
        </div>

        {/* Sidebar con lista de clases */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <h2 className="text-xl font-semibold">Clases del curso</h2>
            <div className="space-y-2">
              {classes?.map((clase) => (
                <Link
                  key={clase.class_id}
                  href={`/courses/${params.courseId}/classes/${clase.class_id}`}
                >
                  <Card
                    className={cn(
                      "p-4 cursor-pointer hover:bg-accent transition-colors",
                      clase.class_id === classId && "bg-accent"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{clase.title}</h3>
                        {clase.duration && (
                          <Badge variant="outline" className="ml-2">
                            {clase.duration} min
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {clase.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassPage