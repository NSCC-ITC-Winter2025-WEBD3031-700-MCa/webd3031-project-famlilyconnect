import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function GET() {
  try{
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
      }
    });
      return NextResponse.json(users)
  }catch(error){
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
  
}

