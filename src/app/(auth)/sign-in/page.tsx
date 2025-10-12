"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner"; // or "@/hooks/use-toast" depending on your setup
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
  import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse";
import { title } from "process";
import {Input} from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {Loader2} from 'lucide-react'
import { signInSchema } from "@/schemas/signInSchema";
import { Signika } from "next/font/google";
import { signIn } from "next-auth/react";
function page() {
  
  const [isSubmitting, setIssubmitting] = useState(false);

  const router = useRouter();

  // zod implemetation

  const form  = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier:"",password:''
    }
  })


  const onSubmit =async (data : z.infer<typeof signInSchema>)=>{

 const result =await signIn("credentials",{
  redirect:false,
  identifier:data.identifier,
  password:data.password
})

if(result?.error){
  toast('login Failed',{
    description:'Incorect credentionals',
  
  })
}
if(result?.url){
  router.replace('/dashboard') 
}


  }

  return (<div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join Mystery Message
        </h1>
        <p className="mb-4 "> Sign up to start your anonymous Adventure</p>


      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-x-6">

<FormField control={form.control} 
name='identifier'
 render={({field})=>
 <FormItem>
  <FormLabel>email/Username</FormLabel>
  <FormControl>
    <Input 
    placeholder='email/Username'
     {...field}  />
  </FormControl>
  <FormMessage/>
</FormItem>}>

</FormField>
<FormField control={form.control} 
name='password'
 render={({field})=>
 <FormItem>
  <FormLabel>Password</FormLabel>
  <FormControl>
    <Input  type="password"
    placeholder='password'
     {...field}/>
  </FormControl>
  <FormMessage/>
</FormItem>}>

</FormField>

        </form>
<Button  type="submit" disabled={isSubmitting}>Sign In </Button>
      </Form>
    <div className="text-center mt-4">
      <p>Already a member ? {''} <Link href={'/sign-in'} className="text-blue-600 hover:text-blue-800">Sign in</Link></p>
    </div>
    </div>
  </div>);
}

export default page;
//5.1.19
