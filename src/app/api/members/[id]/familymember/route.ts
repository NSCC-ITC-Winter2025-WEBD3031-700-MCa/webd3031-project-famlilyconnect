import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: any) {
  const { id: userId } = await context.params;
  const prisma = new PrismaClient();

  try {
    const familyMember = await prisma.familyMember.findMany({
      where: { userId: userId },
      select: {
        id: true,
        userId: true,
        familyId: true,
        role: true,
        isMainFamily: true,
      },
    });

    if (!familyMember) {
    return NextResponse.json({ error: "Family member not found" }, { status: 404 });
    }

    return NextResponse.json(familyMember);
  }catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
