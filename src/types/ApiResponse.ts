import { Message } from "@/app/models/user";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAccesptingMessage?:boolean
    messages?:Array<Message>
}