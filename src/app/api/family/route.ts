import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { User } from 'next-auth';
import { prisma } from '@/utils/prismaDB';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as { user: User & { id: string } };

  console.log("session", session);


  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }


  const existingMainFamily = await prisma.familyMember.findFirst({
    where: {
      userId: session?.user?.id,
      isMainFamily: true,
    },
  });

  if (existingMainFamily) {
    return NextResponse.json(
      { message: 'You already have a main family group.' },
      { status: 400 }
    );
  }


  const body = await request.json();
  const { name } = body;


  if (!name) {
    return NextResponse.json(
      { message: 'Family name is required.' },
      { status: 400 }
    );
  }

  try {

    const newFamily = await prisma.family.create({
      data: {
        name,
        members: {
          create: {
            userId: session.user.id, 
            role: 'admin',
            isMainFamily: true, 
          },
        },
      },
      include: {
        members: true, 
      },
    });

    return NextResponse.json(newFamily, { status: 201 });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json(
      { message: 'Failed to create family group.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {

  const session = await getServerSession(authOptions) as { user: User & { id: string } };


  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }


  if (!session?.user?.id) {
    return NextResponse.json(
      { message: 'User ID is missing in session.' },
      { status: 401 }
    );
  }

  try {

    const families = await prisma.family.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
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
      },
    });


    return NextResponse.json(families, { status: 200 });
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { message: 'Failed to fetch family groups.' },
      { status: 500 }
    );
  }
}