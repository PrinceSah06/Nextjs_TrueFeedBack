import dbConnect
    from "@/lib/dbConnect";
import userModel from "@/app/models/user";
import bcrypt from "bcryptjs"
import { sendVarificationEmail } from "@/helper/sendVerificationEmail";
import { boolean, string, success } from "zod";
import { Boldonse } from "next/font/google";


sendVarificationEmail
export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await userModel.findOne({
            username, isVarified: true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false, message: "Username is already taken"
            }), { status: 500 }
        }

        const existingUserVerifiedByEmail = await userModel.findOne({ email })

        const verifyCade = Math.floor(100000+ Math.random()*900000).toString()
        if (existingUserVerifiedByEmail) {
            if(existingUserVerifiedByEmail.isVarified){
                return Response.json({
                    success:false,
                    message:"User is already registerd with this email"
                }),{status:400
        
                }
            }         else {
            
            const hashPassword = await bcrypt.hash(password,10)
            existingUserVerifiedByEmail.password = hashPassword;
            existingUserVerifiedByEmail.verifyCode= verifyCade;
            existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now()*3600000)

            await existingUserVerifiedByEmail.save()
         }
         }
 else {
          
        }
            const handelPassword = await bcrypt.hash(password, 10)

          const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser =    new userModel({
            username,
            email,
            password: handelPassword,
            verifyCade,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: []
        })

        await newUser.save()

    //send verification email

    const emailResponse = await sendVarificationEmail(email,username,verifyCade)

    if(!emailResponse.success){
        return Response.json({
            success:false,message:emailResponse.message
        }),{
            status:500
        }
    }
        return Response.json({
            success:true,message:'User registerd successfully ,please verify your emial '
        }),{
            status:201
        }

    } catch
    (error) {
        console.error('error register :', error)
        return Response.json({
            success: false,
            message: "Error Registering user"
        }), {
            status: 500
        }
    }
}