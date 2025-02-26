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
    
     const response = completion.choices[0].message.content;
     const parsedResponse = JSON.parse(response || '{}');
  

    return parsedResponse;
};



interface JobContext {
    title: string;
    experienceRange: string;
    workMode: string;
    employmentType: string;
    category: string;
    salaryRange: string;
    applicationInstructions: string;
  }
  
  export function generateJobDescriptionPrompt(context: JobContext): string {
    return `
      Generate a comprehensive job description for the following position:
      
      Title: ${context.title}
      Experience Required: ${context.experienceRange}
      Work Mode: ${context.workMode}
      Employment Type: ${context.employmentType}
      Category: ${context.category}
      Salary Range: ${context.salaryRange}
      Application Instructions: ${context.applicationInstructions}
  
      Please provide:
      1. A detailed job description (approximately 200-300 words)
      2. A list of 5-7 key responsibilities
      3. A list of 5-7 required skills or qualifications
  
      Format the output as a JSON object with keys: description, responsibilities (as an array), and skills (as an array).
    `;
  }
  
  
  export async function generateAIJobDescription(context: JobContext): Promise<{ 
    description: string; 
    responsibilities: string[]; 
    skills: string[];
  }> {
    try {
      const prompt = generateJobDescriptionPrompt(context);
  
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
  
      const response = completion.choices[0].message.content;
      const parsedResponse = JSON.parse(response || '{}');
  
      return {
        description: parsedResponse.description || '',
        responsibilities: parsedResponse.responsibilities || [],
        skills: parsedResponse.skills || [],
      };
    } catch (error) {
      console.error('Error generating AI job description:', error);
      throw new Error('Failed to generate job description');
    }
  }