"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { userService } from "@/lib/user-service";
import { useSession } from "next-auth/react";

const Signin = () => {
  const router = useRouter();
  const { status } = useSession();
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
    return null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      return toast.error("Por favor complete todos los campos");
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        toast.success("¡Bienvenido! Has iniciado sesión correctamente");
        router.replace('/dashboard');
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado. Por favor, intente nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pb-[110px] pt-[150px] lg:pt-[200px] bg-background">
      <div className="container overflow-hidden lg:max-w-[1250px]">
        <div className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-black px-6 py-10 shadow-card-dark sm:p-[10px] flex flex-col items-center">
          <Image src={"/images/logo/logo-white.png"} alt="Logo" width={173} height={34} />
          <div className="text-center">
            <h3 className="mb-[10px] text-2xl font-bold text-white sm:text-[28px]">
              Inicia sesión en tu cuenta
            </h3>
            <p className="mb-11 text-base text-gray-400">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-[10px] block text-sm text-white"
              >
                Tu Email
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
                Tu contraseña
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

            <div className="-mx-2 mb-[30px] flex flex-wrap justify-between">
              <div className="w-full px-2 sm:w-1/2">
                <label
                  htmlFor="keep-signed"
                  className="mb-4 flex cursor-pointer select-none items-center text-base text-body sm:mb-0"
                >
                  <input
                    type="checkbox"
                    id="keep-signed"
                    className="keep-signed sr-only"
                    onChange={(e) =>
                      setData({ ...data, remember: e.target.checked })
                    }
                  />
                  <span
                    className={`box mr-[10px] flex h-[22px] w-[22px] items-center justify-center rounded-sm border-[.7px] border-stroke-dark bg-black ${
                      data?.remember && "bg-primary"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`icon ${data?.remember ? "" : "hidden"}`}
                      aria-hidden="true"
                    >
                      <g clipPath="url(#clip0_73_381)">
                        <path
                          d="M6.66649 10.1148L12.7945 3.98608L13.7378 4.92875L6.66649 12.0001L2.42383 7.75742L3.36649 6.81475L6.66649 10.1148Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_73_381">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Mantener sesión iniciada
                </label>
              </div>

              <div className="w-full px-2 sm:w-1/2">
                <Link
                  href="/auth/forget-password"
                  aria-label="¿Olvidaste tu contraseña?"
                  className="text-base text-primary hover:underline sm:text-right"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              aria-label="Iniciar sesión"
              className="flex w-full justify-center rounded-md bg-primary p-3 text-base font-medium text-white hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
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
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signin;
