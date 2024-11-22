"use client";

import { useSession } from "next-auth/react";
import { SquareUserRound, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import ProfileEmptyContainers from "../emptycontainers/ProfileEmptyContainers";
import {
  FaBuilding,
  FaBriefcase,
  FaEnvelope,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";
import { Circle, Building2, Plus } from "lucide-react";
import { SHEETS } from "@/lib/constant/profile.constant";
import SheetWrapper from "../sheets/SheetWrapper";
import AddCompanyInfo from "./AddCompanyInfo";
import { CompanyType } from "@/types/company.type";
import { Button } from "@/components/ui/button";
import CompanyEmptyContainers from "./ComapnyEmptyContainer";
import CompanyInformationCard from "./CompanyInformationCard";

const CompanyInfo = ({
  isOwner,
  company,
}: {
  isOwner: boolean;
  company: CompanyType | null;
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { status, data } = useSession();

  const handleClose = () => {
    setIsSheetOpen(false);
  };

  const handleOpen = () => {
    // console.log(isSheetOpen ,"called")
    setIsSheetOpen(true);
  };

  const title = company
    ? SHEETS.companyInfo.title.replace("Add", "Edit")
    : SHEETS.companyInfo.title;

  // Display prompt for owner to add work experience if no company data exists

  if (!company && !isOwner) {
    return <div>Company information does not exist</div>;
  }


  return (
    <>
       <div className="flex justify-between items-center">
       <h3 className="font-bold text-2xl">Company Information</h3>
         {
          isOwner  && (
            <Button
              variant={'outline'}
              className="px-3 py-2 rounded-sm text-slate-500 dark:text-slate-400 flex gap-2"
              onClick={handleOpen}
            >
              <Pencil height={16} width={16} /> Edit
            </Button>
          )
         }
        </div>
         {
          !company  && (
            <CompanyEmptyContainers
               isOwner={isOwner}
               buttonText="Add About Your Company"
               handleClick={handleOpen}
               title={
                 isOwner
                   ? "You haven’t added your Company Details yet"
                   : "No Company Details added."
               }
               description={
                 isOwner
                   ? "Share a Complete details about your Company to let Candidate’s about your Company."
                   : ""
               }
               Icon={SquareUserRound}
               />
          )
         }
          {
             company && (
               <CompanyInformationCard company={company}/> 
             )
          }

          {
            isOwner && (
              <SheetWrapper
                 isOpen={isSheetOpen}
                 handleClose={handleClose}
                 title={title}
                 description={SHEETS.companyInfo.description}
               >
                 <AddCompanyInfo handleClose={handleClose} company={company} />
               </SheetWrapper>
            )
          }


       
    </>
  )
};

export default CompanyInfo;
