'use client'

import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Video, BookOpen } from 'lucide-react'
import { useState } from 'react'

import { Header } from "@/components/Header";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeMenu, setActiveMenu] = useState('live');

  return (
    <div className={inter.className}>
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
            <Header userName="User Name" userImage="/path-to-image.jpg" />
            <main className="flex-grow p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
