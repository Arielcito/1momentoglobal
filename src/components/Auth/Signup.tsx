"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useSession } from "next-auth/react";

const Signup = () => {
  const router = useRouter();
  const { status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return null;
  }

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!data.fullName || !data.email || !data.password) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: "Todos los campos son requeridos"
        });
        return;
      }

      const response = await axios.post("/api/register", {
        name: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (response.data) {
        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada correctamente"
        });
        
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          console.error("Error al iniciar sesión:", result.error);
          toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: "Registro exitoso pero hubo un error al iniciar sesión"
          });
          return;
        }

        router.push('/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast({
          variant: "destructive",
          title: "Error de registro",
          description: error.response.data.error
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error durante el registro"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pb-[110px] pt-[100px] md:pt-[150px] lg:pt-[200px] bg-background">
      <div className="container overflow-hidden lg:max-w-[1250px]">
        <div className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-black px-6 py-10 shadow-card-dark sm:p-[10px] flex flex-col items-center">
          <Image src={"/images/logo/logo-white.png"} alt="Logo" width={173} height={34} />
          <div className="text-center">
            <h3 className="mb-[10px] text-2xl font-bold text-white sm:text-[28px]">
              Crea tu cuenta
            </h3>
            <p className="mb-11 text-base text-gray-400">
              Es gratis y solo toma un minuto
            </p>
          </div>

          <form onSubmit={registerUser}>
            <div className="mb-5">
              <label
                htmlFor="fullName"
                className="mb-[10px] block text-sm text-white"
              >
                Nombre completo
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Ingresa tu nombre completo"
                name="fullName"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                className="w-full rounded-md border border-stroke-dark bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-[10px] block text-sm text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Ingresa tu email"
                name="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full rounded-md border border-stroke-dark bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-[10px] block text-sm text-white"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                name="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full rounded-md border border-stroke-dark bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input"
              />
            </div>

            <div className="mb-[30px]">
              <label
                htmlFor="terms"
                className="flex cursor-pointer select-none items-center text-sm text-white"
              >
                <input
                  type="checkbox"
                  id="terms"
                  className="sr-only"
                />
                <span className="mr-[10px] flex h-5 w-5 items-center justify-center rounded border border-stroke-dark">
                  <span className="opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                    ✓
                  </span>
                </span>
                Acepto los términos y condiciones
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              aria-label="Crear cuenta"
              className="flex w-full justify-center rounded-md bg-primary p-3 text-base font-medium text-white hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Procesando...</span>
                </div>
              ) : (
                "Crear cuenta"
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
