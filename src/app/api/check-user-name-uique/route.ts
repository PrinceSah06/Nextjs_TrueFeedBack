import dbConnect from "@/lib/dbConnect";
import {success, z} from "zod"
import userModel from "@/app/models/user";

import {userValidation} from "@/schemas/signUpSchema"

const UsernameQuerySchema = z.object({
    username:userValidation
})

export async function GET(request:Request) {
 
    await dbConnect()
    
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username:searchParams.get('username')

        }
        //validate with zod
     const result =   UsernameQuerySchema.safeParse(queryParam)
console.log('only for itersert ')
     console.log(result)
     if(!result.success){
        
        const UsernameError = result.error?.format().username?._errors|| []
     
    return Response.json({
        success:false,
        message:'Invalid query perameter error'
    },{
        status:400
    })


}
    const {username} = result.data

     const ExistingUser = await userModel.findOne({username,isVerified:true})


     if(ExistingUser){
return Response.json({
    success:false,
    message :'username is alerady taken '
},{
    status:400
}
)




     }
     return Response.json({
    success:true,
    message :'Username is uniqe'
},{
    status:200
})
    } catch (error) {
        console.error("Error checking user name",error)
        return Response.json(
            {
                success:false,
                message:"error checking username"
            },{
                status:500
            }
        )
        
    }
}