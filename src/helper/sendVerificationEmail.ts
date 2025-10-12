// import {resend} from "@/lib/resend";
// import { ApiResponse } from "@/types/ApiResponse";
// import VerificationEmail from "../../emails/VarificationEmail"
// import { promises } from "dns";
// // import {Email}


// export async function sendVarificationEmail(email:string,username:string,verifyCode:string)
// :Promise<ApiResponse>{
//     try {
//         await resend.emails.send({
//             from:'You@example.com',
//             to:email,
//             subject:'MY Next otp | Verification code',
//             react:(VerificationEmail({username,otp:verifyCode}))
//         })
//         return { success:true,message:'Verification email send successfully'}
        
//     } catch (error) {
//         console.error("Error sending varification email")
//         return{success:false,message:'failed to send verifycation email'}
        
//     }

// }

import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VarificationEmail";

export async function sendVarificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      // 🟢 Use the provided test email address.
      from: 'onboarding@resend.dev', 
      to: email, // 🟢 You can send to any email address for verification
      subject: 'My Next OTP | Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, message: `Failed to send verification email. Resend Error: ${error.message}` };
    }

    return { success: true, message: 'Verification email sent successfully' };
    
  } catch (emailError: any) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: `Failed to send verification email. Reason: ${emailError.message}` };
  }
}

