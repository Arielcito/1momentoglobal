'use client'

import { Class } from '@prisma/client'
import { formatDate } from '@/lib/utils'

interface ClassWithCourse extends Class {
  course: {
    title: string
  }
}

const MOCK_CLASSES: ClassWithCourse[] = [
  {
    class_id: 1,
    course_id: 1,
    title: 'Introducción al Análisis Técnico',
    description: 'Fundamentos básicos del análisis técnico en trading',
    scheduled_at: new Date('2024-03-15T10:00:00Z'),
    is_live: false,
    recording_url: 'https://example.com/recording1.mp4',
    course: {
      title: 'Curso de Trading Avanzado'
    }
  },
  {
    class_id: 2,
    course_id: 1,
    title: 'Patrones de Velas Japonesas',
    description: 'Identificación y uso de patrones de velas japonesas',
    scheduled_at: new Date('2024-03-16T10:00:00Z'),
    is_live: false,
    recording_url: 'https://example.com/recording2.mp4',
    course: {
      title: 'Curso de Trading Avanzado'
    }
  },
  {
    class_id: 3,
    course_id: 1,
    title: 'Estrategias de Trading Intradiario',
    description: 'Técnicas efectivas para el trading intradiario',
    scheduled_at: new Date('2024-03-17T10:00:00Z'),
    is_live: false,
    recording_url: 'https://example.com/recording3.mp4',
    course: {
      title: 'Curso de Trading Avanzado'
    }
  },
  {
    class_id: 4,
    course_id: 1,
    title: 'Gestión del Riesgo',
    description: 'Principios fundamentales de la gestión del riesgo',
    scheduled_at: new Date('2024-03-18T10:00:00Z'),
    is_live: true,
    recording_url: null,
    course: {
      title: 'Curso de Trading Avanzado'
    }
  },
  {
    class_id: 5,
    course_id: 1,
    title: 'Psicología del Trading',
    description: 'Aspectos psicológicos y emocionales del trading',
    scheduled_at: new Date('2024-03-19T10:00:00Z'),
    is_live: false,
    recording_url: 'https://example.com/recording5.mp4',
    course: {
      title: 'Curso de Trading Avanzado'
    }
  }
];

export function ClassesComponent() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mis Clases Anteriores</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_CLASSES.map((classItem) => (
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
            {classItem.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {classItem.description}
              </p>
            )}
            {classItem.is_live && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  En vivo
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
