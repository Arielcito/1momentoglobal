import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Video } from "lucide-react";

interface StreamFormData {
  title: string;
  description: string;
}

const StreamModal = () => {
  const [formData, setFormData] = React.useState<StreamFormData>({
    title: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica para iniciar el stream
    console.log("Stream data:", formData);
    // TODO: Integrar con tu backend
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="flex items-center space-x-2 bg-primary"
        >
          <Video className="h-5 w-5" />
          <span>Empezar Stream</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Nuevo Stream</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label 
              htmlFor="title" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Título
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Ingresa el título del stream"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label 
              htmlFor="description" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Descripción
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe el contenido del stream"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogTrigger>
            <Button type="submit" className="bg-primary">
              Iniciar Stream
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StreamModal; 