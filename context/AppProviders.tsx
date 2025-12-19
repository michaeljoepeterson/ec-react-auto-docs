"use client";

import { SessionProvider } from "next-auth/react";
import AuthProvider from "./AuthProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { APIProvider } from "@vis.gl/react-google-maps";
import { NotificationProvider } from "./NotificationProvider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_KEY || ""}>
        <NotificationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>{children}</AuthProvider>
          </LocalizationProvider>
        </NotificationProvider>
      </APIProvider>
    </SessionProvider>
  );
};
