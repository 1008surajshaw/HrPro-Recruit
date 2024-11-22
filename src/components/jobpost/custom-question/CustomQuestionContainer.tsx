import React, { useState } from "react";
import { ScreeningQuestion } from "./CustomQuestions";

interface CustomQuestionContainerProps {
  screeningQuestions: ScreeningQuestion[];
  setScreeningQuestions: React.Dispatch<React.SetStateAction<ScreeningQuestion[]>>;
}

const CustomQuestionContainer: React.FC<CustomQuestionContainerProps> = ({
  screeningQuestions,
  setScreeningQuestions,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState<string>("");
  const [editIdealAns, setEditIdealAns] = useState<string>("");

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditQuestion(screeningQuestions[index].question);
    setEditIdealAns(screeningQuestions[index].idealAns);
  };

  const handleSaveClick = (index: number) => {
    const updatedQuestions = screeningQuestions.map((question, i) =>
      i === index ? { question: editQuestion, idealAns: editIdealAns } : question
    );
    setScreeningQuestions(updatedQuestions);
    setEditingIndex(null);
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
  };

  return (
    <div className="grid w-full gap-4">
      {screeningQuestions.map((ele, idx) => (
        <div
          className="flex w-full justify-between p-2 rounded-md border  text-lg  dark:bg-gray-800  dark:text-white"
          key={idx}
        >
          {editingIndex === idx ? (
            <div className="w-full flex flex-col">
              <input
                className="input-base mb-2"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
              />
              <input
                className="input-base"
                value={editIdealAns}
                onChange={(e) => setEditIdealAns(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => handleSaveClick(idx)} className="btn-save">
                  Save
                </button>
                <button onClick={handleCancelClick} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="w-1/2 flex justify-start">{ele.question}</p>
              <p className="w-1/3 flex justify-center">Ideal Answer: {ele.idealAns}</p>
              <button
                onClick={() => handleEditClick(idx)}
                className="text-primary hover:underline"
              >
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomQuestionContainer;
