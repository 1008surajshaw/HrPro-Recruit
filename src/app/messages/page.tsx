import { getAllConversation } from '@/actions/message.action';
import ConversationCard from '@/components/message/ConversationCard';
import { options } from '@/lib/auth';
import { UserConversationResponse } from '@/types/message.type';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
    const session = await getServerSession(options);
    
    if (!session?.user || !session?.user.role) {
        redirect('/api/auth/signin');
    }

    const conversations = await getAllConversation();
    
    if (!conversations || conversations.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-xl font-semibold text-muted-foreground">No conversations found or an internal error occurred</h1>
            </div>
        );
    }

    return (
        <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-screen'>
            <h2 className='py-8 text-2xl font-bold'>Ongoing Conversations</h2>
            <div className="space-y-4">
                {conversations.map((conversation: UserConversationResponse) => (
                    <ConversationCard 
                        key={conversation.id} 
                        conversation={conversation} 
                        role={session.user.role}
                    />
                ))}
            </div>
        </div>
    );
};

export default page;

