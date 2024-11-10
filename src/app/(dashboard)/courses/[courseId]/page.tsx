'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

// Interfaces
interface Instructor {
  id: string;
  nombre: string;
  rol: string;
  imagen: string;
}

interface Clase {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: string;
  recording_url?: string;
  is_live: boolean;
  scheduled_at?: Date;
  order: number;
}

const fetchCourseData = async (courseId: string) => {
  try {
    const response = await fetch(`/api/courses/${courseId}`);
    if (!response.ok) throw new Error('Error al cargar el curso');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const fetchClassesData = async (courseId: string) => {
  try {
    const response = await fetch(`/api/classes?courseId=${courseId}`);
    if (!response.ok) throw new Error('Error al cargar las clases');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

const CourseDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [classes, setClasses] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [courseData, classesData] = await Promise.all([
        fetchCourseData(courseId),
        fetchClassesData(courseId)
      ]);
      
      setCourse(courseData);
      setClasses(classesData);
      setLoading(false);
    };

    loadData();
  }, [courseId]);

  const handleClassClick = (classId: string) => {
    router.push(`/courses/${courseId}/classes/${classId}`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>;
  }

  if (!course) {
    return <div className="container mx-auto px-4 py-8">Curso no encontrado</div>;
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
              {course.instructors.map((instructor: Instructor) => (
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
            {classes.map((clase) => (
              <Card 
                key={clase.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleClassClick(clase.id)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClassClick(clase.id);
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
  );
};

export default CourseDetailPage 