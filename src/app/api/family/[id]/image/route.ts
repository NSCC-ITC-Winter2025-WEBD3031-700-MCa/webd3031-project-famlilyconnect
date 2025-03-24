import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/utils/auth';

interface PhotoResponse {
  id: string;
  url: string;
  uploader: {
    id: string;
    name: string | null;
    email: string | null;
  };
  createdAt: Date;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export async function POST(req: NextRequest, context: any) {
  const { id: familyId } = await context.params;
  const { url, publicId } = await req.json();

  // Input validation
  if (!url || typeof url !== 'string' || !url.startsWith('https://res.cloudinary.com/')) {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
  }

  if (!publicId || typeof publicId !== 'string') {
    return NextResponse.json({ error: 'Invalid public ID' }, { status: 400 });
  }

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

    // Create photo record
    const photo = await prisma.photo.create({
      data: {
        url,
        uploaderId: session.user.id,
        familyId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const response = NextResponse.json<PhotoResponse>(photo);
    response.headers.set('Cache-Control', 'no-store');
    return response;

  } catch (error: unknown) {
    console.error('Photo upload error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to upload photo' }, 
      { status: 500 }
    );
  }
}