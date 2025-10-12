import dbConnect from "@/lib/dbConnect";
import userModel

    from "@/app/models/user";
import { success } from "zod";
import { date } from "zod/v3";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodeusername = decodeURIComponent(username);


        const user = await userModel.findOne({ username: decodeusername })

        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {
                status: 500

            })

        }
        const isCodevalid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
 if(isCodevalid && isCodeNotExpired) {
    user.isVerified = true 
    await user.save()
      return Response.json({
                success: true,
                message: " accout verified  or user   expitry updated successfully"
            }, {
                status: 200

            })
 
 }
else if(!isCodeNotExpired){
    return Response.json(
    {
        success:true,
        message:"verification got  expired"
    },{
        status:400
    }
    )
}else{
    return Response.json({
        success:false,
        message:"Incorect Verification code"
    },{
        status:400

    })

}






    } catch (error) {
        console.error("Error checking while verify")
        return Response.json({
            success: false,
            message: "Error while verifying user"
        }, {
            status: 500

        })

    }

}