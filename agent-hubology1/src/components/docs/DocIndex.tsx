
import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import ComponentDoc from './ComponentDoc';

interface DocIndexProps {
  className?: string;
}

export function DocIndex({ className }: DocIndexProps) {
  return (
    <div className={cn("container py-8", className)}>
      <header className="mb-8 border-b pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Property Agency System Documentation</h1>
        </div>
        <p className="mt-2 text-muted-foreground text-lg">
          Reference documentation for components, patterns, and utilities
        </p>
      </header>
      
      <div className="grid gap-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <ComponentDoc
            title="Introduction"
            description="This documentation site provides comprehensive information about the components, patterns, and utilities used throughout the Property Agency System."
            critical={true}
            notes="This documentation is generated programmatically and maintained alongside the codebase. Always refer to the latest version."
          >
            <p className="text-muted-foreground mb-4">
              Use the navigation to explore different sections of the documentation. Each component includes examples, props documentation, and usage notes to help you understand how to use it effectively.
            </p>
          </ComponentDoc>
        </section>
      </div>
    </div>
  );
}

export default DocIndex;
