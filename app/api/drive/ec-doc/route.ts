import { googleDocService } from "@/google/googleDocService";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  await googleDocService.createSampleDoc(request, body);
  return Response.json({ message: "EC Doc created successfully" });
};
