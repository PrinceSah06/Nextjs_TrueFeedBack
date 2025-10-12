import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/user";
import {User} from 'next-auth';
import { success } from "zod";
import mongoose from "mongoose";


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
  const userId =  new mongoose.Types.ObjectId(user._id);


  try {
    
    const user = await userModel.aggregate([{
        $match:{id:userId},

    },{$unwind:'$message'},{
        $sort:{
            'message.createdAt':-1
        }
    },{
        $group:{
            _id:"$_id",
            message:{$push:'$message'}
        }
    }])

    if(!user || user.length === 0){
        return Response.json({
            success:false,
            message:'User not found '
        },{status:401})
    }


    return Response.json({
        success:true,
        message:user[0].message
    },{status:201})
  } catch (error) {
    console.error("",error)
    return Response.json({
        success:"",
        message:"dff"
    },
{status:404})
  }
}