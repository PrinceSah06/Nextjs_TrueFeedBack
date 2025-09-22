import {regex, z} from 'zod'

export const userValidation = z
.string()
.min(2,"user name must be atlest two character")
.max(20,'must be used 20 characters')
.regex(/^[a-zA-Z0-9_]+$/,'Username must not constain special character')

export const signUpSchema= z.object({
    username: userValidation,
    email:z.string().email({message:'invalid email'
    })
    ,password: z.string().min(6,{message:'Password must be at least 6 charcter'})


    
})