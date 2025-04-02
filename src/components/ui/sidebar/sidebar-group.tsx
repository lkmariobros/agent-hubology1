
import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarGroupProps {
  children?: React.ReactNode
  className?: string
}

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarGroupProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mb-2 px-2 last:mb-0", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

interface SidebarGroupLabelProps {
  children?: React.ReactNode
  className?: string
  collapsible?: boolean
  defaultOpen?: boolean
}

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarGroupLabelProps
>(
  (
    { children, className, collapsible, defaultOpen = true, ...props },
    ref
  ) => {
    const { open: sidebarOpen } = useSidebar()
    const [open, setOpen] = React.useState(defaultOpen)

    // When sidebar is collapsed, don't show labels
    if (!sidebarOpen) {
      return null
    }
    
    return (
      <div
        ref={ref}
        data-state={open ? "open" : "closed"}
        className={cn(
          "flex select-none items-center justify-between py-1 text-xs font-medium text-sidebar-foreground/70",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {collapsible && (
          <button onClick={() => setOpen(!open)} className="h-4 w-4">
            {open ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            <span className="sr-only">Toggle</span>
          </button>
        )}
      </div>
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

interface SidebarGroupActionProps {
  children?: React.ReactNode
  className?: string
}

const SidebarGroupAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarGroupActionProps
>(({ children, className, ...props }, ref) => {
  const { open } = useSidebar()
  
  // Don't show actions when sidebar is collapsed
  if (!open) {
    return null
  }
  
  return (
    <div
      ref={ref}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

interface SidebarGroupContentProps {
  children?: React.ReactNode
  className?: string
  collapsible?: boolean
}

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarGroupContentProps
>(({ children, className, collapsible, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        collapsible &&
          "data-[state=closed]:hidden data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
}
