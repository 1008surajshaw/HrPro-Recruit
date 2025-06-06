"use client";
import { Circle, BookOpenCheck, Pencil, Plus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import SheetWrapper from "./sheets/SheetWrapper";
import { SHEETS } from "@/lib/constant/profile.constant";
import EducationForm from "./forms/EducationForm";
import { EducationType } from "@/types/user.types";
import { format } from "date-fns";
import { EducationDeleteDialog } from "./EducationDeleteDialog";
import ProfileEmptyContainers from "./emptycontainers/ProfileEmptyContainers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProfileEducation = ({
  isOwner,
  education,
}: {
  isOwner: boolean;
  education: EducationType[];
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedEducation, setSelectedEducation] =
    useState<EducationType | null>(null);

  const handleClose = () => {
    setIsSheetOpen(false);
    setSelectedEducation(null);
  };
  const handleOpen = () => {
    setIsSheetOpen(true);
  };
  const title = selectedEducation
    ? SHEETS.education.title.replace("Add", "Edit")
    : SHEETS.education.title;
  function formatDateRange(startDate: Date, endDate: Date | null): string {
    const startFormatted = format(startDate, "MMMM yy");
    const endFormatted = endDate ? format(endDate, "MMMM yy") : "Present";

    return `${startFormatted} - ${endFormatted}`;
  }
  const handleEditClick = (education: EducationType) => {
    setSelectedEducation(education);
    handleOpen();
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl">Education</h3>
        {isOwner && (
          <Button
            variant={"outline"}
            className="px-3 py-2 rounded-sm text-slate-500 dark:text-slate-400 flex gap-2"
            onClick={handleOpen}
          >
            <Plus height={16} width={16} /> Add Education
          </Button>
        )}
      </div>
      {education.length === 0 && (
        <ProfileEmptyContainers
          isOwner={isOwner}
          buttonText="Add your education"
          handleClick={handleOpen}
          title={
            isOwner ? "You haven’t added education yet" : "No Education added."
          }
          description={
            isOwner
              ? "Provide your education background to complete your profile."
              : ""
          }
          Icon={BookOpenCheck}
        />
      )}
      {education.length !== 0 && (
        <div className="rounded-2xl p-6 dark:bg-slate-900 bg-slate-100">
          {education.map((education) => (
            <div key={education.id} className="flex flex-col">
              <div className="flex gap-3 justify-start">
                <div className="relative w-4 flex justify-center">
                  <div className="absolute top-0 w-2 h-2 rounded-full bg-red-700"></div>
                  <div className="w-[2px] h-full bg-gradient-to-b from-red-600 to-[#F1F5F9] dark:to-[#0F172A]"></div>
                </div>
                <div className="flex flex-col gap-2 mb-3 w-full">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                      <h2 className="dark:text-slate-50 text-[#020817] text-xl font-bold ">
                        {education.degree}
                      </h2>
                      <p className="flex gap-[4px] items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        Grade : {education.grade} cgpa
                      </p>
                      <p className="flex gap-[4px] items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        {education.instituteName}
                        <Circle width={5} height={5} fill="currentColor" />
                        {education.fieldOfStudy}
                      </p>
                      <p className="flex gap-[4px] items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        {education.description}
                      </p>
                      <div className="px-3 py-1 bg-slate-500 bg-opacity-10 text-slate-500 dark:text-slate-400 rounded-[8px] text-sm w-fit">
                        {formatDateRange(
                          education.startDate,
                          education.endDate
                        )}
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex gap-3 items-center w-fit">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                            <EducationDeleteDialog educationId={education.id} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Education</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="bg-transparent p-0 border-0 hover:bg-transparent"
                                onClick={() => handleEditClick(education)}
                              >
                                <Pencil
                                  width={16}
                                  height={16}
                                  className="dark:text-slate-400 text-slate-500"
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Education Detail</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isOwner && (
        <SheetWrapper
          isOpen={isSheetOpen}
          handleClose={handleClose}
          title={title}
          description={SHEETS.education.description}
        >
          <EducationForm
            handleClose={handleClose}
            selectedEducation={selectedEducation}
          />
        </SheetWrapper>
      )}
    </>
  );
};

export default ProfileEducation;
