
import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebar } from "./sidebar-context"

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
      className={cn(
        "flex flex-col gap-1 data-[state=collapsed]:items-center",
        className
      )}
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
  active?: boolean
}

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & SidebarMenuItemProps
>(({ children, className, active, ...props }, ref) => {
  const { open } = useSidebar()
  
  return (
    <li
      ref={ref}
      data-active={active}
      className={cn(
        "flex items-center",
        active ? "font-medium" : "font-normal",
        !open && "justify-center", // Center icons when collapsed
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost"
  asChild?: boolean
  tooltip?: string
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLElement> & SidebarMenuButtonProps
>(
  (
    { asChild = false, className, variant = "default", children, tooltip, ...props },
    ref
  ) => {
    const { open } = useSidebar()
    const Comp = asChild ? React.Fragment : "button"
    const childProps = asChild ? {} : { ref, ...props }

    // Get the child element if it's a React element
    const childElement = React.isValidElement(children) ? children : null;
    
    // Extract icon and text from children
    let icon: React.ReactNode = null;
    let text: React.ReactNode = null;
    
    // If asChild is true and there's a valid child element
    if (asChild && childElement) {
      const childrenOfChild = React.Children.toArray(childElement.props.children);
      // Assume the first child is the icon
      if (childrenOfChild.length > 0) {
        icon = childrenOfChild[0];
        if (childrenOfChild.length > 1) {
          text = childrenOfChild.slice(1);
        }
      }
    } else {
      // For non-asChild usage, assume the first child is the icon and the rest is text
      const childArray = React.Children.toArray(children);
      if (childArray.length > 0) {
        icon = childArray[0];
        if (childArray.length > 1) {
          text = childArray.slice(1);
        }
      }
    }

    const Content = (
      <Comp
        className={cn(
          "flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
          "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          "focus-visible:bg-sidebar-accent/50 focus-visible:text-sidebar-accent-foreground",
          "group dark:focus-visible:text-accent",
          variant === "outline" && "border border-sidebar-border",
          variant === "ghost" && "hover:bg-transparent hover:underline",
          !open && "justify-center px-0", // Center and remove padding when collapsed
          className
        )}
        {...childProps}
      >
        {asChild ? (
          children
        ) : (
          <>
            {icon}
            {open && text}
          </>
        )}
      </Comp>
    );

    // If sidebar is collapsed and tooltip is provided, wrap with tooltip
    if (!open && tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {Content}
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-1">
            {tooltip || (text && String(text))}
          </TooltipContent>
        </Tooltip>
      );
    }

    return Content;
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";


interface SidebarMenuActionProps {
  children?: React.ReactNode
  className?: string
  small?: boolean
}

const SidebarMenuAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarMenuActionProps
>(({ children, className, small, ...props }, ref) => {
  const { open } = useSidebar()
  
  // Don't render actions when sidebar is collapsed
  if (!open) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2",
        small ? "text-xs" : "text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

interface SidebarMenuBadgeProps {
  children?: React.ReactNode
  className?: string
  compact?: boolean
}

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarMenuBadgeProps
>(({ children, className, compact, ...props }, ref) => {
  const { open } = useSidebar()
  
  // Render compact version when sidebar is collapsed
  return (
    <Badge
      ref={ref}
      variant="outline"
      className={cn(
        "ml-auto bg-sidebar-accent/20 border-sidebar-accent/20 text-sidebar-accent-foreground",
        !open || compact ? "h-5 w-5 p-0 text-xs" : "h-5 px-1.5 py-0 text-xs",
        className
      )}
      {...props}
    >
      {children}
    </Badge>
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
