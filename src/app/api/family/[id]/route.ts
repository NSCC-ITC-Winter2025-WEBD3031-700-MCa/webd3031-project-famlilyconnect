import { User } from 'lucide-react';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { User as AuthUser } from 'next-auth';

export async function GET(req: Request, context: any) {
  try {
    const session = await getServerSession(authOptions) as { user: AuthUser & { id: string } };
    const { id } = await context.params; 
    const userId = session.user.id;
    const familyId = id;
    if (!session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const isMember = await prisma.familyMember.findFirst({
      where: {
        familyId,
        userId,
      },
    });

    if (!isMember) {
      return new NextResponse('No longer a member', { status: 403 });
    }

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
        events: {
          include: {  
            creator: {  
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc' 
          }
        },
        posts: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc' 
          }
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

export async function DELETE (req:NextRequest, context:any){
  const session = await getServerSession(authOptions) as { user: AuthUser & { id: string } };

  if (!session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const {id} = await context.params;
  const userId = session.user.id;
  const familyId = id;

  try{
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
      },
    });

    if (!familyMember) {
      return NextResponse.json({ message: 'Family membership not found' }, { status: 404 });
    }

    // Check if this is the user's main family
    if (familyMember.isMainFamily) {
      return NextResponse.json({ message: 'Cannot leave your main family' }, { status: 403 });
    }

    // Remove the user from the family
    await prisma.familyMember.delete({
      where: {
        id: familyMember.id,
      },
    }); 

    return NextResponse.json({ message: 'Successfully left the family' }, {status: 200});
  } catch (err) {
    return NextResponse.json({ message: 'Failed to leave family' },{status: 500});
  }
}