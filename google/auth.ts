import { google } from "googleapis";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const googleAuth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export const getGoogleAuth = async (req: NextRequest) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? "",
  });
  if (!token?.access_token) {
    throw new Error("No access token found");
  }

  googleAuth.setCredentials({
    access_token: token?.access_token as string,
  });

  return googleAuth;
};
