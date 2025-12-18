"use client";

import { SessionProvider } from "next-auth/react";
import AuthProvider from "./AuthProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>{children}</AuthProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
};
