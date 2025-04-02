import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

export async function PUT(req: NextRequest, context:any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: familyId, memberId } = await context.params;
  const { role } = await req.json();

  // Validate inputs
  if (!familyId || !memberId || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Verify requesting user is OWNER of the family
    const requestingMember = await prisma.familyMember.findFirst({
      where: {
        familyId: familyId as string,
        userId: session.user.id,
        role: 'admin',
      },
    });

    if (!requestingMember) {
      return NextResponse.json({ error: 'Only family owners can change roles' }, { status: 403 });
    }

    // Get the target member
    const targetMember = await prisma.familyMember.findUnique({
      where: {
        id: memberId as string,
        familyId: familyId as string,
      },
      include: {
        user: true,
      },
    });

    if (!targetMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Prevent self-modification
    if (targetMember.userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot modify your own role' }, { status: 400 });
    }

    // Prevent setting OWNER role through this endpoint
    if (role === 'admin') {
      return NextResponse.json({ 
        error: 'Use the ownership transfer endpoint to change owners' 
      }, { status: 400 });
    }

    // Update the role
    const updatedMember = await prisma.familyMember.update({
      where: {
        id: memberId as string,
      },
      data: {
        role: role as 'editor' | 'viewer',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMember, { status: 200 });
  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}