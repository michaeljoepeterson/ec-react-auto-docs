import { googleService } from "@/google/googleService";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const coreSheets = await googleService.getCoreSheet(request);
  return Response.json({ data: coreSheets });
};
