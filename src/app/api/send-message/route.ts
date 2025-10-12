  
  
  
  import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/user";
import { Message



 } from "@/app/models/user";

import {User} from 'next-auth'
import { success } from "zod";import { messageSchema } from "@/schemas/messageSchema";
await dbConnect()
   export async function POST(request:Request) {
  await dbConnect()
const {username,content} =await request.json()

try {
    
    const user = await  userModel.findOne({username})

    if(!user){
        return Response.json({
            success:false,
            message:'User not found'

        },{status:404})
    }
    // is user exapeting message

    if(!user.isAcceptingMessage){
                return Response.json({
            success:false,
            message:'User is not Accepting messge'

        },{status:403})

    }

    const newMessage= {content,createdAt :new Date()}

    user.message.push(newMessage as Message)

    await user.save()

            return Response.json({
            success:true,
            message:'User message send successfully'

        },{status:201})
} catch (error) {
console.error('UnExpected  error :',error)
            return Response.json({
            success:false,
            message:'Error message'

        },{status:500})
    
}
    
   }