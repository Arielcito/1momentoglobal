import React from "react";
import Image from "next/image";
import Graphics from "@/components/About/Graphics";
import Link from "next/link";

const About = () => {
  return (
    <>
      <section id="about" className="relative pt-[150px]">
        <div className="container lg:max-w-[1120px]">
          <div>
            <div className="-mx-4 flex flex-wrap items-center justify-between">
              <div className="w-full px-4 lg:w-1/2">
                <div
                  className="wow fadeInUp relative z-10 mx-auto mb-14 w-full max-w-[470px] pb-6 lg:mx-0 lg:mb-0"
                  data-wow-delay=".2s"
                >
                  <Image
                    width={294}
                    height={594}
                    src={"/images/about/trading-platform.png"}
                    alt="Plataforma de trading profesional"
                    className="mx-auto max-w-full rounded-2xl shadow-lg"
                  />

                  <div className="absolute right-5 top-0 -z-10">
                    <svg
                      width="72"
                      height="50"
                      viewBox="0 0 72 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="presentation"
                    >
                      {/* ... SVG paths ... */}
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 -z-10 h-1/2 w-full rounded-[20px] bg-gradient-1">
                    <div className="absolute -top-12 left-10 -z-10">
                      <svg
                        width="65"
                        height="36"
                        viewBox="0 0 65 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="presentation"
                      >
                        {/* ... SVG paths ... */}
                      </svg>
                    </div>
                    <div className="absolute left-0 top-0 h-full w-full bg-texture" />
                  </div>
                </div>
              </div>

              <div className="w-full px-4 lg:w-1/2">
                <div
                  className="wow fadeInUp lg:ml-auto lg:max-w-[510px]"
                  data-wow-delay=".3s"
                >
                  <span className="mb-4 block text-lg font-medium text-primary md:text-[22px]">
                    Academia Profesional de Trading
                  </span>
                  <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[44px] md:leading-tight">
                    Aprende a Operar en los Mercados Financieros
                  </h2>
                  <p className="mb-[30px] text-base leading-relaxed text-body">
                    Nuestra academia te ofrece una formación integral en trading, desde conceptos básicos hasta estrategias avanzadas. Con mentores expertos y años de experiencia en los mercados financieros.
                  </p>

                  <div className="mb-[30px] flex items-center">
                    <div className="mr-[22px] flex h-[60px] w-[60px] items-center justify-center rounded-full border border-stroke text-xl font-semibold text-black dark:border-stroke-dark dark:bg-dark dark:text-white">
                      01
                    </div>
                    <div>
                      <h5 className="text-xl font-medium text-black dark:text-white">
                        Formación Personalizada
                      </h5>
                      <p className="text-base text-body">
                        Mentorías individuales y grupales con traders profesionales activos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-[22px] flex h-[60px] w-[60px] items-center justify-center rounded-full border border-stroke text-xl font-semibold text-black dark:border-stroke-dark dark:bg-dark dark:text-white">
                      02
                    </div>
                    <div>
                      <h5 className="text-xl font-medium text-black dark:text-white">
                        Trading en Vivo
                      </h5>
                      <p className="text-base text-body">
                        Sesiones de trading en tiempo real y análisis de mercado diario.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-[100px]">
            <div className="-mx-4 flex flex-wrap items-center justify-between">
              <div className="w-full px-4 lg:w-1/2">
                <div
                  className="wow fadeInUp lg:max-w-[510px]"
                  data-wow-delay=".2s"
                >
                  <span className="mb-4 block text-lg font-medium text-primary md:text-[22px]">
                    Metodología Probada
                  </span>
                  <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[44px] md:leading-tight">
                    Domina el Arte del Trading
                  </h2>
                  <p className="mb-[30px] text-base leading-relaxed text-body">
                    Nuestro método se basa en años de experiencia real en los mercados. Te enseñamos estrategias probadas y te guiamos en el desarrollo de tu propio estilo de trading.
                  </p>

                  <Link
                    href="/cursos"
                    className="inline-block rounded-md bg-primary px-8 py-[10px] text-base font-medium text-white hover:bg-opacity-90"
                    tabIndex={0}
                    aria-label="Ver nuestros cursos"
                  >
                    Ver Cursos
                  </Link>
                </div>
              </div>

              <div className="order-first w-full px-4 lg:order-last lg:w-1/2">
                <div
                  className="wow fadeInUp relative z-10 mx-auto mb-14 w-full max-w-[470px] pb-6 lg:mb-0 lg:mr-0"
                  data-wow-delay=".3s"
                >
                  <Image
                    width={294}
                    height={594}
                    src={"/images/about/trading-analysis.png"}
                    alt="Análisis técnico profesional"
                    className="mx-auto max-w-full rounded-2xl shadow-lg"
                  />

                  {/* ... SVG decorations ... */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Graphics />
      </section>
    </>
  );
};

export default About;
