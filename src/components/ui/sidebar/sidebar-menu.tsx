
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    collapsed?: boolean
  }
>(({ className, collapsed, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1",
        className
      )}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    tooltipLabel?: string
    active?: boolean
    asChild?: boolean
  }
>(({ className, tooltipLabel, active, asChild, children, ...props }, ref) => {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const Comp = asChild ? Slot : "button"

  if (collapsed && tooltipLabel) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={ref}
            className={cn(
              "group flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active && "bg-sidebar-accent text-sidebar-accent-foreground",
              className
            )}
            {...props}
          >
            {children}
          </Comp>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center">
          {tooltipLabel}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Comp
      ref={ref}
      className={cn(
        "group flex h-9 w-full items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarMenuTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipContent>
>(({ className, sideOffset = 8, ...props }, ref) => {
  return (
    <TooltipContent
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuTooltipContent.displayName = "SidebarMenuTooltipContent"
