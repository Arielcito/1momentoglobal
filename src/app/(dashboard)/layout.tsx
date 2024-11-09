'use client'

import * as React from 'react'
import { Bell, ChevronDown, LogOut, Settings, User, Video, BookOpen, Key, Upload } from 'lucide-react'
import { signOut, useSession } from "next-auth/react"
import { ClassesComponent } from '@/components/Classes'
import { useQuery } from 'react-query'


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
import { Badge } from '@/components/ui/badge'
import { NotificationsDropdown } from "@/components/Notifications"
import Image from 'next/image'
import StreamModal from "@/components/Modals/StreamModal";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeMenu, setActiveMenu] = React.useState('live')

  // Fetch stream status
  const { data: streamData } = useQuery(
    ['stream', session?.user?.id],
    async () => {
      const res = await fetch(`/api/stream/${session?.user?.id}`)
      const data = await res.json()
      return data.streamKey
    },
    {
      enabled: !!session?.user?.id
    }
  )

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="relative w-[200px] h-[40px] animate-breathing">
          <Image
            src="/images/logo/logo-black.png"
            alt="Loading..."
            fill
            className="object-contain "
            priority
          />
        </div>
      </div>
    );
  }

  if (!session) {
    return null
  }
  console.log(session)
  const userName = session.user?.name || 'User Name'
  const userImage = session.user?.image || '/default-avatar.png'
  const isAdmin = session.user?.is_admin || false 
  
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
      case 'upload':
        router.push('/classes/upload')
        break
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar className="w-64 border-r">
          <SidebarHeader className="h-16 border-b px-4 py-4 flex justify-center items-center">
            <Image src="/images/logo/logo-black.png" alt="1MomentGlobal" width={100} height={100} />  
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleMenuClick('live')}
                  isActive={activeMenu === 'live'}
                  className="flex items-center justify-between w-full p-6 text-lg"
                >
                  <div className="flex items-center">
                    <Video className="mr-3 h-5 w-5" />
                    Live
                  </div>
                  {streamData?.isLive && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 animate-pulse"
                    >
                      EN VIVO
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleMenuClick('classes')}
                  isActive={activeMenu === 'classes'}
                  className="flex items-center w-full p-6 text-lg"
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  Clases
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAdmin && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick('keys')}
                      isActive={activeMenu === 'keys'}
                      className="flex items-center w-full p-4 text-lg"
                    >
                      <Key className="mr-3 h-5 w-5" />
                      Stream Keys
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick('upload')}
                      isActive={activeMenu === 'upload'}
                      className="flex items-center w-full p-4 text-lg"
                    >
                      <Upload className="mr-3 h-5 w-5" />
                      Subir Clase
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div className="flex flex-col flex-grow">
          <header className="flex items-center justify-between h-16 px-6 border-b bg-background py-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-lg font-medium">Hola, {userName}!</span>
            </div>
            <div className="flex items-center space-x-4">
              <StreamModal />
              <NotificationsDropdown />
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
