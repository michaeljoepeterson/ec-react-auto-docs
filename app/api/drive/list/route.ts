import { google } from "googleapis";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? "",
  });
  if (!token?.access_token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: token?.access_token as string,
  });

  const drive = google.drive({
    version: "v3",
    auth,
  });

  const res = await drive.files.list({
    pageSize: 10,
    fields: "files(id, name)",
  });

  console.log("Drive Files:", res.data.files?.length);

  return Response.json(res.data);
}
