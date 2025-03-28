import { Prisma, PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Fetching user with ID:", params.id); // ✅ Debugging log
    
    if (!params.id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      console.error("User not found:", params.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user); // ✅ Only return the user object
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

