"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { acceptMassageSchema } from "@/schemas/accsptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import type { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import MessageCard from '@/components/messsageCard'

type Message = {
  _id: string;
  [key: string]: any;
};

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((m: any) => m._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMassageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMassage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get(`/get/accept-message`);

      setValue("acceptMassage", response.data.isAcceptingMessage);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast("error", {
        description:
          axiosError.response?.data.message || "error while accepting message",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get("/get/messages");
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast("error", {
        description:
          axiosError.response?.data.message || "error while fetching messages",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get<ApiResponse>("/api/get-message");
      const msg = response?.data?.message;
      setMessages(Array.isArray(msg) ? msg : []);
      toast('Refresh messages',{description:'showing latest messages'})

    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message || "error while showing latest  messages",
      });
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false);
    }
  }, [setIsLoading,setMessages]);
useEffect(()=>{
if(!session || !session.user){
  return 
}
fetchMessage()
fetchAcceptMessage()


},[session,setValue,fetchAcceptMessage,fetchMessage])

const handleSwitchChange=async ()=>{
  try {
    const response = await axios.post<ApiResponse>('/api/accept-message',
      {acceptMessages:!acceptMessages})
      setValue('acceptMassage', !acceptMessages)

      toast(response.data.message)


  } catch (error) {
     console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast("error", {
        description:
          axiosError.response?.data.message || "error while fetching messages",
      });
    } 
  }


 const {username} = session?.user as User
 // todo :do more Research

const baseUrl = `${window.location.protocol}//${window.location.host}`
const profileUrl = `${baseUrl} /u/ ${username}`



const copyToClipborad = ()=>{
  navigator.clipboard.writeText(profileUrl)
  toast('url copied')
}

  if(!session  || !session.user){
    return <div className=""> Please Login</div>
  }

  return <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl  ">
    <h1 className=" text-4xl font-bold  mb-4 "> User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2 ">Copy Your Uniue Link </h2>
      <div className="flex items-center" >
        <input type="text"
        value={profileUrl} 
        disabled
        className="input input-bordered w-full p-2 mr-2 "/>
        <Button onClick={copyToClipborad}>Copy</Button>
      </div>
    </div>




    <div className="mb-4">
      <Switch {
        ...register('acceptMassage')
       
      }
       checked={acceptMessages    }
       onCheckedChange={handleSwitchChange}
       disabled={isSwitchLoading}>

      </Switch>
      <span className="ml-2">
        Accept Message :{ acceptMessages ? "On" :'Off'}
      </span>
    </div>
    <Separator></Separator>
    <Button className="mt-4 " 
    variant="outline"
    onClick={(e)=>{
      e.preventDefault();
      fetchMessage()
    }}>
      {
        isLoading ?
         (<Loader2 className="h-4 w-4 animate-spin"></Loader2>) 
        :(<RefreshCcw className="h-4 w-4"></RefreshCcw>)
      }
     
    </Button>
    <div className="mt-4 grid-cols-1 md:grid-cols-2 gap-6">
      {
        messages.length>0 ?(messages.map((messages)=>(
          <MessageCard
          key= {messages._id}
          message={messages}
          onMessageDelete={
            handleDeleteMessage
          }>

          </MessageCard>
          
        ))):(<p> No messages to display.</p>)
      }

    </div>
  </div>;
}

export default Dashboard;
