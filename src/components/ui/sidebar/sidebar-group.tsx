
import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("pb-4", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  if (collapsed) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "px-3 py-2 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    />
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

export interface SidebarGroupCollapsibleProps
  extends React.ComponentPropsWithoutRef<typeof Collapsible> {
  label: string
  icon?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  tooltipLabel?: string
}

export const SidebarGroupCollapsible = React.forwardRef<
  HTMLDivElement,
  SidebarGroupCollapsibleProps
>(
  (
    {
      className,
      children,
      open,
      defaultOpen,
      onOpenChange,
      label,
      icon,
      tooltipLabel,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar()
    const collapsed = state === "collapsed"

    if (collapsed) {
      return (
        <div ref={ref} className={cn("relative", className)} {...props}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-9 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                {icon}
              </div>
            </TooltipTrigger>
            <TooltipContent className="flex items-center" side="right">
              {tooltipLabel || label}
            </TooltipContent>
          </Tooltip>
        </div>
      )
    }

    return (
      <Collapsible
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        className={className}
        ref={ref}
        {...props}
      >
        <CollapsibleTrigger className="flex h-9 w-full items-center rounded-md px-3 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="flex-1 truncate">{label}</span>
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 pt-1">
          {children}
        </CollapsibleContent>
      </Collapsible>
    )
  }
)
SidebarGroupCollapsible.displayName = "SidebarGroupCollapsible"
