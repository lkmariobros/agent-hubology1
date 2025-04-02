
import * as React from "react"
import { ChevronDown, ChevronRight, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SidebarInputProps {
  placeholder?: string
  className?: string
}

const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & SidebarInputProps
>(({ className, ...props }, ref) => {
  const { isExpanded } = useSidebar()
  
  // Don't show input when sidebar is collapsed
  if (!isExpanded) {
    return null
  }
  
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-sidebar-foreground/50" />
      <Input
        ref={ref}
        type="search"
        className={cn(
          "h-9 pl-8 bg-sidebar-accent border-none",
          className
        )}
        {...props}
      />
    </div>
  )
})
SidebarInput.displayName = "SidebarInput"

interface SidebarHeaderProps {
  children?: React.ReactNode
  className?: string
}

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarHeaderProps
>(({ children, className, ...props }, ref) => {
  const { isExpanded } = useSidebar()
  
  return (
    <div
      ref={ref}
      data-state={isExpanded ? "expanded" : "collapsed"}
      className={cn(
        "flex h-14 items-center gap-2 border-b border-sidebar-border py-4",
        !isExpanded && "justify-center h-14 px-0", // Center when collapsed
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

interface SidebarFooterProps {
  children?: React.ReactNode
  className?: string
}

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarFooterProps
>(({ children, className, ...props }, ref) => {
  const { isExpanded } = useSidebar()
  
  return (
    <div
      ref={ref}
      data-state={isExpanded ? "expanded" : "collapsed"}
      className={cn(
        "shrink-0 border-t border-sidebar-border/20",
        !isExpanded && "flex justify-center", // Center when collapsed
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"

interface SidebarContentProps {
  children?: React.ReactNode
  className?: string
}

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarContentProps
>(({ children, className, ...props }, ref) => {
  const { isExpanded } = useSidebar()
  
  return (
    <div
      ref={ref}
      data-state={isExpanded ? "expanded" : "collapsed"}
      className={cn("flex-1 overflow-auto", !isExpanded && "px-0", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"

interface SidebarSeparatorProps {
  className?: string
}

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mb-2 mt-2 h-px bg-sidebar-border/30", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

export { SidebarInput, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarContent }
