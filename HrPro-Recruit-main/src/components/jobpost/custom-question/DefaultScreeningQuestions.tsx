import React from "react";
import { DefaultScreeningQuestions as questions } from "@/lib/constant/screening.constant";
import { ScreeningQuestion } from "./CustomQuestions";

interface DefaultScreeningQuestionsProps {
  setScreeningQuestions: React.Dispatch<React.SetStateAction<ScreeningQuestion[]>>;
  screeningQuestions: ScreeningQuestion[];
}

const DefaultScreeningQuestions: React.FC<DefaultScreeningQuestionsProps> = ({
  setScreeningQuestions,
  screeningQuestions,
}) => {
  return (
    <div className="flex w-full flex-wrap dark:bg-gray-800  dark:text-white">
      {questions &&
        questions.map((ele:any,idx:any) => (
          <div
            key={idx}
            onClick={() =>
              setScreeningQuestions([
                ...screeningQuestions,
                { ...ele, question: "What is " + ele.question },
              ])
            }
            className="p-2 rounded-full mr-3 border border-primary  cursor-pointer"
          >
            {ele.question}
          </div>
        ))}
    </div>
  );
};

export default DefaultScreeningQuestions;
