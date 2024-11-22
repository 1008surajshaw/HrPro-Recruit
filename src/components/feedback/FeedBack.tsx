"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Smile, Meh, Frown, Send } from 'lucide-react'
import random1 from "../../../public/randomimg/random1.png"
import random2 from "../../../public/randomimg/random2.png"
import random3 from "../../../public/randomimg/random3.png"
import random4 from "../../../public/randomimg/random4.png"
import random5 from "../../../public/randomimg/random5.png"
import random6 from "../../../public/randomimg/random6.png"
import random7 from "../../../public/randomimg/random7.png"
import random8 from "../../../public/randomimg/random8.png"
import random9 from "../../../public/randomimg/random9.png"
import random10 from "../../../public/randomimg/random10.png"
import { Role } from "@prisma/client"
import { saveUserResponse } from "@/actions/feedback.action"
import { useToast } from '../../components/ui/use-toast';

type FeedbackOption = {
  id: string
  label: string
  subOptions?: { id: string; label: string }[]
}

type FeedbackStep = {
  question: string
  options: FeedbackOption[]
}

const recruiterFeedbackSteps: FeedbackStep[] = [
  {
    question: "How satisfied are you with the candidate's overall qualifications?",
    options: [
      { id: "very-satisfied", label: "Very Satisfied" },
      { id: "satisfied", label: "Satisfied" },
      { id: "neutral", label: "Neutral" },
      { id: "dissatisfied", label: "Dissatisfied" },
      { id: "very-dissatisfied", label: "Very Dissatisfied" },
    ],
  },
  {
    question: "Which aspect of the candidate impressed you the most?",
    options: [
      { id: "technical-skills", label: "Technical Skills" },
      { id: "communication", label: "Communication" },
      { id: "experience", label: "Experience" },
      { id: "cultural-fit", label: "Cultural Fit" },
      { id: "problem-solving", label: "Problem Solving" },
    ],
  },
  {
    question: "Would you recommend moving forward with this candidate?",
    options: [
      { id: "strongly-recommend", label: "Strongly Recommend" },
      { id: "recommend", label: "Recommend" },
      { id: "neutral", label: "Neutral" },
      { id: "not-recommend", label: "Do Not Recommend" },
      { id: "strongly-not-recommend", label: "Strongly Do Not Recommend" },
    ],
  },
]

const candidateFeedbackSteps: FeedbackStep[] = [
  {
    question: "How would you rate your overall experience with our job application process?",
    options: [
      { id: "excellent", label: "Excellent" },
      { id: "good", label: "Good" },
      { id: "average", label: "Average" },
      { id: "poor", label: "Poor" },
      { id: "very-poor", label: "Very Poor" },
    ],
  },
  {
    question: "Which aspect of the process did you find most challenging?",
    options: [
      { id: "job-search", label: "Finding relevant job postings" },
      { id: "application-form", label: "Filling out the application form" },
      { id: "assessment", label: "Completing assessments or tests" },
      { id: "interview", label: "Interview process" },
      { id: "communication", label: "Communication with the company" },
    ],
  },
  {
    question: "How likely are you to recommend our job portal to others?",
    options: [
      { id: "very-likely", label: "Very Likely" },
      { id: "likely", label: "Likely" },
      { id: "neutral", label: "Neutral" },
      { id: "unlikely", label: "Unlikely" },
      { id: "very-unlikely", label: "Very Unlikely" },
    ],
  },
]

const randomImages = [random1, random2, random3, random4, random5, random6, random7, random8, random9, random10]

export default function FeedbackPage({ userType = "USER",userId }: { userType?:Role ,userId:string}) {
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [additionalComments, setAdditionalComments] = useState("");
  const [overallRating, setOverallRating] = useState<number | null>(null);

  const steps = userType === "HR" ? recruiterFeedbackSteps : candidateFeedbackSteps;
  const totalSteps = steps.length;

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setFeedback((prev) => ({ ...prev, [questionId]: optionId }));
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (overallRating === null) {
      alert("Please provide an overall rating before submitting.");
      return;
    }

    const feedbackData = {
      userType,
      overallRating,
      feedbackResponses: feedback,
      additionalComments,
      userId,
    };

    try {
      //@ts-ignore
      const response = await saveUserResponse(feedbackData);
      toast({
        variant: "success",
        title: "Thank you for your valuable feedback. It will help us improve the application.",
      });

      // Reset the form or redirect to a thank-you page
    } catch (error) {
      toast({
        title: "We're sorry for the inconvenience. Please report this issue to our support team.",
        variant: "destructive",
      });
    }
  };

  const renderSmileyFace = (rating: number) => {
    const commonClasses = "w-12 h-12 cursor-pointer transition-transform hover:scale-110";
    const selectedClasses = "text-red-600 scale-110";
    const unselectedClasses = "text-gray-400";

    if (rating <= 2) {
      return <Frown className={cn(commonClasses, overallRating === rating ? selectedClasses : unselectedClasses)} onClick={() => setOverallRating(rating)} />;
    } else if (rating === 3) {
      return <Meh className={cn(commonClasses, overallRating === rating ? selectedClasses : unselectedClasses)} onClick={() => setOverallRating(rating)} />;
    } else {
      return <Smile className={cn(commonClasses, overallRating === rating ? selectedClasses : unselectedClasses)} onClick={() => setOverallRating(rating)} />;
    }
  };

  
  return (
    
    <div className="h-[calc(100vh-60px)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          We value your feedback
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Help us improve our {userType === "HR" ? "candidate selection" : "job application"} process.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-280px)]">
        <div className="w-full md:w-1/2 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-grow overflow-y-auto"
            >
              {currentStep < totalSteps ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{steps[currentStep].question}</h3>
                  <RadioGroup
                    onValueChange={(value) => handleOptionSelect(steps[currentStep].question, value)}
                    value={feedback[steps[currentStep].question]}
                    className="space-y-2"
                  >
                    {steps[currentStep].options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="text-gray-700 dark:text-gray-300">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Overall Rating</h3>
                    <div className="flex justify-between px-4">
                      {[1, 2, 3, 4, 5].map((rating) => renderSmileyFace(rating))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Additional Comments (Optional)</h3>
                    <Textarea
                      placeholder="Any other thoughts or suggestions?"
                      value={additionalComments}
                      onChange={(e) => setAdditionalComments(e.target.value)}
                      className="w-full h-32 resize-none"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-4 pt-3 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950"
            >
              Previous
            </Button>
            <div className="space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {totalSteps + 1}
              </span>
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!feedback[steps[currentStep].question]}
                  className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={overallRating === null}
                  className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="p-4 flex items-center justify-center"
            >
              <Image
                src={randomImages[currentStep % randomImages.length]}
                alt={`Random image ${currentStep + 1}`}
                width={300}
                height={300}
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
  )
}