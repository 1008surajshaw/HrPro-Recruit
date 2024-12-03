import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <>
      
      {Array.from({ length: 12 }).map((value, index) => {
        if (index % 2 === 0) {
          return <Skeleton key={index} className="h-10 w-52 rounded-[8px]" />;
        } else {
          return <Skeleton key={index} className="h-40 w-full rounded-[8px]" />;
        }
      })}
    </>
  );
};

export default Loading;
