'use client'
import React, { Dispatch, SetStateAction, useState } from "react";
import CustomQuestionForm from "./CustomQuestionForm";
import CustomQuestionContainer from "./CustomQuestionContainer";
import DefaultScreeningQuestions from "./DefaultScreeningQuestions";
import {Plus} from "lucide-react"


export interface ScreeningQuestion {
  question: string;

  idealAns: string;
  
}

interface CustomQuestionProps {
  setScreeningQuestions: Dispatch<SetStateAction<ScreeningQuestion[]>>;
  screeningQuestions: ScreeningQuestion[];
}

const CustomQuestions : React.FC<CustomQuestionProps>= ({
  setScreeningQuestions,
  screeningQuestions,
}) => {
  const [addCustomQuestion, setAddCustomQuestion] = useState<boolean>(false);

  return (
    <div className="grid w-full my-10 py-3 px-5 rounded-md border dark:bg-gray-800  dark:text-white">
      <div className="flex justify-between">
        <p className="text-2xl font-medium my-3 dark:text-white ">Custom Question</p>
        
        <button
          onClick={() => setAddCustomQuestion(true)}
          className="text-md font-light  hover:bg-red-500 px-3  rounded-md flex items-center space-x-2"
        >
          Add Question  <Plus className="text-md flex items-center space-x-2 " /> 
        </button>
      </div>

      <div className={` w-full`}>
        {addCustomQuestion && (
          <CustomQuestionForm
            screeningQuestions={screeningQuestions}
            setScreeningQuestions={setScreeningQuestions}
          />
        )}
        <div className="my-4">
          {screeningQuestions && (
            <CustomQuestionContainer setScreeningQuestions={setScreeningQuestions} screeningQuestions={screeningQuestions} />
          )}
        </div>
        <div className="my-4">
          <DefaultScreeningQuestions
            screeningQuestions={screeningQuestions}
            setScreeningQuestions={setScreeningQuestions}
          />
        </div>
      </div>
      <div className="flex justify-end gap-x-3">
    </div>
    </div>
  );
};

export default CustomQuestions;
