'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_COURSES } from '@/data/courses'

export function CoursesGrid() {
  const router = useRouter()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {MOCK_COURSES.map((course) => (
        <Card 
          key={course.course_id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/courses/${course.course_id}`)}
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
              <Badge>{course.category.name}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Badge variant="secondary">
              {course.classes.length} clases
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 