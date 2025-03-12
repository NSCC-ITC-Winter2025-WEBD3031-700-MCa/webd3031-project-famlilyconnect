import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/utils/email"; 
import { nanoid } from "nanoid"; 

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, familyId, inviterId } = await req.json();

    console.log("Received data:", { email, familyId, inviterId });

    const inviteCode = nanoid(10); 
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    const invitation = await prisma.invitation.create({
      data: {
        email,
        inviteCode,
        familyId,
        invitedBy: inviterId,
        expiresAt,
      },
    });

    
    await sendEmail({
      to: email,
      subject: "Join Family Connect",
      html: `<p>You are invited to join the family group! copy the code below and paste it in the app to join the family group</p>
      <p>Code: ${inviteCode}</p>`,
    });

    return NextResponse.json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "sever issue" }, { status: 500 });
  }
}
