import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobType } from '@/types/jobs.types';
import { useToast } from '@/components/ui/use-toast';
import { submitJobApplication } from '@/actions/job.action';

export interface CustomQuestion {
  question: string;
  idealAns: string;
}

interface QuestionAnswer {
  question: string;
  userAns: string;
}

const DEFAULT_QUESTION: CustomQuestion = {
  question: "What interests you about working for this company?",
  idealAns: "Please provide a response in approximately 100 words."
};

export default function CustomQuestionAns({ jobData }: { jobData: JobType }) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, question: string) => {
    const value = e.target.value;
    setFormValues({ ...formValues, [question]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);

    //@ts-ignore
    const questionAns: CustomQuestion[] = jobData.customQuestions?.length ? 
      jobData.customQuestions : 
      [DEFAULT_QUESTION];

    // Format answers to match the required JSON structure
    const formattedAnswers: QuestionAnswer[] = questionAns.map(q => ({
      question: q.question,
      userAns: formValues[q.question] || ''
    }));

    const formData = new FormData();
    formData.append('answers', JSON.stringify(formattedAnswers));
    
    const jobId = jobData.id;

    try {
      const result = await submitJobApplication(formData, jobId , jobData.title , jobData.company.companyName);
      setLoading(false);

      if (result) {
        toast({
          title: "Job Application sent successfully",
          variant: 'success'
        });
        router.push('/jobs');
      } else {
        toast({
          title: "Already Applied for this job Position",
          variant: 'destructive'
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error submitting application",
        description: "Please try again later",
        variant: 'destructive'
      });
    }
  };

  // Get questions from either custom questions or default
  //@ts-ignore
  const questionAns: CustomQuestion[] = jobData.customQuestions?.length ? 
    jobData.customQuestions : 
    [DEFAULT_QUESTION];

  return (
    <div className="max-w-2xl mx-auto p-4 bg-background">
      <form onSubmit={handleSubmit} className="space-y-4">
        {questionAns.map((q: CustomQuestion, index: number) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`question-${index}`} className="font-medium">
              {q.question}
            </Label>
            {q === DEFAULT_QUESTION ? (
              <Textarea
                id={`question-${index}`}
                onChange={(e) => handleInputChange(e, q.question)}
                value={formValues[q.question] || ''}
                placeholder="Your answer (approximately 100 words)"
                className="w-full min-h-32"
                required
              />
            ) : (
              <Input
                id={`question-${index}`}
                type="text"
                onChange={(e) => handleInputChange(e, q.question)}
                value={formValues[q.question] || ''}
                placeholder="Your answer"
                className="w-full"
                required
              />
            )}
          </div>
        ))}
        
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}