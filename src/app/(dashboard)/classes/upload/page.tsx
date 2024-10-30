'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Video } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function UploadClassPage() {
  const { data: session } = useSession()
  const [isUploading, setIsUploading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  if (!session?.user?.is_admin) {
    redirect('/dashboard')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)

    // Aquí iría la lógica de subida
    // Por ahora solo simulamos una carga
    setTimeout(() => {
      setIsUploading(false)
    }, 2000)
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

            {/* Class Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Clase</Label>
              <Input
                id="title"
                placeholder="Ej: Introducción al Análisis Técnico"
                required
              />
            </div>

            {/* Class Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el contenido de la clase..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || !videoFile}
            >
              {isUploading ? 'Subiendo...' : 'Subir Clase'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 