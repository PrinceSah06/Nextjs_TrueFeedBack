import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/user";


import {User} from 'next-auth'
import { success } from "zod";
export async function POST(request:Request) {
    await dbConnect()

   const session =await  getServerSession(authOptions,)

   const user:User = session?.user as User

   if(!session || !session.user){
    return Response.json({
        success:false,
        message:"not aurthenticated user"
    },{
        status:401
    })
   }
   const userId = user._id;

  const {accptMessage}=  await request.json()

   try {
    
    const user = await userModel.findByIdAndUpdate(userId,{isAcceptingMessage:accptMessage},{new :true})
 if (!user){
    return Response.json({
        success:false,
        message:"failed  to find user or user not find"

    },{status:401})
 }

 return Response.json({
    success:true,
    message:'Message acceptance status updated successfully'
    ,user
 },{
    status:401
 })



   } catch (error) {
    
    console.error("faild to update user status to accept message")
    return Response.json({
        success:false,
        message:"aild to update user status to accept message"
    },{
        status:401
    })
   }
    
}

 export async function GET(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
  const user = session?.user as User
   
  if(!session || session.user){
    return Response.json({
        success:false,
        message:"Not Authenticatied"
    },{ 
        status:401
    })
  }
  const userId = user._id
 try {
     const foundUser = await userModel.findById(userId);
     if(!foundUser){
       return Response.json({
           success:false,
           messagea:'User not found'
       },{
           status:401
       })  }
   
   
       return Response.json({
           success:true,isAcceptingMessage:foundUser.isAcceptingMessage
       },{status:200})
 } catch (error) {
    console.error("this is error in :  ",error)
return Response.json({
    success:false,
    message:'Error in geitng accepting message'

},{
    status:500
})
 }
}

