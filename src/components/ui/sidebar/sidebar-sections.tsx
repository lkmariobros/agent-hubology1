
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "./sidebar-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export const SidebarWrapper = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ className, children, defaultOpen, open, onOpenChange, ...props }, ref) => {
  return (
    <div className="flex w-full h-full" ref={ref} {...props}>
      {children}
    </div>
  )
})
SidebarWrapper.displayName = "SidebarWrapper"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const { isMobile, state, toggleSidebar } = useSidebar()
  const Comp = asChild ? Slot : Button

  return (
    <Comp
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "data-[state=open]:bg-accent/50",
        isMobile && "md:hidden",
        className
      )}
      onClick={() => toggleSidebar()}
      data-state={state === "expanded" ? "open" : "closed"}
      {...props}
    >
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Comp>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    tooltipTitle?: string
  }
>(({ className, children, tooltipTitle, ...props }, ref) => {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  if (collapsed && tooltipTitle) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={ref}
            className={cn(
              "flex h-14 shrink-0 items-center border-b border-border px-4",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center">
          {tooltipTitle}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 shrink-0 items-center border-b border-border px-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "shrink-0 mt-auto pt-2 border-t border-border",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <div
      ref={ref}
      className={cn(
        "duration-200 flex min-h-screen flex-1 transition-[margin] ease-linear",
        collapsed
          ? "ml-[var(--sidebar-width-icon)]"
          : "ml-[var(--sidebar-width)]",
        className
      )}
      data-sidebar-inset={true}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"
