import { Prisma, PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: any ){
  try{
    const { id } = await context.params; // Extract the 'id' from params
    
    if(!id){
      return new Response("User Id not found", {status:404})
    }
    const prisma = new PrismaClient();
    const userPosts = await prisma.post.findMany({
      where: { authorId: id },
      select: {
        id: true,
        content: true,
        authorId: true,
        familyId: true,
        createdAt: true,
      },
    });
    if(!userPosts){
      return new Response("User Posts not found", {status:404})
    }
      return NextResponse.json(userPosts)
  }catch(error){
    console.error("Database error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}