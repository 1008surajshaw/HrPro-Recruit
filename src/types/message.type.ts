
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
        id:number
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
