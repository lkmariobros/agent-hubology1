
import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

interface SidebarMenuSkeletonProps {
  className?: string
}

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarMenuSkeletonProps
>(({ className, ...props }, ref) => {
  const { isIconOnly } = useSidebar()
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex animate-pulse items-center gap-2 rounded-md px-3 py-2",
        isIconOnly && "justify-center px-2",
        className
      )}
      {...props}
    >
      <div className="h-5 w-5 rounded-full bg-sidebar-accent/30" />
      {!isIconOnly && <div className="h-4 w-[80%] rounded bg-sidebar-accent/30" />}
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

interface SidebarMenuSubProps {
  children?: React.ReactNode
  className?: string
}

const SidebarMenuSub = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarMenuSubProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-state="true"
      className={cn(
        "mt-1 ml-4 space-y-1 rounded-md border-l border-sidebar-accent/50 pl-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarMenuSub.displayName = "SidebarMenuSub"

interface SidebarMenuSubItemProps {
  children?: React.ReactNode
  className?: string
}

const SidebarMenuSubItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarMenuSubItemProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

interface SidebarMenuSubButtonProps {
  children?: React.ReactNode
  isActive?: boolean
  className?: string
  asChild?: boolean
}

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLElement> & SidebarMenuSubButtonProps
>(({ children, isActive, className, asChild = false, ...props }, ref) => {
  const { isCollapsed, isIconOnly } = useSidebar()
  
  // If the sidebar is completely collapsed, don't render
  if (isCollapsed || isIconOnly) {
    return null
  }
  
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      ref={ref}
      data-active={isActive ? "true" : "false"}
      className={cn(
        "inline-flex w-full items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] hover:bg-sidebar-accent hover:text-sidebar-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isActive ? "bg-sidebar-accent/30 text-sidebar-foreground" : "text-sidebar-foreground/70",
        className
      )}
      {...props}
    >
      <ChevronRight className="h-3 w-3 shrink-0" />
      {children}
    </Comp>
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
}
