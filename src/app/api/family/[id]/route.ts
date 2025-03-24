import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params; 

    const family = await prisma.family.findUnique({
      where: { id: id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        photos: {  
          include: {
            uploader: { 
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }

    return NextResponse.json(family);
  } catch (error) {
    console.error("Error fetching family:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
