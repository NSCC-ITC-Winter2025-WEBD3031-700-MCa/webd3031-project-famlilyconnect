// hooks/useAuth.ts
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function useAuth(isAuthenticated: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/signin'); // Redirect if not authenticated
    }
  }, [isAuthenticated, router]);

  return;
}
