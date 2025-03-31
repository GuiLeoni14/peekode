import { SessionProvider } from "next-auth/react";

interface RootProvidersProps {
  children: React.ReactNode;
}
export function RootProviders({ children }: RootProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
