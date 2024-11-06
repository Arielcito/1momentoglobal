export interface Instructor {
  nombre: string
  rol: string
  imagen: string
}

export interface Clase {
  id: number
  titulo: string
  descripcion: string
  imagen: string
  duracion: string
  estudiantes: number
  nivel: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructors: Instructor[]
  classes: Clase[]
  learningObjectives: string[]
} 