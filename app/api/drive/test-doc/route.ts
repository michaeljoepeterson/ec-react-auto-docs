import { getGoogleAuth } from "@/app/_google/auth";
import { google } from "googleapis";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const googleAuth = await getGoogleAuth(req);
  const drive = google.drive({
    version: "v3",
    auth: googleAuth,
  });

  const res = await drive.files.create({
    requestBody: {
      name: "Internal Tool Doc",
      mimeType: "application/vnd.google-apps.document",
      parents: [process.env.FOLDER_ID || ""],
    },
  });

  return Response.json({ message: "Created Doc" });
};
