import z from "zod"
 
 export  const verifiSchema = z.object({
    code:z.string().length(6,"Varifucation code must be 6 digits")
 })