'use client'
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true   
});



export const improveText = async (request: string,type:string,isArray:boolean) => {

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: "system",
                content: `You are an expert HR professional who writes clear and engaging job ${type} is form of ${isArray ? "responsibility's array don't include any other thing simple responsibility's array" :'it look professional and not complete in a single line. '} .`
            },
            {
                role: "user",
                content: `understand what user want to say and regenerate the sentence or complete ${request} :
                
                Keep it professional but engaging.`
            }
        ],
        temperature: 0.7,
        max_tokens: 500
    });

    if (!completion.choices[0].message.content) {
        throw new Error("Failed to generate job description");
    }

    return completion.choices[0].message.content;
};