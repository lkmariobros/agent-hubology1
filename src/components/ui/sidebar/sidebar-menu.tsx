
import * as React from "react"
import { MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface SidebarMenuProps {
  children?: React.ReactNode
  className?: string
}

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & SidebarMenuProps
>(({ children, className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn("space-y-1 px-2", className)}
      {...props}
    >
      {children}
    </ul>
  )
})
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps {
  children?: React.ReactNode
  className?: string
}

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & SidebarMenuItemProps
>(({ children, className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </li>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

export interface SidebarMenuButtonProps {
  children?: React.ReactNode
  tooltip?: React.ReactNode
  isActive?: boolean
  className?: string
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLElement> & SidebarMenuButtonProps
>(({ children, tooltip, isActive, className, asChild = false, ...props }, ref) => {
  const { isCollapsed, isIconOnly } = useSidebar()
  
  // If the sidebar is completely collapsed, don't render
  if (isCollapsed) {
    return null
  }
  
  const Comp = asChild ? "span" : "button"
  const content = (
    <Comp
      ref={ref}
      data-active={isActive ? "true" : "false"}
      className={cn(
        "inline-flex w-full items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isActive ? "bg-sidebar-accent/30 text-sidebar-foreground" : "text-sidebar-foreground/70",
        isIconOnly && "justify-center px-2",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
  
  // When in icon-only mode with a tooltip, wrap in tooltip component
  if (isIconOnly && tooltip) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
      </Tooltip>
    )
  }
  
  return content
})
SidebarMenuButton.displayName = "SidebarMenuButton"

interface SidebarMenuActionProps {
  children?: React.ReactNode
  className?: string
  asChild?: boolean
}

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & SidebarMenuActionProps
>(({ children, className, asChild = false, ...props }, ref) => {
  const { isIconOnly } = useSidebar()
  
  // Don't render actions in icon-only mode
  if (isIconOnly) {
    return null
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-2 cursor-pointer rounded-full p-1 opacity-0 hover:opacity-100",
        className
      )}
      {...props}
    >
      {children || <MoreHorizontal className="h-4 w-4" />}
    </button>
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

interface SidebarMenuBadgeProps {
  children?: React.ReactNode
  className?: string
}

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement, 
  React.ComponentProps<typeof Badge> & SidebarMenuBadgeProps
>(({ className, ...props }, ref) => {
  const { isIconOnly } = useSidebar()
  
  // Don't render badge in icon-only mode
  if (isIconOnly) {
    return null
  }
  
  return (
    <Badge
      ref={ref}
      variant="outline"
      className={cn("ml-auto px-1.5 py-0", className)}
      {...props}
    />
  )
})
SidebarMenuBadge.displayName = "SidebarMenuBadge"

export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
}
