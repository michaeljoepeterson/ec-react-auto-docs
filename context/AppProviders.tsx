"use client";

import { SessionProvider } from "next-auth/react";
import AuthProvider from "./AuthProvider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
};
