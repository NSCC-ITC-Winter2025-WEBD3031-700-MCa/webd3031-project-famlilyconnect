import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req: NextRequest, context: any) {
  const { id: familyId, photoId } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify membership
    const membership = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: session.user.id,
          familyId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a family member' }, { status: 403 });
    }

    // Verify photo ownership
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { uploader: true },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    if (photo.uploader.id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete photo
    await prisma.photo.delete({ where: { id: photoId } });

    return NextResponse.json({ message: 'Photo deleted' });
  } catch (error) {
    return NextResponse.error();
  }
}