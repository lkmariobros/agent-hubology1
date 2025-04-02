
import * as React from "react"
import { PanelLeft } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useSidebar } from "./sidebar-context"
import { cn } from "@/lib/utils"

export interface SidebarProps {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  className?: string
  children: React.ReactNode
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & SidebarProps
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { state, isMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet defaultOpen={state !== "collapsed"} modal={true}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": "18rem",
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <TooltipProvider delayDuration={0}>
        <div
          ref={ref}
          className="group peer hidden md:block text-sidebar-foreground"
          data-state={state}
          data-collapsible={state === "icon" ? "icon" : state === "collapsed" ? "offcanvas" : ""}
          data-variant={variant}
          data-side={side}
        >
          {/* This is what handles the sidebar gap on desktop */}
          <div
            className={cn(
              "duration-300 relative h-svh bg-transparent transition-[width] ease-linear",
              state === "expanded" && "w-[--sidebar-width]",
              state === "icon" && "w-[--sidebar-width-icon]",
              state === "collapsed" && "w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset"
                ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
                : ""
            )}
          />
          <div
            className={cn(
              "duration-300 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex",
              side === "left"
                ? "left-0 group-data-[state=collapsed]:left-[calc(var(--sidebar-width)*-1)]"
                : "right-0 group-data-[state=collapsed]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust width based on state
              state === "expanded" && "w-[--sidebar-width]",
              state === "icon" && "w-[--sidebar-width-icon]", 
              state === "collapsed" && "w-0",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset"
                ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
                : "group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            )}
            {...props}
          >
            <div
              data-sidebar="sidebar"
              className={cn(
                "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </TooltipProvider>
    )
  }
)
Sidebar.displayName = "Sidebar"

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[state=collapsed]:translate-x-0 group-data-[state=collapsed]:after:left-full group-data-[state=collapsed]:hover:bg-sidebar",
        "[[data-side=left][data-state=collapsed]_&]:-right-2",
        "[[data-side=right][data-state=collapsed]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"
