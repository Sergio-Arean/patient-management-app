"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Users, Settings, Heart, LogOut } from "lucide-react"

const navigation = [
  {
    name: "Pacientes",
    icon: Users,
    current: true,
  },
  {
    name: "Configuración",
    icon: Settings,
    current: false,
  },
]

interface SidebarProps {
  onNavigateToPatients?: () => void
}

export function Sidebar({ onNavigateToPatients }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">PsyManager</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-4">
          <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-2">Gestión</p>
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.name}
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  item.current
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
                onClick={item.name === "Pacientes" ? onNavigateToPatients : undefined}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">Dr</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "Usuario"}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Profesional</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
