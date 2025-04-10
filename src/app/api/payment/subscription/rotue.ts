// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/auth";
// import { prisma } from "@/utils/prismaDB";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return NextResponse.json({ isSubscribed: false }, { status: 200 });
//   }

//   const subscription = await prisma.subscription.findUnique({
//     where: {
//       userId: session.user.id,
//     },
//   });

//   return NextResponse.json({
//     isSubscribed: subscription?.status === "active",
//   });
// }
