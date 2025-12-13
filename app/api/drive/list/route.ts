import { getGoogleAuth } from "@/app/_google/auth";
import { google } from "googleapis";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const googleAuth = await getGoogleAuth(req);

  const drive = google.drive({
    version: "v3",
    auth: googleAuth,
  });

  const res = await drive.files.list({
    pageSize: 10,
    fields: "files(id, name)",
  });

  console.log("Drive Files:", res.data.files?.length);

  return Response.json(res.data);
}
