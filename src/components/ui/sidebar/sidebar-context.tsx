import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "4.5rem" // Increased width for better icon visibility

type SidebarState = "expanded" | "icon" | "collapsed";

type SidebarContext = {
  state: SidebarState;
  isExpanded: boolean;
  isIconOnly: boolean;
  isCollapsed: boolean;
  setOpen: (open: SidebarState) => void;
  toggleSidebar: () => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
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
  defaultState?: SidebarState;
  state?: SidebarState;
  onStateChange?: (state: SidebarState) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & SidebarProviderProps
>(
  (
    {
      defaultState = "expanded",
      state: stateProp,
      onStateChange: setStateProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // Internal state management
    const [_state, _setState] = React.useState<SidebarState>(defaultState)
    const state = stateProp ?? _state
    const isExpanded = state === "expanded"
    const isIconOnly = state === "icon"
    const isCollapsed = state === "collapsed"
    
    const setOpen = React.useCallback(
      (value: SidebarState | ((value: SidebarState) => SidebarState)) => {
        const newState = typeof value === "function" ? value(state) : value
        if (setStateProp) {
          setStateProp(newState)
        } else {
          _setState(newState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${newState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        
        // Dispatch event for localStorage update
        localStorage.setItem(SIDEBAR_COOKIE_NAME, String(newState));
        window.dispatchEvent(new StorageEvent('storage', {
          key: SIDEBAR_COOKIE_NAME,
          newValue: String(newState),
          storageArea: localStorage
        }));
      },
      [setStateProp, state]
    )

    // Helper to cycle through sidebar states
    const toggleSidebar = React.useCallback(() => {
      if (isMobile) {
        setOpenMobile((open) => !open)
        return
      }
      
      // Cycle through states: expanded -> icon -> collapsed -> expanded
      setOpen((currentState) => {
        if (currentState === "expanded") return "icon"
        if (currentState === "icon") return "collapsed"
        return "expanded"
      })
    }, [isMobile, setOpen, setOpenMobile])

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
        isExpanded,
        isIconOnly,
        isCollapsed,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, isExpanded, isIconOnly, isCollapsed, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
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
