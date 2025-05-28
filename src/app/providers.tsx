'use client'
import { SessionProvider } from "next-auth/react";
import { ProgressProvider } from '@bprogress/next/app';

interface RootProvidersProps {
  children: React.ReactNode;
}
export function RootProviders({ children }: RootProvidersProps) {
  return (
    <SessionProvider>
      <ProgressProvider
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </SessionProvider>
  );
}
