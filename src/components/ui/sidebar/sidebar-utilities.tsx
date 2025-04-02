
import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useSidebar } from "./sidebar-context"

interface SidebarMenuSkeletonProps {
  className?: string
}

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarMenuSkeletonProps
>(({ className, ...props }, ref) => {
  const { open } = useSidebar()
  
  if (!open) {
    return (
      <div className={cn("flex items-center gap-2", className)} ref={ref} {...props}>
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    )
  }
  
  return (
    <div className={cn("flex items-center gap-2", className)} ref={ref} {...props}>
      <Skeleton className="h-9 w-9 rounded-md" />
      <Skeleton className="h-5 w-24" />
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
      className={cn("pl-8 flex flex-col gap-1 mt-1", className)}
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
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & SidebarMenuSubItemProps
>(({ children, className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("list-none flex items-center", className)}
      {...props}
    >
      {children}
    </li>
  )
})
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

interface SidebarMenuSubButtonProps {
  children?: React.ReactNode
  className?: string
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & SidebarMenuSubButtonProps
>(({ asChild = false, children, className, isActive, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  const childProps = asChild ? {} : { ref, ...props }

  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-sm py-1.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        isActive && "font-medium text-sidebar-foreground",
        className
      )}
      data-active={isActive}
      {...childProps}
    >
      {asChild ? (
        children
      ) : (
        <>
          <div className="h-1 w-1 rounded-full bg-current opacity-60" />
          <span>{children}</span>
        </>
      )}
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
