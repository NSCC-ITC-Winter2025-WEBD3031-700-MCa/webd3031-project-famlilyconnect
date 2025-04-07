import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context:any) {
  try {

    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id: familyId, memberId } = await context.params;


    const requestingMember = await prisma.familyMember.findFirst({
      where: {
        familyId: familyId as string,
        userId: session.user.id,
        role: 'admin',
      },
    });

    if (!requestingMember) {
      return NextResponse.json(
        { error: 'Only family owners can remove members' },
        { status: 403 }
      );
    }

    // Get the target member
    const targetMember = await prisma.familyMember.findUnique({
      where: {
        id: memberId as string,
        familyId: familyId as string,
      },
    });

    if (!targetMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Prevent self-removal
    if (targetMember.userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot remove yourself from family' },
        { status: 400 }
      );
    }

    // Delete the member
    await prisma.familyMember.delete({
      where: {
        id: memberId as string,
      },
    });

    return NextResponse.json({ message: 'Member removed successfully' }, { status: 200 });

  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}