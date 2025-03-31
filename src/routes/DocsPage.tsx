
import React from 'react';
import { DocIndex } from '@/components/docs/DocIndex';
import { AlertDoc } from '@/components/docs/examples/AlertDoc';
import { EnvConfigDoc } from '@/components/docs/patterns/EnvConfigDoc';

export function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DocIndex />
      
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">UI Components</h2>
        <AlertDoc />
        {/* Add more component docs here */}
      </section>
      
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Development Patterns</h2>
        <EnvConfigDoc />
        {/* Add more pattern docs here */}
      </section>
    </div>
  );
}

export default DocsPage;
