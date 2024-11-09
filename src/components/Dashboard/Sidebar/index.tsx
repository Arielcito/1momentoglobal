'use client'

import * as React from 'react'
import { Video, BookOpen, Key, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

export const DashboardSidebar = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeMenu, setActiveMenu] = React.useState('live')

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

  if (status === 'loading' || !session) return null

  const isAdmin = session.user?.is_admin || false

  return (
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
                <Badge variant="destructive" className="ml-2 animate-pulse">
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
  )
} 