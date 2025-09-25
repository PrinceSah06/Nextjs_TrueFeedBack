import {resend} from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VarificationEmail"
import { promises } from "dns";
// import {Email}


export async function sendVarificationEmail(email:string,username:string,verifyCode:string)
:Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from:'You@example.com',
            to:email,
            subject:'MY Next otp | Verification code',
            react:(VerificationEmail({username,otp:verifyCode}))
        })
        return { success:true,message:'Verification email send successfully'}
        
    } catch (error) {
        console.error("Error sending varification email")
        return{success:false,message:'failed to send verifycation email'}
        
    }

}