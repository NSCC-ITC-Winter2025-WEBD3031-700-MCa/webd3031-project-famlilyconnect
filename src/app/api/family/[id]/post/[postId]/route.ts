import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: familyId, postId } = context.params;


    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        familyId
      },
      include: {
        author: true
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const isAuthor = post.author.id === session.user.id;
    
    if (!isAuthor) {
      return NextResponse.json(
        { error: "You don't have permission to delete this post" },
        { status: 403 }
      );
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: postId
      }
    });

    return NextResponse.json(
      { message: "Post deleted successfully", deletedPost },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}