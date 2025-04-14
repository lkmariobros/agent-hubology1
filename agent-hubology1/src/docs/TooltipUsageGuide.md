
# Tooltip Usage Guide

## Overview

Tooltips in our application use Radix UI's tooltip primitives through our shadcn/ui components. Proper usage requires understanding the component hierarchy and provider pattern.

## Component Structure

Tooltips require the following structure:

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Button or element that triggers the tooltip</TooltipTrigger>
    <TooltipContent>Tooltip content goes here</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Global Provider

Our application has a global `TooltipProvider` in `main.tsx` that wraps the entire application. This means most components don't need to include their own provider.

## Best Practices

1. **Always use the complete structure**:
   
   ```tsx
   <Tooltip>
     <TooltipTrigger asChild>
       <Button>Hover me</Button>
     </TooltipTrigger>
     <TooltipContent>
       <p>Tooltip text</p>
     </TooltipContent>
   </Tooltip>
   ```

2. **Use `asChild` with `TooltipTrigger` when wrapping custom components**:
   
   ```tsx
   <TooltipTrigger asChild>
     <Button>Hover me</Button>
   </TooltipTrigger>
   ```

3. **For complex scenarios, use our utility component**:
   
   ```tsx
   import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

   // Use when you're not sure if the component will be used within a TooltipProvider
   <TooltipWrapper>
     <YourComponentWithTooltips />
   </TooltipWrapper>
   ```

4. **For dynamic tooltips, consider the hook**:
   
   ```tsx
   import { useTooltipSafely } from '@/hooks/useTooltipSafely';

   const { SafeTooltip, TooltipTrigger, TooltipContent } = useTooltipSafely();

   <SafeTooltip>
     <TooltipTrigger asChild>
       <Button>Hover me</Button>
     </TooltipTrigger>
     <TooltipContent>
       <p>Tooltip text</p>
     </TooltipContent>
   </SafeTooltip>
   ```

## Common Issues

- **Error: `Tooltip` must be used within `TooltipProvider`**: This occurs when a Tooltip component is rendered outside of a TooltipProvider context. Make sure your component is a child of TooltipProvider.

- **Tooltip not showing**: Check that you have properly structured your tooltip with both trigger and content components.

- **Multiple tooltips in a component**: Each Tooltip needs its own trigger and content, but they can all share a single TooltipProvider.
