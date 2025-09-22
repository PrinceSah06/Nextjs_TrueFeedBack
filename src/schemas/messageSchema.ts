import z from "zod"
 
 export  const messageSchema = z.object({
   constet :z
   .string()
   .min(10,{message:"Content must be at least 10 character"})
   .max(300,{message:"Constent must be o longer then 300 characters"})
 })