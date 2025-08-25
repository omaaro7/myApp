// src\components\navigation-loader.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    // Add loading indicator when navigation starts
    window.addEventListener('beforeunload', showLoader);
    window.addEventListener('load', hideLoader);

    return () => {
      window.removeEventListener('beforeunload', showLoader);
      window.removeEventListener('load', hideLoader);
    };
  }, []);

  // Reset loading state when route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
      <div className="h-full bg-primary animate-[loading_1s_ease-in-out_infinite]" />
    </div>
  );
}
