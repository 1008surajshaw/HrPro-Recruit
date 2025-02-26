import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import React from 'react';


interface SheetWrapperForMessageProps {
  title: string | undefined;
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  avatar: string;
  name: string;
  lastMessage: Date | undefined;
  otherUserId: string | undefined;
  description:string;
}

const SheetWrapperForMessage: React.FC<SheetWrapperForMessageProps> = ({
  isOpen,
  handleClose,
  children,
  avatar,
  name,
  title,
  lastMessage,
  otherUserId,
  description
}) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);


  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col pb-0 overflow-y-auto no-scrollbar sm:max-w-2xl w-full">
        <SheetHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              
                <Avatar className="h-16 w-16 cursor-pointer">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
             
              <div>
                <SheetTitle className="text-2xl">{name}</SheetTitle>
                <div className="flex items-center space-x-2 mt-1">
                  {title && <Badge variant="secondary">{title}</Badge>}
                  <span className="text-sm text-muted-foreground">
                    Last Update: {lastMessage 
                      ? new Date(lastMessage).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                      : "No messages"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto mt-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetWrapperForMessage;