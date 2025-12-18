import { googleDocService } from "@/google/googleDocService";

export const POST = async (request: Request) => {
  const reqBody = await request.json();
  console.log("EC Doc Request Body:", reqBody);
  await googleDocService.createSampleDoc(reqBody);
  return Response.json({ message: "EC Doc created successfully" });
};
