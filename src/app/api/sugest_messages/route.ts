import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import OpenAI from 'openai';
import { generateText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
 try {
    const  prompt = "Create a list of three open-enden and engaging question sfromatted as a single string . Each question should be separated by`||` . These questions are for an anonymous social messageing platform , like Qooh . me, and should ve suitable for a diverse audience .avoid  personal or sensitive topics  focusing instead on universal themes  that encourage friendly interaction . for example, yout output  should be structured like thid : 'What 's a hobby you've recently started ? || if you could have dinner with any  historical figure ,who woukd it be ?||  what's a simple things that makes You happy || Ensure the question are intriguing ,foster curiosity, and contribute to a positiceans welcoming conversational enviroment."

    
   
 const { text } = await generateText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    prompt,
  });

  
  return Response.json({text})
 } catch (error) {
    
    if (error instanceof OpenAI.APIError) {

        const {name,status,headers,message}  = error

        return Response.json({
            name,headers,status,message
        },{status})
    } else {
        console.log('An unexpected error :',error)
    }
    console.log()
 }
}