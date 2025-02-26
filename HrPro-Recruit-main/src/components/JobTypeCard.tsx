// components/JobTypeCard.tsx
import React from 'react';


// Define the props to include the icon type
interface JobTypeCardProps {
    // The Material UI Icon component type
  title: string;
  jobCount: number;
}

const JobTypeCard: React.FC<JobTypeCardProps> = ({  title, jobCount }) => {
  return (
    <div className="flex flex-col items-center justify-center w-48 h-48 p-4 bg-red-50 rounded-md shadow-md">
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-600 rounded-full">
        {/* <Icon className="text-white" fontSize="large" /> */}
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-sm text-gray-500">{jobCount} jobs</p>
    </div>
  );
};

export default JobTypeCard;
