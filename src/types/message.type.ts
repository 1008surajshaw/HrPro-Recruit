

 type User = {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  type company ={
    companyName:string;
    companyLogo:string | null;
  }
   type Job = {
    id: string;
    title: string;
    company: {
      companyName:string;
      companyLogo:string | null;
    };
  };
  
  export type UserConversationResponse = {
    id: string;
    otherUsers: {
        id: string;
        name: string;
        avatar: string | null;
    } | null;
    lastMessage: {
        id: string;
        content: string;
        senderId: string;
        createdAt: Date;
        isRead: boolean;
    } | null;
    jobApplication?: {
        job: {
            id: string;
            title: string;
            company: {
                companyName: string;
                companyLogo: string | null;
            };
        };
    };
    createdAt: Date;
    updatedAt: Date;
};
