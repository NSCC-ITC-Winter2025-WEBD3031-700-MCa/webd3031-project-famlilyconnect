import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params;
    // Fetch user details along with their family groups
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        familyMembers: {
          select: {
            family: {
              select: {
                id: true,
                name: true,
                _count: {
                  select: { members: true }, 
                },
              },
            },
            role: true,
            isMainFamily: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response to include user details and family groups
    const formattedUser = {
      ...user,
      familyGroups: user.familyMembers.map((member) => ({
        id: member.family.id,
        name: member.family.name,
        role: member.role,
        isMainFamily: member.isMainFamily,
      })),
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const { name} = await req.json();

    // Update user details
    const updatedUser = await prisma.user.update({
      where: { id },  
      data: { name},
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {  
  try {
    const { id } = await context.params;

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}