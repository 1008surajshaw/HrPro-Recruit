"use client";
import { SHEETS } from "@/lib/constant/profile.constant";
import { CertificateType } from "@/types/user.types";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Circle, BookOpenCheck, Pencil, Plus } from "lucide-react";
import ProfileEmptyContainers from "./emptycontainers/ProfileEmptyContainers";
import SheetWrapper from "./sheets/SheetWrapper";
import CertificateForm from "./forms/CertificateForm";
import CertificateDeleteDialog from "./CertificateDeleteDialog";

const ProfileCertificate = ({
  isOwner,
  certificate,
}: {
  isOwner: boolean;
  certificate: CertificateType[];
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateType | null>(null);

  const handleClose = () => {
    setIsSheetOpen(false);
    setSelectedCertificate(null);
  };
  const handleOpen = () => {
    setIsSheetOpen(true);
  };
  const title = selectedCertificate
    ? SHEETS.certificate.title.replace("Add", "Edit")
    : SHEETS.certificate.title;

  const handleEditClick = (certificate: CertificateType) => {
    setSelectedCertificate(certificate);
    handleOpen();
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl">Certificate</h3>
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
      {certificate.length == 0 && (
        <ProfileEmptyContainers
          isOwner={isOwner}
          buttonText="Add your certificate"
          handleClick={handleOpen}
          title={
            isOwner
              ? "You haven’t added certificate yet"
              : "No certificate added."
          }
          description={
            isOwner ? "Provide your certificate to complete your profile." : ""
          }
          Icon={BookOpenCheck}
        />
      )}
      {certificate.length !== 0 && (
        <div className="rounded-2xl p-6 dark:bg-slate-900 bg-slate-100">
          {certificate.map((certi) => (
            <div key={certi.id} className='className="flex flex-col"'>
              <div className="flex gap-3 justify-start">
                <div className="relative w-4 flex justify-center">
                  <div className="absolute top-0 w-2 h-2 rounded-full bg-red-700"></div>
                  <div className="w-[2px] h-full bg-gradient-to-b from-[#e85538] to-[#F1F5F9] dark:to-[#0F172A]"></div>
                </div>
                <div className="flex flex-col gap-2 mb-3 w-full">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                      <h2 className="dark:text-slate-50 text-[#020817] text-xl font-bold ">
                        {certi.name}
                      </h2>
                      <p className="flex gap-[4px] items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        {certi.issuingOrganization}
                        {certi?.issueDate && (
                          <>
                             <Circle width={5} height={5} fill="currentColor" />
                             {new Date(certi.issueDate).toLocaleDateString()}
                          </>
                        )}
                      </p>
                      <p className="flex gap-[4px] items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        {certi?.credentialUrl}
                      </p>
                    </div>
                    {isOwner && (
                      <div className="flex gap-3 items-center w-fit">
                        <CertificateDeleteDialog certificateId={certi.id} />
                        <Button
                          className="bg-transparent p-0 b-0 hover:bg-transparent"
                          onClick={() => handleEditClick(certi)}
                        >
                          <Pencil
                            width={16}
                            height={16}
                            className="dark:text-slate-400 text-slate-500"
                          />
                        </Button>
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
          <CertificateForm
            handleClose={handleClose}
            selectedCertificate={selectedCertificate}
          />
        </SheetWrapper>
      )}
    </>
  );
};

export default ProfileCertificate;
