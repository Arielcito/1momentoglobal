import { prisma } from "@/app/libs/prismaDB";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error("Contraseña incorrecta");
        }
        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" || account?.provider === "github") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { stream: true }
          });

          if (!existingUser) {
            // Generar username único basado en el nombre completo
            let baseUsername = user.name?.replace(/\s+/g, '') || user.email!.split('@')[0];
            let username = baseUsername;
            let counter = 1;
            
            while (await prisma.user.findUnique({ where: { username } })) {
              username = `${baseUsername}${counter}`;
              counter++;
            }

            // Crear usuario con stream y datos de Google
            await prisma.user.create({
              data: {
                email: user.email!,
                name: profile?.name || user.name, // Usar el nombre del perfil de Google
                username,
                image: profile?.image || user.image, // Usar la imagen del perfil de Google
                stream: {
                  create: {
                    name: `${profile?.name || user.name}'s stream`,
                  }
                }
              },
            });
          } else {
            // Actualizar el usuario existente con los datos más recientes de Google
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: profile?.name || user.name,
                image: profile?.image || user.image,
              }
            });

            if (!existingUser.stream) {
              await prisma.stream.create({
                data: {
                  name: `${existingUser.name}'s stream`,
                  userId: existingUser.id,
                }
              });
            }
          }
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async session({ session, token, user }) {
      if (session?.user) {
        // Obtener el usuario completo de la base de datos
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            is_admin: true,
            username: true
          }
        });
        
        // Actualizar la sesión con todos los datos necesarios
        session.user = {
          ...session.user,
          ...dbUser,
          is_admin: dbUser?.is_admin || false
        };

        console.log("Session updated:", session);
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.is_admin = (user as any).is_admin;
        // Incluir datos adicionales del perfil si es necesario
        if (profile) {
          token.name = profile.name;
          token.picture = profile.image;
        }
      }
      return token;
    },
  },
};

export const getSelf = async () => {
  const session = await getServerSession(authOptions);
  console.log("session", session)
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return user;
};
