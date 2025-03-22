
"use client"

import * as React from "react"
import { forwardRef, useContext, createContext } from "react"
import * as SidebarPrimitive from "rn-primitives"

import { cn } from "@/lib/utils"

const SidebarContext = createContext<{
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}>({
  expanded: true,
  setExpanded: () => { }
})

interface SidebarProviderProps {
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

const SidebarProvider = ({
  children,
  defaultExpanded = true,
  className
}: SidebarProviderProps) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className={cn("flex min-h-screen w-full", className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

interface SidebarProps {
  children?: React.ReactNode
  className?: string
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, ...props }, ref) => {
    const { expanded } = useContext(SidebarContext)

    return (
      <aside
        ref={ref}
        className={cn(
          "sidebar group relative flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground",
          expanded ? "w-64" : "w-14",
          "transition-width duration-300",
          className
        )}
        data-expanded={expanded}
        {...props}
      >
        {children}
      </aside>
    )
  }
)

Sidebar.displayName = "Sidebar"

interface SidebarHeaderProps {
  children?: React.ReactNode
  className?: string
}

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { expanded } = useContext(SidebarContext)

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-14 items-center border-b px-4",
          expanded ? "justify-between" : "justify-center",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SidebarHeader.displayName = "SidebarHeader"

interface SidebarContentProps {
  children?: React.ReactNode
  className?: string
}

const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props}>
        {children}
      </div>
    )
  }
)

SidebarContent.displayName = "SidebarContent"

interface SidebarFooterProps {
  children?: React.ReactNode
  className?: string
}

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-t px-4 py-2", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SidebarFooter.displayName = "SidebarFooter"

interface SidebarGroupProps {
  children?: React.ReactNode
  className?: string
  "aria-label"?: string
}

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-2 py-4", className)}
        role="group"
        {...props}
      >
        {children}
      </div>
    )
  }
)

SidebarGroup.displayName = "SidebarGroup"

interface SidebarGroupLabelProps {
  children?: React.ReactNode
  className?: string
}

const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ children, className, ...props }, ref) => {
    const { expanded } = useContext(SidebarContext)

    return (
      <div
        ref={ref}
        className={cn(
          "mb-2 px-2",
          expanded ? "text-xs uppercase" : "sr-only",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SidebarGroupLabel.displayName = "SidebarGroupLabel"

interface SidebarGroupContentProps {
  children?: React.ReactNode
  className?: string
}

const SidebarGroupContent = forwardRef<HTMLDivElement, SidebarGroupContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    )
  }
)

SidebarGroupContent.displayName = "SidebarGroupContent"

interface SidebarMenuProps {
  children?: React.ReactNode
  className?: string
}

const SidebarMenu = forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("space-y-1", className)}
        role="menu"
        {...props}
      >
        {children}
      </ul>
    )
  }
)

SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps {
  children?: React.ReactNode
  className?: string
}

const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn("", className)} role="menuitem" {...props}>
        {children}
      </li>
    )
  }
)

SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps {
  children?: React.ReactNode
  className?: string
  asChild?: boolean
}

const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ children, className, asChild, ...props }, ref) => {
    const { expanded } = useContext(SidebarContext)
    const Comp = asChild ? SidebarPrimitive.Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex w-full cursor-pointer items-center rounded-md p-2 text-sm hover:bg-sidebar-accent outline-none transition-colors",
          expanded ? "justify-start" : "justify-center",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

SidebarMenuButton.displayName = "SidebarMenuButton"

interface SidebarTriggerProps {
  direction?: "left" | "right"
  children?: React.ReactNode
  className?: string
}

const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ direction = "right", children, className, ...props }, ref) => {
    const { expanded, setExpanded } = useContext(SidebarContext)

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
          direction === "right" ? "ml-auto" : "mr-auto",
          className
        )}
        onClick={() => setExpanded(!expanded)}
        {...props}
      >
        {children || (
          <SidebarPrimitive.ChevronRight
            className={cn(
              "h-6 w-6 transition-transform",
              expanded ? "rotate-180" : "rotate-0",
              direction === "left" && "rotate-180",
              expanded && direction === "left" && "rotate-0"
            )}
          />
        )}
      </button>
    )
  }
)

SidebarTrigger.displayName = "SidebarTrigger"

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
}
