'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users } from 'lucide-react'
import { clases } from '@/data/mock-classes'
import { cn } from '@/lib/utils'

const ClassPage = () => {
  const params = useParams()
  const classId = Number(params.classId)
  const currentClass = clases.find(clase => clase.id === classId)
  
  if (!currentClass) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal con el video y detalles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reproductor de video */}
          <div className="relative aspect-video w-full bg-slate-950 rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Detalles de la clase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{currentClass.titulo}</h1>
              <Badge>{currentClass.nivel}</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{currentClass.duracion}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{currentClass.estudiantes} estudiantes</span>
              </div>
            </div>

            <p className="text-muted-foreground">
              {currentClass.descripcion}
            </p>
          </div>
        </div>

        {/* Sidebar con lista de clases */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <h2 className="text-xl font-semibold">Clases del curso</h2>
            <div className="space-y-2">
              {clases.map((clase) => (
                <Card
                  key={clase.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-accent transition-colors",
                    clase.id === classId && "bg-accent"
                  )}
                  onClick={() => {
                    window.location.href = `/courses/${params.courseId}/classes/${clase.id}`
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{clase.titulo}</h3>
                      <Badge variant="outline" className="ml-2">
                        {clase.duracion}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {clase.descripcion}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassPage 