
import React from "react";
import { cn } from "@/lib/utils";

interface TimelineProps {
  children: React.ReactNode;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ children, orientation = "vertical", className }, ref) => {
    return (
      <div
        ref={ref}
        data-orientation={orientation}
        className={cn(
          "group/timeline relative",
          orientation === "vertical" && "space-y-4",
          orientation === "horizontal" && "flex space-x-4",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
Timeline.displayName = "Timeline";

interface TimelineItemProps {
  children: React.ReactNode;
  step?: number | string;
  completed?: boolean;
  className?: string;
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ children, step, completed = false, className }, ref) => {
    return (
      <div
        ref={ref}
        data-step={step}
        data-completed={completed}
        className={cn(
          "group/timeline-item relative",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
TimelineItem.displayName = "TimelineItem";

interface TimelineHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TimelineHeader = ({ children, className }: TimelineHeaderProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      {children}
    </div>
  );
};

interface TimelineTitleProps {
  children: React.ReactNode;
  className?: string;
}

const TimelineTitle = ({ children, className }: TimelineTitleProps) => {
  return (
    <h3 className={cn("font-medium", className)}>
      {children}
    </h3>
  );
};

interface TimelineSeparatorProps {
  className?: string;
}

const TimelineSeparator = ({ className }: TimelineSeparatorProps) => {
  return (
    <div
      className={cn(
        "absolute inset-y-0 left-3 w-0.5 bg-border",
        className
      )}
    />
  );
};

interface TimelineIndicatorProps {
  children?: React.ReactNode;
  className?: string;
}

const TimelineIndicator = ({ children, className }: TimelineIndicatorProps) => {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-input bg-background",
        className
      )}
    >
      {children}
    </div>
  );
};

interface TimelineContentProps {
  children: React.ReactNode;
  className?: string;
}

const TimelineContent = ({ children, className }: TimelineContentProps) => {
  return (
    <div className={cn("ml-2", className)}>
      {children}
    </div>
  );
};

interface TimelineDateProps {
  children: React.ReactNode;
  className?: string;
}

const TimelineDate = ({ children, className }: TimelineDateProps) => {
  return (
    <p className={cn("text-xs text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
};

export {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineTitle,
  TimelineSeparator,
  TimelineIndicator,
  TimelineContent,
  TimelineDate,
};
