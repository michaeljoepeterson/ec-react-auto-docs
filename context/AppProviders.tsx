"use client";

import { SessionProvider } from "next-auth/react";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
