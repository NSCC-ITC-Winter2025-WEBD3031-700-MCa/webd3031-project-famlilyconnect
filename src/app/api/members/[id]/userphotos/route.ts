import { Prisma, PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


export async function GET(req: Request, context: any ) {
  try {
    const { id: uploaderId } = await context.params; // Extract the 'id' from params

    if (!uploaderId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    const photo = await prisma.photo.findMany({
      where: { uploaderId: uploaderId },
      select: {
       id: true,
       url: true,
       uploaderId: true,
       familyId: true,
       createdAt: true,
      },
    });

    if (!photo) {
      console.error("User photos not found:", uploaderId);
      return NextResponse.json({ error: "User photos not found" }, { status: 404 });
    }

    return NextResponse.json(photo)
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
