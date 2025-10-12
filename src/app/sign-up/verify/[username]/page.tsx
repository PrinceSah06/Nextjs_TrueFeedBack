"use client"
import { verifiSchema } from '@/schemas/varifySchema'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import {  toast } from "sonner"; // or "@/hooks/use-toast" depending on your setup
import { useForm} from 'react-hook-form'
import {Form } from '@/components/ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
function VerifyAccount() {
    const router = useRouter()
const param = useParams<{username : string}>()

const form = useForm<z.infer<typeof verifiSchema>>({
   resolver:zodResolver(verifiSchema)
    
})
const onSubmit = async (data:z.infer<typeof verifiSchema>)=>{
    try {
        
        const response= await axios.post('/api/verifiy-code',{
            username:param.username,
            code: data.code
        })
        toast('success',{
            description:response.data.message
        })
        router.replace('sign-in')
    } catch (error) {
        console.error("Error in signup of user ",error);
        const AxiosError= error as AxiosError <ApiResponse>
        toast('signup failed',{
            description:AxiosError.response?.data.message,
       
        })
        
    }
}

  return (
    <div className=' flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter lg:text-5xl mb-6 ">verify</h1>
            <p  className='mb-4'>verifdf</p>
        </div>
        
<Form {...form}>
    <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
<FormField control={form.control} name='code' 
render ={({field})=>(
    <FormItem>
          <FormLabel> Verification Code</FormLabel>
    <FormControl>
        <Input placeholder='Code'  {...field}>
        </Input>
    </FormControl>
   <FormMessage></FormMessage>
    </FormItem>
   
  )}></FormField>
    </form>
<button type='submit'> Submit</button>
</Form>
      </div>
    </div>
  )
}

export default VerifyAccount
