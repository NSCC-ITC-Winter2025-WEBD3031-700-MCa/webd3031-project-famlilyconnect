import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const { imageUrl } = await req.json();
    // Update user image
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { image: imageUrl },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user image:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}