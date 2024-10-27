'use client'

import * as React from 'react'
import { Bell, ChevronDown, LogOut, Settings, User, Video, BookOpen } from 'lucide-react'
import { signOut } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarInset,
} from "@/components/ui/sidebar"

interface DashboardProps {
  userName: string;
  userImage: string;
}

export function DashboardComponent({ userName, userImage }: DashboardProps) {
  const [activeMenu, setActiveMenu] = React.useState('live')

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar className="w-64 border-r">
          <SidebarHeader className="h-16 border-b px-4">
            <h1 className="text-xl font-semibold">E-learning App</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveMenu('live')}
                  isActive={activeMenu === 'live'}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Live
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveMenu('classes')}
                  isActive={activeMenu === 'classes'}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Clases
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div className="flex flex-col flex-grow">
          <header className="flex items-center justify-between h-16 px-6 border-b bg-background">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-lg font-medium">Hola, {userName}!</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" aria-label="Notificaciones">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Perfil</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-grow p-6 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">
              {activeMenu === 'live' ? 'Transmisiones en vivo' : 'Mis clases'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-card text-card-foreground rounded-lg shadow-sm p-4">
                  <div className="aspect-video bg-muted rounded-md mb-2" />
                  <h3 className="font-medium">
                    {activeMenu === 'live' ? `Transmisión en vivo ${item}` : `Clase ${item}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeMenu === 'live' ? 'En curso' : 'Disponible'}
                  </p>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
