import { googleSheetService } from "@/google/googleSheetService";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const coreSheets = await googleSheetService.getCoreSheet(request);
  return Response.json({ data: coreSheets });
};
