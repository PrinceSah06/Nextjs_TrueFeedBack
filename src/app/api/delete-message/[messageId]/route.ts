import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/user";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  await dbConnect();
  const messageId = params.messageId;
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticatied",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const updateResult = await userModel.updateOne(
      { _id: user._id },
      {
        $pull: {
          messages: { _id: messageId },
        },
      }
    );
    if (updateResult.modifiedCount == 0) {
      return Response.json(
        { success: false, message: "message not found or already deleted" },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message delete success fully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while delete message ",error);
    return Response.json(
      { 
        success: false, 
        message: "Error deleting message"
       },
      {
        status: 500,
      }
    );
  }
}
