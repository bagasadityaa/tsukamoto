"use client";
import {
  Calculator,
  Database,
  History,
  Home,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/hooks/useAuth";

export default function AppSidebar() {
  const items = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Perhitungan Detergen",
      url: "/dashboard/perhitungan",
      icon: Calculator,
    },
    {
      title: "Riwayat Perhitungan",
      url: "/dashboard/riwayat",
      icon: History,
    },
    {
      title: "Data",
      url: "/dashboard/data",
      icon: Database,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ];
  const { user } = useAuth();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between">
            <h1 className="text-base">Halo, {user?.email}</h1>
            <ModeToggle />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
