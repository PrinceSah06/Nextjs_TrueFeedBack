import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSehema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVarified:boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSehema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    match:[/.+\@.+\..+/,"Please use a valid email address"]
  },
  password: {
    type: String,
    required: [true,"password is required"]
  },
  verifyCode: {
    type: String,
    required: [true,"varifycode is required"]
  },
  verifyCodeExpiry: {
    type: Date,
 required: [true,"code Expirey  is required"]
  },
  isVarified:{
    type:Boolean,
    required:[true,'isvarified is required ']

  },
  isAcceptingMessage: {
    type: Boolean,
    required: true,
  },
    message:[MessageSehema]
});

const userModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSehema))

export default userModel;