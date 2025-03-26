import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request, context: any ) {
  try {

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: familyId } = await context.params;

    if (!familyId) {
      return NextResponse.json({ error: "Family ID is required" }, { status: 400 });
    }

    const { title, date,  description, place } = await req.json();

    console.log(title, date, description, place);
    if (!title || !date || !place) {
      return NextResponse.json(
        { error: "Title, date, and place are required" },
        { status: 400 }
      );
    }

    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }

    if (family.members.length === 0) {
      return NextResponse.json(
        { error: "User not in family" },
        { status: 403 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        createdAt: new Date(date),
        status: "pending",
        place: place,
        family: { connect: { id: familyId } },
        creator: { connect: { id: session.user.id } }, 
      }
    });


    return NextResponse.json(event, { status: 201 });

  } catch (error) {
    console.error("[EVENT_CREATION_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}