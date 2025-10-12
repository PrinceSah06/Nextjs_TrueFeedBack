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
function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const [isSubmitting, setIssubmitting] = useState(false);

  const router = useRouter();
  const debounce = useDebounceCallback(setUsername, 300);

  // zod implemetation

  const form  = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:"",email:"",password:''
    }
  })
  useEffect(()=>{
    const  checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage('')
        try {
     const response=    await axios.get(`/api/check-user-name-uique?username=${username}`)
 console.log(response.data.message)
 console.log('this is a normal console log for debug purpus')

     setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError =error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message?? 'Error checking username')
          console.log(error,'while log')


        }finally{
          setIsCheckingUsername(false)
        }
      }

    }
        checkUsernameUnique()

  },[username])

  const onSubmit =async (data : z.infer<typeof signUpSchema>)=>{
setIssubmitting(true)
try {
  const response= await axios.post<ApiResponse>('/api/sign-up',data)
toast('success',{description:response.data.message})

router.replace('/verify/'+username)
setIssubmitting(false)

} catch (error) {
  console.error('error in sign up in user',error)
  const axiosError = error as AxiosError<ApiResponse>

  let errorMessage = axiosError.response?.data.message
  toast('sign up faild',{description :errorMessage
  })
   
setIssubmitting(false)
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
name='username'
 render={({field})=>
 <FormItem>
  <FormLabel>Username</FormLabel>
  <FormControl>
    <Input 
    placeholder='username'
     {...field}  onChange={(e)=>{
      field.onChange(e)
      debounce(e.target.value)
     }}/>
  </FormControl>
     {isCheckingUsername && <Loader2 className="animate-spin"></Loader2>}
<p  className={`text-sm ${usernameMessage === 'Username is uniqe' ?'text-green-500':'text-red-500'}`}>test {usernameMessage}</p>
  <FormMessage/>
</FormItem>}>

</FormField>
<FormField control={form.control} 
name='email'
 render={({field})=>
 <FormItem>
  <FormLabel>email</FormLabel>
  <FormControl>
    <Input 
    placeholder='email'
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
<Button  type="submit" disabled={isSubmitting}>
{ isSubmitting ?(<><Loader2 className="mr-2 h-4 w-4 animate-spin">Please wait</Loader2></>):('Signup')}</Button>
      </Form>
    <div className="text-center mt-4">
      <p>Already a member ? {''} <Link href={'/sign-in'} className="text-blue-600 hover:text-blue-800">Sign in</Link></p>
    </div>
    </div>
  </div>);
}

export default page;
//5.1.19
