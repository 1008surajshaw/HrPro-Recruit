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
        return <h1>No conversations found or an internal error occurred</h1>;
    }

    return (
        <div className='w-10/12 flex mx-auto justify-center '>
            <div className="space-y-4">
            <h2 className='py-8'>Ongoing</h2>
                {conversations.map((conversation:UserConversationResponse) => (
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