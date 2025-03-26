import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context:any) {
  try {

    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id: familyId, eventId } = await context.params;


    const familyMember = await prisma.familyMember.findFirst({
      where: {
        familyId,
        userId: session.user.id
      }
    });

    if (!familyMember) {
      return NextResponse.json(
        { error: "You don't have permission to delete events in this family" },
        { status: 403 }
      );
    }

    const deletedEvent = await prisma.event.delete({
      where: {
        id: eventId,
        familyId
      }
    });

    return NextResponse.json(
      { message: "Event deleted successfully", deletedEvent },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { familyId: string; eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { familyId, eventId } = params;
    const { status } = await req.json();

    // Verify user has permission
    const familyMember = await prisma.familyMember.findFirst({
      where: { familyId, userId: session.user.id }
    });
    if (!familyMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId, familyId },
      data: { status }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}