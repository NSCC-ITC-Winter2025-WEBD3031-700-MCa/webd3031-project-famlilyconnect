import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB"; 

export async function POST(req: NextRequest) {
  const { inviteCode } = await req.json();

  if (!inviteCode) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  try {
  
    const invitation = await prisma.invitation.findUnique({
      where: { inviteCode: inviteCode },
    });


    if (!invitation) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return NextResponse.json({ error: "Code has expired" }, { status: 400 });
    }


    const user = await prisma.user.upsert({
      where: { email: invitation.email },
      update: {}, 
      create: { email: invitation.email }, 
    });


    await prisma.familyMember.create({
      data: {
        userId: user.id,
        familyId: invitation.familyId,
      },
    });

    await prisma.invitation.delete({
      where: { inviteCode: inviteCode },
    });

    return NextResponse.json(
      { message: "Successfully joined family", familyId: invitation.familyId },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
