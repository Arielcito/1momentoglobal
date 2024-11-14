'use client'

import * as React from 'react'
import { Video, BookOpen, Key, Upload, Menu } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { useSession } from "next-auth/react"
import { useQuery } from 'react-query'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

interface StreamData {
  isLive: boolean
  streamKey: string
}

const menuPaths = {
  '/dashboard': 'live',
  '/classes': 'classes',
  '/user/keys': 'keys',
  '/upload': 'upload'
} as const

type MenuKeys = keyof typeof menuPaths
type MenuValues = typeof menuPaths[MenuKeys]

export const DashboardSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Determinar el menú activo basado en la ruta actual
  const activeMenu = React.useMemo(() => {
    const path = pathname as MenuKeys
    return menuPaths[path] || 'live'
  }, [pathname])

  const { data: streamData } = useQuery<StreamData>(
    ['stream', session?.user?.id],
    async () => {
      const res = await fetch(`/api/stream/${session?.user?.id}`)
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    },
    {
      enabled: !!session?.user?.id
    }
  )

  const handleMenuClick = (menu: MenuValues) => {
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
        router.push('/upload')
        break
    }
  }

  if (status === 'loading' || !session) return null

  const isAdmin = session.user?.is_admin || false

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsMobileMenuOpen(!isMobileMenuOpen)
          }
        }}
        className="fixed z-50 bottom-4 right-4 md:hidden bg-primary text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <Sidebar 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:relative
        `}
      >
        <SidebarHeader className="h-16 border-b border-sidebar-border px-4 py-4 flex justify-center items-center bg-sidebar">
          <Image 
            src="/images/logo/logo-white.png" 
            alt="1MomentGlobal" 
            width={100} 
            height={100}
            className="w-auto h-8"
          />  
        </SidebarHeader>
        <SidebarContent className="bg-sidebar">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  handleMenuClick('live')
                  setIsMobileMenuOpen(false)
                }}
                isActive={activeMenu === 'live'}
                className="flex items-center justify-between w-full p-4 md:p-6 text-lg text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center">
                  <Video className="mr-3 h-5 w-5" />
                  Live
                </div>
                {streamData?.isLive && (
                  <Badge 
                    variant="destructive" 
                    className="ml-2 animate-pulse bg-primary text-primary-foreground"
                  >
                    EN VIVO
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  handleMenuClick('classes')
                  setIsMobileMenuOpen(false)
                }}
                isActive={activeMenu === 'classes'}
                className="flex items-center w-full p-4 md:p-6 text-lg text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Clases
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {isAdmin && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      handleMenuClick('keys')
                      setIsMobileMenuOpen(false)
                    }}
                    isActive={activeMenu === 'keys'}
                    className="flex items-center w-full p-4 text-lg text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <Key className="mr-3 h-5 w-5" />
                    Stream Keys
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      handleMenuClick('upload')
                      setIsMobileMenuOpen(false)
                    }}
                    isActive={activeMenu === 'upload'}
                    className="flex items-center w-full p-4 text-lg text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <Upload className="mr-3 h-5 w-5" />
                    Subir Clase
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail className="bg-sidebar" />
      </Sidebar>

      {/* Overlay para cerrar el menú en móvil */}
      {isMobileMenuOpen && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsMobileMenuOpen(false)
            }
          }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          aria-label="Close menu overlay"
        />
      )}
    </>
  )
} 