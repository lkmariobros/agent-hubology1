
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function DocButton() {
  return (
    <Link to="/docs">
      <Button variant="outline" size="sm" className="gap-2">
        <BookOpen className="h-4 w-4" />
        Documentation
      </Button>
    </Link>
  );
}

export default DocButton;
