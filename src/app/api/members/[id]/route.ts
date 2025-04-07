import { Prisma, PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


export async function GET(req: Request, context: any ) {
  try {
    const { id } = await context.params; // Extract the 'id' from params

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      console.error("User not found:", id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request,context: any){
  try{
    const { id } = await context.params; // Extract the 'id' from params

    if(!id){
      return new Response("User Id not found", {status:404})
    }
    const body = await req.json();
    const { name, email, role } = body; 
      const prisma = new PrismaClient();
      const updateUser = await prisma.user.update({
        where: { id: id },
        data:{
          name,
          email,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
      return new Response(JSON.stringify(updateUser), {status:200})
  }catch(error){
    return new Response("Failed to update user", {status:500})
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params; // Extract the 'id' from params

    if (!id) {
      return new Response("User Id not found", { status: 404 });
    }

    const prisma = new PrismaClient();
    const deleteUser = await prisma.user.delete({
      where: { id: id },
    });

    return new Response(JSON.stringify(deleteUser), { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response("Failed to delete user", { status: 500 });
  }
}