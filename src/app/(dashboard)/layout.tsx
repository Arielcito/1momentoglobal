'use client'

import * as React from 'react'
import { Bell, ChevronDown, LogOut, Settings, User, Video, BookOpen, Key } from 'lucide-react'
import { signOut, useSession } from "next-auth/react"
import { ClassesComponent } from '@/components/Classes'

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
} from "@/components/ui/sidebar"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeMenu, setActiveMenu] = React.useState('live')

  useEffect(() => {
    console.log("Session Status:", status)
    console.log("Session Data:", session)
  }, [session, status])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  const userName = session.user?.name || 'User Name'
  const userImage = session.user?.image || '/default-avatar.png'
  const isAdmin = session.user?.is_admin || false 

  console.log(session.user)
  
  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
    switch (menu) {
      case 'classes':
        router.push('/classes')
        break
      case 'live':
        router.push('/dashboard')
        break
      case 'keys':
        router.push('/user/keys')
        break
    }
  }

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
                  onClick={() => handleMenuClick('live')}
                  isActive={activeMenu === 'live'}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Live
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleMenuClick('classes')}
                  isActive={activeMenu === 'classes'}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Clases
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick('keys')}
                    isActive={activeMenu === 'keys'}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Stream Keys
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
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
                  <DropdownMenuItem onClick={() => router.push('/user/keys')}>
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
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
