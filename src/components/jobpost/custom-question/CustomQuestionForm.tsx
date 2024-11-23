import React, { Dispatch, SetStateAction, useState } from "react";
import { ScreeningQuestion } from "./CustomQuestions";
import {Plus} from "lucide-react"
interface CustomQuestionForm {
  setScreeningQuestions: Dispatch<SetStateAction<ScreeningQuestion[]>>;
  screeningQuestions: ScreeningQuestion[];
}

const CustomQuestionForm: React.FC<CustomQuestionForm> = ({
  setScreeningQuestions,
  screeningQuestions,
}) => {
  const [question, setQuestion] = useState("");
  const [idealAns, setIdealAns] = useState("");

  const handleAdd = () => {
    if (question.trim() && idealAns.trim()) {
      setScreeningQuestions([
        ...screeningQuestions,
        {
          question: question.trim(),
          idealAns: idealAns.trim(),
        },
      ]);
      setQuestion("");
      setIdealAns("");
    }
  };

  return (
    <div className="grid dark:bg-gray-800 dark:text-white p-4 border rounded-md mb-4">
      <div className="w-full flex justify-between items-start gap-4">
        <div className="flex flex-col flex-1">
          <label htmlFor="question" className="text-sm font-medium mb-2">
            Question
          </label>
          <input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className="input-base p-2 border rounded-md dark:bg-gray-700"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="idealAns" className="text-sm font-medium mb-2">
            Ideal Answer
          </label>
          <input
            id="idealAns"
            value={idealAns}
            onChange={(e) => setIdealAns(e.target.value)}
            placeholder="Enter ideal answer"
            className="input-base p-2 border rounded-md dark:bg-gray-700"
          />
        </div>

        <button
          onClick={handleAdd}
          className="mt-8 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Plus className="text-xl text-primary" />
        </button>
      </div>
    </div>
  );
};

export default CustomQuestionForm;
