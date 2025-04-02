
import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"

export type SidebarState = "expanded" | "collapsed" | "icon"

type SidebarContext = {
  state: SidebarState
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

export interface SidebarProviderProps {
  defaultState?: SidebarState
  onStateChange?: (state: SidebarState) => void
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & SidebarProviderProps
>(
  (
    {
      defaultState = "expanded",
      onStateChange,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [state, setState] = React.useState<SidebarState>(defaultState)

    // Helper to toggle the sidebar between the three states
    const toggleSidebar = React.useCallback(() => {
      setState((prevState) => {
        let newState: SidebarState;
        if (prevState === "expanded") {
          newState = "icon";
        } else if (prevState === "icon") {
          newState = "collapsed";
        } else {
          newState = "expanded";
        }
        
        if (onStateChange) {
          onStateChange(newState);
        }
        return newState;
      });
    }, [onStateChange]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        isMobile,
        toggleSidebar,
      }),
      [state, isMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

// Import cn from utils
import { cn } from "@/lib/utils"
