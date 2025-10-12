import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/user";
import bcrypt from "bcryptjs";
import { sendVarificationEmail } from "@/helper/sendVerificationEmail";
// import { Response } from "next/server"; // Import Response for App Router
import { boolean, string, success } from "zod"; // This import is unused and should be removed.
import { Boldonse } from "next/font/google"; // This import is unused and should be removed.

// Note: The imports from 'zod' and 'next/font/google' are unused and can be safely removed to clean up your code.

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // 🟢 Error-proofing check: Validate that all fields are present.
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields in the request body.",
        },
        { status: 400 }
      );
    }

    const existingUserVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true, // Correcting `isVerified` to `isVerified`
    });

    if (existingUserVerifiedByUsername) {
      // Corrected Response syntax
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 500 }
      );
    }

    const existingUserVerifiedByEmail = await userModel.findOne({ email });

    const verifyCade = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        // Correcting `isVerified`
        // Corrected Response syntax
        return Response.json(
          {
            success: false,
            message: "User is already registered with this email",
          },
          { status: 400 }
        );
      } else {
        // User exists but is not verified, update their password and verification code.
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserVerifiedByEmail.password = hashPassword;
        existingUserVerifiedByEmail.verifyCode = verifyCade;
        existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        ); // 1 hour expiry
        await existingUserVerifiedByEmail.save();
      }
    } else {
      // New user, create a new entry
      const handelPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new userModel({
        username,
        email,
        password: handelPassword,
        verifyCode: verifyCade, // Correcting `verifyCade` to `verifyCode`
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVarificationEmail(
      email,
      username,
      verifyCade
    );

    if (!emailResponse.success) {
      // Corrected Response syntax
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    // Corrected Response syntax
    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    // Corrected Response syntax
    return Response.json(
      { success: false, message: "Error Registering user" },
      { status: 500 }
    );
  }
}
