"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Settings, User } from "lucide-react";
import SheetWrapper from "./sheets/SheetWrapper";
import EditProfileForm from "./forms/EditProfileForm";
import { SHEETS } from "@/lib/constant/profile.constant";
import AccountSeetingForm from "./forms/AccountSeetingForm";
import { useSession } from "next-auth/react";
import { UserType } from "@/types/user.types";
import ProfileSocials from "./ProfileSocials";
import { ProfileShareDialog } from "./ProfileShare";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ProfileHeroSection = ({ userdetails }: { userdetails: UserType }) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

  const { status, data } = useSession();

  const handleClose = () => {
    setIsSheetOpen(false);
    setIsAccountOpen(false);
  };

  const handleOpen = () => {
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="border rounded-2xl  min-h-72 overflow-hidden">
        <div className="w-full h-32 bg-gradient-to-r from-red-500 via-pink-500 to-red-700"></div>
        <div className="p-6 relative flex-col flex gap-y-3">
          <Avatar className="h-32 w-32 absolute -top-16 bg-slate-100 dark:bg-slate-900">
            {userdetails.avatar && (
              <AvatarImage src={userdetails.avatar} alt="@shadcn" />
            )}
            <AvatarFallback>
              <User
                width={32}
                height={32}
                className="dark:text-slate-400 text-slate-500"
              />
            </AvatarFallback>
          </Avatar>

          <div className="w-full flex justify-end gap-2 h-10">
            {status === "authenticated" && data.user.id === userdetails.id && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                    <Button
                      variant={"outline"}
                      className="px-3 py-2 rounded-sm"
                      onClick={handleOpen}
                    >
                      <Pencil height={16} width={16} />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Update your Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                    <Button
                      onClick={() => setIsAccountOpen(true)}
                      variant={"outline"}
                      className="px-3 py-2 rounded-sm"
                    >
                      <Settings height={16} width={16} />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Manage Account </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <ProfileShareDialog />
                </TooltipTrigger>
                <TooltipContent>
                  <p> Share Profile Info</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            <h2 className="text-4xl font-bold">
              {" "}
              {userdetails.name
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h2>
          </div>
          <ProfileSocials userdetails={userdetails} />
        </div>
      </div>
      {status === "authenticated" && data.user.id === userdetails.id && (
        <>
          <SheetWrapper
            isOpen={isSheetOpen}
            handleClose={handleClose}
            title={SHEETS.editProfile.title}
            description={SHEETS.editProfile.description}
          >
            <EditProfileForm
              userdetails={userdetails}
              handleClose={handleClose}
            />
          </SheetWrapper>
          <SheetWrapper
            isOpen={isAccountOpen}
            handleClose={handleClose}
            title={SHEETS.accountSetting.title}
            description={SHEETS.accountSetting.description}
          >
            <AccountSeetingForm handleClose={handleClose} />
          </SheetWrapper>
        </>
      )}
    </>
  );
};

export default ProfileHeroSection;
